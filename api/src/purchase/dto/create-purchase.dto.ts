// src/purchase/dto/create-purchase.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreatePurchaseDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @IsString()
  courseId: string;
}
