/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */

export const DEFAULT_COUNT = 0;
export const DEFAULT_LIMIT = 1;

enum RecordSequence {
  DefaultRecord = 0,
  FirstRecord = 1,
}

enum RequestType {
  Display = 'D',
  Save = 'S',
}


enum ControllerName {
  DataUpdateController = 'DataUpdateController',
}

export const SUPPORTED_FILE_EXTENSIONS = {
  CSV: 'csv',
  XLS: 'xls',
  XLSX: 'xlsx',
};

enum LogType {
  Log = 'log',
  Error = 'error',
  Exception = 'exception',
  Request = 'request',
  Response = 'response',
  Process = 'process',
}


const COLUMN_NAMES = { recordId: 'recordId' };

const REC_STATUS = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ACTIVE: 'A',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  PENDING: 'P',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  INACTIVE: 'I',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SAVED: 'S',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DELETE: 'X',
};


enum ServiceName {
  DataUpdateService = 'DataUpdateService',
  CsvParserService= 'CsvParserService',
  DocumentUploaderService= 'DocumentUploaderService',
  ExcelParserService= 'ExcelParserService'
}

enum MethodName {
  DataUpdate = 'dataUpdate',
  CsvDataParser= 'csvDataParser',
  ProcessFile= 'processFile',
  GetParser= 'getParser',
  IsMulterFile= 'isMulterFile',
  ExcelDataParse= 'excelDataParse',
  ParseSheet= 'parseSheet',
  GetSheetNames= 'getSheetNames'
}


export enum DataUpdateControllerConstants {
  UnknownError = 'An unknown error occurred',
  Authorization = 'Authorization',
  UserId = 'UserId',
  OrgId = 'OrgId',
  AuthorizationDescription = 'Bearer token for authentication',
  UserIdDescription = 'User ID for the request',
  OrgIdDescription = 'Organization ID for the request',
  ProcessId = 'processId',
  EventId = 'eventId',
  Action = 'action',
  RequestType = 'requestType',
  ProcessIdDescription = 'Process ID for the data update operation',
  EventIdDescription = 'Event ID for the data update operation',
  ActionDescription = 'Action to be performed (optional)',
  RequestTypeDescription = 'Type of request (Display/Save) - defaults to Display',
  DataUpdateSwaggerSummary = 'Update data based on process and event parameters',
  DataUpdatePayloadDescription = 'Data update payload containing form data and query parameters',
  DataUpdateSuccess = 'Data update operation completed successfully',
  DataUpdateFailure = 'Failed to complete data update operation',
  MissingAuthorizationHeader = 'Authorization header is required',
  MissingUserIdHeader = 'UserId header is required',
  MissingOrgIdHeader = 'OrgId header is required',
  MissingProcessId = 'processId query parameter is required',
  MissingEventId = 'eventId query parameter is required',
  MissingDataUpdatePayload = 'Request body cannot be empty',
  InvalidProcessId = 'processId must be a valid number',
  InvalidEventId = 'eventId must be a valid number',
  StringType = 'string',
  NumberType = 'number',
  BadRequest = 'Invalid input data',
  InternalServerError = 'Internal server error',
  UserName = 'username',
  RequestId = 'requestid',
  MissingUserOrOrgIdInHeaders= 'Missing userId or orgId in headers',
  NoEventHandlerDefined= 'No event handler defined',
  EventPrefix= 'Event_',
  SomethingWentWrong= 'Something went wrong!',
}

export enum DocumentUploaderServiceConstants {
  FileNotProvidedError = 'File is required for processing',
  SchemaNotProvidedError = 'Schema is required for data mapping',
  InvalidFileNameError = 'Invalid file name provided',
  FileExtensionNotFoundError = 'File extension could not be determined',
  EmptyFileBufferError = 'File buffer is empty or invalid',
  FileExtensionRequiredError = 'File extension is required',
  UnsupportedFileTypeError = 'Unsupported file type',
  ParsingFailedError = 'Failed to parse file content',
  SchemaMappingFailedError = 'Failed to map data to provided schema',
}

export enum CsvParserServiceConstants  {
  EmptyFileBufferError= 'File buffer is empty or null',
  EmptyFileContentError= 'File content is empty after conversion to string',
  CsvParseError= 'Error parsing CSV file',
  InvalidFileFormatError= 'Invalid CSV file format',
  Buffer= 'Buffer',
  BufferType = 'buffer'
};
export const UTF8 = 'utf8';

export const ExcelParserServiceConstants = {
  EmptyFileBufferError: 'File buffer is empty or null',
  NoSheetsFoundError: 'No sheets found in the Excel file',
  SheetNotFoundError: 'Specified sheet not found in the Excel file',
  EmptySheetError: 'The Excel sheet is empty or contains no data',
  SheetNameRequiredError: 'Sheet name is required for parsing specific sheet',
  InvalidExcelFileError: 'Invalid Excel file format',
  CorruptedFileError: 'Excel file appears to be corrupted',
};


export {
  ServiceName,
  MethodName,
  RecordSequence,
  REC_STATUS,
  LogType,
  RequestType,
  COLUMN_NAMES,
  ControllerName
};
