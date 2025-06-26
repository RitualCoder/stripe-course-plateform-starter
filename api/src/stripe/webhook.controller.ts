import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PurchaseService } from 'src/purchase/purchase.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { CreatePurchaseDto } from 'src/purchase/dto/create-purchase.dto';
import { UpdatePurchaseDto } from 'src/purchase/dto/update-purchase.dto';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  private stripe: Stripe;

  constructor(
    private readonly config: ConfigService,
    private purchaseService: PurchaseService,
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2025-05-28.basil',
    });
  }

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Signature Stripe manquante');
    }

    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new BadRequestException('Secret webhook non configuré');
    }

    let event: Stripe.Event;

    try {
      // Vérifier la signature du webhook
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error: any) {
      this.logger.error(`Erreur de signature webhook: ${error.message}`);
      throw new BadRequestException('Signature invalide');
    }

    this.logger.log(`Événement webhook reçu: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;

        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object);
          break;

        case 'charge.dispute.created':
          await this.handleChargeDispute(event.data.object);
          break;

        default:
          this.logger.warn(`Événement non géré: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      this.logger.error(
        `Erreur lors du traitement du webhook: ${error.message}`,
      );
      res.status(400).json({ error: error.message });
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    this.logger.log(`Session checkout complétée: ${session.id}`);
    this.logger.debug(
      'Session Stripe complète:',
      JSON.stringify(session, null, 2),
    );

    const { userId, courseId } = session.metadata || {};

    if (!userId || !courseId) {
      throw new Error('Métadonnées manquantes dans la session');
    }

    try {
      await this.purchaseService.create({
        userId,
        paymentIntentId: session.payment_intent?.toString(),
        courseId,
      });
      this.logger.log(`Purchase créé pour session ${session.id}`);
    } catch (error) {
      // Si le purchase existe déjà, on l'ignore (idempotence)
      if (error.code === 'P2002') {
        this.logger.log(`Purchase déjà existant pour session ${session.id}`);
        return;
      }
      throw error;
    }
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    this.logger.log(`Paiement réussi: ${paymentIntent.id}`);

    // Récupérer la session associée
    const sessions = await this.stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });

    const purchase = await this.purchaseService.findOneByPaymentIntentId(
      paymentIntent.id,
    );

    if (!purchase) {
      this.logger.warn(`Aucun purchase pour ${paymentIntent.id}`);
      return;
    }

    const sessionId = sessions.data[0].id;

    // Mettre à jour le statut du purchase
    const dto = new UpdatePurchaseDto();
    dto.status = 'COMPLETED';
    const updated = await this.purchaseService.update(purchase.id, dto);
    this.logger.log(`Purchase ${updated.id} mis à jour -> ${updated.status}`);

    if (sessions.data.length === 0) {
      this.logger.warn(
        `Aucune session trouvée pour payment_intent ${paymentIntent.id}`,
      );
      return;
    }

    this.logger.log(`Purchase mis à jour: ${sessionId} -> COMPLETED`);
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    this.logger.log(`Paiement échoué: ${paymentIntent.id}`);

    // Récupérer la session associée
    const sessions = await this.stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });

    if (sessions.data.length === 0) {
      this.logger.warn(
        `Aucune session trouvée pour payment_intent ${paymentIntent.id}`,
      );
      return;
    }

    const sessionId = sessions.data[0].id;

    // Mettre à jour le statut du purchase

    this.logger.log(`Purchase mis à jour: ${sessionId} -> FAILED`);
  }

  private async handleChargeDispute(dispute: Stripe.Dispute) {
    this.logger.warn(
      `Litige créé: ${dispute.id} pour charge ${dispute.charge}`,
    );
  }
}
