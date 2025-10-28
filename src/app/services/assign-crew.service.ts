import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class AssignCrewService extends RestAPIService {
  getAssignCrewStoreData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetAssignCrewStoreData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.officeId) {
        queryParams.officeId = filterParams.officeId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getAssignCrewData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetAssignCrewData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      wmWorkorderRegisteredId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.wmWorkorderRegisteredId) {
        queryParams.wmWorkorderRegisteredId = filterParams.wmWorkorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  saveAssignCrewData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveAssignCrewData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      storeOfficeId?: string;
      storeCode?: string;
      workStartDate?: string;
      workEndDate?: string;
    } = {};
    if (filterParams) {
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.storeOfficeId) {
        queryParams.storeOfficeId = filterParams.storeOfficeId;
      }
      if (filterParams.storeCode) {
        queryParams.storeCode = filterParams.storeCode;
      }
      if (filterParams.workStartDate) {
        queryParams.workStartDate = filterParams.workStartDate;
      }
      if (filterParams.workEndDate) {
        queryParams.workEndDate = filterParams.workEndDate;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  getDesignationData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDesignationData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      designationMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.designationMasterId) {
        queryParams.designationMasterId = filterParams.designationMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
}
