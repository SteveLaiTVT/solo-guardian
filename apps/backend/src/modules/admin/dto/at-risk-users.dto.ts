/**
 * @file at-risk-users.dto.ts
 * @description DTO for at-risk users (early warning)
 * @task TASK-055
 * @design_state_version 3.8.0
 */

export class AtRiskUserDto {
  id: string;
  email: string;
  name: string;
  consecutiveMisses: number;
  lastCheckIn: string | null;
  emergencyContactsCount: number;
}

export class AtRiskUsersResponse {
  users: AtRiskUserDto[];
  total: number;
}
