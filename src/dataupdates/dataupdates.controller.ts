/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */

import {
  Controller,
  Post,
  Body,
  Headers,
  Res,
  HttpStatus,
  HttpCode,
  BadRequestException,
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiHeaders, ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';
import { isEmpty } from 'lodash';
import { arkLog, ArkResponse } from '@Abrightlab/arkshare';

import { DataUpdateService } from './dataupdates.service';
import { DataUpdateResponseDTO, DataUpdateServiceDTO } from './dto/dataupdates.dto';

import {
  LogType,
  MethodName,
  ControllerName,
  RequestType,
  DataUpdateControllerConstants,
} from '../constants';

@Controller('dataupdates')
@ApiTags('DataUpdate')
export class DataUpdatesController {
  constructor(private readonly dataUpdateService: DataUpdateService) { }

  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @ApiOperation({ summary: DataUpdateControllerConstants.DataUpdateSwaggerSummary as string })
  @ApiResponse({
    status: HttpStatus.OK,
    description: DataUpdateControllerConstants.DataUpdateSuccess as string,
    type: DataUpdateResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: DataUpdateControllerConstants.BadRequest as string,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: DataUpdateControllerConstants.InternalServerError,
  })
  @ApiBody({
    description: DataUpdateControllerConstants.DataUpdatePayloadDescription as string,
    type: DataUpdateServiceDTO,
  })
  @ApiHeaders([
    {
      name: DataUpdateControllerConstants.Authorization as string,
      required: true,
      description: DataUpdateControllerConstants.AuthorizationDescription as string,
    },
    {
      name: DataUpdateControllerConstants.UserId as string,
      required: true,
      description: DataUpdateControllerConstants.UserIdDescription as string,
    },
    {
      name: DataUpdateControllerConstants.OrgId as string,
      required: true,
      description: DataUpdateControllerConstants.OrgIdDescription as string,
    },
  ])
  @ApiQuery({
    name: DataUpdateControllerConstants.ProcessId as string,
    required: true,
    description: DataUpdateControllerConstants.ProcessIdDescription as string,
    type: Number,
  })
  @ApiQuery({
    name: DataUpdateControllerConstants.EventId as string,
    required: true,
    description: DataUpdateControllerConstants.EventIdDescription as string,
    type: Number,
  })
  @ApiQuery({
    name: DataUpdateControllerConstants.Action as string,
    required: false,
    description: DataUpdateControllerConstants.ActionDescription as string,
    type: String,
  })
  @ApiQuery({
    name: DataUpdateControllerConstants.RequestType as string,
    required: false,
    description: DataUpdateControllerConstants.RequestTypeDescription as string,
    type: String,
  })
  async dataUpdate(
    @Headers() headers: Record<string, string>,
    @Body() body: DataUpdateServiceDTO,
    @Query() queryParams: any,
    @Res() response: Response
  ): Promise<Response> {
    try {
      const { processId, eventId, action, requestType = queryParams.requestType || RequestType.Display } = queryParams;
      const { formData, queryParams: bodyQueryParams } = body;

      arkLog(LogType.Log, headers, ControllerName.DataUpdateController, MethodName.DataUpdate, LogType.Request, {
        processId,
        eventId,
        body,
        queryParams,
      });

      // Validate required headers using switch
      switch (true) {
        case !headers?.[DataUpdateControllerConstants.Authorization]:
          throw new BadRequestException(DataUpdateControllerConstants.MissingAuthorizationHeader);

        case !headers?.[DataUpdateControllerConstants.UserId]:
          throw new BadRequestException(DataUpdateControllerConstants.MissingUserIdHeader);

        case !headers?.[DataUpdateControllerConstants.OrgId]:
          throw new BadRequestException(DataUpdateControllerConstants.MissingOrgIdHeader);
      }

      // Validate required query parameters using switch
      switch (true) {
        case !processId:
          throw new BadRequestException(DataUpdateControllerConstants.MissingProcessId);

        case !eventId:
          throw new BadRequestException(DataUpdateControllerConstants.MissingEventId);

        case !body || isEmpty(body):
          throw new BadRequestException(DataUpdateControllerConstants.MissingDataUpdatePayload);
      }

      const intProcessId = Number.parseInt(processId);
      const intEventId = Number.parseInt(eventId);

      // Validate parsed numbers
      switch (true) {
        case isNaN(intProcessId):
          throw new BadRequestException(DataUpdateControllerConstants.InvalidProcessId);

        case isNaN(intEventId):
          throw new BadRequestException(DataUpdateControllerConstants.InvalidEventId);
      }

      const result: ArkResponse<DataUpdateResponseDTO | string> = await this.dataUpdateService.dataUpdate({
        headers,
        formData,
        processId: intProcessId,
        eventId: intEventId,
        action,
        requestType,
        queryParams: bodyQueryParams,
      });

      if (typeof result?.data === 'string') {
        throw new TypeError(result?.data);
      }

      const dataUpdateSuccessResponse = {
        error: false,
        message: DataUpdateControllerConstants.DataUpdateSuccess,
        data: result,
      };

      arkLog(
        LogType.Log,
        headers,
        ControllerName.DataUpdateController,
        MethodName.DataUpdate,
        LogType.Response,
        dataUpdateSuccessResponse
      );

      return response?.status(HttpStatus.OK).json(dataUpdateSuccessResponse);
    } catch (error) {
      const isError = error instanceof Error;
      const statusCode = error instanceof BadRequestException ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;

      const errorResponse = {
        error: true,
        message: isError ? error?.message : DataUpdateControllerConstants.DataUpdateFailure,
        data: {
          type: isError ? error?.constructor?.name : DataUpdateControllerConstants.UnknownError,
          details: isError ? error?.message : DataUpdateControllerConstants.UnknownError,
        },
      };

      arkLog(
        LogType.Error,
        headers,
        ControllerName.DataUpdateController,
        MethodName.DataUpdate,
        LogType.Exception,
        errorResponse
      );

      return response?.status(statusCode).json(errorResponse);
    }
  }
}