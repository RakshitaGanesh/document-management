/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ArkPrismaClient, ArkResponse, arkLog, getErrorMessageResponse } from '@Abrightlab/arkshare';
import { DocumentUploaderService } from 'src/document-uploader/document-uploader-service/document-uploader.service';

import { DataUpdateServiceDTO, DataUpdateResponseDTO } from './dto/dataupdates.dto';
import eventFunctionMapper from '../eventHandlers/event.function.mapper';
import {
  RequestType,
  MethodName,
  ServiceName,
  LogType,
  DataUpdateControllerConstants,
} from '../constants';

@Injectable()
export class DataUpdateService {
  private readonly arkPrismaClient: ArkPrismaClient;

  constructor(
    private readonly documentUploaderService: DocumentUploaderService,
    private readonly configService: ConfigService
  ) {
    this.arkPrismaClient = this.configService.get<ArkPrismaClient>('arkPrismaClient') as ArkPrismaClient;
  }

  //function handles data updates based on event mapping
  async dataUpdate({
    headers,
    formData,
    processId,
    eventId,
    action,
    requestType,
    queryParams,
  }: DataUpdateServiceDTO): Promise<ArkResponse<DataUpdateResponseDTO | string>> {
    arkLog(
      LogType.Log,
      headers,
      ServiceName.DataUpdateService,
      MethodName.DataUpdate,
      LogType.Request,
      {
        processId,
        eventId,
        action,
        requestType,
        queryParams,
      }
    );

    try {
      const { userid: userId, orgid: orgId } = headers;

      if (!userId || !orgId) {
        throw new TypeError(DataUpdateControllerConstants.MissingUserOrOrgIdInHeaders);
      }

      const eventKey = DataUpdateControllerConstants.EventPrefix + eventId;
      let txUserId = userId;

      if (queryParams?.txUserId && queryParams?.txUserId !== '') {
        txUserId = queryParams.txUserId;
      }

      if (!eventFunctionMapper.hasOwnProperty(eventKey)) {
        const noHandlerResponse: ArkResponse<DataUpdateResponseDTO | string> = {
          status: HttpStatus.OK,
          data: {
            message: DataUpdateControllerConstants.NoEventHandlerDefined,
          },
        };

        arkLog(
          LogType.Log,
          headers,
          ServiceName.DataUpdateService,
          MethodName.DataUpdate,
          LogType.Response,
          noHandlerResponse
        );

        return noHandlerResponse;
      }

      const EventClass = eventFunctionMapper[eventKey];
      const eventInstance = new EventClass(
        {
          userId,
          txUserId,
          orgId,
          headers,
          processId,
          eventId,
          formData,
          action,
          queryParams,
        },
        this.documentUploaderService
      );

      let result: DataUpdateResponseDTO;

      if (requestType === RequestType.Save) {
        result = await eventInstance.saveData(headers);
      } else {
        result = await eventInstance.sendData(headers);
      }

      const successResponse: ArkResponse<DataUpdateResponseDTO | string> = {
        data: result,
        status: HttpStatus.OK,
      };

      arkLog(
        LogType.Log,
        headers,
        ServiceName.DataUpdateService,
        MethodName.DataUpdate,
        LogType.Response,
        successResponse
      );

      return successResponse;
    } catch (error: unknown) {
      const errorResponse: ArkResponse<string> = getErrorMessageResponse(error);

      arkLog(
        LogType.Error,
        headers,
        ServiceName.DataUpdateService,
        MethodName.DataUpdate,
        LogType.Exception,
        errorResponse
      );

      return errorResponse;
    }
  }
}