/**
 * @file app.module.ts
 * @description Root application module
 * @task TASK-000-5, TASK-006, TASK-015, TASK-021
 * @design_state_version 1.6.0
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { EmergencyContactsModule } from './modules/emergency-contacts/emergency-contacts.module';
import { UserPreferencesModule } from './modules/user-preferences/user-preferences.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    CheckInModule,
    EmergencyContactsModule,
    UserPreferencesModule,
  ],
})
export class AppModule {}
