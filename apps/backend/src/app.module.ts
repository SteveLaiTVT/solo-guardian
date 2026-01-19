/**
 * @file app.module.ts
 * @description Root application module
 * @task TASK-000-5, TASK-006, TASK-015, TASK-021, TASK-024, TASK-028, TASK-046, TASK-096
 * @design_state_version 3.12.0
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
// DONE(B): Import ScheduleModule for cron jobs - TASK-028
import { ScheduleModule } from '@nestjs/schedule';
// DONE(B): Import ThrottlerModule for rate limiting - TASK-096
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
// DONE(B): Import AdminModule for admin dashboard - TASK-046
import { AdminModule } from './modules/admin';
// DONE(B): Import CaregiverModule - TASK-046 (enabled after migration)
import { CaregiverModule } from './modules/caregiver';
// DONE(B): Import TemplatesModule - TASK-050
import { TemplatesModule } from './modules/templates';
// DONE(B): Import AnalyticsModule - TASK-053
import { AnalyticsModule } from './modules/analytics';
// Import StorageModule for file uploads
import { StorageModule } from './modules/storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // DONE(B): Add ScheduleModule.forRoot() for cron jobs - TASK-028
    ScheduleModule.forRoot(),
    // DONE(B): Add ThrottlerModule for rate limiting - TASK-096
    // Global default: 100 requests per minute
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'short',
        ttl: 60000,
        limit: 5,
      },
      {
        name: 'long',
        ttl: 600000,
        limit: 3,
      },
    ]),
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
    // DONE(B): Add AdminModule for admin dashboard - TASK-046
    AdminModule,
    // DONE(B): Add CaregiverModule - TASK-046 (enabled)
    CaregiverModule,
    // DONE(B): Add TemplatesModule - TASK-050
    TemplatesModule,
    // DONE(B): Add AnalyticsModule - TASK-053
    AnalyticsModule,
    // Add StorageModule for file uploads (global)
    StorageModule,
  ],
  // DONE(B): Add global ThrottlerGuard for rate limiting - TASK-096
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
