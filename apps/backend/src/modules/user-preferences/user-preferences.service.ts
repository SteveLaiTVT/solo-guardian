/**
 * @file user-preferences.service.ts
 * @description Service for user preferences business logic
 * @task TASK-021
 * @design_state_version 1.6.0
 */
import { Injectable, Logger } from '@nestjs/common';
import { UserPreferences } from '@prisma/client';
import { UserPreferencesRepository } from './user-preferences.repository';
import { UpdatePreferencesDto, PreferencesResponseDto } from './dto';
import { BusinessException } from '../../common/exceptions';

@Injectable()
export class UserPreferencesService {
  private readonly logger = new Logger(UserPreferencesService.name);

  constructor(private readonly repository: UserPreferencesRepository) {}

  async getOrCreate(userId: string): Promise<PreferencesResponseDto> {
    let preferences = await this.repository.findByUserId(userId);

    if (!preferences) {
      preferences = await this.repository.create(userId);
      this.logger.log(`Created default preferences for user: ${userId}`);
    }

    return this.mapToResponse(preferences);
  }

  async update(
    userId: string,
    dto: UpdatePreferencesDto,
  ): Promise<PreferencesResponseDto> {
    // Ensure preferences exist
    const existing = await this.repository.findByUserId(userId);
    if (!existing) {
      await this.repository.create(userId);
    }

    const preferences = await this.repository.update(userId, {
      preferFeaturesOn: dto.preferFeaturesOn,
      fontSize: dto.fontSize,
      highContrast: dto.highContrast,
      reducedMotion: dto.reducedMotion,
      warmColors: dto.warmColors,
      hobbyCheckIn: dto.hobbyCheckIn,
      familyAccess: dto.familyAccess,
    });

    this.logger.log(`Updated preferences for user: ${userId}`);
    return this.mapToResponse(preferences);
  }

  async updateOptionalFeature(
    userId: string,
    featureName: string,
    enabled: boolean,
  ): Promise<PreferencesResponseDto> {
    // Validate feature name (basic validation)
    if (!featureName || featureName.length > 50) {
      throw new BusinessException('PREFERENCES_INVALID_FEATURE', {
        details: { featureName },
      });
    }

    // Ensure preferences exist
    let existing = await this.repository.findByUserId(userId);
    if (!existing) {
      existing = await this.repository.create(userId);
    }

    // Merge with existing optional features
    const currentFeatures = (existing.optionalFeatures as Record<string, boolean>) || {};
    const updatedFeatures = { ...currentFeatures, [featureName]: enabled };

    const preferences = await this.repository.update(userId, {
      optionalFeatures: updatedFeatures,
    });

    this.logger.log(`Updated optional feature ${featureName}=${enabled} for user: ${userId}`);
    return this.mapToResponse(preferences);
  }

  async completeOnboarding(userId: string): Promise<PreferencesResponseDto> {
    // Ensure preferences exist
    const existing = await this.repository.findByUserId(userId);
    if (!existing) {
      await this.repository.create(userId);
    }

    const preferences = await this.repository.update(userId, {
      onboardingCompleted: true,
    });

    this.logger.log(`Completed onboarding for user: ${userId}`);
    return this.mapToResponse(preferences);
  }

  private mapToResponse(preferences: UserPreferences): PreferencesResponseDto {
    return {
      id: preferences.id,
      userId: preferences.userId,
      preferFeaturesOn: preferences.preferFeaturesOn,
      fontSize: preferences.fontSize,
      highContrast: preferences.highContrast,
      reducedMotion: preferences.reducedMotion,
      warmColors: preferences.warmColors,
      hobbyCheckIn: preferences.hobbyCheckIn,
      familyAccess: preferences.familyAccess,
      optionalFeatures: (preferences.optionalFeatures as Record<string, boolean>) || {},
      onboardingCompleted: preferences.onboardingCompleted,
      createdAt: preferences.createdAt,
      updatedAt: preferences.updatedAt,
    };
  }
}
