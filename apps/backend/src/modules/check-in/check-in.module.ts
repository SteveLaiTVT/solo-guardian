/**
 * @file check-in.module.ts
 * @description NestJS module for check-in functionality
 * @task TASK-006
 * @design_state_version 0.8.0
 */
import { Module } from '@nestjs/common';
import { CheckInController } from './check-in.controller';
import { CheckInService } from './check-in.service';
import { CheckInRepository } from './check-in.repository';

/**
 * Check-in module
 *
 * TODO(B): Import AuthModule when auth guard is ready
 * Requirements:
 * - Register controller, service, repository
 * - Import PrismaModule (already global)
 */
@Module({
  controllers: [CheckInController],
  providers: [CheckInService, CheckInRepository],
  exports: [CheckInService],
})
export class CheckInModule {}
