import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UsersService } from '../users.service';
import { User } from '../user.entity';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<{
      currentUser: null | User;
      session: {
        userId?: number;
      };
    }>();

    const {
      session: { userId },
    } = request;

    if (userId) {
      const user = await this.usersService.findOne(userId);

      request.currentUser = user;
    }

    return next.handle();
  }
}
