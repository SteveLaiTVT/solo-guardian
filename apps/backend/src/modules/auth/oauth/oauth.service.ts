/**
 * @file oauth.service.ts
 * @description OAuth service - orchestrates OAuth authentication flow
 * @task TASK-038, TASK-039, TASK-040
 * @design_state_version 3.6.0
 */
import { Injectable, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { AuthRepository } from '../auth.repository';
import { AuthTokens } from '../dto';
import { GoogleOAuthProvider } from './google-oauth.provider';
import { AppleOAuthProvider } from './apple-oauth.provider';
import {
  OAuthProvider,
  OAuthUserProfile,
  OAuthCallbackData,
  OAuthAuthResult,
} from './oauth.types';

const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60;
const REFRESH_TOKEN_EXPIRES_IN = '7d';

interface OAuthUser {
  id: string;
  email: string | null;
  name: string;
  createdAt: Date;
}

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly googleProvider: GoogleOAuthProvider,
    private readonly appleProvider: AppleOAuthProvider,
  ) {}

  /**
   * Get list of enabled OAuth providers
   */
  getEnabledProviders(): OAuthProvider[] {
    const providers: OAuthProvider[] = [];

    if (this.googleProvider.isEnabled()) {
      providers.push(OAuthProvider.GOOGLE);
    }

    if (this.appleProvider.isEnabled()) {
      providers.push(OAuthProvider.APPLE);
    }

    return providers;
  }

  /**
   * Check if a specific provider is enabled
   */
  isProviderEnabled(provider: OAuthProvider): boolean {
    return this.getEnabledProviders().includes(provider);
  }

  /**
   * Get authorization URL for a provider
   */
  getAuthorizationUrl(provider: OAuthProvider, state?: string): string {
    const providerInstance = this.getProvider(provider);
    return providerInstance.getAuthorizationUrl(state);
  }

  /**
   * Handle OAuth callback and authenticate user
   */
  async authenticate(
    provider: OAuthProvider,
    data: OAuthCallbackData,
  ): Promise<OAuthAuthResult & { user: OAuthUser; tokens: AuthTokens }> {
    const providerInstance = this.getProvider(provider);

    // Exchange code for tokens and get profile
    const { profile, tokens: oauthTokens } = await providerInstance.authenticate(data);

    // Find or create user
    const { user, isNewUser } = await this.findOrCreateUser(profile);

    // Generate app tokens
    const appTokens = await this.generateTokens(user.id);

    // Save refresh token
    const refreshTokenHash = this.hashRefreshToken(appTokens.refreshToken);
    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    this.logger.log(`OAuth login successful: ${user.email} via ${provider} (new: ${isNewUser})`);

    return {
      profile,
      oauthTokens,
      isNewUser,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      tokens: appTokens,
    };
  }

  /**
   * Link OAuth account to existing user
   */
  async linkAccount(
    userId: string,
    provider: OAuthProvider,
    data: OAuthCallbackData,
  ): Promise<{ success: boolean; profile: OAuthUserProfile }> {
    const providerInstance = this.getProvider(provider);

    // Exchange code for tokens and get profile
    const { profile } = await providerInstance.authenticate(data);

    // TODO(B): Implement account linking in repository
    // - Check if OAuth account is already linked to another user
    // - If so, throw ConflictException
    // - Otherwise, link to current user

    this.logger.log(`OAuth account linked: ${profile.email} to user ${userId} via ${provider}`);

    return { success: true, profile };
  }

  /**
   * Unlink OAuth account from user
   */
  async unlinkAccount(userId: string, provider: OAuthProvider): Promise<boolean> {
    // TODO(B): Implement account unlinking
    // - Check if user has other login methods
    // - If this is the only login method, throw error
    // - Otherwise, remove OAuth link

    this.logger.log(`OAuth account unlinked: user ${userId} from ${provider}`);
    return true;
  }

  /**
   * Get the provider instance for a given provider type
   */
  private getProvider(provider: OAuthProvider): GoogleOAuthProvider | AppleOAuthProvider {
    switch (provider) {
      case OAuthProvider.GOOGLE:
        if (!this.googleProvider.isEnabled()) {
          throw new UnauthorizedException('Google OAuth is not enabled');
        }
        return this.googleProvider;

      case OAuthProvider.APPLE:
        if (!this.appleProvider.isEnabled()) {
          throw new UnauthorizedException('Apple OAuth is not enabled');
        }
        return this.appleProvider;

      default:
        throw new UnauthorizedException(`Unknown OAuth provider: ${provider}`);
    }
  }

  /**
   * Find existing user or create new one from OAuth profile
   */
  private async findOrCreateUser(
    profile: OAuthUserProfile,
  ): Promise<{ user: { id: string; email: string | null; name: string; createdAt: Date }; isNewUser: boolean }> {
    if (!profile.email) {
      throw new UnauthorizedException('OAuth provider did not return an email address');
    }

    // TODO(B): Implement OAuth account table and proper linking
    // For now, we'll use email matching

    // Try to find user by email
    const existingUser = await this.authRepository.findByEmail(profile.email);

    if (existingUser) {
      // TODO(B): Link OAuth account to existing user if not already linked
      return {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          createdAt: existingUser.createdAt,
        },
        isNewUser: false,
      };
    }

    // Create new user
    const newUser = await this.authRepository.createUser({
      email: profile.email.toLowerCase(),
      passwordHash: '', // OAuth users don't have passwords
      name: profile.name || profile.email.split('@')[0],
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
      },
      isNewUser: true,
    };
  }

  /**
   * Generate app authentication tokens
   */
  private async generateTokens(userId: string): Promise<AuthTokens> {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const jti = crypto.randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        { secret: accessSecret, expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      ),
      this.jwtService.signAsync(
        { sub: userId, jti },
        { secret: refreshSecret, expiresIn: REFRESH_TOKEN_EXPIRES_IN },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS,
    };
  }

  /**
   * Hash refresh token for storage
   */
  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
