/**
 * @file track-event.dto.ts
 * @description DTO for event tracking
 * @task TASK-100
 * @design_state_version 3.9.0
 */
import {
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  MaxLength,
} from 'class-validator';

export enum EventType {
  USER_ACTION = 'user_action',
  SYSTEM_EVENT = 'system_event',
  ERROR = 'error',
}

export enum Platform {
  WEB = 'web',
  IOS = 'ios',
  ANDROID = 'android',
}

/**
 * DTO for tracking a single event
 */
export class TrackEventDto {
  @IsString()
  @MaxLength(100)
  eventName: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsOptional()
  @IsObject()
  properties?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsEnum(Platform)
  platform?: Platform;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  appVersion?: string;
}

/**
 * DTO for batch tracking multiple events
 */
export class BatchTrackEventsDto {
  events: TrackEventDto[];
}

/**
 * Response DTO for tracked event
 */
export class TrackedEventResponseDto {
  id: string;
  eventName: string;
  eventType: string;
  timestamp: Date;
  acknowledged: boolean;
}

/**
 * DTO for querying events (admin)
 */
export class QueryEventsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  eventName?: string;

  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;
}

/**
 * DTO for export configuration
 */
export class ExportConfigDto {
  @IsString()
  platform: string; // "mixpanel" | "amplitude" | "posthog" | "webhook"

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsObject()
  options?: Record<string, unknown>;
}
