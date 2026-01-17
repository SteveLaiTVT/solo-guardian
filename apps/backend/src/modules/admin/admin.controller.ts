/**
 * @file admin.controller.ts
 * @description Admin API controller
 * @task TASK-046, TASK-055
 * @design_state_version 3.8.0
 */
import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { AdminOnly } from '../auth/decorators';
import { AdminService } from './admin.service';
import {
  DashboardStatsResponse,
  UserListQueryDto,
  UserListResponse,
  UserDetailResponse,
  UpdateUserStatusDto,
  AlertListQueryDto,
  AlertListResponse,
  AtRiskUsersResponse,
} from './dto';

interface ApiResponse<T> {
  success: true;
  data: T;
}

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@AdminOnly()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getDashboardStats(): Promise<ApiResponse<DashboardStatsResponse>> {
    const stats = await this.adminService.getDashboardStats();
    return { success: true, data: stats };
  }

  @Get('users')
  async getUsers(
    @Query() query: UserListQueryDto,
  ): Promise<ApiResponse<UserListResponse>> {
    const result = await this.adminService.getUserList(query);
    return { success: true, data: result };
  }

  @Get('users/:id')
  async getUser(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserDetailResponse>> {
    const user = await this.adminService.getUserDetail(id);
    return { success: true, data: user };
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.adminService.updateUserStatus(id, dto.status);
    return { success: true, data: { message: 'User status updated' } };
  }

  @Get('alerts')
  async getAlerts(
    @Query() query: AlertListQueryDto,
  ): Promise<ApiResponse<AlertListResponse>> {
    const result = await this.adminService.getAlertList(query);
    return { success: true, data: result };
  }

  // DONE(B): Add early warning endpoint - TASK-055
  @Get('early-warning/at-risk-users')
  async getAtRiskUsers(): Promise<ApiResponse<AtRiskUsersResponse>> {
    const result = await this.adminService.getAtRiskUsers();
    return { success: true, data: result };
  }
}
