import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PurchaseService } from 'src/purchase/purchase.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PurchaseService],
  exports: [CourseService],
})
export class CourseModule {}
