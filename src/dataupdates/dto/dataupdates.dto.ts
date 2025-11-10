/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */

export class DataUpdateServiceDTO {
  headers: Record<string, string>;
  formData: any;
  processId: number;
  eventId: number;
  action: string;
  requestType: string;
  queryParams: any;
}

export class DataUpdateResponseDTO {
  data?: any;
  error?: string;
  statusText?: string;
  message?: string;
  nextEventProcess?: number;
  nextEventId?: number;
  nextEventParams?: string;
  status?: string;
  params?: string;
}
