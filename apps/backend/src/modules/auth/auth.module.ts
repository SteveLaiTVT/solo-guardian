import { Module } from '@nestjs/common';
// TODO(B): Import JwtModule from '@nestjs/jwt'
// TODO(B): Import ConfigModule, ConfigService from '@nestjs/config'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

/**
 * Auth module configuration
 *
 * TODO(B): Configure JwtModule
 * Requirements:
 * - Register JwtModule with async configuration
 * - Get JWT secret from ConfigService
 * - Set default expiration for access token (15m)
 */
@Module({
  imports: [
    // TODO(B): Add JwtModule.registerAsync configuration
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_ACCESS_SECRET'),
    //     signOptions: { expiresIn: '15m' },
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
