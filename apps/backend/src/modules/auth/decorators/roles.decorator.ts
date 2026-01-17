/**
 * @file roles.decorator.ts
 * @description Role-based access control decorators
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type UserRoleType = 'user' | 'caregiver' | 'admin' | 'super_admin';

/**
 * Decorator to specify required roles for a route
 * @param roles - Array of roles that can access this route
 */
export const Roles = (...roles: UserRoleType[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);

/**
 * Decorator to mark a route as admin-only
 */
export const AdminOnly = (): MethodDecorator & ClassDecorator =>
  Roles('admin', 'super_admin');

/**
 * Decorator to mark a route as super-admin-only
 */
export const SuperAdminOnly = (): MethodDecorator & ClassDecorator =>
  Roles('super_admin');

/**
 * Decorator to mark a route as accessible by caregivers
 */
export const CaregiverOrAdmin = (): MethodDecorator & ClassDecorator =>
  Roles('caregiver', 'admin', 'super_admin');
