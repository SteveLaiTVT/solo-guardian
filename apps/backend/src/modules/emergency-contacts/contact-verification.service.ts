/**
 * @file contact-verification.service.ts
 * @description Service for emergency contact verification logic
 * @task TASK-031, TASK-033
 * @design_state_version 2.0.0
 */
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import { ContactResponseDto } from './dto';
import { EmailService } from '../email';
import { PrismaService } from '../../prisma/prisma.service';
import type { EmergencyContact } from '@prisma/client';

@Injectable()
export class ContactVerificationService {
  private readonly logger = new Logger(ContactVerificationService.name);

  constructor(
    private readonly contactsRepository: EmergencyContactsRepository,
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
  ) {}

  async sendVerification(
    contactId: string,
    userId: string,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactsRepository.findById(contactId);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    if (contact.isVerified) {
      throw new BadRequestException('Contact is already verified');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedContact = await this.contactsRepository.setVerificationToken(contactId);

    const emailSent = await this.emailService.sendVerificationEmail(
      contact.email,
      contact.name,
      user.name,
      updatedContact.verificationToken!,
    );

    if (!emailSent) {
      this.logger.error(`Failed to send verification email to ${contact.email}`);
    }

    this.logger.log(`Verification email sent to contact ${contactId}`);
    return this.mapToResponse(updatedContact);
  }

  async resendVerification(
    contactId: string,
    userId: string,
  ): Promise<ContactResponseDto> {
    const contact = await this.contactsRepository.findById(contactId);
    if (!contact || contact.userId !== userId || contact.deletedAt) {
      throw new NotFoundException('Contact not found');
    }

    if (contact.isVerified) {
      throw new BadRequestException('Contact is already verified');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedContact = await this.contactsRepository.setVerificationToken(contactId);

    const emailSent = await this.emailService.sendVerificationEmail(
      contact.email,
      contact.name,
      user.name,
      updatedContact.verificationToken!,
    );

    if (!emailSent) {
      this.logger.error(`Failed to resend verification email to ${contact.email}`);
    }

    this.logger.log(`Verification email resent to contact ${contactId}`);
    return this.mapToResponse(updatedContact);
  }

  async verifyContact(token: string): Promise<{
    success: boolean;
    contactName: string;
    userName: string;
  }> {
    const contact = await this.contactsRepository.findByVerificationToken(token);

    if (!contact) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (!contact.verificationTokenExpiresAt || contact.verificationTokenExpiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.contactsRepository.markVerified(contact.id);
    this.logger.log(`Contact ${contact.id} verified successfully`);

    return {
      success: true,
      contactName: contact.name,
      userName: contact.user.name,
    };
  }

  private mapToResponse(contact: EmergencyContact): ContactResponseDto {
    return {
      id: contact.id,
      userId: contact.userId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      priority: contact.priority,
      isVerified: contact.isVerified,
      isActive: contact.isActive,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    };
  }
}
