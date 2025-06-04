import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  stripeProductId: string;

  @IsString()
  stripePriceId: string;
}
