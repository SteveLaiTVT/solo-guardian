/**
 * @file app.module.ts
 * @description Root application module
 * @task TASK-000-5, TASK-006, TASK-015, TASK-021, TASK-024, TASK-028
 * @design_state_version 1.8.0
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// DONE(B): Import ScheduleModule for cron jobs - TASK-028
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { EmergencyContactsModule } from './modules/emergency-contacts/emergency-contacts.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';
// DONE(B): Import QueueModule for Bull queue - TASK-024
import { QueueModule } from './modules/queue';
// DONE(B): Import AlertModule, NotificationModule, DetectorModule - TASK-027, TASK-028
import { AlertModule } from './modules/alerts';
import { NotificationModule } from './modules/notifications';
import { DetectorModule } from './modules/detector';
import { HealthModule } from './modules/health';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // DONE(B): Add ScheduleModule.forRoot() for cron jobs - TASK-028
    ScheduleModule.forRoot(),
    PrismaModule,
    // DONE(B): Add QueueModule for Bull queue infrastructure - TASK-024
    QueueModule,
    AuthModule,
    CheckInModule,
    EmergencyContactsModule,
    UserPreferencesModule,
    // DONE(B): Add alert and notification modules - TASK-027
    NotificationModule,
    AlertModule,
    // DONE(B): Add DetectorModule for missed check-in detection - TASK-028
    DetectorModule,
    // Health check endpoint for monitoring
    HealthModule,
  ],
})
export class AppModule {}
