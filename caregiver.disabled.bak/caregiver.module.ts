/**
 * @file caregiver.module.ts
 * @description Caregiver module configuration
 * @task TASK-046
 * @design_state_version 3.7.0
 */
import { Module } from '@nestjs/common';
import { CaregiverController } from './caregiver.controller';
import { CaregiverService } from './caregiver.service';
import { CaregiverRepository } from './caregiver.repository';
import { PrismaModule } from '../../prisma';

@Module({
  imports: [PrismaModule],
  controllers: [CaregiverController],
  providers: [CaregiverService, CaregiverRepository],
  exports: [CaregiverService],
})
export class CaregiverModule {}
