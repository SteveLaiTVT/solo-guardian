/**
 * @file user-preferences.controller.ts
 * @description Controller for user preferences endpoints
 * @task TASK-021
 * @design_state_version 1.6.0
 */
import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPreferencesService } from './user-preferences.service';
import { UpdatePreferencesDto, PreferencesResponseDto } from './dto';

@Controller('api/v1/preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly preferencesService: UserPreferencesService) {}

  @Get()
  async getPreferences(
    @CurrentUser() userId: string,
  ): Promise<PreferencesResponseDto> {
    return this.preferencesService.getOrCreate(userId);
  }

  @Patch()
  async updatePreferences(
    @CurrentUser() userId: string,
    @Body() dto: UpdatePreferencesDto,
  ): Promise<PreferencesResponseDto> {
    return this.preferencesService.update(userId, dto);
  }

  @Patch('features/:featureName')
  async toggleFeature(
    @CurrentUser() userId: string,
    @Param('featureName') featureName: string,
    @Body('enabled') enabled: boolean,
  ): Promise<PreferencesResponseDto> {
    return this.preferencesService.updateOptionalFeature(userId, featureName, enabled);
  }

  @Post('onboarding/complete')
  async completeOnboarding(
    @CurrentUser() userId: string,
  ): Promise<PreferencesResponseDto> {
    return this.preferencesService.completeOnboarding(userId);
  }
}
