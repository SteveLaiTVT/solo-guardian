/**
 * @file auth.repository.ts
 * @description Repository for authentication-related database operations
 * @task TASK-001-B
 * @design_state_version 0.2.0
 */
import { Injectable } from '@nestjs/common';
import { User, RefreshToken } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

export type UserWithoutPassword = Omit<User, 'passwordHash'>;
export type UserWithPassword = User;
export type RefreshTokenWithUser = RefreshToken & { user: UserWithoutPassword };

@Injectable()
export class AuthRepository {
  // DONE(B): Inject PrismaService - TASK-001-B
  constructor(private readonly prisma: PrismaService) {}

  // DONE(B): Implement findByEmail - TASK-001-B
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  // DONE(B): Implement findById - TASK-001-B
  async findById(id: string): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // DONE(B): Implement createUser - TASK-001-B
  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
  }): Promise<UserWithoutPassword> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        name: data.name,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // DONE(B): Implement saveRefreshToken - TASK-001-B
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

  // DONE(B): Implement findValidRefreshToken - TASK-001-B
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
            name: true,
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

  // DONE(B): Implement deleteRefreshToken - TASK-001-B
  async deleteRefreshToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }
}
