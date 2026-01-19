/**
 * @file auth.controller.ts
 * @description Controller for authentication endpoints
 * @task TASK-001-D
 * @design_state_version 0.2.0
 */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<{ success: true; data: AuthResult }> {
    const result = await this.authService.register(dto);
    return { success: true, data: result };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
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
