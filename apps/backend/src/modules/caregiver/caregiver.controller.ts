/**
 * @file caregiver.controller.ts
 * @description Caregiver API controller
 * @task TASK-046, TASK-058, TASK-060, TASK-061
 * @design_state_version 3.8.0
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
  CreateInvitationDto,
  InvitationResponseDto,
  InvitationDetailsDto,
  CreateNoteDto,
  NoteResponseDto,
  NotesListResponseDto,
} from './dto';

interface ApiResponse<T> {
  success: true;
  data: T;
}

interface JwtUser {
  userId: string;
}

@Controller('api/v1/caregiver')
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

  // DONE(B): Invitation endpoints - TASK-058
  /**
   * Create an invitation (returns QR token)
   */
  @Post('invitations')
  async createInvitation(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateInvitationDto,
  ): Promise<ApiResponse<InvitationResponseDto>> {
    const invitation = await this.caregiverService.createInvitation(user.userId, dto);
    return { success: true, data: invitation };
  }

  /**
   * Get invitation details (public - no auth required for viewing)
   */
  @Get('invitations/:token')
  async getInvitationDetails(
    @Param('token') token: string,
  ): Promise<ApiResponse<InvitationDetailsDto>> {
    const details = await this.caregiverService.getInvitationDetails(token);
    return { success: true, data: details };
  }

  /**
   * Accept an invitation
   */
  @Post('invitations/:token/accept')
  async acceptInvitation(
    @CurrentUser() user: JwtUser,
    @Param('token') token: string,
  ): Promise<ApiResponse<{ message: string }>> {
    await this.caregiverService.acceptInvitation(token, user.userId);
    return { success: true, data: { message: 'Invitation accepted' } };
  }

  // DONE(B): Caretaker check-in endpoint - TASK-060
  /**
   * Check in on behalf of an elder (caretaker only)
   */
  @Post('elders/:elderId/check-in')
  @UseGuards(RolesGuard)
  @CaregiverOrAdmin()
  async checkInOnBehalf(
    @CurrentUser() user: JwtUser,
    @Param('elderId') elderId: string,
    @Body() dto: { note?: string },
  ): Promise<ApiResponse<{ checkInDate: string; checkedInAt: Date }>> {
    const result = await this.caregiverService.checkInOnBehalf(user.userId, elderId, dto.note);
    return { success: true, data: result };
  }

  // DONE(B): Caregiver notes endpoints - TASK-061
  /**
   * Add a note for an elder
   */
  @Post('elders/:elderId/notes')
  @UseGuards(RolesGuard)
  @CaregiverOrAdmin()
  async addNote(
    @CurrentUser() user: JwtUser,
    @Param('elderId') elderId: string,
    @Body() dto: CreateNoteDto,
  ): Promise<ApiResponse<NoteResponseDto>> {
    const note = await this.caregiverService.addNote(user.userId, elderId, dto);
    return { success: true, data: note };
  }

  /**
   * Get notes for an elder
   */
  @Get('elders/:elderId/notes')
  @UseGuards(RolesGuard)
  @CaregiverOrAdmin()
  async getNotes(
    @CurrentUser() user: JwtUser,
    @Param('elderId') elderId: string,
  ): Promise<ApiResponse<NotesListResponseDto>> {
    const result = await this.caregiverService.getNotes(user.userId, elderId);
    return { success: true, data: result };
  }
}
