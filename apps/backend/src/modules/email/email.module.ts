// ============================================================
// Email Module - Email sending infrastructure
// @task TASK-025, TASK-051
// @design_state_version 3.8.0
// ============================================================

import { Module, forwardRef } from '@nestjs/common';
import { EmailService } from './email.service';
import { TemplatesModule } from '../templates';

/**
 * Email Module - Provides email sending capabilities
 * DONE(B): Module setup complete - TASK-025
 * DONE(B): Added TemplatesModule import - TASK-051
 */
@Module({
  imports: [forwardRef(() => TemplatesModule)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
