/**
 * @file auth.repository.ts
 * @description Repository for authentication-related database operations
 * @task TASK-001-B, TASK-080
 */
import { Injectable } from '@nestjs/common';
import { User, RefreshToken, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IdentifierType,
  detectIdentifierType,
  normalizeIdentifier,
} from './utils';

const PRISMA_RECORD_NOT_FOUND = 'P2025';

export type UserWithoutPassword = Omit<User, 'passwordHash'>;
export type UserWithPassword = User;
export type RefreshTokenWithUser = RefreshToken & { user: UserWithoutPassword };

export interface DuplicateCheckResult {
  hasDuplicateEmail: boolean;
  hasDuplicateUsername: boolean;
  hasDuplicatePhone: boolean;
}

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findByUsername(username: string): Promise<UserWithPassword | null> {
    return this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });
  }

  async findByPhone(phone: string): Promise<UserWithPassword | null> {
    const normalizedPhone = phone.replace(/\s|-/g, '');
    return this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
  }

  async findByIdentifier(identifier: string): Promise<UserWithPassword | null> {
    const identifierType = detectIdentifierType(identifier);
    const normalized = normalizeIdentifier(identifier, identifierType);

    switch (identifierType) {
      case IdentifierType.UID:
        return this.prisma.user.findUnique({ where: { id: normalized } });
      case IdentifierType.EMAIL:
        return this.prisma.user.findUnique({ where: { email: normalized } });
      case IdentifierType.PHONE:
        return this.prisma.user.findUnique({ where: { phone: normalized } });
      case IdentifierType.USERNAME:
        return this.prisma.user.findUnique({ where: { username: normalized } });
      default:
        return null;
    }
  }

  async checkDuplicates(data: {
    email?: string;
    username?: string;
    phone?: string;
  }): Promise<DuplicateCheckResult> {
    const orConditions: Prisma.UserWhereInput[] = [];

    if (data.email) {
      orConditions.push({ email: data.email.toLowerCase() });
    }
    if (data.username) {
      orConditions.push({ username: data.username.toLowerCase() });
    }
    if (data.phone) {
      orConditions.push({ phone: data.phone.replace(/\s|-/g, '') });
    }

    if (orConditions.length === 0) {
      return {
        hasDuplicateEmail: false,
        hasDuplicateUsername: false,
        hasDuplicatePhone: false,
      };
    }

    const existingUsers = await this.prisma.user.findMany({
      where: { OR: orConditions },
      select: { email: true, username: true, phone: true },
    });

    const normalizedEmail = data.email?.toLowerCase();
    const normalizedUsername = data.username?.toLowerCase();
    const normalizedPhone = data.phone?.replace(/\s|-/g, '');

    return {
      hasDuplicateEmail:
        !!normalizedEmail &&
        existingUsers.some((u) => u.email === normalizedEmail),
      hasDuplicateUsername:
        !!normalizedUsername &&
        existingUsers.some((u) => u.username === normalizedUsername),
      hasDuplicatePhone:
        !!normalizedPhone &&
        existingUsers.some((u) => u.phone === normalizedPhone),
    };
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        name: true,
        avatar: true,
        birthYear: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createUser(data: {
    email?: string;
    username?: string;
    phone?: string;
    passwordHash: string;
    name: string;
  }): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email?.toLowerCase() ?? null,
        username: data.username?.toLowerCase() ?? null,
        phone: data.phone?.replace(/\s|-/g, '') ?? null,
        passwordHash: data.passwordHash,
        name: data.name,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async saveRefreshToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findValidRefreshToken(
    tokenHash: string,
  ): Promise<RefreshTokenWithUser | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            phone: true,
            name: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!token || token.expiresAt < new Date()) {
      return null;
    }

    return token as RefreshTokenWithUser;
  }

  async deleteRefreshToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }

  async consumeRefreshToken(
    tokenHash: string,
  ): Promise<RefreshTokenWithUser | null> {
    try {
      const token = await this.prisma.refreshToken.delete({
        where: { tokenHash },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              phone: true,
              name: true,
              role: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      if (token.expiresAt < new Date()) {
        return null;
      }

      return token as RefreshTokenWithUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_RECORD_NOT_FOUND
      ) {
        return null;
      }
      throw error;
    }
  }
}
