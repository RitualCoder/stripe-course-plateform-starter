import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PurchaseService } from 'src/purchase/purchase.service';

interface RequestWithUser extends Request {
  user?: { id: string };
  params: { id: string };
}

@Injectable()
export class CourseAccessGuard implements CanActivate {
  constructor(private readonly purchaseService: PurchaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const courseId = request.params.id;

    if (!user || !courseId) {
      throw new ForbiddenException('Accès non autorisé');
    }

    const hasAccess = await this.purchaseService.hasAccessToCourse(
      user.id,
      courseId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('Vous n’avez pas accès à ce cours.');
    }

    return true;
  }
}
