/**
 * @file detector.module.ts
 * @description Detector Module - Scheduled job infrastructure
 * @task TASK-028, TASK-029
 * @design_state_version 2.0.0
 */

import { Module } from '@nestjs/common';
// DONE(B): Import ScheduleModule from '@nestjs/schedule' - TASK-028
// Note: ScheduleModule.forRoot() imported in AppModule
import { PrismaModule } from '../../prisma/prisma.module';
import { AlertModule } from '../alerts';
// DONE(B): Import CheckInModule for check-in queries - TASK-028
import { CheckInModule } from '../check-in';
// TODO(B): Import EmailModule for reminder notifications - TASK-029
// import { EmailModule } from '../email';
import { MissedCheckInDetector } from './missed-checkin.detector';

// DONE(B): Completed DetectorModule setup - TASK-028
@Module({
  imports: [
    // Note: ScheduleModule.forRoot() is imported in AppModule
    PrismaModule,
    AlertModule,
    // DONE(B): Import CheckInModule - TASK-028
    CheckInModule,
    // TODO(B): Import EmailModule for reminders - TASK-029
    // EmailModule,
  ],
  providers: [MissedCheckInDetector],
})
export class DetectorModule {}
