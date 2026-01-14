/**
 * @file check-in-response.dto.ts
 * @description Response DTOs for check-in endpoints
 * @task TASK-006
 * @design_state_version 0.8.0
 */

/**
 * Response DTO for a single check-in record
 */
export class CheckInResponseDto {
  id: string;
  userId: string;
  checkInDate: string; // YYYY-MM-DD format
  checkedInAt: Date;
  note: string | null;
}

/**
 * Response DTO for today's check-in status
 */
export class TodayCheckInStatusDto {
  hasCheckedIn: boolean;
  checkIn: CheckInResponseDto | null;
  deadlineTime: string;
  isOverdue: boolean;
}

/**
 * Response DTO for check-in history (paginated)
 */
export class CheckInHistoryDto {
  checkIns: CheckInResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
