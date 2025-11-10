/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArkPrismaClient, ArkResponse, arkLog, getErrorMessageResponse } from '@Abrightlab/arkshare';
import * as XLSX from 'xlsx';
import { isEmpty } from "lodash";

import {
  LogType,
  ServiceName,
  MethodName,
  ExcelParserServiceConstants,
  CsvParserServiceConstants
} from '../../constants';

@Injectable()
export class ExcelParserService {
  private readonly arkPrismaClient: ArkPrismaClient;

  constructor(private readonly configService: ConfigService) {
    this.arkPrismaClient = this.configService.get<ArkPrismaClient>('arkPrismaClient') as ArkPrismaClient;
  }

  //function parses Excel file buffer and returns parsed data array
  async excelDataParse(
    fileBuffer: Buffer,
    headers?: Record<string, string>
  ): Promise<ArkResponse<unknown[] | string>> {
    const requestHeaders = headers || {};

    arkLog(
      LogType.Log,
      requestHeaders,
      ServiceName.ExcelParserService,
      MethodName.ExcelDataParse,
      LogType.Request,
      {
        fileBufferLength: fileBuffer?.length,
        fileBufferType: CsvParserServiceConstants.Buffer,
      }
    );

    try {
      if (!fileBuffer || isEmpty(fileBuffer)) {
        throw new TypeError(ExcelParserServiceConstants.EmptyFileBufferError);
      }

      // Read the Excel workbook
      const workbook = XLSX?.read(fileBuffer, {
        type: CsvParserServiceConstants.BufferType,
        cellDates: true,
        cellNF: false,
        cellText: false,
      });

      if (!workbook || !workbook?.SheetNames || isEmpty(workbook?.SheetNames)) {
        throw new Error(ExcelParserServiceConstants.NoSheetsFoundError);
      }

      const firstSheetName = workbook?.SheetNames?.[0];
      const sheet = workbook?.Sheets?.[firstSheetName];

      if (!sheet) {
        throw new Error(ExcelParserServiceConstants.SheetNotFoundError);
      }

      // Convert sheet to JSON with proper options
      const rawData = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        header: 1, // First get as array of arrays to check if data exists
        blankrows: false,
      });

      if (!rawData || isEmpty(rawData)) {
        throw new Error(ExcelParserServiceConstants.EmptySheetError);
      }

