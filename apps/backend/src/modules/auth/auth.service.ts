/**
 * @file auth.service.ts
 * @description Authentication service - handles login/register logic
 * @task TASK-001-C, TASK-003, TASK-004
 * @design_state_version 0.6.0
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
  OnModuleInit,
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
export class AuthService implements OnModuleInit {
  // DONE(B): Add NestJS Logger - TASK-003
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // DONE(B): Validate JWT secrets on startup - TASK-004
  onModuleInit(): void {
    this.validateJwtSecrets();
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      this.logger.warn(`Registration attempt with existing email: ${dto.email}`);
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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR
      ) {
        this.logger.warn(`Registration race condition - duplicate email: ${dto.email}`);
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

    this.logger.log(`User registered: ${user.email}`);

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

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`Login failed - user not found: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      this.logger.warn(`Login failed - invalid password: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);
    const refreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    this.logger.log(`User logged in: ${user.email}`);

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

  async refreshTokens(refreshToken: string): Promise<AuthResult> {
    const tokenHash = this.hashRefreshToken(refreshToken);

    const consumedToken =
      await this.authRepository.consumeRefreshToken(tokenHash);

    if (!consumedToken) {
      this.logger.warn('Token refresh failed - invalid or expired token');
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.generateTokens(consumedToken.user.id);
    const newTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: consumedToken.user.id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    this.logger.log(`Token refreshed for user: ${consumedToken.user.email}`);

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

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashRefreshToken(refreshToken);
    await this.authRepository.deleteRefreshToken(tokenHash);
  }

  // DONE(B): Validate JWT secrets on module init - TASK-004
  private validateJwtSecrets(): void {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!accessSecret) {
      throw new Error(
        'JWT_ACCESS_SECRET is not configured. ' +
          'Please set it in your environment variables.',
      );
    }

    if (!refreshSecret) {
      throw new Error(
        'JWT_REFRESH_SECRET is not configured. ' +
          'Please set it in your environment variables.',
      );
    }

    this.logger.log('JWT secrets validated successfully');
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_COST_FACTOR);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

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

  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
