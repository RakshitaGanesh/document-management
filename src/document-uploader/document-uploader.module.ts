import { Module } from '@nestjs/common';
import {  DocumentUploaderService } from "./document-uploader-service/document-uploader.service";
import { DocumentUploaderController } from "./document-uploader.controller";
import { CsvParserService } from "../document-uploader/document-uploader-service/csv-parser.service";
import { ExcelParserService } from "../document-uploader/document-uploader-service/excel-parser.service";
import { SchemaMapperService } from "../document-uploader/document-uploader-service/schema-mapper.service";

@Module({
  exports:[DocumentUploaderService],
  imports: [],
  controllers: [DocumentUploaderController],
  providers: [DocumentUploaderService,CsvParserService,ExcelParserService,SchemaMapperService],
})
export class DocumentUploaderModule {}
