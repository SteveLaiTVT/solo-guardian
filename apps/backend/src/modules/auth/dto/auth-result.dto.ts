/**
 * @file auth-result.dto.ts
 * @description Response structure for authentication operations
 * @task TASK-001, TASK-046, TASK-082
 */

export type UserRoleType = 'user' | 'caregiver' | 'admin' | 'super_admin';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string | null;
  username: string | null;
  phone: string | null;
  name: string;
  role: UserRoleType;
  createdAt: Date;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
}
