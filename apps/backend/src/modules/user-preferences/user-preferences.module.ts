/**
 * @file user-preferences.module.ts
 * @description Module definition for user preferences
 * @task TASK-021
 * @design_state_version 1.6.0
 */
import { Module } from '@nestjs/common';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesRepository } from './user-preferences.repository';

@Module({
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService, UserPreferencesRepository],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
