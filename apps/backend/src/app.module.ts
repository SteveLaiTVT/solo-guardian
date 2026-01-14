/**
 * @file app.module.ts
 * @description Root application module
 * @task TASK-000-5, TASK-006
 * @design_state_version 0.8.0
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CheckInModule } from './modules/check-in/check-in.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    CheckInModule,
  ],
})
export class AppModule {}
