/**
 * @file oauth.controller.ts
 * @description OAuth controller - handles OAuth routes
 * @task TASK-038, TASK-039, TASK-040
 * @design_state_version 3.6.0
 */
import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  Res,
  UseGuards,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { OAuthService } from './oauth.service';
import { OAuthProvider, OAuthCallbackData } from './oauth.types';

interface OAuthInitiateQuery {
  redirect_uri?: string;
}

interface OAuthCallbackQuery {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

@Controller('auth/oauth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(private readonly oauthService: OAuthService) {}

  /**
   * GET /auth/oauth/providers
   * Returns list of enabled OAuth providers
   */
  @Get('providers')
  getEnabledProviders(): { providers: OAuthProvider[] } {
    const providers = this.oauthService.getEnabledProviders();
    return { providers };
  }

  /**
   * GET /auth/oauth/:provider
   * Initiates OAuth flow - redirects to provider
   */
  @Get(':provider')
  initiateOAuth(
    @Param('provider') provider: string,
    @Query() query: OAuthInitiateQuery,
    @Res() res: Response,
  ): void {
    const oauthProvider = this.validateProvider(provider);

    if (!this.oauthService.isProviderEnabled(oauthProvider)) {
      throw new BadRequestException(`OAuth provider ${provider} is not enabled`);
    }

    // Generate state for CSRF protection
    const state = this.generateState(query.redirect_uri);

    const authUrl = this.oauthService.getAuthorizationUrl(oauthProvider, state);

    this.logger.log(`Redirecting to ${provider} OAuth`);
    res.redirect(authUrl);
  }

  /**
   * GET /auth/oauth/:provider/callback
   * Handles OAuth callback from provider
   */
  @Get(':provider/callback')
  async handleCallback(
    @Param('provider') provider: string,
    @Query() query: OAuthCallbackQuery,
    @Res() res: Response,
  ): Promise<void> {
    const oauthProvider = this.validateProvider(provider);

    // Handle OAuth errors
    if (query.error) {
      this.logger.warn(`OAuth error from ${provider}: ${query.error} - ${query.error_description}`);
      return this.redirectWithError(res, query.error, query.error_description);
    }

    if (!query.code) {
      throw new BadRequestException('Authorization code is required');
    }

    try {
      const callbackData: OAuthCallbackData = {
        code: query.code,
        state: query.state,
      };

      const result = await this.oauthService.authenticate(oauthProvider, callbackData);

      // Redirect to frontend with tokens
      // TODO(B): Implement secure token passing (e.g., short-lived code exchange)
      const redirectUrl = this.buildSuccessRedirectUrl(result.tokens, result.isNewUser);
      res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error(`OAuth authentication failed: ${error.message}`, error.stack);
      this.redirectWithError(res, 'authentication_failed', error.message);
    }
  }

  /**
   * POST /auth/oauth/:provider/callback
   * Handles OAuth callback via POST (required for Apple Sign In form_post)
   */
  @Post(':provider/callback')
  async handleCallbackPost(
    @Param('provider') provider: string,
    @Body() body: { code?: string; state?: string; error?: string; id_token?: string; user?: string },
    @Res() res: Response,
  ): Promise<void> {
    const oauthProvider = this.validateProvider(provider);

    if (body.error) {
      this.logger.warn(`OAuth error from ${provider}: ${body.error}`);
      return this.redirectWithError(res, body.error);
    }

    if (!body.code) {
      throw new BadRequestException('Authorization code is required');
    }

    try {
      const callbackData: OAuthCallbackData = {
        code: body.code,
        state: body.state,
      };

      const result = await this.oauthService.authenticate(oauthProvider, callbackData);

      const redirectUrl = this.buildSuccessRedirectUrl(result.tokens, result.isNewUser);
      res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error(`OAuth authentication failed: ${error.message}`, error.stack);
      this.redirectWithError(res, 'authentication_failed', error.message);
    }
  }

  /**
   * POST /auth/oauth/:provider/link
   * Links OAuth account to current user
   */
  @Post(':provider/link')
  @UseGuards(JwtAuthGuard)
  async linkAccount(
    @Param('provider') provider: string,
    @Body() body: { code: string; state?: string },
    @CurrentUser() user: { userId: string },
  ): Promise<{ success: boolean; provider: OAuthProvider }> {
    const oauthProvider = this.validateProvider(provider);

    const callbackData: OAuthCallbackData = {
      code: body.code,
      state: body.state,
    };

    const result = await this.oauthService.linkAccount(user.userId, oauthProvider, callbackData);

    return { success: result.success, provider: oauthProvider };
  }

  /**
   * DELETE /auth/oauth/:provider/unlink
   * Unlinks OAuth account from current user
   */
  @Post(':provider/unlink')
  @UseGuards(JwtAuthGuard)
  async unlinkAccount(
    @Param('provider') provider: string,
    @CurrentUser() user: { userId: string },
  ): Promise<{ success: boolean }> {
    const oauthProvider = this.validateProvider(provider);
    const success = await this.oauthService.unlinkAccount(user.userId, oauthProvider);
    return { success };
  }

  /**
   * Validate and parse provider parameter
   */
  private validateProvider(provider: string): OAuthProvider {
    const normalizedProvider = provider.toLowerCase();

    if (normalizedProvider === 'google') {
      return OAuthProvider.GOOGLE;
    }

    if (normalizedProvider === 'apple') {
      return OAuthProvider.APPLE;
    }

    throw new BadRequestException(`Unknown OAuth provider: ${provider}`);
  }

  /**
   * Generate state parameter for CSRF protection
   */
  private generateState(redirectUri?: string): string {
    // TODO(B): Implement proper state generation with encryption
    // Should encode redirect_uri and random nonce
    const nonce = Math.random().toString(36).substring(2);
    const data = { nonce, redirectUri };
    return Buffer.from(JSON.stringify(data)).toString('base64url');
  }

  /**
   * Build redirect URL for successful authentication
   */
  private buildSuccessRedirectUrl(tokens: { accessToken: string; refreshToken: string }, isNewUser: boolean): string {
    // TODO(B): Make this configurable and more secure
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const params = new URLSearchParams({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      is_new_user: String(isNewUser),
    });

    return `${frontendUrl}/auth/callback?${params.toString()}`;
  }

  /**
   * Redirect with error to frontend
   */
  private redirectWithError(res: Response, error: string, description?: string): void {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const params = new URLSearchParams({ error });
    if (description) {
      params.append('error_description', description);
    }

    res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
  }
}
