/**
 * @file missed-checkin.detector.ts
 * @description Missed Check-in Detector - Cron job to detect overdue users
 * @task TASK-028, TASK-029
 * @design_state_version 2.0.0
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// DONE(B): Import Cron, CronExpression from '@nestjs/schedule' - TASK-028
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertService } from '../alerts';
// DONE(B): Import PrismaService for batch queries - TASK-028
import { PrismaService } from '../../prisma/prisma.service';
import { CheckInService } from '../check-in';
// TODO(B): Import EmailService for sending reminders - TASK-029
// import { EmailService } from '../email';

// DONE(B): Implemented MissedCheckInDetector - TASK-028
@Injectable()
export class MissedCheckInDetector implements OnModuleInit {
  private readonly logger = new Logger(MissedCheckInDetector.name);
  private isRunning = false; // Prevent concurrent runs

  constructor(
    private readonly alertService: AlertService,
    // DONE(B): Inject PrismaService for batch queries - TASK-028
    private readonly prisma: PrismaService,
    // DONE(B): Inject CheckInService - TASK-028
    private readonly checkInService: CheckInService,
    // TODO(B): Inject EmailService for sending reminders - TASK-029
    // private readonly emailService: EmailService,
  ) {}

  /**
   * Log startup message
   */
  onModuleInit(): void {
    this.logger.log('Missed check-in detector initialized');
    this.logger.log('Detection job runs: EVERY_MINUTE');
    this.logger.log('Expiration job runs: Daily at midnight UTC');
  }

  /**
   * Main detection job - runs every minute
   * DONE(B): Implement detectMissedCheckIns - TASK-028
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async detectMissedCheckIns(): Promise<void> {
    // Prevent concurrent runs
    if (this.isRunning) {
      this.logger.debug('Detection already in progress, skipping');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    let usersChecked = 0;
    let alertsCreated = 0;

    try {
      // Get all users with check-in settings
      const usersWithSettings = await this.prisma.checkInSettings.findMany({
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      });

      for (const settings of usersWithSettings) {
        try {
          usersChecked++;
          const userId = settings.userId;
          const userName = settings.user.name;
          const timezone = settings.timezone;
          const deadlineTime = settings.deadlineTime;

          // Check if past deadline in user's timezone
          if (!this.isPastDeadline(deadlineTime, timezone)) {
            continue; // Not past deadline yet
          }

          const today = this.getTodayInTimezone(timezone);

          // Check if user has checked in today
          const checkIn = await this.prisma.checkIn.findUnique({
            where: {
              userId_checkInDate: { userId, checkInDate: today },
            },
          });

          if (checkIn) {
            continue; // Already checked in
          }

          // Create alert (service handles duplicate check)
          const alert = await this.alertService.createAlert(userId, userName, today);

          if (alert) {
            alertsCreated++;
            this.logger.warn(`Created alert for user ${userName} (${userId}) - missed ${today}`);
          }
        } catch (error) {
          // Log error but continue with other users
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Error processing user ${settings.userId}: ${errorMessage}`);
        }
      }

      const duration = Date.now() - startTime;
      if (alertsCreated > 0 || duration > 10000) {
        this.logger.log(
          `Detection complete: ${usersChecked} users checked, ${alertsCreated} alerts created (${duration}ms)`,
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Detection job failed: ${errorMessage}`);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Check if a user is past their deadline
   * DONE(B): Implement isPastDeadline - TASK-028
   */
  private isPastDeadline(deadlineTime: string, timezone: string): boolean {
    const [deadlineHour, deadlineMinute] = deadlineTime.split(':').map(Number);

    // Get current time in user's timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const currentHour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
    const currentMinute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);

    // Compare times
    return currentHour > deadlineHour ||
      (currentHour === deadlineHour && currentMinute > deadlineMinute);
  }

  /**
   * Get today's date in user's timezone
   * DONE(B): Implement getTodayInTimezone - TASK-028
   */
  private getTodayInTimezone(timezone: string): string {
    // en-CA locale returns YYYY-MM-DD format
    return new Date().toLocaleDateString('en-CA', { timeZone: timezone });
  }

  /**
   * Expire old alerts (cleanup job) - runs daily at midnight UTC
   * DONE(B): Implement expireOldAlerts - TASK-028
   */
  @Cron('0 0 * * *')
  async expireOldAlerts(): Promise<void> {
    this.logger.log('Running alert expiration job');

    try {
      // Get today's date in UTC
      const today = new Date().toISOString().split('T')[0];

      const count = await this.alertService.expireOldAlerts(today);

      if (count > 0) {
        this.logger.log(`Expired ${count} old alerts`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Alert expiration job failed: ${errorMessage}`);
    }
  }

  // ============================================================
  // Reminder Notification System - TASK-029
  // ============================================================

  /**
   * Reminder job - runs every minute to send reminders to users
   * who haven't checked in yet and are within their reminder window
   *
   * TODO(B): Implement sendReminders - TASK-029
   * Requirements:
   * - Query all users with checkInSettings where reminderEnabled = true
   * - For each user:
   *   1. Check if current time in user's timezone is past reminderTime but before deadlineTime
   *   2. Check if user has already checked in today (skip if yes)
   *   3. Check if reminder was already sent today (lastReminderSentAt, skip if same day)
   *   4. Send reminder email via EmailService.sendReminderEmail()
   *   5. Update lastReminderSentAt in checkInSettings
   * - Use batch processing with error handling per user
   * - Log summary: users processed, reminders sent
   */
  // @Cron(CronExpression.EVERY_MINUTE)
  // async sendReminders(): Promise<void> {
  //   // TODO(B): Implement reminder logic - TASK-029
  // }

  /**
   * Check if current time is within reminder window (after reminder, before deadline)
   *
   * TODO(B): Implement isWithinReminderWindow - TASK-029
   * Requirements:
   * - Parse reminderTime and deadlineTime (HH:mm format)
   * - Get current time in user's timezone
   * - Return true if: reminderTime <= currentTime < deadlineTime
   * - Edge case: if reminderTime >= deadlineTime, no valid window exists
   */
  // private isWithinReminderWindow(
  //   reminderTime: string,
  //   deadlineTime: string,
  //   timezone: string,
  // ): boolean {
  //   // TODO(B): Implement - TASK-029
  //   return false;
  // }

  /**
   * Check if reminder was already sent today
   *
   * TODO(B): Implement wasReminderSentToday - TASK-029
   * Requirements:
   * - Compare lastReminderSentAt with today's date in user's timezone
   * - Return true if lastReminderSentAt is today
   */
  // private wasReminderSentToday(
  //   lastReminderSentAt: Date | null,
  //   timezone: string,
  // ): boolean {
  //   // TODO(B): Implement - TASK-029
  //   return false;
  // }
}
