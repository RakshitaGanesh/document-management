/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { Express } from 'express';
import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArkPrismaClient, ArkResponse, arkLog, getErrorMessageResponse } from '@Abrightlab/arkshare';

import { CsvParserService } from './csv-parser.service';
import { ExcelParserService } from './excel-parser.service';
import { SchemaMapperService } from './schema-mapper.service';
import {
  LogType,
  ServiceName,
  MethodName,
  DocumentUploaderServiceConstants,
  SUPPORTED_FILE_EXTENSIONS,
} from '../../constants';

@Injectable()
export class DocumentUploaderService {
  private readonly arkPrismaClient: ArkPrismaClient;

  constructor(
    private readonly csvParser: CsvParserService,
    private readonly excelParser: ExcelParserService,
    private readonly schemaMapper: SchemaMapperService,
    private readonly configService: ConfigService
  ) {
    this.arkPrismaClient = this.configService.get<ArkPrismaClient>('arkPrismaClient') as ArkPrismaClient;
  }

  //function processes file and maps data to schema
  async processFile(
    headers: Record<string, string>,
    file: Express.Multer.File | Buffer,
    schema: any,
    fileType?: string,
  ): Promise<ArkResponse<any | string>> {
    arkLog(
      LogType.Log,
      headers,
      ServiceName.DocumentUploaderService,
      MethodName.ProcessFile,
      LogType.Request,
      {
        fileType,
        isMulterFile: this.isMulterFile(file),
        schemaProvided: !!schema,
      }
    );

    try {
      if (!file) {
        throw new BadRequestException(DocumentUploaderServiceConstants.FileNotProvidedError);
      }

      if (!schema) {
        throw new BadRequestException(DocumentUploaderServiceConstants.SchemaNotProvidedError);
      }

      let fileExtension = fileType ?? '';
      let fileBuffer: Buffer;

      if (this.isMulterFile(file)) {
        if (!file.originalname) {
          throw new BadRequestException(DocumentUploaderServiceConstants.InvalidFileNameError);
        }
        fileExtension = file.originalname.split('.').pop()?.toLowerCase() ?? '';
        fileBuffer = file.buffer;
      } else {
        fileBuffer = file as Buffer;
      }

      if (!fileExtension) {
        throw new BadRequestException(DocumentUploaderServiceConstants.FileExtensionNotFoundError);
      }

      if (!fileBuffer || fileBuffer.length === 0) {
        throw new BadRequestException(DocumentUploaderServiceConstants.EmptyFileBufferError);
      }

      const parsedDataResponse = await this.getParser(headers, fileExtension, fileBuffer);

      if (parsedDataResponse.status !== HttpStatus.OK) {
        return parsedDataResponse;
      }

      const parsedData = parsedDataResponse.data as any[];
      const schemaResult = await this.schemaMapper.map(parsedData, schema);

      const successResponse: ArkResponse<any | string> = {
        status: HttpStatus.OK,
        data: schemaResult,
      };

      arkLog(
        LogType.Log,
        headers,
        ServiceName.DocumentUploaderService,
        MethodName.ProcessFile,
        LogType.Response,
        {
          recordsProcessed: Array.isArray(schemaResult) ? schemaResult.length : 'N/A',
          fileExtension,
        }
      );

      return successResponse;
    } catch (error: unknown) {
      const errorResponse: ArkResponse<string> = getErrorMessageResponse(error);

      arkLog(
        LogType.Error,
        headers,
        ServiceName.DocumentUploaderService,
        MethodName.ProcessFile,
        LogType.Exception,
        errorResponse
      );

      return errorResponse;
    }
  }

  //function gets appropriate parser based on file extension
  async getParser(
    headers: Record<string, string>,
    ext: string,
    fileBuffer: Buffer,
  ): Promise<ArkResponse<any[] | string>> {
    arkLog(
      LogType.Log,
      headers,
      ServiceName.DocumentUploaderService,
      MethodName.GetParser,
      LogType.Request,
      {
        fileExtension: ext,
        fileBufferLength: fileBuffer.length,
      }
    );

    try {
      if (!ext) {
        throw new BadRequestException(DocumentUploaderServiceConstants.FileExtensionRequiredError);
      }

      if (!fileBuffer || fileBuffer.length === 0) {
        throw new BadRequestException(DocumentUploaderServiceConstants.EmptyFileBufferError);
      }

      let parsedDataResponse: ArkResponse<any[] | string>;

      switch (ext.toLowerCase()) {
        case SUPPORTED_FILE_EXTENSIONS.CSV:
          parsedDataResponse = await this.csvParser.csvDataParser(fileBuffer, headers);
          break;
        case SUPPORTED_FILE_EXTENSIONS.XLS:
        case SUPPORTED_FILE_EXTENSIONS.XLSX:
          parsedDataResponse = await this.excelParser.excelDataParse(fileBuffer, headers);
          break;
        default:
          throw new BadRequestException(`${DocumentUploaderServiceConstants.UnsupportedFileTypeError}: ${ext}`);
      }

      if (parsedDataResponse.status !== HttpStatus.OK) {
        return parsedDataResponse;
      }

      const successResponse: ArkResponse<any[] | string> = {
        status: HttpStatus.OK,
        data: parsedDataResponse.data,
      };

      arkLog(
        LogType.Log,
        headers,
        ServiceName.DocumentUploaderService,
        MethodName.GetParser,
        LogType.Response,
        {
          recordsParsed: Array.isArray(parsedDataResponse.data) ? (parsedDataResponse.data as any[]).length : 'N/A',
          parserUsed: ext,
        }
      );

      return successResponse;
    } catch (error: unknown) {
      const errorResponse: ArkResponse<string> = getErrorMessageResponse(error);

      arkLog(
        LogType.Error,
        headers,
        ServiceName.DocumentUploaderService,
        MethodName.GetParser,
        LogType.Exception,
        errorResponse
      );

      return errorResponse;
    }
  }

  //function checks if file is a Multer file
  private isMulterFile(file: any): file is Express.Multer.File {
    arkLog(
      LogType.Log,
      {},
      ServiceName.DocumentUploaderService,
      MethodName.IsMulterFile,
      LogType.Request,
      {
        hasOriginalname: !!(file && file?.originalname),
        hasBuffer: !!(file && file?.buffer),
      }
    );

    const isMulter = file && typeof file === 'object' && 'originalname' in file && 'buffer' in file;

    arkLog(
      LogType.Log,
      {},
      ServiceName.DocumentUploaderService,
      MethodName.IsMulterFile,
      LogType.Response,
      { isMulterFile: isMulter }
    );

    return isMulter;
  }

  // Legacy method to maintain backward compatibility
  async processFileBuffer(
    file: Express.Multer.File | Buffer,
    schema: any,
    fileType?: string,
  ): Promise<any> {
    const result = await this.processFile({}, file, schema, fileType);
    if (result.status === HttpStatus.OK) {
      return result.data;
    } else {
      throw new Error(result.data as string);
    }
  }
}