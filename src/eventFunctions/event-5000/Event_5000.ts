/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { arkLog, LogType } from '@Abrightlab/arkshare';
import { Buffer } from 'buffer';
import * as XLSX from 'xlsx';

import EventHandler from '../../eventHandlers/event.handler';
import { EventHandlerTypes } from '../../eventHandlers/event.handler.type';
import { DocumentUploaderService } from 'src/document-uploader/document-uploader-service/document-uploader.service';

export interface ExcelSchema {
  [key: string]: string;
  // key = columnName in Excel, value = fieldName in API/db
}

const employeeSchema: ExcelSchema = {
  "First Name": 'firstName',
  "Last Name": 'lastName',
  "Gender": 'gender',
  "Country": 'country',
  "Age": 'age',
  "Date": 'date',
  "Id": 'id',
};

// Displays vendors list and processes uploaded files
class Event_5000 extends EventHandler {
  constructor(
    private readonly eventArgs: EventHandlerTypes,
    private readonly documentUploaderService: DocumentUploaderService
  ) {
    super(
      { ...eventArgs },
      documentUploaderService
    );

    // Ensure BigInt can be safely serialized
    if (!BigInt.prototype.hasOwnProperty('toJSON')) {
      BigInt.prototype['toJSON'] = function () {
        return this.toString();
      };
    }
  }

  async sendData(headers: Record<string, string>) {
    try {
      arkLog(LogType.Log, headers, 'Event_5000', 'sendData', LogType.Request, {
        queryParams: this?.queryParams,
      });

      const { files } = this?.queryParams;

      if (!files) {
      }

      const parsedFiles = JSON.parse(files);

      if (!Array.isArray(parsedFiles) || parsedFiles.length === 0) {
      }

      // Process all files in parallel
      const convertedFiles = await Promise.all(
        parsedFiles.map((base64String) => this.base64ToBuffer(headers, base64String))
      );

      arkLog(LogType.Log, headers, 'Event_5000', 'sendData', LogType.Response, {
        filesProcessed: convertedFiles.length,
      });

      console.log('Converted files:', convertedFiles);

      // Return the processed data
      return {
        data: convertedFiles,
        message: 'Files processed successfully',
        error: false,
        status: 200,
      };
    } catch (error) {
      arkLog(LogType.Error, headers, 'Event_5000', 'sendData', LogType.Exception, error);
      
      return {
        data: null,
        message: error.message || 'Failed to process files',
        error: true,
        status: 500,
      };
    }
  }

  /**
   * Convert base64 string to buffer and process the file
   * @param headers - Request headers for logging
   * @param base64String - Base64 encoded file string
   * @returns Parsed file information
   */
  private async base64ToBuffer(
    headers: Record<string, string>,
    base64String: string
  ): Promise<any> {
    try {
      arkLog(LogType.Log, headers, 'Event_5000', 'base64ToBuffer', LogType.Request, {
        base64Length: base64String?.length,
      });

      // Remove data URL prefix if present (e.g., "data:application/vnd.ms-excel;base64,")
      const base64Data = base64String.includes(',') 
        ? base64String.split(',')[1] 
        : base64String;

      // Convert base64 to Buffer
      const bufferFromString = Buffer.from(base64Data, 'base64');

      // Process the file using the document uploader service
      const parsedInformation = await this.documentUploaderService.processFile(
        headers,
        bufferFromString,
        employeeSchema,
        'xlsx'
      );


      return parsedInformation;
    } catch (error) {
      arkLog(LogType.Error, headers, 'Event_5000', 'base64ToBuffer', LogType.Exception, error);
      throw error;
    }
  }
}

export default Event_5000;