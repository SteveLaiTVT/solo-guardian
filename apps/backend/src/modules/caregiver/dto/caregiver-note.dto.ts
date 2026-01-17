/**
 * @file caregiver-note.dto.ts
 * @description DTOs for caregiver notes
 * @task TASK-061
 * @design_state_version 3.8.0
 */
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MaxLength(1000)
  content: string;

  @IsString()
  @IsOptional()
  noteDate?: string;
}

export class NoteResponseDto {
  id: string;
  content: string;
  noteDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NotesListResponseDto {
  notes: NoteResponseDto[];
  total: number;
}
