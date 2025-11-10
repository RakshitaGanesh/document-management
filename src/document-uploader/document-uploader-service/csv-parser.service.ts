/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { Injectable, HttpStatus } from '@nestjs/common';
import { ArkResponse, arkLog, getErrorMessageResponse } from '@Abrightlab/arkshare';
import * as CSVParse from 'papaparse';
import { isEmpty } from 'lodash';

import {
  LogType,
  ServiceName,
  MethodName,
  CsvParserServiceConstants,
  UTF8
} from '../../constants';

@Injectable()
export class CsvParserService{
  constructor() {
  }

  //function parses CSV file buffer and returns parsed data array
  async csvDataParser(
    fileBuffer: Buffer,
    headers?: Record<string, string>
  ): Promise<ArkResponse<unknown[] | string>> {
    const requestHeaders = headers || {};
    
    arkLog(
      LogType.Log,
      requestHeaders,
      ServiceName.CsvParserService,
      MethodName.CsvDataParser,
      LogType.Request,
      {
        fileBufferLength: fileBuffer?.length,
        fileBufferType: CsvParserServiceConstants.Buffer,
      }
    );

    try {
      if (!fileBuffer || isEmpty(fileBuffer)) {
        throw new TypeError(CsvParserServiceConstants.EmptyFileBufferError);
      }

      const csvStr = fileBuffer?.toString(UTF8);
      
      if (!csvStr?.trim()) {
        throw new TypeError(CsvParserServiceConstants.EmptyFileContentError);
      }

      const csvParsedData = CSVParse?.parse(csvStr, { 
        header: true, 
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header: string) => header?.trim(),
      });

      if (csvParsedData?.errors && isEmpty(csvParsedData?.errors)) {
        arkLog(
          LogType.Log,
          requestHeaders,
          ServiceName.CsvParserService,
          MethodName.CsvDataParser,
          LogType.Response,
          { parseErrors: csvParsedData?.errors }
        );
        
        throw new Error(`${CsvParserServiceConstants.CsvParseError}: ${csvParsedData?.errors?.map(error => error?.message)?.join(', ')}`);
      }

      const csvData = csvParsedData?.data as unknown[];

      const csvParsedResponse: ArkResponse<unknown[] | string> = {
        status: HttpStatus.OK,
        data: csvData,
      };

      arkLog(
        LogType.Log,
        requestHeaders,
        ServiceName.CsvParserService,
        MethodName.CsvDataParser,
        LogType.Response,
        {
          recordsCount: csvData?.length,
          firstRecord: csvData?.[0] || null,
        }
      );

      return csvParsedResponse;
    } catch (error: unknown) {
      const errorResponse: ArkResponse<string> = getErrorMessageResponse(error);

      arkLog(
        LogType.Error,
        requestHeaders,
        ServiceName.CsvParserService,
        MethodName.CsvDataParser,
        LogType.Exception,
        errorResponse
      );

      return errorResponse;
    }
  }
}