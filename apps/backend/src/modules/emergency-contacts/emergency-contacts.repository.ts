/**
 * @file emergency-contacts.repository.ts
 * @description Repository for emergency contacts database operations
 * @task TASK-015, TASK-031, TASK-033, TASK-065
 * @design_state_version 3.9.0
 */
import { Injectable } from '@nestjs/common';
import { EmergencyContact, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type EmergencyContactWithLinkedUser = EmergencyContact & {
  linkedUser: { id: string; name: string } | null;
};

@Injectable()
export class EmergencyContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // DONE(B): Implemented findAllByUserId - TASK-015
  // DONE(B): Updated to include linkedUser - TASK-065
  async findAllByUserId(userId: string): Promise<EmergencyContactWithLinkedUser[]> {
    return this.prisma.emergencyContact.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        priority: 'asc',
      },
      include: {
        linkedUser: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // DONE(B): Implemented findById - TASK-015
  async findById(id: string): Promise<EmergencyContact | null> {
    return this.prisma.emergencyContact.findUnique({
      where: { id },
    });
  }

  // DONE(B): Implemented findByEmail - TASK-015
  async findByEmail(
    userId: string,
    email: string,
  ): Promise<EmergencyContact | null> {
    return this.prisma.emergencyContact.findFirst({
      where: {
        userId,
        email,
        deletedAt: null,
      },
    });
  }

  // DONE(B): Implemented countByUserId - TASK-015
  async countByUserId(userId: string): Promise<number> {
    return this.prisma.emergencyContact.count({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  // Get the maximum priority value for a user's active contacts
  async getMaxPriority(userId: string): Promise<number> {
    const result = await this.prisma.emergencyContact.aggregate({
      where: {
        userId,
        deletedAt: null,
      },
      _max: {
        priority: true,
      },
    });
    return result._max.priority ?? 0;
  }

  // DONE(B): Implemented create - TASK-015
  async create(data: {
    userId: string;
    name: string;
    email: string;
    phone?: string;
    priority: number;
  }): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.create({
      data: {
        userId: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        priority: data.priority,
      },
    });
  }

  // DONE(B): Implemented update - TASK-015
  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      priority?: number;
      isActive?: boolean;
    },
  ): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data,
    });
  }

  // DONE(B): Implemented softDelete - TASK-015
  async softDelete(id: string): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  // DONE(B): Implemented updatePriorities - TASK-015
  // Uses transaction to update priorities atomically
  async updatePriorities(
    updates: Array<{ id: string; priority: number }>,
  ): Promise<EmergencyContact[]> {
    if (updates.length === 0) {
      return [];
    }

    const ids = updates.map((u) => u.id);

    // Use transaction to update all priorities atomically
    // First set all to negative values to avoid unique constraint violations
    // Then set to final values
    await this.prisma.$transaction(async (tx) => {
      // Temporarily set priorities to negative values (offset by 1000)
      for (let i = 0; i < updates.length; i++) {
        await tx.emergencyContact.update({
          where: { id: updates[i].id },
          data: { priority: -(i + 1000) },
        });
      }
      // Now set to final values
      for (const update of updates) {
        await tx.emergencyContact.update({
          where: { id: update.id },
          data: { priority: update.priority },
        });
      }
    });

    // Return updated contacts in priority order
    return this.prisma.emergencyContact.findMany({
      where: { id: { in: ids } },
      orderBy: { priority: 'asc' },
    });
  }

  // ============================================================
  // Contact Verification - TASK-031, TASK-033
  // ============================================================

  /**
   * Find contact by verification token
   * DONE(B): Implement findByVerificationToken - TASK-033
   */
  async findByVerificationToken(
    token: string,
  ): Promise<(EmergencyContact & { user: { id: string; name: string } }) | null> {
    return this.prisma.emergencyContact.findFirst({
      where: { verificationToken: token },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
  }

  /**
   * Set verification token for a contact
   * DONE(B): Implement setVerificationToken - TASK-031
   */
  async setVerificationToken(
    id: string,
    token?: string,
  ): Promise<EmergencyContact> {
    const verificationToken = token ?? crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        verificationToken,
        verificationTokenExpiresAt: expiresAt,
      },
    });
  }

  /**
   * Mark contact as verified
   * DONE(B): Implement markVerified - TASK-033
   */
  async markVerified(id: string): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });
  }

  /**
   * Clear expired verification tokens
   * DONE(B): Implement clearExpiredTokens - TASK-033
   */
  async clearExpiredTokens(): Promise<number> {
    const result = await this.prisma.emergencyContact.updateMany({
      where: {
        verificationTokenExpiresAt: { lt: new Date() },
        verificationToken: { not: null },
      },
      data: {
        verificationToken: null,
        verificationTokenExpiresAt: null,
      },
    });

    return result.count;
  }

  // ============================================================
  // Phone Verification - TASK-036
  // ============================================================

  /**
   * Set phone verification OTP for a contact
   * DONE(B): Implemented setPhoneVerificationOtp - TASK-036
   * @task TASK-036
   */
  async setPhoneVerificationOtp(
    id: string,
    otpCode: string,
  ): Promise<EmergencyContact> {
    const OTP_EXPIRY_MINUTES = 10;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        phoneOtp: otpCode,
        phoneOtpExpiresAt: expiresAt,
      },
    });
  }

  /**
   * Mark phone as verified and clear OTP
   * DONE(B): Implemented markPhoneVerified - TASK-036
   * @task TASK-036
   */
  async markPhoneVerified(id: string): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        phoneVerified: true,
        phoneOtp: null,
        phoneOtpExpiresAt: null,
      },
    });
  }

  /**
   * Clear expired phone OTPs
   * DONE(B): Implemented clearExpiredPhoneOtps - TASK-036
   * @task TASK-036
   */
  async clearExpiredPhoneOtps(): Promise<number> {
    const result = await this.prisma.emergencyContact.updateMany({
      where: {
        phoneOtpExpiresAt: { lt: new Date() },
        phoneOtp: { not: null },
      },
      data: {
        phoneOtp: null,
        phoneOtpExpiresAt: null,
      },
    });

    return result.count;
  }

  // ============================================================
  // Linked Contact Methods - TASK-065
  // ============================================================

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async setInvitationToken(
    id: string,
    linkedUserId: string,
  ): Promise<EmergencyContact> {
    const INVITATION_EXPIRY_DAYS = 7;
    const invitationToken = crypto.randomUUID();

    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        linkedUserId,
        invitationToken,
        invitationSentAt: new Date(),
      },
    });
  }

  async findByInvitationToken(
    token: string,
  ): Promise<(EmergencyContact & { user: { id: string; name: string; email: string | null } }) | null> {
    return this.prisma.emergencyContact.findUnique({
      where: { invitationToken: token },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async acceptInvitation(id: string): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        invitationAcceptedAt: new Date(),
        invitationToken: null,
      },
    });
  }

  async findContactsWhereUserIsLinked(
    linkedUserId: string,
  ): Promise<(EmergencyContact & { user: { id: string; name: string; email: string | null } })[]> {
    return this.prisma.emergencyContact.findMany({
      where: {
        linkedUserId,
        invitationAcceptedAt: { not: null },
        deletedAt: null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        invitationAcceptedAt: 'desc',
      },
    });
  }

  async findPendingInvitationsForUser(
    linkedUserId: string,
  ): Promise<(EmergencyContact & { user: { id: string; name: string; email: string | null } })[]> {
    return this.prisma.emergencyContact.findMany({
      where: {
        linkedUserId,
        invitationSentAt: { not: null },
        invitationAcceptedAt: null,
        deletedAt: null,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        invitationSentAt: 'desc',
      },
    });
  }

  async clearInvitation(id: string): Promise<EmergencyContact> {
    return this.prisma.emergencyContact.update({
      where: { id },
      data: {
        linkedUserId: null,
        invitationToken: null,
        invitationSentAt: null,
        invitationAcceptedAt: null,
      },
    });
  }

  async findByIdWithLinkedUser(
    id: string,
  ): Promise<EmergencyContactWithLinkedUser | null> {
    return this.prisma.emergencyContact.findUnique({
      where: { id },
      include: {
        linkedUser: {
          select: { id: true, name: true },
        },
      },
    });
  }
}
