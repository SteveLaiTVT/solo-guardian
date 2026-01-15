/**
 * @file emergency-contacts.controller.ts
 * @description Controller for emergency contacts endpoints
 * @task TASK-015
 * @design_state_version 1.4.1
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
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

  /**
   * TODO(B): Implement list all contacts endpoint
   * Requirements:
   * - Return all active (non-deleted) contacts for the current user
   * - Order by priority ascending
   * Acceptance:
   * - GET /api/v1/emergency-contacts returns array of contacts
   * Constraints:
   * - Only return contacts belonging to current user
   */
  @Get()
  async findAll(
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto[]> {
    return this.contactsService.findAll(userId);
  }

  /**
   * TODO(B): Implement get single contact endpoint
   * Requirements:
   * - Return contact by ID
   * - Throw NotFoundException if not found or doesn't belong to user
   * Acceptance:
   * - GET /api/v1/emergency-contacts/:id returns single contact
   * Constraints:
   * - Verify contact belongs to current user
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.findOne(id, userId);
  }

  /**
   * TODO(B): Implement create contact endpoint
   * Requirements:
   * - Validate max 5 contacts limit
   * - Validate email uniqueness within user's contacts
   * - Auto-assign priority if not provided
   * Acceptance:
   * - POST /api/v1/emergency-contacts creates new contact
   * - Returns 400 if limit reached or email duplicate
   * Constraints:
   * - Max 5 contacts per user
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateContactDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.create(userId, dto);
  }

  /**
   * TODO(B): Implement update contact endpoint
   * Requirements:
   * - Update contact fields (name, email, phone, isActive)
   * - Validate email uniqueness if changed
   * - Throw NotFoundException if contact not found
   * Acceptance:
   * - PUT /api/v1/emergency-contacts/:id updates contact
   * Constraints:
   * - Verify contact belongs to current user
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto> {
    return this.contactsService.update(id, userId, dto);
  }

  /**
   * TODO(B): Implement soft delete contact endpoint
   * Requirements:
   * - Set deletedAt timestamp instead of hard delete
   * - Do NOT reorder remaining contacts
   * Acceptance:
   * - DELETE /api/v1/emergency-contacts/:id soft-deletes contact
   * Constraints:
   * - Verify contact belongs to current user
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    return this.contactsService.remove(id, userId);
  }

  /**
   * TODO(B): Implement reorder contacts endpoint
   * Requirements:
   * - Accept array of contact IDs in new order
   * - Update priority (1, 2, 3...) based on array position
   * - Validate all IDs belong to current user
   * Acceptance:
   * - PUT /api/v1/emergency-contacts/reorder updates all priorities
   * Constraints:
   * - All contact IDs must exist and belong to user
   */
  @Put('reorder')
  async reorder(
    @Body() dto: ReorderContactsDto,
    @CurrentUser() userId: string,
  ): Promise<ContactResponseDto[]> {
    return this.contactsService.reorder(userId, dto.contactIds);
  }
}
