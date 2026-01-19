/**
 * @file oauth.module.ts
 * @description OAuth module configuration
 * @task TASK-038, TASK-039, TASK-040, TASK-095
 * @design_state_version 3.12.0
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthCodeStore } from './oauth-code.store';
import { GoogleOAuthProvider } from './google-oauth.provider';
import { AppleOAuthProvider } from './apple-oauth.provider';
import { AuthRepository } from '../auth.repository';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OAuthController],
  providers: [
    OAuthService,
    OAuthCodeStore,
    GoogleOAuthProvider,
    AppleOAuthProvider,
    AuthRepository,
  ],
  exports: [OAuthService],
})
export class OAuthModule {}
