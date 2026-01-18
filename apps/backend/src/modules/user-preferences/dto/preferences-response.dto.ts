/**
 * @file preferences-response.dto.ts
 * @description DTO for user preferences response
 * @task TASK-021
 * @design_state_version 1.6.0
 */

export class PreferencesResponseDto {
  id: string;
  userId: string;
  preferFeaturesOn: boolean;
  theme: string;
  fontSize: number;
  highContrast: boolean;
  reducedMotion: boolean;
  warmColors: boolean;
  hobbyCheckIn: boolean;
  familyAccess: boolean;
  optionalFeatures: Record<string, boolean>;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
