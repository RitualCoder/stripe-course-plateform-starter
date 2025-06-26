// src/purchase/dto/update-purchase.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseDto } from './create-purchase.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @IsOptional()
  @IsString()
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
}
