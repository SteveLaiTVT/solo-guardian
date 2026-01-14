/**
 * @file check-in.controller.ts
 * @description Controller for check-in endpoints
 * @task TASK-006
 * @design_state_version 0.8.0
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CheckInService } from './check-in.service';
import {
  CreateCheckInDto,
  UpdateCheckInSettingsDto,
  CheckInResponseDto,
  TodayCheckInStatusDto,
  CheckInHistoryDto,
  CheckInSettingsResponseDto,
} from './dto';

// TODO(B): Import auth decorator after auth guard is created
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

/**
 * Controller for check-in endpoints
 *
 * TODO(B): Add authentication guard to all endpoints
 * Requirements:
 * - All endpoints require JWT authentication
 * - Use @UseGuards(JwtAuthGuard) at class level
 * - Use @CurrentUser() to get user ID
 *
 * For now, use hardcoded userId until auth guard is ready
 */
@Controller('api/v1/check-ins')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  /**
   * POST /api/v1/check-ins
   * Create a check-in for today
   *
   * TODO(B): Add auth guard and get userId from token
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async checkIn(
    @Body() dto: CreateCheckInDto,
    // TODO(B): @CurrentUser() userId: string,
  ): Promise<CheckInResponseDto> {
    // TODO(B): Replace hardcoded userId with @CurrentUser()
    const userId = 'TODO-REPLACE-WITH-AUTH';
    return this.checkInService.checkIn(userId, dto);
  }

  /**
   * GET /api/v1/check-ins/today
   * Get today's check-in status
   *
   * TODO(B): Add auth guard and get userId from token
   */
  @Get('today')
  async getTodayStatus(
    // TODO(B): @CurrentUser() userId: string,
  ): Promise<TodayCheckInStatusDto> {
    // TODO(B): Replace hardcoded userId with @CurrentUser()
    const userId = 'TODO-REPLACE-WITH-AUTH';
    return this.checkInService.getTodayStatus(userId);
  }

  /**
   * GET /api/v1/check-ins
   * Get check-in history (paginated)
   *
   * TODO(B): Add auth guard and get userId from token
   */
  @Get()
  async getHistory(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 30,
    // TODO(B): @CurrentUser() userId: string,
  ): Promise<CheckInHistoryDto> {
    // TODO(B): Replace hardcoded userId with @CurrentUser()
    const userId = 'TODO-REPLACE-WITH-AUTH';
    return this.checkInService.getHistory(userId, page, pageSize);
  }

  /**
   * GET /api/v1/check-in-settings
   * Get user's check-in settings
   *
   * Note: Different path for settings (singular resource)
   * TODO(B): Add auth guard and get userId from token
   */
  @Get('../check-in-settings')
  async getSettings(
    // TODO(B): @CurrentUser() userId: string,
  ): Promise<CheckInSettingsResponseDto> {
    // TODO(B): Replace hardcoded userId with @CurrentUser()
    const userId = 'TODO-REPLACE-WITH-AUTH';
    return this.checkInService.getSettings(userId);
  }

  /**
   * PUT /api/v1/check-in-settings
   * Update user's check-in settings
   *
   * TODO(B): Add auth guard and get userId from token
   */
  @Put('../check-in-settings')
  async updateSettings(
    @Body() dto: UpdateCheckInSettingsDto,
    // TODO(B): @CurrentUser() userId: string,
  ): Promise<CheckInSettingsResponseDto> {
    // TODO(B): Replace hardcoded userId with @CurrentUser()
    const userId = 'TODO-REPLACE-WITH-AUTH';
    return this.checkInService.updateSettings(userId, dto);
  }
}
