export enum IStatusCode {
  Inspection = 1,
  Estimation = 2,
  EstimationApproval = 3,
  ExtenstionWorkOrderIntiation = 4,
  ServiceMainEstimate = 5,
  ServiceMainEstimateApproval = 6,
  ServiceMainWorkOrder = 7,
}

export interface IDashboardFilterParams {
  userName: string;
  userCode: string;
  userRole: string;
  serviceKey: string;
  apiKey: string;
  officeCode: string;
}

export interface IDashboardListFilterParams {
  userName: string;
  userCode: string;
  userRole: string;
  serviceKey: string;
  apiKey: string;
  officeCode: string;
  statusCode: string;
}

export interface IEstimateProcessCount {
  inspectionCount: string;
  estimationCount: string;
  estimationApprovalCount: string;
  extensionWorkOrderIntiationCount: string;
  serviceMainEstimateCount: string;
  serviceMainEstimateApprovalCount: string;
  serviceMainWorkOrder: string;
}

export interface IEstimatesList {
  serviceRegistrationsId: number;
  referenceNumber: any;
  substationMasterId: any;
  feederMasterId: any;
  dtrMasterId: any;
  poleMasterId: any;
  areaMasterId: any;
  officeId: number;
  applicationTypeId: number;
  connectionTypeId: number;
  accountNumber: any;
  applicantName: string;
  applicantTypeId: number;
  serviceTypeId: number;
  locationTypeId: null;
  mainCategoryId: number;
  subCategoryId: number;
  address: string;
  landmark: any;
  city: any;
  pinCode: any;
  districtId: number;
  email: any;
  landlineNumber: any;
  mobileNumber: string;
  adjacentAccountNo: string;
  registeredOn: Date;
  registeredBy: number;
  applicationStatusCode: string;
  registeredSource: string;
  phase: number;
  servicePurposeId: any;
  kwLoad: number;
  hpLoad: any;
  totalContractedLoad: number;
  totalConnectedLoad: any;
  loadUnit: string;
  loadType: string;
  plotSize: number;
  buildupAreaSize: number;
  designationId: any;
  departmentId: any;
  insertedBy: number;
  insertDate: any;
  modifiedBy: any;
  modifiedDate: any;
  sessionIpAddress: string;
  activeStatus: number;
  uniqueCondition: string;
  numberOfFloors: any;
  buildingHeight: any;
  meterRequiredFlag: any;
  gisLatitude: any;
  gisLongitude: any;
  existingLoadKw: any;
  existingLoadHp: any;
  existingTotalLoad: any;
  existingLoadUnit: any;
  newLoadKw: any;
  newLoadHp: any;
  newTotalLoad: any;
  newLoadUnit: any;
  groupNumber: any;
  groupName: any;
  noOfConnections: any;
}

export interface IEstimatesListByStatusCodeAndOffice {}

export interface IDataByAccountId {
  accountId: '13293049303';
  applicantName: 'Rajesh';
  address: 'Bescom office';
  tariff: 'LT-2(a)(i) Tariff Schedule - Normal';
  phase: '3';
  loadKw: '1.000';
  loadHp: '0.000';
  totalContractedLoad: '1.000';
  loadUnit: 'KW';
  statusName: 'INSPECTION';
  registeredSource: 'NSC';
  registeredOn: '2023-01-01 00:00:00.0';
  officeName: 'ESCOM HQ';
  loadType: 'LT';
  landmark: 'null';
  mobileNumber: '9834355555';
  email: 'null';
  applicantType: 'Owner';
  connectionType: 'Single Connection';
  plotSize: '100.000';
  buildupAreaSize: '100.000';
  adjacentAccountNo: '13293049304';
}
