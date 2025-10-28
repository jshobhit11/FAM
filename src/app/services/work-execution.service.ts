import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class WorkExecutionService extends RestAPIService {
  geWorkExecutionData(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetWorkExecutionData
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

 async getWorkExecutionMaterialIndentData(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetWorkExecutionMaterialIndentData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      wmWorkorderRegisteredId?: string;
      materialMasterId?: string;
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
      if (filterParams.materialMasterId) {
        queryParams.materialMasterId = filterParams.materialMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  

  saveWorkExecutionData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveWorkExecutionData
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

  getDataByVendorMasterId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getVendorData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      vendorMasterId?: string;
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
      if (filterParams.vendorMasterId) {
        queryParams.vendorMasterId = filterParams.vendorMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getPendingWorkAwardByVendorId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetPendingWorkAwardByVendorId
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      vendorMasterId?: string;
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
      if (filterParams.vendorMasterId) {
        queryParams.vendorMasterId = filterParams.vendorMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getAmAssetDetails(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetWorkExecutionAmAssetDetails
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
  getWorkOrderCreditData(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetCreditWorkOrderData
    );

    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
}
