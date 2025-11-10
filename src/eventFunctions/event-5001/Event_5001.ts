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
    // key = fieldName in API/db, value = columnName in Excel
}
const employeeSchema: ExcelSchema = {
    "Numeric": 'Numeric Value',
    "Numeric-2": 'monthValue',
    "Numeric-Suffix": 'year',
};
// displays vendors list
class Event_5001 extends EventHandler {
    constructor(
        private readonly eventArgs: EventHandlerTypes,
        private readonly documentUploaderService: DocumentUploaderService
    ) {
        super(
            { ...eventArgs },
            documentUploaderService
        );

        // Ensure BigInt can be safely serialized
        BigInt.prototype['toJSON'] = function () {
            return this.toString();
        };
    }
    async sendData(headers: Record<string, string>) {
        console.log(headers, "it actually enters the syste", this?.queryParams);
        const { files } = this?.queryParams;
        const parsedFiles = JSON.parse(files);
        const convertedFiles = parsedFiles?.map((item) => this.base64ToBuffer(item));

        console.log(convertedFiles, "this are the converted files")
    }


    async base64ToBuffer(base64String: string) {
        const base64Data = base64String.split(',')[1] || base64String;
        const bufferFromString = Buffer.from(base64Data, 'base64');
        let parsedInformation = await this.documentUploaderService.processFile(bufferFromString, employeeSchema, 'csv');
        return parsedInformation;
    }


}

export default Event_5001;
