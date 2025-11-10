/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { EventHandlerTypes, UserSessionType } from './event.handler.type';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { S3Client } from '@aws-sdk/client-s3';
import { DocumentUploaderService } from 'src/document-uploader/document-uploader-service/document-uploader.service';
type Employee = {
  empId: string;
  fullName: string;
};

class EventHandler {
  userId: string;
  txUserId: string;
  orgId: string;
  headers: Record<string, string>;
  processId: number;
  eventId: number;
  formData: any;
  transaction: any;
  queryParams: any;
  empDictionary: Map<string, Employee>;
  configService: ConfigService;
  userSession: UserSessionType;
  accessableUserIds: string[];
  httpService: HttpService;
  private dbTransactions: any[];
  prismaTransaction: any[];
  action: string;
  userLanguage: string;

  s3Client = new S3Client({
    region: process.env.AWS_REGION,
  });

  constructor(
    eventHandlerArgs: EventHandlerTypes,
    documentUploaderService: DocumentUploaderService
  ) {
    this.userId = eventHandlerArgs.userId;
    this.txUserId = eventHandlerArgs.txUserId;
    this.orgId = eventHandlerArgs.orgId;
    this.headers = eventHandlerArgs.headers;
    this.processId = eventHandlerArgs.processId;
    this.eventId = eventHandlerArgs.eventId;
    this.formData = eventHandlerArgs.formData;
    this.queryParams = eventHandlerArgs.queryParams;
    this.empDictionary = new Map<string, Employee>();
    this.dbTransactions = [];
    this.action = eventHandlerArgs.action;

    BigInt.prototype['toJSON'] = function () {
      return this.toString();
    };

    this.configService = new ConfigService();
    this.httpService = new HttpService();
    this.userLanguage = 'en';
    if (eventHandlerArgs.headers && eventHandlerArgs.headers['userlanguage']) {
      this.userLanguage = eventHandlerArgs.headers['userlanguage'];
    }
  }

  async saveData(headers): Promise<any> {
    return null;
  }
  async sendData(headers): Promise<any> {
    return null;
  }
}

export default EventHandler;
