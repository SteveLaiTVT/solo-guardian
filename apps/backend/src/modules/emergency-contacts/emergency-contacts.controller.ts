/**
 * @file emergency-contacts.controller.ts
 * @description Controller for emergency contacts endpoints
 * @task TASK-015, TASK-031, TASK-033
 * @design_state_version 2.0.0
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
} from '@nestjs/common';
import { EmergencyContactsService } from './emergency-contacts.service';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactResponseDto,
  ReorderContactsDto,
} from './dto';
import { CurrentUser } from '@/modules/auth/decorators';
import { JwtAuthGuard } from '@/modules/auth/guards';

@Controller('api/v1/emergency-contacts')
@UseGuards(JwtAuthGuard)
export class EmergencyContactsController {
  constructor(private readonly contactsService: EmergencyContactsService) {}

  // DONE(B): Implemented list all contacts endpoint - TASK-015
  @Get()
  async findAll(
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto[]> {
    return this.contactsService.findAll(userId);
  }

  // DONE(B): Implemented get single contact endpoint - TASK-015
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.findOne(id, userId);
  }

  // DONE(B): Implemented create contact endpoint - TASK-015
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateContactDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.create(userId, dto);
  }

  // DONE(B): Implemented reorder contacts endpoint - TASK-015
  // NOTE: Must be before @Put(':id') to avoid route shadowing
  @Put('reorder')
  async reorder(
    @Body() dto: ReorderContactsDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto[]> {
    return this.contactsService.reorder(userId, dto.contactIds);
  }

  // DONE(B): Implemented update contact endpoint - TASK-015
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.update(id, userId, dto);
  }

  // DONE(B): Implemented soft delete contact endpoint - TASK-015
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.contactsService.remove(id, userId);
  }

  // ============================================================
  // Contact Verification Endpoints - TASK-031, TASK-033
  // ============================================================

  /**
   * Send verification email to contact
   * POST /api/v1/emergency-contacts/:id/send-verification
   * DONE(B): Implemented sendVerification endpoint - TASK-031
   */
  @Post(':id/send-verification')
  @HttpCode(HttpStatus.OK)
  async sendVerification(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.sendVerification(id, userId);
  }

  /**
   * Resend verification email to contact
   * POST /api/v1/emergency-contacts/:id/resend-verification
   * DONE(B): Implemented resendVerification endpoint - TASK-031
   */
  @Post(':id/resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.resendVerification(id, userId);
  }
}

// ============================================================
// Public Verification Controller - TASK-033
// No authentication required
// ============================================================

/**
 * DONE(B): Created VerifyContactController - TASK-033
 * Route: /api/v1/verify-contact
 * No authentication required (public endpoint)
 */
@Controller('api/v1/verify-contact')
export class VerifyContactController {
  constructor(private readonly contactsService: EmergencyContactsService) {}

  /**
   * Verify contact via token
   * GET /api/v1/verify-contact?token=xxx
   * DONE(B): Implemented verify endpoint - TASK-033
   */
  @Get()
  async verify(
    @Query('token') token: string,
  ): Promise<{ success: boolean; contactName: string; userName: string }> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    return this.contactsService.verifyContact(token);
  }
}
