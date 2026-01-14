import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResult } from './dto';

/**
 * Controller for authentication endpoints
 *
 * This layer ONLY handles:
 * - Request validation (via DTOs + class-validator)
 * - Calling the service
 * - Response formatting
 *
 * NO business logic allowed here!
 */
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   *
   * TODO(B): Verify this endpoint works
   * - Validation is handled by ValidationPipe + DTO decorators
   * - Just call service and return result
   *
   * Acceptance:
   * - POST /api/v1/auth/register returns AuthResult
   * - Invalid input returns 400 Bad Request
   * - Duplicate email returns 409 Conflict
   */
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResult> {
    return this.authService.register(dto);
  }

  /**
   * Login with email and password
   *
   * TODO(B): Verify this endpoint works
   *
   * Acceptance:
   * - POST /api/v1/auth/login returns AuthResult
   * - Invalid credentials return 401 Unauthorized
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResult> {
    return this.authService.login(dto);
  }

  /**
   * Refresh access token
   *
   * TODO(B): Implement this endpoint
   * Requirements:
   * - Accept refresh token in request body
   * - Return new tokens
   *
   * Acceptance:
   * - POST /api/v1/auth/refresh returns new tokens
   * - Invalid refresh token returns 401
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<AuthResult> {
    // TODO(B): Add validation for refreshToken (create RefreshDto if needed)
    return this.authService.refreshTokens(refreshToken);
  }

  /**
   * Logout (invalidate refresh token)
   *
   * TODO(B): Implement this endpoint
   * Requirements:
   * - Accept refresh token in request body
   * - Invalidate the token
   *
   * Acceptance:
   * - POST /api/v1/auth/logout returns 204 No Content
   * - Refresh token no longer valid
   */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Body('refreshToken') refreshToken: string): Promise<void> {
    // TODO(B): Add validation for refreshToken
    return this.authService.logout(refreshToken);
  }
}
