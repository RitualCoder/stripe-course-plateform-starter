import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCheckoutSession(
    @Body() { courseId }: { courseId: string },
    @Req() req: { user: { id: string } },
  ) {
    return this.stripeService.createCheckoutSession(courseId, req.user.id);
  }

  @Get('session/:sessionId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getCheckoutSession(@Param() params: { sessionId: string }) {
    return this.stripeService.getCheckoutSession(params.sessionId);
  }
}
