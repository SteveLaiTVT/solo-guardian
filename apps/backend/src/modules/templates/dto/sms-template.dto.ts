/**
 * @file sms-template.dto.ts
 * @description DTOs for SMS template operations
 * @task TASK-050
 * @design_state_version 3.8.0
 */
import { IsString, IsOptional, IsBoolean, IsArray, MaxLength, IsIn } from 'class-validator';

export class CreateSmsTemplateDto {
  @IsString()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsIn(['en', 'zh', 'ja'])
  language: string;

  @IsString()
  @MaxLength(320)
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];
}

export class UpdateSmsTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(320)
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SmsTemplateResponseDto {
  id: string;
  code: string;
  language: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
