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
  async getMyElders(@CurrentUser() user: JwtUser): Promise<ElderSummary[]> {
    return this.caregiverService.getMyElders(user.userId);
  }

  /**
   * Get list of caregivers for the current user (as elder)
   */
  @Get('caregivers')
  async getMyCaregivers(@CurrentUser() user: JwtUser): Promise<CaregiverSummary[]> {
    return this.caregiverService.getMyCaregivers(user.userId);
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
  ): Promise<ElderDetail> {
    return this.caregiverService.getElderDetail(user.userId, elderId);
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
  ): Promise<{ message: string }> {
    await this.caregiverService.inviteElder(user.userId, dto);
    return { message: 'Invitation sent' };
  }

  /**
   * Accept a caregiver invitation (as elder)
   */
  @Post('accept')
  async acceptCaregiver(
    @CurrentUser() user: JwtUser,
    @Body() dto: AcceptInvitationDto,
  ): Promise<{ message: string }> {
    await this.caregiverService.acceptCaregiver(user.userId, dto.caregiverId);
    return { message: 'Caregiver accepted' };
  }

  /**
   * Remove a caregiver (as elder)
   */
  @Delete('caregivers/:caregiverId')
  async removeCaregiver(
    @CurrentUser() user: JwtUser,
    @Param('caregiverId') caregiverId: string,
  ): Promise<{ message: string }> {
    await this.caregiverService.removeCaregiver(user.userId, caregiverId);
    return { message: 'Caregiver removed' };
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
  ): Promise<{ message: string }> {
    await this.caregiverService.removeElder(user.userId, elderId);
    return { message: 'Elder removed' };
  }

  // DONE(B): Invitation endpoints - TASK-058
  /**
   * Create an invitation (returns QR token)
   */
  @Post('invitations')
  async createInvitation(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateInvitationDto,
  ): Promise<InvitationResponseDto> {
    return this.caregiverService.createInvitation(user.userId, dto);
  }

  /**
   * Get invitation details (public - no auth required for viewing)
   */
  @Get('invitations/:token')
  async getInvitationDetails(@Param('token') token: string): Promise<InvitationDetailsDto> {
    return this.caregiverService.getInvitationDetails(token);
  }

  /**
   * Accept an invitation
   */
  @Post('invitations/:token/accept')
  async acceptInvitation(
    @CurrentUser() user: JwtUser,
    @Param('token') token: string,
  ): Promise<{ message: string }> {
    await this.caregiverService.acceptInvitation(token, user.userId);
    return { message: 'Invitation accepted' };
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
  ): Promise<{ checkInDate: string; checkedInAt: Date }> {
    return this.caregiverService.checkInOnBehalf(user.userId, elderId, dto.note);
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
  ): Promise<NoteResponseDto> {
    return this.caregiverService.addNote(user.userId, elderId, dto);
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
  ): Promise<NotesListResponseDto> {
    return this.caregiverService.getNotes(user.userId, elderId);
  }
}
