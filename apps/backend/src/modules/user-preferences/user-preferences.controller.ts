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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPreferencesService } from './user-preferences.service';
import { UpdatePreferencesDto, PreferencesResponseDto, UpdateProfileDto, ProfileResponseDto } from './dto';

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

  @Get('profile')
  async getProfile(
    @CurrentUser() userId: string,
  ): Promise<ProfileResponseDto> {
    return this.preferencesService.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.preferencesService.updateProfile(userId, dto);
  }

  @Post('profile/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
      fileFilter: (_req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
        }
      },
    }),
  )
  async uploadAvatar(
    @CurrentUser() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.preferencesService.uploadAvatar(userId, file);
  }
}
