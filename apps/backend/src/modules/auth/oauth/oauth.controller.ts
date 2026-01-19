/**
 * @file oauth.controller.ts
 * @description OAuth controller - handles OAuth routes
 * @task TASK-038, TASK-039, TASK-040, TASK-095
 * @design_state_version 3.12.0
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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { OAuthService } from './oauth.service';
import { OAuthCodeStore } from './oauth-code.store';
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

@Controller('api/v1/auth/oauth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(
    private readonly oauthService: OAuthService,
    private readonly oauthCodeStore: OAuthCodeStore,
  ) {}

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
   * DONE(B): Implemented secure code-based token exchange - TASK-095
   */
  @Get(':provider/callback')
  async handleCallback(
    @Param('provider') provider: string,
    @Query() query: OAuthCallbackQuery,
    @Res() res: Response,
  ): Promise<void> {
    const oauthProvider = this.validateProvider(provider);

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

      // Store tokens with short-lived code (not exposed in URL)
      const authCode = this.oauthCodeStore.storeTokens(
        result.tokens.accessToken,
        result.tokens.refreshToken,
        result.isNewUser,
      );

      // Redirect with only the code (not tokens) - code is single-use and expires
      const redirectUrl = this.buildSuccessRedirectUrl(authCode, result.isNewUser);
      res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error(`OAuth authentication failed: ${error.message}`, error.stack);
      this.redirectWithError(res, 'authentication_failed', error.message);
    }
  }

  /**
   * POST /auth/oauth/:provider/callback
   * Handles OAuth callback via POST (required for Apple Sign In form_post)
   * DONE(B): Implemented secure code-based token exchange - TASK-095
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

      // Store tokens with short-lived code (not exposed in URL)
      const authCode = this.oauthCodeStore.storeTokens(
        result.tokens.accessToken,
        result.tokens.refreshToken,
        result.isNewUser,
      );

      const redirectUrl = this.buildSuccessRedirectUrl(authCode, result.isNewUser);
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
   * POST /auth/oauth/exchange
   * Exchange authorization code for tokens (secure token exchange)
   * DONE(B): Added secure code exchange endpoint - TASK-095
   */
  @Post('exchange')
  @HttpCode(HttpStatus.OK)
  exchangeCode(
    @Body() body: { code: string },
  ): { success: true; data: { accessToken: string; refreshToken: string; isNewUser: boolean } } {
    if (!body.code) {
      throw new BadRequestException('Authorization code is required');
    }

    const result = this.oauthCodeStore.exchangeCode(body.code);

    if (!result) {
      this.logger.warn('Invalid or expired OAuth code exchange attempt');
      throw new BadRequestException('Invalid or expired authorization code');
    }

    this.logger.log('OAuth code exchanged successfully');

    return {
      success: true,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isNewUser: result.isNewUser,
      },
    };
  }

  /**
   * Build redirect URL for successful authentication
   * DONE(B): Updated to use code instead of tokens - TASK-095
   */
  private buildSuccessRedirectUrl(code: string, isNewUser: boolean): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const params = new URLSearchParams({
      code,
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
