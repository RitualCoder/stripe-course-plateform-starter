import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') || '');
  }

  async createCheckoutSession(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
      });

      user.stripeCustomerId = customer.id;
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });
    }

    console.log('Creating checkout session for course:', course);
    console.log('User details:', user);

    if (!course.stripePriceId || !user.stripeCustomerId) {
      throw new Error('Course price ID or user Stripe customer ID is missing');
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: course.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        courseId,
      },
      mode: 'payment',
      success_url: `${this.configService.get('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/courses`,
    });

    return {
      url: session.url,
    };
  }

  async getCheckoutSession(sessionId: string) {
    if (!sessionId) {
      throw new Error('Le sessionId est requis');
    }

    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    return session;
  }
}
