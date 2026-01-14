/**
 * @file current-user.decorator.ts
 * @description Decorator to extract user ID from request
 * @task TASK-007
 * @design_state_version 0.9.0
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.userId;
  },
);