      // Convert again with proper headers
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        blankrows: false,
        raw: false,
      });

      // Clean up headers by trimming whitespace
      const cleanedData = parsedData?.map((row: any) => {
        const cleanedRow: any = {};
        Object.keys(row)?.forEach(key => {
          const cleanedKey = key?.trim();
          cleanedRow[cleanedKey] = row?.[key];
        });
        return cleanedRow;
      });

      const successResponse: ArkResponse<any[] | string> = {
        status: HttpStatus.OK,
        data: cleanedData,
      };

      arkLog(
        LogType.Log,
        requestHeaders,
        ServiceName.ExcelParserService,
        MethodName.ExcelDataParse,
        LogType.Response,
        {
          sheetName: firstSheetName,
          totalSheets: workbook.SheetNames.length,
          recordsCount: cleanedData.length,
          firstRecord: cleanedData?.[0] || null,
        }
      );

      return successResponse;
    } catch (error: unknown) {
      const errorResponse: ArkResponse<string> = getErrorMessageResponse(error);

      arkLog(
        LogType.Error,
        requestHeaders,
        ServiceName.ExcelParserService,
        MethodName.ExcelDataParse,
        LogType.Exception,
        errorResponse
      );

      return errorResponse;
    }
  }

  //function parses specific sheet from Excel file
  async parseSheet(
    fileBuffer: Buffer,
    sheetName: string,
    headers?: Record<string, string>
  ): Promise<ArkResponse<any[] | string>> {
    const requestHeaders = headers || {};

    arkLog(
      LogType.Log,
      requestHeaders,
      ServiceName.ExcelParserService,
      MethodName.ParseSheet,
      LogType.Request,
      {
        fileBufferLength: fileBuffer.length,
        sheetName,
      }
    );

    try {
      if (!fileBuffer || isEmpty(fileBuffer)) {
        throw new TypeError(ExcelParserServiceConstants.EmptyFileBufferError);
      }

      if (!sheetName || sheetName?.trim() === '') {
        throw new TypeError(ExcelParserServiceConstants.SheetNameRequiredError);
      }

      const workbook = XLSX.read(fileBuffer, {
        type: CsvParserServiceConstants.BufferType,
        cellDates: true,
        cellNF: false,
        cellText: false,
      });

      if (!workbook || !workbook?.SheetNames || isEmpty(workbook?.SheetNames)) {
        throw new Error(ExcelParserServiceConstants.NoSheetsFoundError);
      }

      if (!workbook.SheetNames.includes(sheetName)) {
        throw new Error(`${ExcelParserServiceConstants.SheetNotFoundError}: ${sheetName}. Available sheets: ${workbook.SheetNames.join(', ')}`);
      }

      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        blankrows: false,
        raw: false,
      });

      // Clean up headers by trimming whitespace
      const cleanedData = parsedData?.map((row: any) => {
        const cleanedRow: any = {};
        Object.keys(row)?.forEach(key => {
          const cleanedKey = key?.trim();
          cleanedRow[cleanedKey] = row?.[key];
        });
        return cleanedRow;
      });

      const successResponse: ArkResponse<any[] | string> = {
        status: HttpStatus.OK,
        data: cleanedData,
      };

      arkLog(
        LogType.Log,
        requestHeaders,
        ServiceName.ExcelParserService,
        MethodName.ParseSheet,
        LogType.Response,
        {
          sheetName,
          recordsCount: cleanedData.length,
          firstRecord: cleanedData?.[0] || null,
        }
      );

      return successResponse;
    } catch (error: unknown) {
      const errorResponse: ArkResponse<string> = getErrorMessageResponse(error);

      arkLog(
        LogType.Error,
        requestHeaders,
        ServiceName.ExcelParserService,
        MethodName.ParseSheet,
        LogType.Exception,
        errorResponse
      );

      return errorResponse;
    }
  }

  //function gets list of sheet names from Excel file
  async getSheetNames(
    fileBuffer: Buffer,
    headers?: Record<string, string>
  ): Promise<ArkResponse<string[] | string>> {
    const requestHeaders = headers || {};

    arkLog(
      LogType.Log,
      requestHeaders,
      ServiceName.ExcelParserService,
      MethodName.GetSheetNames,
      LogType.Request,
      {
        fileBufferLength: fileBuffer?.length,
      }
    );

    try {
      if (!fileBuffer || isEmpty(fileBuffer)) {
        throw new TypeError(ExcelParserServiceConstants.EmptyFileBufferError);
      }

      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

      if (!workbook || !workbook.SheetNames || isEmpty(workbook.SheetNames)) {
        throw new Error(ExcelParserServiceConstants.NoSheetsFoundError);
      }

      const successResponse: ArkResponse<string[] | string> = {
        status: HttpStatus.OK,
        data: workbook.SheetNames,
      };

      arkLog(
        LogType.Log,
        requestHeaders,
        ServiceName.ExcelParserService,
        MethodName.GetSheetNames,
        LogType.Response,
        {
          sheetNames: workbook.SheetNames,
          totalSheets: workbook.SheetNames.length,
        }
      );

      return successResponse;
    } catch (error: unknown) {
      const errorResponse: ArkResponse<string> = getErrorMessageResponse(error);

      arkLog(
        LogType.Error,
        requestHeaders,
        ServiceName.ExcelParserService,
        MethodName.GetSheetNames,
        LogType.Exception,
        errorResponse
      );

      return errorResponse;
    }
  }

  // Legacy method to maintain backward compatibility
  async parseBuffer(fileBuffer: Buffer): Promise<any[]> {
    const result = await this.excelDataParse(fileBuffer);
    if (result.status === HttpStatus.OK) {
      return result.data as any[];
    } else {
      throw new Error(result.data as string);
    }
  }
}