/**
 * @file early-warning.module.ts
 * @description Module for early warning system
 * @task TASK-100
 * @design_state_version 3.12.0
 */
import { Module } from '@nestjs/common';
import { EarlyWarningController } from './early-warning.controller';
import { EarlyWarningService } from './early-warning.service';
import { EarlyWarningRepository } from './early-warning.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EarlyWarningController],
  providers: [EarlyWarningService, EarlyWarningRepository],
  exports: [EarlyWarningService],
})
export class EarlyWarningModule {}
