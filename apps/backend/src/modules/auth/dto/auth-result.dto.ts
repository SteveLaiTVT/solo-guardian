/**
 * @file auth-result.dto.ts
 * @description Response structure for authentication operations
 * @task TASK-001, TASK-046
 * @design_state_version 3.7.0
 */

// Role type for auth (matches schema when migration runs)
export type UserRoleType = 'user' | 'caregiver' | 'admin' | 'super_admin';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until access token expires
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
  createdAt: Date;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
}
