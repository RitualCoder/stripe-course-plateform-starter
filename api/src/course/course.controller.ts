import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CourseAccessGuard } from './guards/course-access.guard';
import { PurchaseService } from 'src/purchase/purchase.service';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly purchaseService: PurchaseService,
  ) {}

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('with-purchase-status')
  @UseGuards(JwtAuthGuard)
  async findAllWithPurchaseStatus(@Request() req: { user: { id: string } }) {
    return this.courseService.findAllWithPurchaseStatus(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':courseId/access')
  async checkAccess(
    @Param('courseId') courseId: string,
    @Request() req: { user: { id: string } },
  ) {
    const userId = req.user.id;
    return this.purchaseService.hasAccessToCourse(userId, courseId);
  }

  @UseGuards(JwtAuthGuard, CourseAccessGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }
}
