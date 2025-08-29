import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../users/user.entity';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      currentUser: null | User;
    }>();

    if (!request.currentUser) {
      return false;
    }

    const { admin } = request.currentUser;

    return admin;
  }
}
