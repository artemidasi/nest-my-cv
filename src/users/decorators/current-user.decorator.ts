import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{
      currentUser: null | User;
      session: {
        userId?: number;
      };
    }>();

    return request.currentUser;
  },
);
