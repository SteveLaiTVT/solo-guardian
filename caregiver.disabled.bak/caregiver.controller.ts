/**
 * @file caregiver.controller.ts
 * @description Caregiver API controller
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CaregiverOrAdmin } from '../auth/decorators';
import { CurrentUser } from '../auth/decorators';
import { CaregiverService } from './caregiver.service';
import {
  ElderSummary,
  ElderDetail,
  CaregiverSummary,
  InviteElderDto,
  AcceptInvitationDto,
} from './dto';

interface ApiResponse<T> {
  success: true;
  data: T;
}

interface JwtUser {
  userId: string;
}

@Controller('caregiver')
@UseGuards(JwtAuthGuard)
export class CaregiverController {
  constructor(private readonly caregiverService: CaregiverService) {}

  /**
   * Get list of elders the caregiver is caring for
   */
  @Get('elders')
  @UseGuards(RolesGuard)
  @CaregiverOrAdmin()
  async getMyElders(
    @CurrentUser() user: JwtUser,
  ): Promise<ApiResponse<ElderSummary[]>> {
    const elders = await this.caregiverService.getMyElders(user.userId);
    return { success: true, data: elders };
  }

  /**
   * Get list of caregivers for the current user (as elder)
   */
  @Get('caregivers')
  async getMyCaregivers(
    @CurrentUser() user: JwtUser,
  ): Promise<ApiResponse<CaregiverSummary[]>> {
    const caregivers = await this.caregiverService.getMyCaregivers(user.userId);
    return { success: true, data: caregivers };
  }

  /**
   * Get detailed info about an elder
   */
  @Get('elders/:elderId')
  @UseGuards(RolesGuard)
  @CaregiverOrAdmin()
  async getElderDetail(
    @CurrentUser() user: JwtUser,
    @Param('elderId') elderId: string,
  ): Promise<ApiResponse<ElderDetail>> {
    const elder = await this.caregiverService.getElderDetail(user.userId, elderId);
    return { success: true, data: elder };
  }

  /**
   * Invite an elder to be cared for
   */
  @Post('invite')
  @UseGuards(RolesGuard)
  @CaregiverOrAdmin()
  async inviteElder(
    @CurrentUser() user: JwtUser,
    @Body() dto: InviteElderDto,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.caregiverService.inviteElder(user.userId, dto);
    return { success: true, data: { message: 'Invitation sent' } };
  }

  /**
   * Accept a caregiver invitation (as elder)
   */
  @Post('accept')
  async acceptCaregiver(
    @CurrentUser() user: JwtUser,
    @Body() dto: AcceptInvitationDto,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.caregiverService.acceptCaregiver(user.userId, dto.caregiverId);
    return { success: true, data: { message: 'Caregiver accepted' } };
  }

  /**
   * Remove a caregiver (as elder)
   */
  @Delete('caregivers/:caregiverId')
  async removeCaregiver(
    @CurrentUser() user: JwtUser,
    @Param('caregiverId') caregiverId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.caregiverService.removeCaregiver(user.userId, caregiverId);
    return { success: true, data: { message: 'Caregiver removed' } };
  }

  /**
   * Remove an elder (as caregiver)
   */
  @Delete('elders/:elderId')
  @UseGuards(RolesGuard)
  @CaregiverOrAdmin()
  async removeElder(
    @CurrentUser() user: JwtUser,
    @Param('elderId') elderId: string,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.caregiverService.removeElder(user.userId, elderId);
    return { success: true, data: { message: 'Elder removed' } };
  }
}
