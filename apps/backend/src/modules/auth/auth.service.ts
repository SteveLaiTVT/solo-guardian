/**
 * @file auth.service.ts
 * @description Authentication service - handles login/register logic
 * @task TASK-001-C
 * @design_state_version 0.2.0
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { RegisterDto, LoginDto, AuthResult, AuthTokens } from './dto';

const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002';

const BCRYPT_COST_FACTOR = 12;
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60;
const REFRESH_TOKEN_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  // DONE(B): Inject JwtService and ConfigService - TASK-001-C
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // DONE(B): Implement register - TASK-001-C
  // FIX: Handle unique constraint race condition
  async register(dto: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.hashPassword(dto.password);

    let user;
    try {
      user = await this.authRepository.createUser({
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name,
      });
    } catch (error) {
      // Handle race condition: concurrent registration with same email
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR
      ) {
        throw new ConflictException('Email already registered');
      }
      throw error;
    }

    const tokens = await this.generateTokens(user.id);
    const refreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  // DONE(B): Implement login - TASK-001-C
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);
    const refreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  // DONE(B): Implement refreshTokens - TASK-001-C
  // FIX: Use atomic consume to prevent race condition token reuse
  async refreshTokens(refreshToken: string): Promise<AuthResult> {
    const tokenHash = this.hashRefreshToken(refreshToken);

    // Atomic delete + return: prevents race condition where two concurrent
    // requests could both read the same token before either deletes it
    const consumedToken =
      await this.authRepository.consumeRefreshToken(tokenHash);

    if (!consumedToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.generateTokens(consumedToken.user.id);
    const newTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: consumedToken.user.id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    return {
      user: {
        id: consumedToken.user.id,
        email: consumedToken.user.email,
        name: consumedToken.user.name,
        createdAt: consumedToken.user.createdAt,
      },
      tokens,
    };
  }

  // DONE(B): Implement logout - TASK-001-C
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashRefreshToken(refreshToken);
    await this.authRepository.deleteRefreshToken(tokenHash);
  }

  // DONE(B): Implement hashPassword - TASK-001-C
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_COST_FACTOR);
  }

  // DONE(B): Implement verifyPassword - TASK-001-C
  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // DONE(B): Implement generateTokens - TASK-001-C
  private async generateTokens(userId: string): Promise<AuthTokens> {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        { secret: accessSecret, expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        { secret: refreshSecret, expiresIn: REFRESH_TOKEN_EXPIRES_IN },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_SECONDS,
    };
  }

  // DONE(B): Implement hashRefreshToken - TASK-001-C
  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
