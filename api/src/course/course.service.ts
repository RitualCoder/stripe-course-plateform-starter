import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Course } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Course[]> {
    return await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllWithPurchaseStatus(userId: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        Purchase: {
          where: { userId },
          select: { id: true, status: true },
        },
      },
    });

    return courses.map((course) => ({
      ...course,
      // find renvoie le 1er élément ou undefined → !! le cast en boolean
      isPurchased: !!course.Purchase.find((p) => p.status === 'COMPLETED'),
      Purchase: course.Purchase,
    }));
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`Course avec l'id ${id} non trouvé`);
    }

    return course;
  }
}
