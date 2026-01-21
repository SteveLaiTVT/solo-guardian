/**
 * @file auth.service.ts
 * @description Authentication service - handles login/register logic
 * @task TASK-001-C, TASK-003, TASK-004, TASK-046, TASK-054, TASK-081
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { RegisterDto, LoginDto, AuthResult, AuthTokens } from './dto';
import { AnalyticsService } from '../analytics';
import { detectIdentifierType, IdentifierType } from './utils';

const PRISMA_UNIQUE_CONSTRAINT_ERROR = 'P2002';

const BCRYPT_COST_FACTOR = 12;
const ACCESS_TOKEN_EXPIRES_IN = '7d';
const ACCESS_TOKEN_EXPIRES_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_EXPIRES_IN = '30d';
const REFRESH_TOKEN_EXPIRES_MS = 30 * 24 * 60 * 60 * 1000;

type UserRoleType = 'user' | 'caregiver' | 'admin' | 'super_admin';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Optional() private readonly analyticsService?: AnalyticsService,
  ) {}

  onModuleInit(): void {
    this.validateJwtSecrets();
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const duplicates = await this.authRepository.checkDuplicates({
      email: dto.email,
      username: dto.username,
      phone: dto.phone,
    });

    if (duplicates.hasDuplicateEmail) {
      this.logger.warn(`Registration attempt with existing email: ${dto.email}`);
      throw new ConflictException('Email already registered');
    }

    if (duplicates.hasDuplicateUsername) {
      this.logger.warn(
        `Registration attempt with existing username: ${dto.username}`,
      );
      throw new ConflictException('Username already taken');
    }

    if (duplicates.hasDuplicatePhone) {
      this.logger.warn(`Registration attempt with existing phone: ${dto.phone}`);
      throw new ConflictException('Phone number already registered');
    }

    const passwordHash = await this.hashPassword(dto.password);

    let user;
    try {
      user = await this.authRepository.createUser({
        email: dto.email,
        username: dto.username,
        phone: dto.phone,
        passwordHash,
        name: dto.name,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR
      ) {
        this.logger.warn('Registration race condition - duplicate identifier');
        throw new ConflictException('Identifier already registered');
      }
      throw error;
    }

    const role: UserRoleType = 'user';
    const tokens = await this.generateTokens(user.id, role);
    const refreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    const identifier = dto.email ?? dto.username ?? dto.phone;
    this.logger.log(`User registered: ${identifier} (role: ${role})`);

    if (this.analyticsService) {
      await this.analyticsService.trackRegister(user.id);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        name: user.name,
        role: role,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const identifierType = detectIdentifierType(dto.identifier);
    const user = await this.authRepository.findByIdentifier(dto.identifier);

    if (!user) {
      this.logger.warn(
        `Login failed - user not found: ${dto.identifier} (type: ${identifierType})`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      this.logger.warn(
        `Login failed - invalid password: ${dto.identifier} (type: ${identifierType})`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = user.role as UserRoleType;
    const tokens = await this.generateTokens(user.id, role);
    const refreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    const logIdentifier = user.email ?? user.username ?? user.phone ?? user.id;
    this.logger.log(
      `User logged in: ${logIdentifier} (type: ${identifierType}, role: ${role})`,
    );

    if (this.analyticsService) {
      await this.analyticsService.trackLogin(user.id);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        name: user.name,
        role: role,
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

    const role = consumedToken.user.role as UserRoleType;
    const tokens = await this.generateTokens(consumedToken.user.id, role);
    const newTokenHash = this.hashRefreshToken(tokens.refreshToken);

    await this.authRepository.saveRefreshToken({
      userId: consumedToken.user.id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS),
    });

    const logIdentifier =
      consumedToken.user.email ??
      consumedToken.user.username ??
      consumedToken.user.phone ??
      consumedToken.user.id;
    this.logger.log(`Token refreshed for user: ${logIdentifier}`);

    return {
      user: {
        id: consumedToken.user.id,
        email: consumedToken.user.email,
        username: consumedToken.user.username,
        phone: consumedToken.user.phone,
        avatar: consumedToken.user.avatar,
        name: consumedToken.user.name,
        role: role,
        createdAt: consumedToken.user.createdAt,
      },
      tokens,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashRefreshToken(refreshToken);
    await this.authRepository.deleteRefreshToken(tokenHash);
  }

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

  private async generateTokens(
    userId: string,
    role: UserRoleType = 'user',
  ): Promise<AuthTokens> {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');

    const jti = crypto.randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, role },
        { secret: accessSecret, expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      ),
      this.jwtService.signAsync(
        { sub: userId, jti },
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
