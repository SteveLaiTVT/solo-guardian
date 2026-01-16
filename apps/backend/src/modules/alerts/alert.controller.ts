// ============================================================
// Alert Controller - API endpoints for alerts
// @task TASK-027
// @design_state_version 1.8.0
// ============================================================

import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
// TODO(B): Import JwtAuthGuard and CurrentUser decorator
import { AlertService } from './alert.service';

/**
 * Alert Controller - Exposes alert API endpoints
 *
 * TODO(B): Implement this controller
 * Requirements:
 * - GET /alerts - List user's alert history
 * - GET /alerts/:id - Get alert details with notifications
 *
 * Constraints:
 * - All endpoints protected with JwtAuthGuard
 * - Use CurrentUser decorator to get userId
 * - Controller only validates and calls Service
 * - Single function < 50 lines
 *
 * API Response Format:
 * {
 *   success: true,
 *   data: { ... },
 *   meta: { page, limit, total }
 * }
 */
@Controller('alerts')
// TODO(B): Add @UseGuards(JwtAuthGuard)
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  /**
   * Get user's alert history
   *
   * TODO(B): Implement getAlerts
   * Requirements:
   * - Add @Get() decorator
   * - Use @CurrentUser('userId') to get user ID
   * - Support pagination with @Query('page') and @Query('limit')
   * - Default: page=1, limit=10
   * - Return paginated alerts
   *
   * @param userId - Current user ID (from JWT)
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated alert list
   */
  async getAlerts(
    // @CurrentUser('userId') userId: string,
    // @Query('page') page: number = 1,
    // @Query('limit') limit: number = 10,
  ): Promise<{
    success: boolean;
    data: unknown[];
    meta: { page: number; limit: number; total: number };
  }> {
    throw new Error('Not implemented - TODO(B)');
  }

  /**
   * Get alert details with notifications
   *
   * TODO(B): Implement getAlertById
   * Requirements:
   * - Add @Get(':id') decorator
   * - Use @Param('id', ParseUUIDPipe) to validate ID
   * - Use @CurrentUser('userId') to get user ID
   * - Return alert with notification details
   * - Return 404 if not found or not owned by user
   *
   * @param id - Alert ID
   * @param userId - Current user ID (for authorization)
   * @returns Alert details with notifications
   */
  async getAlertById(
    // @Param('id', ParseUUIDPipe) id: string,
    // @CurrentUser('userId') userId: string,
  ): Promise<{
    success: boolean;
    data: unknown;
  }> {
    throw new Error('Not implemented - TODO(B)');
  }
}
