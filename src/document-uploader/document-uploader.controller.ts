import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, BadRequestException, Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { DocumentUploaderService } from './document-uploader-service/document-uploader.service';
import { UploadFileDto } from './document-uploader-dtos/document-uploader.dto';

@Controller("Document-Uploader-Management")
@ApiTags("Document-Uploader-Management")
export class DocumentUploaderController {
  constructor(private readonly documentUploadService: DocumentUploaderService) {}

  /**
   * Upload endpoint for direct file uploads via multipart/form-data
   * Used when files are uploaded directly from a form
   */
  @Post('upload')
  @ApiOkResponse({ description: 'File uploaded and processed successfully' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(
    @Headers() headers: Record<string, string>,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!dto.schema) {
      throw new BadRequestException('Schema is required');
    }

    // Call processFile with headers
    return this.documentUploadService.processFile(
      headers,
      file,
      dto.schema,
      dto.fileType
    );
  }

  /**
   * Alternative endpoint for base64 file uploads
   * Used when files are sent as base64 strings (useful for Event handlers)
   */
  @Post('upload-base64')
  @ApiOkResponse({ description: 'Base64 file uploaded and processed successfully' })
  async uploadBase64(
    @Headers() headers: Record<string, string>,
    @Body() body: {
      file: string; // base64 string
      schema: any;
      fileType?: string;
    },
  ) {
    if (!body.file) {
      throw new BadRequestException('No file data provided');
    }

    if (!body.schema) {
      throw new BadRequestException('Schema is required');
    }

    // Remove data URL prefix if present
    const base64Data = body.file.includes(',') 
      ? body.file.split(',')[1] 
      : body.file;

    // Convert base64 to Buffer
    const fileBuffer = Buffer.from(base64Data, 'base64');

    if (fileBuffer.length === 0) {
      throw new BadRequestException('Invalid or empty file data');
    }

    // Call processFile with headers
    return this.documentUploadService.processFile(
      headers,
      fileBuffer,
      body.schema,
      body.fileType
    );
  }
}