/**
 * @file dashboard-stats.dto.ts
 * @description Dashboard statistics DTO
 * @task TASK-046
 * @design_state_version 3.7.0
 */
export interface DashboardStatsResponse {
  totalUsers: number;
  activeUsers: number;
  todayCheckIns: number;
  pendingAlerts: number;
  checkInRate: number;
  userGrowth: number[];
}
