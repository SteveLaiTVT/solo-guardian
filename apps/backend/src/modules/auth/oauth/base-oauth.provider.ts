/**
 * @file base-oauth.provider.ts
 * @description Abstract base class for OAuth providers
 * @task TASK-038, TASK-039
 * @design_state_version 3.6.0
 */
import { Logger } from '@nestjs/common';
import {
  OAuthProvider,
  OAuthUserProfile,
  OAuthTokens,
  OAuthCallbackData,
  OAuthProviderConfig,
} from './oauth.types';

/**
 * Abstract base class for OAuth providers
 * Implements common functionality and defines the interface for specific providers
 */
export abstract class BaseOAuthProvider {
  protected readonly logger: Logger;
  protected readonly config: OAuthProviderConfig;

  constructor(
    protected readonly providerName: OAuthProvider,
    config: OAuthProviderConfig,
  ) {
    this.logger = new Logger(`OAuth:${providerName}`);
    this.config = config;
  }

  /**
   * Check if the provider is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled && !!this.config.clientId && !!this.config.clientSecret;
  }

  /**
   * Get the provider name
   */
  getProviderName(): OAuthProvider {
    return this.providerName;
  }

  /**
   * Get OAuth authorization URL
   * User will be redirected here to authenticate
   */
  abstract getAuthorizationUrl(state?: string): string;

  /**
   * Exchange authorization code for tokens
   * Called after user is redirected back with auth code
   */
  abstract exchangeCodeForTokens(data: OAuthCallbackData): Promise<OAuthTokens>;

  /**
   * Get user profile from provider using tokens
   */
  abstract getUserProfile(tokens: OAuthTokens): Promise<OAuthUserProfile>;

  /**
   * Validate ID token (for providers that use OIDC like Google/Apple)
   * Returns decoded claims if valid
   */
  abstract validateIdToken(idToken: string): Promise<Record<string, unknown> | null>;

  /**
   * Full OAuth flow: exchange code and get user profile
   */
  async authenticate(data: OAuthCallbackData): Promise<{
    profile: OAuthUserProfile;
    tokens: OAuthTokens;
  }> {
    if (!this.isEnabled()) {
      throw new Error(`OAuth provider ${this.providerName} is not enabled`);
    }

    this.logger.log('Exchanging authorization code for tokens');
    const tokens = await this.exchangeCodeForTokens(data);

    this.logger.log('Fetching user profile');
    const profile = await this.getUserProfile(tokens);

    this.logger.log(`OAuth authentication successful for ${profile.email || profile.providerId}`);

    return { profile, tokens };
  }

  /**
   * Build OAuth scopes string from array
   */
  protected buildScopesString(scopes: string[]): string {
    return scopes.join(' ');
  }

  /**
   * Mask sensitive data for logging
   */
  protected maskForLog(value: string, visibleChars = 4): string {
    if (value.length <= visibleChars * 2) {
      return '***';
    }
    return `${value.slice(0, visibleChars)}...${value.slice(-visibleChars)}`;
  }
}
