/**
 * @file roles.guard.ts
 * @description Role-based access control guard
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRoleType } from '../decorators/roles.decorator';

interface RequestUser {
  userId: string;
  role?: UserRoleType;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Default to 'user' role if not specified
    const userRole = user.role || 'user';

    return requiredRoles.includes(userRole);
  }
}
