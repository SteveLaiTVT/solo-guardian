/**
 * Response structure for authentication operations
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until access token expires
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
}
