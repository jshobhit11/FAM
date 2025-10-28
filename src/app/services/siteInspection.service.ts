import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class SiteInspectionService extends RestAPIService {
  viewSiteInspectionData(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ViewSiteInspectionData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      applicationStatusCode?: string;
      accountId?: string;
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
      if (filterParams.accountId) {
        queryParams.accountId = filterParams.accountId;
      }
      if (filterParams.applicationStatusCode) {
        queryParams.applicationStatusCode = filterParams.applicationStatusCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  rejectionInspectionData(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.RejectSiteInspectionData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationsId?: string;
      rejectReason?: string;
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
      if (filterParams.rejectReason) {
        queryParams.rejectReason = filterParams.rejectReason;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  saveImprovementSiteInspection(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ImprovementSiteInspection
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
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
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }
  saveCSCSiteInspection(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SiteInspectionSaveData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
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
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }
}
