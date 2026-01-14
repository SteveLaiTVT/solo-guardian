/**
 * @file check-in.module.ts
 * @description NestJS module for check-in functionality
 * @task TASK-006, TASK-007
 * @design_state_version 0.9.0
 */
import { Module } from '@nestjs/common';
import { CheckInController } from './check-in.controller';
import { CheckInSettingsController } from './check-in-settings.controller';
import { CheckInService } from './check-in.service';
import { CheckInRepository } from './check-in.repository';

@Module({
  controllers: [CheckInController, CheckInSettingsController],
  providers: [CheckInService, CheckInRepository],
  exports: [CheckInService],
})
export class CheckInModule {}
