/**
 * @file templates.repository.ts
 * @description Repository for email and SMS template database operations
 * @task TASK-050
 * @design_state_version 3.8.0
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { EmailTemplate, SmsTemplate } from '@prisma/client';

interface CreateEmailTemplateData {
  code: string;
  language: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  theme?: string;
  variables?: string[];
}

interface UpdateEmailTemplateData {
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  theme?: string;
  variables?: string[];
  isActive?: boolean;
}

interface CreateSmsTemplateData {
  code: string;
  language: string;
  content: string;
  variables?: string[];
}

interface UpdateSmsTemplateData {
  content?: string;
  variables?: string[];
  isActive?: boolean;
}

@Injectable()
export class TemplatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllEmailTemplates(): Promise<EmailTemplate[]> {
    return this.prisma.emailTemplate.findMany({
      orderBy: [{ code: 'asc' }, { language: 'asc' }],
    });
  }

  async findEmailTemplateById(id: string): Promise<EmailTemplate | null> {
    return this.prisma.emailTemplate.findUnique({ where: { id } });
  }

  async findEmailTemplateByCodeAndLanguage(
    code: string,
    language: string,
  ): Promise<EmailTemplate | null> {
    return this.prisma.emailTemplate.findUnique({
      where: { code_language: { code, language } },
    });
  }

  async findActiveEmailTemplate(
    code: string,
    language: string,
  ): Promise<EmailTemplate | null> {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { code_language: { code, language }, isActive: true },
    });

    if (!template && language !== 'en') {
      return this.prisma.emailTemplate.findUnique({
        where: { code_language: { code, language: 'en' }, isActive: true },
      });
    }

    return template;
  }

  async createEmailTemplate(data: CreateEmailTemplateData): Promise<EmailTemplate> {
    return this.prisma.emailTemplate.create({
      data: {
        code: data.code,
        language: data.language,
        subject: data.subject,
        htmlContent: data.htmlContent,
        textContent: data.textContent,
        theme: data.theme ?? 'standard',
        variables: data.variables ?? [],
      },
    });
  }

  async updateEmailTemplate(
    id: string,
    data: UpdateEmailTemplateData,
  ): Promise<EmailTemplate> {
    return this.prisma.emailTemplate.update({
      where: { id },
      data,
    });
  }

  async deleteEmailTemplate(id: string): Promise<void> {
    await this.prisma.emailTemplate.delete({ where: { id } });
  }

  async findAllSmsTemplates(): Promise<SmsTemplate[]> {
    return this.prisma.smsTemplate.findMany({
      orderBy: [{ code: 'asc' }, { language: 'asc' }],
    });
  }

  async findSmsTemplateById(id: string): Promise<SmsTemplate | null> {
    return this.prisma.smsTemplate.findUnique({ where: { id } });
  }

  async findSmsTemplateByCodeAndLanguage(
    code: string,
    language: string,
  ): Promise<SmsTemplate | null> {
    return this.prisma.smsTemplate.findUnique({
      where: { code_language: { code, language } },
    });
  }

  async findActiveSmsTemplate(
    code: string,
    language: string,
  ): Promise<SmsTemplate | null> {
    const template = await this.prisma.smsTemplate.findUnique({
      where: { code_language: { code, language }, isActive: true },
    });

    if (!template && language !== 'en') {
      return this.prisma.smsTemplate.findUnique({
        where: { code_language: { code, language: 'en' }, isActive: true },
      });
    }

    return template;
  }

  async createSmsTemplate(data: CreateSmsTemplateData): Promise<SmsTemplate> {
    return this.prisma.smsTemplate.create({
      data: {
        code: data.code,
        language: data.language,
        content: data.content,
        variables: data.variables ?? [],
      },
    });
  }

  async updateSmsTemplate(
    id: string,
    data: UpdateSmsTemplateData,
  ): Promise<SmsTemplate> {
    return this.prisma.smsTemplate.update({
      where: { id },
      data,
    });
  }

  async deleteSmsTemplate(id: string): Promise<void> {
    await this.prisma.smsTemplate.delete({ where: { id } });
  }
}
