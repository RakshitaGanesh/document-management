/*
 * <copyright company="Argenbright Innovations Lab">
 *        copyright (c) Argenbright Innovations Lab, an Argenbright Holdings Company.  All rights reserved.
 * </copyright>
 */

export interface EventHandlerTypes {
  action: string;
  eventId: number;
  formData: any;
  headers: Record<string, string>;
  orgId: string;
  processId: number;
  queryParams: any;
  txUserId: string;
  userId: string;
}

type DelegatorType = {
  empAdmin: boolean;
  fullName: string;
  isManager: string;
  orgAdmin: boolean;
  superManager: boolean;
  uHead: boolean;
  userId: string;
};

export interface UserSessionType {
  akaName: string;
  confirmationDate: Date;
  contractId: string;
  costcenterId: string;
  dateOfJoining: Date;
  delegationAccess: DelegatorType[];
  designationId: string;
  divisionId: string;
  empAdmin: boolean;
  empId: string;
  employmentStatus: string;
  employmentType: string;
  expat: string;
  fresher: string;
  firstName: string;
  fteEquivalent: any;
  fteWeeklyHours: number;
  ftptIndicator: string;
  fullName: string;
  gradeId: string;
  groupJoiningDate: Date;
  initials: string;
  isManager: string;
  lastName: string;
  legalEntityId: string;
  managerId: string;
  middleInitial: string;
  orgAddressId: string;
  orgAdmin: boolean;
  orgId: string;
  payFrequency: string;
  payType: string;
  preferredLanguage: string;
  requestHeaders: any;
  roleId: string;
  salutation: string;
  superManager: boolean;
  uHead: boolean;
  unitId: string;
  userId: string;
  workCountryCode: string;
}
