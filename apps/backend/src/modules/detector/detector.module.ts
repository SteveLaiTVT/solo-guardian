// ============================================================
// Detector Module - Scheduled job infrastructure
// @task TASK-028
// @design_state_version 1.8.0
// ============================================================

import { Module } from '@nestjs/common';
// TODO(B): Import ScheduleModule from '@nestjs/schedule'
import { PrismaModule } from '../../prisma/prisma.module';
import { AlertModule } from '../alerts';
// TODO(B): Import CheckInModule for check-in queries
import { MissedCheckInDetector } from './missed-checkin.detector';

/**
 * Detector Module - Scheduled jobs for detection
 *
 * TODO(B): Complete module setup
 * Requirements:
 * - Import ScheduleModule.forRoot() for cron jobs
 * - Import PrismaModule for database access
 * - Import AlertModule for creating alerts
 * - Import CheckInModule for querying check-ins
 * - Provide MissedCheckInDetector
 *
 * Note: ScheduleModule.forRoot() should be imported in AppModule
 * if used by multiple modules, or here if only used by detector.
 *
 * Acceptance:
 * - Module loads without errors
 * - Cron jobs registered and running
 */
@Module({
  imports: [
    // TODO(B): Import ScheduleModule.forRoot() if not in AppModule
    PrismaModule,
    AlertModule,
    // TODO(B): Import CheckInModule
  ],
  providers: [MissedCheckInDetector],
})
export class DetectorModule {}
