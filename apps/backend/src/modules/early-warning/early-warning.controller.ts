/**
 * @file early-warning.controller.ts
 * @description Controller for early warning system endpoints (Admin only)
 * @task TASK-100
 * @design_state_version 3.12.0
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { EarlyWarningService } from './early-warning.service';
import {
  CreateWarningRuleDto,
  UpdateWarningRuleDto,
  AcknowledgeWarningDto,
  WarningFilterDto,
  WarningSeverity,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '@/modules/auth/guards';
import { Roles, CurrentUser } from '@/modules/auth/decorators';

@Controller('api/v1/admin/early-warnings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class EarlyWarningController {
  constructor(private readonly service: EarlyWarningService) {}

  /**
   * Get dashboard summary
   */
  @Get('dashboard')
  async getDashboard() {
    return this.service.getDashboard();
  }

  /**
   * Get all warning rules
   */
  @Get('rules')
  async getAllRules() {
    return this.service.getAllRules();
  }

  /**
   * Create a warning rule
   */
  @Post('rules')
  @HttpCode(HttpStatus.CREATED)
  async createRule(@Body() dto: CreateWarningRuleDto) {
    return this.service.createRule(dto);
  }

  /**
   * Get a warning rule by ID
   */
  @Get('rules/:id')
  async getRuleById(@Param('id') id: string) {
    return this.service.getRuleById(id);
  }

  /**
   * Update a warning rule
   */
  @Patch('rules/:id')
  async updateRule(@Param('id') id: string, @Body() dto: UpdateWarningRuleDto) {
    return this.service.updateRule(id, dto);
  }

  /**
   * Delete a warning rule
   */
  @Delete('rules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRule(@Param('id') id: string) {
    await this.service.deleteRule(id);
  }

  /**
   * Get warnings with filters
   */
  @Get()
  async getWarnings(
    @Query('severity') severity?: WarningSeverity,
    @Query('acknowledged') acknowledged?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const filters: WarningFilterDto = {
      severity,
      acknowledged: acknowledged ? acknowledged === 'true' : undefined,
      userId,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 50,
    };

    return this.service.getWarnings(filters);
  }

  /**
   * Acknowledge a warning
   */
  @Post(':id/acknowledge')
  @HttpCode(HttpStatus.OK)
  async acknowledgeWarning(
    @Param('id') id: string,
    @CurrentUser() adminId: string,
    @Body() dto: AcknowledgeWarningDto,
  ) {
    return this.service.acknowledgeWarning(id, adminId, dto.notes);
  }

  /**
   * Manually trigger warning detection
   */
  @Post('detect')
  @HttpCode(HttpStatus.OK)
  async triggerDetection() {
    return this.service.triggerDetection();
  }
}
