import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@supabase/supabase-js';

export interface AuthUserData {
  user: User;
  token: string;
}

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUserData => {
    const request = ctx.switchToHttp().getRequest();
    return {
      user: request.user,
      token: request.token,
    };
  },
);
