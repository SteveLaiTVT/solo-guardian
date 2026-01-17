/**
 * @file templates.service.ts
 * @description Service for email and SMS template operations with rendering
 * @task TASK-050
 * @design_state_version 3.8.0
 */
import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { TemplatesRepository } from './templates.repository';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  EmailTemplateResponseDto,
  CreateSmsTemplateDto,
  UpdateSmsTemplateDto,
  SmsTemplateResponseDto,
} from './dto';

interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

interface TemplateVariables {
  [key: string]: string | number | undefined;
}

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);

  constructor(private readonly templatesRepository: TemplatesRepository) {}

  async getAllEmailTemplates(): Promise<EmailTemplateResponseDto[]> {
    const templates = await this.templatesRepository.findAllEmailTemplates();
    return templates.map(this.mapEmailTemplateToResponse);
  }

  async getEmailTemplateById(id: string): Promise<EmailTemplateResponseDto> {
    const template = await this.templatesRepository.findEmailTemplateById(id);

    if (!template) {
      throw new NotFoundException('Email template not found');
    }

    return this.mapEmailTemplateToResponse(template);
  }

  async createEmailTemplate(
    dto: CreateEmailTemplateDto,
  ): Promise<EmailTemplateResponseDto> {
    const existing = await this.templatesRepository.findEmailTemplateByCodeAndLanguage(
      dto.code,
      dto.language,
    );

    if (existing) {
      throw new ConflictException(
        `Email template with code "${dto.code}" and language "${dto.language}" already exists`,
      );
    }

    const template = await this.templatesRepository.createEmailTemplate({
      code: dto.code,
      language: dto.language,
      subject: dto.subject,
      htmlContent: dto.htmlContent,
      textContent: dto.textContent,
      theme: dto.theme,
      variables: dto.variables,
    });

    this.logger.log(`Created email template: ${dto.code} (${dto.language})`);

    return this.mapEmailTemplateToResponse(template);
  }

  async updateEmailTemplate(
    id: string,
    dto: UpdateEmailTemplateDto,
  ): Promise<EmailTemplateResponseDto> {
    const existing = await this.templatesRepository.findEmailTemplateById(id);

    if (!existing) {
      throw new NotFoundException('Email template not found');
    }

    const template = await this.templatesRepository.updateEmailTemplate(id, {
      subject: dto.subject,
      htmlContent: dto.htmlContent,
      textContent: dto.textContent,
      theme: dto.theme,
      variables: dto.variables,
      isActive: dto.isActive,
    });

    this.logger.log(`Updated email template: ${template.code} (${template.language})`);

    return this.mapEmailTemplateToResponse(template);
  }

  async deleteEmailTemplate(id: string): Promise<void> {
    const existing = await this.templatesRepository.findEmailTemplateById(id);

    if (!existing) {
      throw new NotFoundException('Email template not found');
    }

    await this.templatesRepository.deleteEmailTemplate(id);
    this.logger.log(`Deleted email template: ${existing.code} (${existing.language})`);
  }

  async renderEmail(
    code: string,
    language: string,
    variables: TemplateVariables,
  ): Promise<RenderedEmail | null> {
    const template = await this.templatesRepository.findActiveEmailTemplate(code, language);

    if (!template) {
      this.logger.warn(`No active email template found for code: ${code}, language: ${language}`);
      return null;
    }

    return {
      subject: this.renderTemplate(template.subject, variables),
      html: this.renderTemplate(template.htmlContent, variables),
      text: this.renderTemplate(template.textContent, variables),
    };
  }

  async getAllSmsTemplates(): Promise<SmsTemplateResponseDto[]> {
    const templates = await this.templatesRepository.findAllSmsTemplates();
    return templates.map(this.mapSmsTemplateToResponse);
  }

  async getSmsTemplateById(id: string): Promise<SmsTemplateResponseDto> {
    const template = await this.templatesRepository.findSmsTemplateById(id);

    if (!template) {
      throw new NotFoundException('SMS template not found');
    }

    return this.mapSmsTemplateToResponse(template);
  }

  async createSmsTemplate(dto: CreateSmsTemplateDto): Promise<SmsTemplateResponseDto> {
    const existing = await this.templatesRepository.findSmsTemplateByCodeAndLanguage(
      dto.code,
      dto.language,
    );

    if (existing) {
      throw new ConflictException(
        `SMS template with code "${dto.code}" and language "${dto.language}" already exists`,
      );
    }

    const template = await this.templatesRepository.createSmsTemplate({
      code: dto.code,
      language: dto.language,
      content: dto.content,
      variables: dto.variables,
    });

    this.logger.log(`Created SMS template: ${dto.code} (${dto.language})`);

    return this.mapSmsTemplateToResponse(template);
  }

  async updateSmsTemplate(
    id: string,
    dto: UpdateSmsTemplateDto,
  ): Promise<SmsTemplateResponseDto> {
    const existing = await this.templatesRepository.findSmsTemplateById(id);

    if (!existing) {
      throw new NotFoundException('SMS template not found');
    }

    const template = await this.templatesRepository.updateSmsTemplate(id, {
      content: dto.content,
      variables: dto.variables,
      isActive: dto.isActive,
    });

    this.logger.log(`Updated SMS template: ${template.code} (${template.language})`);

    return this.mapSmsTemplateToResponse(template);
  }

  async deleteSmsTemplate(id: string): Promise<void> {
    const existing = await this.templatesRepository.findSmsTemplateById(id);

    if (!existing) {
      throw new NotFoundException('SMS template not found');
    }

    await this.templatesRepository.deleteSmsTemplate(id);
    this.logger.log(`Deleted SMS template: ${existing.code} (${existing.language})`);
  }

  async renderSms(
    code: string,
    language: string,
    variables: TemplateVariables,
  ): Promise<string | null> {
    const template = await this.templatesRepository.findActiveSmsTemplate(code, language);

    if (!template) {
      this.logger.warn(`No active SMS template found for code: ${code}, language: ${language}`);
      return null;
    }

    return this.renderTemplate(template.content, variables);
  }

  private renderTemplate(template: string, variables: TemplateVariables): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = variables[key];
      return value !== undefined ? String(value) : match;
    });
  }

  private mapEmailTemplateToResponse(template: {
    id: string;
    code: string;
    language: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    theme: string;
    variables: unknown;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): EmailTemplateResponseDto {
    return {
      id: template.id,
      code: template.code,
      language: template.language,
      subject: template.subject,
      htmlContent: template.htmlContent,
      textContent: template.textContent,
      theme: template.theme,
      variables: template.variables as string[],
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  private mapSmsTemplateToResponse(template: {
    id: string;
    code: string;
    language: string;
    content: string;
    variables: unknown;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): SmsTemplateResponseDto {
    return {
      id: template.id,
      code: template.code,
      language: template.language,
      content: template.content,
      variables: template.variables as string[],
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}
