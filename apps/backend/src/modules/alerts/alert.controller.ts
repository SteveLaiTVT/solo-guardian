/**
 * @file alert.controller.ts
 * @description Alert Controller - API endpoints for alerts
 * @task TASK-027
 * @design_state_version 1.8.0
 */

import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
// DONE(B): Import JwtAuthGuard and CurrentUser decorator - TASK-027
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AlertService } from './alert.service';

// DONE(B): Implemented AlertController - TASK-027
@Controller('api/v1/alerts')
// DONE(B): Add @UseGuards(JwtAuthGuard) - TASK-027
@UseGuards(JwtAuthGuard)
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  /**
   * Get user's alert history
   * DONE(B): Implement getAlerts - TASK-027
   */
  @Get()
  async getAlerts(
    @CurrentUser('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<{
    success: boolean;
    data: unknown[];
    meta: { page: number; limit: number; total: number };
  }> {
    const result = await this.alertService.getUserAlerts(userId, page, limit);

    return {
      success: true,
      data: result.data,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    };
  }

  /**
   * Get alert details with notifications
   * DONE(B): Implement getAlertById - TASK-027
   */
  @Get(':id')
  async getAlertById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<{
    success: boolean;
    data: unknown;
  }> {
    const result = await this.alertService.getAlertDetails(id, userId);

    if (!result) {
      throw new NotFoundException('Alert not found');
    }

    return {
      success: true,
      data: result,
    };
  }
}
