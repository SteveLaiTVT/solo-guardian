/**
 * @file email-template.dto.ts
 * @description DTOs for email template operations
 * @task TASK-050
 * @design_state_version 3.8.0
 */
import { IsString, IsOptional, IsBoolean, IsArray, MaxLength, IsIn } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsString()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsIn(['en', 'zh', 'ja'])
  language: string;

  @IsString()
  @MaxLength(200)
  subject: string;

  @IsString()
  htmlContent: string;

  @IsString()
  textContent: string;

  @IsOptional()
  @IsString()
  @IsIn(['standard', 'warm'])
  theme?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];
}

export class UpdateEmailTemplateDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsOptional()
  @IsString()
  htmlContent?: string;

  @IsOptional()
  @IsString()
  textContent?: string;

  @IsOptional()
  @IsString()
  @IsIn(['standard', 'warm'])
  theme?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class EmailTemplateResponseDto {
  id: string;
  code: string;
  language: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  theme: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
