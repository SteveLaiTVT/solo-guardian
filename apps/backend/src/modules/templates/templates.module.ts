/**
 * @file templates.module.ts
 * @description Module for email and SMS template management
 * @task TASK-050
 * @design_state_version 3.8.0
 */
import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { TemplatesRepository } from './templates.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, TemplatesRepository],
  exports: [TemplatesService],
})
export class TemplatesModule {}
