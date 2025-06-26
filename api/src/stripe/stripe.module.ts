import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { WebhookController } from './webhook.controller';
import { PurchaseService } from 'src/purchase/purchase.service';

@Module({
  controllers: [StripeController, WebhookController],
  providers: [StripeService, PurchaseService],
})
export class StripeModule {}
