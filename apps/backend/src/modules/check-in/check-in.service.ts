/**
 * @file check-in.service.ts
 * @description Service for check-in business logic
 * @task TASK-006
 * @design_state_version 0.8.0
 */
import { Injectable, Logger } from '@nestjs/common';
import { CheckIn, CheckInSettings } from '@prisma/client';
import { CheckInRepository } from './check-in.repository';
import { BusinessException } from '../../common/exceptions';
import {
  CreateCheckInDto,
  UpdateCheckInSettingsDto,
  CheckInResponseDto,
  TodayCheckInStatusDto,
  CheckInHistoryDto,
  CheckInSettingsResponseDto,
} from './dto';

@Injectable()
export class CheckInService {
  private readonly logger = new Logger(CheckInService.name);

  constructor(private readonly checkInRepository: CheckInRepository) {}

  async checkIn(
    userId: string,
    dto: CreateCheckInDto,
  ): Promise<CheckInResponseDto> {
    const settings = await this.checkInRepository.getOrCreateSettings(userId);
    const today = this.getTodayDateString(settings.timezone);

    // Check if user has already checked in today
    const existingCheckIn = await this.checkInRepository.findByDate(userId, today);
    if (existingCheckIn) {
      throw new BusinessException('CHECKIN_ALREADY_TODAY', {
        message: 'Already checked in today',
        details: { checkInDate: today },
      });
    }

    const checkIn = await this.checkInRepository.upsertCheckIn({
      userId,
      checkInDate: today,
      note: dto.note,
    });

    this.logger.log(`User ${userId} checked in for ${today}`);

    return this.mapCheckInToResponse(checkIn);
  }

  async getTodayStatus(userId: string): Promise<TodayCheckInStatusDto> {
    const settings = await this.checkInRepository.getOrCreateSettings(userId);
    const today = this.getTodayDateString(settings.timezone);
    const checkIn = await this.checkInRepository.findByDate(userId, today);

    const hasCheckedIn = checkIn !== null;
    const isOverdue = !hasCheckedIn && this.isOverdue(settings.deadlineTime, settings.timezone);

    return {
      hasCheckedIn,
      checkIn: checkIn ? this.mapCheckInToResponse(checkIn) : null,
      deadlineTime: settings.deadlineTime,
      isOverdue,
    };
  }

  async getHistory(
    userId: string,
    page: number = 1,
    pageSize: number = 30,
  ): Promise<CheckInHistoryDto> {
    const { checkIns, total } = await this.checkInRepository.findHistory(
      userId,
      page,
      pageSize,
    );

    return {
      checkIns: checkIns.map((c) => this.mapCheckInToResponse(c)),
      total,
      page,
      pageSize,
    };
  }

  async getSettings(userId: string): Promise<CheckInSettingsResponseDto> {
    const settings = await this.checkInRepository.getOrCreateSettings(userId);
    return this.mapSettingsToResponse(settings);
  }

  async updateSettings(
    userId: string,
    dto: UpdateCheckInSettingsDto,
  ): Promise<CheckInSettingsResponseDto> {
    await this.checkInRepository.getOrCreateSettings(userId);

    const updated = await this.checkInRepository.updateSettings(userId, {
      deadlineTime: dto.deadlineTime,
      reminderTime: dto.reminderTime,
      reminderEnabled: dto.reminderEnabled,
    });

    this.logger.log(`User ${userId} updated check-in settings`);

    return this.mapSettingsToResponse(updated);
  }

  private getTodayDateString(timezone: string = 'Asia/Shanghai'): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: timezone });
  }

  private isOverdue(deadlineTime: string, timezone: string): boolean {
    const now = new Date();
    const [hour, minute] = deadlineTime.split(':').map(Number);

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const currentHour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
    const currentMinute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);

    return currentHour > hour || (currentHour === hour && currentMinute > minute);
  }

  private mapCheckInToResponse(checkIn: CheckIn): CheckInResponseDto {
    return {
      id: checkIn.id,
      userId: checkIn.userId,
      checkInDate: checkIn.checkInDate,
      checkedInAt: checkIn.checkedInAt,
      note: checkIn.note,
    };
  }

  private mapSettingsToResponse(settings: CheckInSettings): CheckInSettingsResponseDto {
    return {
      userId: settings.userId,
      deadlineTime: settings.deadlineTime,
      reminderTime: settings.reminderTime,
      reminderEnabled: settings.reminderEnabled,
      timezone: settings.timezone,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }
}
