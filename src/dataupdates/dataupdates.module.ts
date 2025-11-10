/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataUpdatesController } from './dataupdates.controller';

import { HttpModule } from '@nestjs/axios';
import { DocumentUploaderModule } from "../document-uploader/document-uploader.module";

import { DataUpdateService } from './dataupdates.service';

@Module({
  imports: [
    HttpModule, DocumentUploaderModule,
  ],
  providers: [
    DataUpdateService,
    ConfigService,
  ],
  controllers: [DataUpdatesController],
})
export class DataUpdatesModule { }
