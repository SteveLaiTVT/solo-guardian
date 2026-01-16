// ============================================================
// Email Module - Email sending infrastructure
// @task TASK-025
// @design_state_version 1.8.0
// ============================================================

import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Email Module - Provides email sending capabilities
 * DONE(B): Module setup complete - TASK-025
 */
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
