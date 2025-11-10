import { Controller, Get } from '@nestjs/common';
import { DocumentUploaderService } from './document-uploader-service/document-uploader.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
// file-upload.controller.ts
import { Post, UploadedFile, UseInterceptors, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadFileDto } from './document-uploader-dtos/document-uploader.dto';


@Controller("Document-Uploader-Management")
@ApiTags("Document-Uploader-Management")
export class DocumentUploaderController {
  constructor(private readonly documentUploadService: DocumentUploaderService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.documentUploadService.processFile(file, dto.schema, dto.fileType);
  }
}
