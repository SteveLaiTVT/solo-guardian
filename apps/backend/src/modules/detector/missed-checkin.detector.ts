/**
 * @file missed-checkin.detector.ts
 * @description Missed Check-in Detector and Reminder Notification System
 * @task TASK-028, TASK-029
 * @design_state_version 2.0.0
 */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlertService } from '../alerts';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email';

@Injectable()
export class MissedCheckInDetector implements OnModuleInit {
  private readonly logger = new Logger(MissedCheckInDetector.name);
  private isRunning = false;

  constructor(
    private readonly alertService: AlertService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  onModuleInit(): void {
    this.logger.log('Missed check-in detector initialized');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async detectMissedCheckIns(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    let alertsCreated = 0;

    try {
      const usersWithSettings = await this.prisma.checkInSettings.findMany({
        include: { user: { select: { id: true, name: true } } },
      });

      for (const settings of usersWithSettings) {
        try {
          const { userId, timezone, deadlineTime } = settings;
          const userName = settings.user.name;

          if (!this.isPastDeadline(deadlineTime, timezone)) continue;

          const today = this.getTodayInTimezone(timezone);
          const checkIn = await this.prisma.checkIn.findUnique({
            where: { userId_checkInDate: { userId, checkInDate: today } },
          });

          if (checkIn) continue;

          const alert = await this.alertService.createAlert(userId, userName, today);
          if (alert) {
            alertsCreated++;
            this.logger.warn(`Created alert for user ${userName} (${userId}) - missed ${today}`);
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Error processing user ${settings.userId}: ${msg}`);
        }
      }

      if (alertsCreated > 0) {
        this.logger.log(`Detection complete: ${alertsCreated} alerts created`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Detection job failed: ${msg}`);
    } finally {
      this.isRunning = false;
    }
  }

  @Cron('0 0 * * *')
  async expireOldAlerts(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const count = await this.alertService.expireOldAlerts(today);
      if (count > 0) this.logger.log(`Expired ${count} old alerts`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Alert expiration job failed: ${msg}`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendReminders(): Promise<void> {
    let remindersSent = 0;

    try {
      const usersWithSettings = await this.prisma.checkInSettings.findMany({
        where: { reminderEnabled: true },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      for (const settings of usersWithSettings) {
        try {
          const { userId, reminderTime, deadlineTime, timezone, lastReminderSentAt } = settings;
          const { name: userName, email: userEmail } = settings.user;

          if (!this.isWithinReminderWindow(reminderTime, deadlineTime, timezone)) continue;

          const today = this.getTodayInTimezone(timezone);
          const checkIn = await this.prisma.checkIn.findUnique({
            where: { userId_checkInDate: { userId, checkInDate: today } },
          });
          if (checkIn) continue;

          if (this.wasReminderSentToday(lastReminderSentAt, timezone)) continue;

          if (!userEmail) {
            this.logger.debug(`Skipping reminder for user ${userId}: no email address`);
            continue;
          }

          const success = await this.emailService.sendReminderEmail(
            userEmail, userName, deadlineTime, timezone,
          );

          if (success) {
            await this.prisma.checkInSettings.update({
              where: { userId },
              data: { lastReminderSentAt: new Date() },
            });
            remindersSent++;
            this.logger.log(`Sent reminder to ${userName} (${userEmail})`);
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          this.logger.error(`Error sending reminder to user ${settings.userId}: ${msg}`);
        }
      }

      if (remindersSent > 0) {
        this.logger.log(`Reminder job: ${remindersSent} reminders sent`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Reminder job failed: ${msg}`);
    }
  }

  private isPastDeadline(deadlineTime: string, timezone: string): boolean {
    const [deadlineHour, deadlineMinute] = deadlineTime.split(':').map(Number);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const currentHour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
    const currentMinute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
    return currentHour > deadlineHour ||
      (currentHour === deadlineHour && currentMinute > deadlineMinute);
  }

  private getTodayInTimezone(timezone: string): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: timezone });
  }

  private isWithinReminderWindow(
    reminderTime: string,
    deadlineTime: string,
    timezone: string,
  ): boolean {
    const [reminderHour, reminderMinute] = reminderTime.split(':').map(Number);
    const [deadlineHour, deadlineMinute] = deadlineTime.split(':').map(Number);
    const reminderMinutes = reminderHour * 60 + reminderMinute;
    const deadlineMinutes = deadlineHour * 60 + deadlineMinute;
    if (reminderMinutes >= deadlineMinutes) return false;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone, hour: 'numeric', minute: 'numeric', hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const currentHour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
    const currentMinute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
    const currentMinutes = currentHour * 60 + currentMinute;
    return currentMinutes >= reminderMinutes && currentMinutes < deadlineMinutes;
  }

  private wasReminderSentToday(lastReminderSentAt: Date | null, timezone: string): boolean {
    if (!lastReminderSentAt) return false;
    const lastSentDate = lastReminderSentAt.toLocaleDateString('en-CA', { timeZone: timezone });
    return lastSentDate === this.getTodayInTimezone(timezone);
  }
}
