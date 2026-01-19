/**
 * @file auth.controller.ts
 * @description Controller for authentication endpoints
 * @task TASK-001-D, TASK-096
 * @design_state_version 3.12.0
 */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshDto,
  LogoutDto,
  AuthResult,
} from './dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // DONE(B): Add strict rate limiting - 3 requests per 10 minutes - TASK-096
  @Post('register')
  @Throttle({ long: { ttl: 600000, limit: 3 } })
  async register(
    @Body() dto: RegisterDto,
  ): Promise<{ success: true; data: AuthResult }> {
    const result = await this.authService.register(dto);
    return { success: true, data: result };
  }

  // DONE(B): Add strict rate limiting - 5 requests per minute - TASK-096
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  async login(
    @Body() dto: LoginDto,
  ): Promise<{ success: true; data: AuthResult }> {
    const result = await this.authService.login(dto);
    return { success: true, data: result };
  }

  // DONE(B): Add validation for refreshToken - TASK-001-D
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto: RefreshDto,
  ): Promise<{ success: true; data: AuthResult }> {
    const result = await this.authService.refreshTokens(dto.refreshToken);
    return { success: true, data: result };
  }

  // DONE(B): Add validation for logout - TASK-001-D
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() dto: LogoutDto,
  ): Promise<{ success: true; data: null }> {
    await this.authService.logout(dto.refreshToken);
    return { success: true, data: null };
  }
}
