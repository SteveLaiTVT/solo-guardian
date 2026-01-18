// ============================================================
// Storage Service - Aliyun OSS file upload service
// ============================================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OSS from 'ali-oss';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export interface UploadResult {
  url: string;
  key: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client: OSS | null = null;
  private readonly bucket: string;
  private readonly cdnDomain: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('ALIYUN_OSS_REGION');
    const accessKeyId = this.configService.get<string>('ALIYUN_OSS_ACCESS_KEY_ID');
    const accessKeySecret = this.configService.get<string>('ALIYUN_OSS_ACCESS_KEY_SECRET');
    this.bucket = this.configService.get<string>('ALIYUN_OSS_BUCKET') || '';
    this.endpoint = this.configService.get<string>('ALIYUN_OSS_ENDPOINT') || '';
    this.cdnDomain = this.configService.get<string>('ALIYUN_OSS_CDN_DOMAIN') || '';

    // Validate that config values are real (not placeholder values)
    const isValidConfig =
      region &&
      accessKeyId &&
      accessKeySecret &&
      this.bucket &&
      !region.includes('your-') &&
      !accessKeyId.includes('your-') &&
      !accessKeySecret.includes('your-') &&
      !this.bucket.includes('your-');

    if (isValidConfig) {
      try {
        this.client = new OSS({
          region,
          accessKeyId,
          accessKeySecret,
          bucket: this.bucket,
        });
        this.logger.log('Aliyun OSS client initialized');
      } catch (error) {
        this.logger.warn(`Failed to initialize OSS client: ${error}`);
        this.client = null;
      }
    } else {
      this.logger.warn('Aliyun OSS not configured - file uploads will be disabled');
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  async uploadAvatar(
    userId: string,
    buffer: Buffer,
    originalFilename: string,
  ): Promise<UploadResult> {
    if (!this.client) {
      throw new Error('OSS storage is not configured');
    }

    const ext = path.extname(originalFilename).toLowerCase() || '.jpg';
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!allowedExts.includes(ext)) {
      throw new Error(`Invalid file type: ${ext}. Allowed: ${allowedExts.join(', ')}`);
    }

    const key = `avatars/${userId}/${uuidv4()}${ext}`;

    try {
      const result = await this.client.put(key, buffer, {
        headers: {
          'Content-Type': this.getMimeType(ext),
          'Cache-Control': 'max-age=31536000', // 1 year cache
        },
      });

      const url = this.getPublicUrl(key);
      this.logger.log(`Avatar uploaded: ${key}`);

      return { url, key };
    } catch (error) {
      this.logger.error(`Failed to upload avatar: ${error}`);
      throw new Error('Failed to upload avatar');
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('OSS storage is not configured');
    }

    try {
      await this.client.delete(key);
      this.logger.log(`File deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error}`);
      throw new Error('Failed to delete file');
    }
  }

  private getPublicUrl(key: string): string {
    if (this.cdnDomain) {
      return `${this.cdnDomain}/${key}`;
    }
    return `https://${this.bucket}.${this.endpoint.replace('https://', '')}/${key}`;
  }

  private getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
