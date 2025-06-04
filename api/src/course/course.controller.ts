import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get('with-purchase-status')
  @UseGuards(JwtAuthGuard)
  async findAllWithPurchaseStatus(@Request() req: { user: { id: string } }) {
    return this.courseService.findAllWithPurchaseStatus(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }
}
