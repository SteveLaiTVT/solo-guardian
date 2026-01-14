/**
 * @file check-in.controller.ts
 * @description Controller for check-in endpoints
 * @task TASK-006, TASK-007
 * @design_state_version 0.9.0
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CheckInService } from './check-in.service';
import {
  CreateCheckInDto,
  CheckInResponseDto,
  TodayCheckInStatusDto,
  CheckInHistoryDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/check-ins')
@UseGuards(JwtAuthGuard)
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async checkIn(
    @Body() dto: CreateCheckInDto,
    @CurrentUser() userId: string,
  ): Promise<CheckInResponseDto> {
    return this.checkInService.checkIn(userId, dto);
  }

  @Get('today')
  async getTodayStatus(
    @CurrentUser() userId: string,
  ): Promise<TodayCheckInStatusDto> {
    return this.checkInService.getTodayStatus(userId);
  }

  @Get()
  async getHistory(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 30,
    @CurrentUser() userId: string,
  ): Promise<CheckInHistoryDto> {
    return this.checkInService.getHistory(userId, page, pageSize);
  }
}
