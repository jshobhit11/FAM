import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class ExceptionalReportService extends RestAPIService {
  async ExceptionalPortingData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.ExceptionalPortingData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      rateType?: string;
      portingStartDate?: string;
      portingEndDate?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.rateType) {
        queryParams.rateType = filterParams.rateType;
      }
      if (filterParams.portingStartDate) {
        queryParams.portingStartDate = filterParams.portingStartDate;
      }
      if (filterParams.portingEndDate) {
        queryParams.portingEndDate = filterParams.portingEndDate;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async ExceptionalReportData(excelData): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.ExceptionalReortData);
    const queryParams: {
      apiKey?: string;
      serviceKey?: string;
      userRole?: string;
      userName?: string;
      userCode?: string;
      smInventoryUploadReqId?: string;
      portedFileName?: string;
      portingDate?: string;
    } = {};  
    if (excelData) {
      if (excelData.smInventoryUploadReqId !== undefined) {
        queryParams.smInventoryUploadReqId = excelData.smInventoryUploadReqId;
      }
      if (excelData.portedFileName) {
        queryParams.portedFileName = excelData.portedFileName;
      }
      if (excelData.portingDate) {
        queryParams.portingDate = excelData.portingDate;
      }
      if (excelData.apiKey) {
        queryParams.apiKey = excelData.apiKey;
      }
      if (excelData.serviceKey) {
        queryParams.serviceKey = excelData.serviceKey;
      }
      if (excelData.userRole) {
        queryParams.userRole = excelData.userRole;
      }
      if (excelData.userName) {
        queryParams.userName = excelData.userName;
      }
      if (excelData.userCode) {
        queryParams.userCode = excelData.userCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  
}
