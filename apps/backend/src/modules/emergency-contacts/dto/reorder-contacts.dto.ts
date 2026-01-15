/**
 * @file reorder-contacts.dto.ts
 * @description DTO for reordering emergency contacts
 * @task TASK-015
 * @design_state_version 1.4.1
 */
import { IsArray, IsUUID, ArrayMaxSize } from 'class-validator';

export class ReorderContactsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMaxSize(5)
  contactIds: string[];
}
