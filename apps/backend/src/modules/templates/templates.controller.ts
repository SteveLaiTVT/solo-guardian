/**
 * @file templates.controller.ts
 * @description Admin controller for email and SMS template management
 * @task TASK-050
 * @design_state_version 3.8.0
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TemplatesService } from './templates.service';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  EmailTemplateResponseDto,
  CreateSmsTemplateDto,
  UpdateSmsTemplateDto,
  SmsTemplateResponseDto,
} from './dto';

@Controller('api/v1/admin/templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get('email')
  async getAllEmailTemplates(): Promise<{
    success: true;
    data: EmailTemplateResponseDto[];
  }> {
    const templates = await this.templatesService.getAllEmailTemplates();
    return { success: true, data: templates };
  }

  @Get('email/:id')
  async getEmailTemplateById(
    @Param('id') id: string,
  ): Promise<{ success: true; data: EmailTemplateResponseDto }> {
    const template = await this.templatesService.getEmailTemplateById(id);
    return { success: true, data: template };
  }

  @Post('email')
  async createEmailTemplate(
    @Body() dto: CreateEmailTemplateDto,
  ): Promise<{ success: true; data: EmailTemplateResponseDto }> {
    const template = await this.templatesService.createEmailTemplate(dto);
    return { success: true, data: template };
  }

  @Put('email/:id')
  async updateEmailTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateEmailTemplateDto,
  ): Promise<{ success: true; data: EmailTemplateResponseDto }> {
    const template = await this.templatesService.updateEmailTemplate(id, dto);
    return { success: true, data: template };
  }

  @Delete('email/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEmailTemplate(@Param('id') id: string): Promise<void> {
    await this.templatesService.deleteEmailTemplate(id);
  }

  @Get('sms')
  async getAllSmsTemplates(): Promise<{
    success: true;
    data: SmsTemplateResponseDto[];
  }> {
    const templates = await this.templatesService.getAllSmsTemplates();
    return { success: true, data: templates };
  }

  @Get('sms/:id')
  async getSmsTemplateById(
    @Param('id') id: string,
  ): Promise<{ success: true; data: SmsTemplateResponseDto }> {
    const template = await this.templatesService.getSmsTemplateById(id);
    return { success: true, data: template };
  }

  @Post('sms')
  async createSmsTemplate(
    @Body() dto: CreateSmsTemplateDto,
  ): Promise<{ success: true; data: SmsTemplateResponseDto }> {
    const template = await this.templatesService.createSmsTemplate(dto);
    return { success: true, data: template };
  }

  @Put('sms/:id')
  async updateSmsTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateSmsTemplateDto,
  ): Promise<{ success: true; data: SmsTemplateResponseDto }> {
    const template = await this.templatesService.updateSmsTemplate(id, dto);
    return { success: true, data: template };
  }

  @Delete('sms/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSmsTemplate(@Param('id') id: string): Promise<void> {
    await this.templatesService.deleteSmsTemplate(id);
  }
}
