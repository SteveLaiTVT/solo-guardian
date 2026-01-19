/**
 * @file emergency-contacts.controller.ts
 * @description Controller for emergency contacts endpoints
 * @task TASK-015, TASK-031, TASK-033, TASK-036, TASK-067, TASK-068, TASK-069, TASK-096
 * @design_state_version 3.12.0
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { EmergencyContactsService, LinkedContactInfo, PendingInvitationInfo } from './emergency-contacts.service';
import { ContactVerificationService } from './contact-verification.service';
import { PhoneVerificationService } from './phone-verification.service';
import { EmailService } from '../email/email.service';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactResponseDto,
  ReorderContactsDto,
  VerifyPhoneDto,
} from './dto';
import { CurrentUser } from '@/modules/auth/decorators';
import { JwtAuthGuard } from '@/modules/auth/guards';

@Controller('api/v1/emergency-contacts')
@UseGuards(JwtAuthGuard)
export class EmergencyContactsController {
  constructor(
    private readonly contactsService: EmergencyContactsService,
    private readonly verificationService: ContactVerificationService,
    private readonly phoneVerificationService: PhoneVerificationService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
  ) {}

  @Get()
  async findAll(@CurrentUser() userId: string): Promise<ContactResponseDto[]> {
    return this.contactsService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.findOne(id, userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateContactDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    const result = await this.contactsService.create(userId, dto);
    return result.contact;
  }

  @Put('reorder')
  async reorder(
    @Body() dto: ReorderContactsDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto[]> {
    return this.contactsService.reorder(userId, dto.contactIds);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    const result = await this.contactsService.update(id, userId, dto);
    return result.contact;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.contactsService.remove(id, userId);
  }

  @Post(':id/send-verification')
  @HttpCode(HttpStatus.OK)
  async sendVerification(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.verificationService.sendVerification(id, userId);
  }

  @Post(':id/resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.verificationService.resendVerification(id, userId);
  }

  // ============================================================
  // Phone Verification Endpoints - TASK-036
  // ============================================================

  /**
   * Send phone verification OTP
   * DONE(B): Implemented sendPhoneVerification endpoint - TASK-036
   * DONE(B): Added rate limiting - 3 requests per 10 minutes - TASK-096
   * @task TASK-036, TASK-096
   */
  @Post(':id/send-phone-verification')
  @HttpCode(HttpStatus.OK)
  @Throttle({ long: { ttl: 600000, limit: 3 } })
  async sendPhoneVerification(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.phoneVerificationService.sendPhoneVerification(id, userId);
  }

  /**
   * Verify phone number with OTP
   * DONE(B): Implemented verifyPhone endpoint - TASK-036
   * DONE(B): Added rate limiting - 3 requests per 10 minutes - TASK-096
   * @task TASK-036, TASK-096
   */
  @Post(':id/verify-phone')
  @HttpCode(HttpStatus.OK)
  @Throttle({ long: { ttl: 600000, limit: 3 } })
  async verifyPhone(
    @Param('id') id: string,
    @Body() dto: VerifyPhoneDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.phoneVerificationService.verifyPhone(id, userId, dto.otpCode);
  }

  /**
   * Resend phone verification OTP
   * DONE(B): Implemented resendPhoneVerification endpoint - TASK-036
   * DONE(B): Added rate limiting - 3 requests per 10 minutes - TASK-096
   * @task TASK-036, TASK-096
   */
  @Post(':id/resend-phone-verification')
  @HttpCode(HttpStatus.OK)
  @Throttle({ long: { ttl: 600000, limit: 3 } })
  async resendPhoneVerification(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.phoneVerificationService.resendPhoneVerification(id, userId);
  }

  // ============================================================
  // Linked Contact Endpoints - TASK-068, TASK-069
  // ============================================================

  @Get('linked')
  async getLinkedContacts(@CurrentUser() userId: string): Promise<LinkedContactInfo[]> {
    return this.contactsService.getLinkedContacts(userId);
  }

  @Get('linked/pending')
  async getPendingInvitations(@CurrentUser() userId: string): Promise<PendingInvitationInfo[]> {
    return this.contactsService.getPendingInvitations(userId);
  }
}

@Controller('api/v1/verify-contact')
export class VerifyContactController {
  constructor(private readonly verificationService: ContactVerificationService) {}

  @Get()
  async verify(
    @Query('token') token: string,
  ): Promise<{ success: boolean; contactName: string; userName: string }> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    return this.verificationService.verifyContact(token);
  }
}

@Controller('api/v1/emergency-contacts/link')
export class ContactLinkController {
  constructor(private readonly contactsService: EmergencyContactsService) {}

  @Get(':token')
  async getInvitationDetails(
    @Param('token') token: string,
  ): Promise<{ contactId: string; elderName: string; elderEmail: string | null; contactName: string } | null> {
    const details = await this.contactsService.getInvitationDetails(token);
    if (!details) {
      throw new BadRequestException('Invalid or expired invitation');
    }
    return details;
  }

  @Post(':token/accept')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async acceptInvitation(
    @Param('token') token: string,
    @CurrentUser() userId: string,
  ): Promise<{ success: boolean; elderName: string }> {
    return this.contactsService.acceptInvitation(token, userId);
  }
}
