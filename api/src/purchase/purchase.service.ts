/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/purchase/purchase.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePurchaseDto) {
    try {
      return await this.prisma.purchase.create({
        data: {
          userId: dto.userId,
          paymentIntentId: dto.paymentIntentId,
          courseId: dto.courseId,
        },
      });
    } catch (caught: unknown) {
      // safe logging
      if (caught instanceof Error) {
        this.logger.error(`Error creating purchase: ${caught.message}`);
      } else {
        this.logger.error(`Unknown error creating purchase: ${caught}`);
      }
      throw new Error('Failed to create purchase');
    }
  }

  async findAll() {
    return this.prisma.purchase.findMany();
  }

  async findAllByUserId(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.purchase.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdatePurchaseDto) {
    const purchase = await this.prisma.purchase.findUnique({ where: { id } });

    const updatePurchase = await this.prisma.purchase.update({
      where: { id },
      data: {
        ...purchase,
        status: dto.status,
      },
    });

    return updatePurchase;
  }

  async remove(id: string) {
    return this.prisma.purchase.delete({ where: { id } });
  }

  async findOneByPaymentIntentId(paymentIntentId: string) {
    return this.prisma.purchase.findUnique({
      where: { paymentIntentId },
    });
  }

  async hasAccessToCourse(userId: string, courseId: string): Promise<boolean> {
    const purchase = await this.prisma.purchase.findFirst({
      where: {
        userId,
        courseId,
        status: 'COMPLETED',
      },
    });

    this.logger.log(
      `Checking access for user ${userId} to course ${courseId}: ${!!purchase}`,
    );

    return !!purchase;
  }
}
