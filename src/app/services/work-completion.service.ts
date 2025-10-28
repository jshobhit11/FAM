import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class WorkCompletionService extends RestAPIService {
  getWorkCompletionData(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetWorkCompletionData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeMasterId?: string;
      designationCode?: string;
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
      if (filterParams.officeMasterId) {
        queryParams.officeMasterId = filterParams.officeMasterId;
      }
      if (filterParams.designationCode) {
        queryParams.designationCode = filterParams.designationCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getWorkCompletionDataByWorkOrderRegisteredId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetWorkCompletionDataByRegisteredId
    );
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
        queryParams.wmWorkorderRegisteredId =
          filterParams.wmWorkorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  saveWorkCompletionData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveWorkCompletion
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationsId?: string;
      wmWorkorderRegisteredId?:string;
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
      if (filterParams.serviceRegistrationsId) {
        queryParams.serviceRegistrationsId =
          filterParams.serviceRegistrationsId;
      }
      if (filterParams.wmWorkorderRegisteredId) {
        queryParams.wmWorkorderRegisteredId = filterParams.wmWorkorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }
}
