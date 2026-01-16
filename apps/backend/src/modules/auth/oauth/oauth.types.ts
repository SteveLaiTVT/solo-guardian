/**
 * @file oauth.types.ts
 * @description OAuth type definitions for provider-agnostic authentication
 * @task TASK-038, TASK-039
 * @design_state_version 3.6.0
 */

/**
 * OAuth provider identifier enum
 */
export enum OAuthProvider {
  GOOGLE = 'google',
  APPLE = 'apple',
}

/**
 * Standardized OAuth user profile returned by all providers
 */
export interface OAuthUserProfile {
  /** Provider-specific user ID */
  providerId: string;
  /** OAuth provider name */
  provider: OAuthProvider;
  /** User email (may be null for some providers) */
  email: string | null;
  /** User display name */
  name: string | null;
  /** Profile picture URL */
  avatarUrl?: string | null;
  /** Whether email is verified by provider */
  emailVerified?: boolean;
}

/**
 * OAuth tokens returned after authentication
 */
export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
}

/**
 * OAuth callback data from provider
 */
export interface OAuthCallbackData {
  code: string;
  state?: string;
}

/**
 * OAuth configuration for a provider
 */
export interface OAuthProviderConfig {
  /** Whether this provider is enabled */
  enabled: boolean;
  /** Client ID */
  clientId: string;
  /** Client secret */
  clientSecret: string;
  /** Callback URL */
  callbackUrl: string;
  /** OAuth scopes */
  scopes: string[];
}

/**
 * OAuth authentication result
 */
export interface OAuthAuthResult {
  /** User profile from OAuth provider */
  profile: OAuthUserProfile;
  /** OAuth tokens */
  tokens: OAuthTokens;
  /** Whether this is a new user */
  isNewUser: boolean;
}
