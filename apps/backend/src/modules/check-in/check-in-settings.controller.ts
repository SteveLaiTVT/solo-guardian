/**
 * @file check-in-settings.controller.ts
 * @description Controller for check-in settings endpoints
 * @task TASK-007 (fix)
 * @design_state_version 0.9.0
 */
import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CheckInService } from './check-in.service';
import {
  UpdateCheckInSettingsDto,
  CheckInSettingsResponseDto,
} from './dto';
import { CurrentUser } from '@/modules/auth/decorators';
import { JwtAuthGuard } from '@/modules/auth/guards';

@Controller('api/v1/check-in-settings')
@UseGuards(JwtAuthGuard)
export class CheckInSettingsController {
  constructor(private readonly checkInService: CheckInService) {}

  @Get()
  async getSettings(
    @CurrentUser() userId: string,
  ): Promise<CheckInSettingsResponseDto> {
    return this.checkInService.getSettings(userId);
  }

  @Put()
  async updateSettings(
    @Body() dto: UpdateCheckInSettingsDto,
    @CurrentUser() userId: string,
  ): Promise<CheckInSettingsResponseDto> {
    return this.checkInService.updateSettings(userId, dto);
  }
}
