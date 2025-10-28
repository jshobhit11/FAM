import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class StoreOfficeService extends RestAPIService {
  getAllStoreMasterData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetAllStoreMasterData);
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
    return this.sendRequest<any>(endpoint);
  }

  getStoreOfficeApprovalListData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetStoreOfficeApprovalListData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeMasterId?: string;
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
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getStoreOfficeApprovalShowMaterialIndentdata(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetStoreOfficeApprovalShowMaterialIndentdata);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      wmMaterialsIndentId?: string;
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
      if (filterParams.wmMaterialsIndentId) {
        queryParams.wmMaterialsIndentId = filterParams.wmMaterialsIndentId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  saveStoreOfficeApprovalAlternate(filterParams: any, params: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveStoreOfficeApproval);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      storeOfficerApprovedRemarks?: string;
      wmMaterialsIndentTransLogId?:string;
      alternateMaterialMasterId?:string;
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
      queryParams.storeOfficerApprovedRemarks = filterParams.storeOfficerApprovedRemarks;
      if (filterParams.wmMaterialsIndentTransLogId) {
        queryParams.wmMaterialsIndentTransLogId = filterParams.wmMaterialsIndentTransLogId;
      }
      if (filterParams.alternateMaterialMasterId) {
        queryParams.alternateMaterialMasterId = filterParams.alternateMaterialMasterId;
      }

    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, params);
  }
  
  saveStoreOfficeApprovalForIndent(filterParams: any, params: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveStoreOfficeApproval);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      storeOfficerApprovedRemarks?: string;
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
      queryParams.storeOfficerApprovedRemarks = filterParams.storeOfficerApprovedRemarks;
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, params);
  }
  async generateStoreInventoryAbstractReport(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.GenerateStoreInventoryAbstractReport);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async getOfficeMasterByOfficeMasterId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetOfficeMasterByOfficeMasterId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async generateStoreInventoryAbstractReportXLS(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.GenerateStoreInventoryAbstractReportXLS);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async generateStockLogReportXLS(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.GenerateStockLogReportXLS);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async generateStockLogReportXML(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.GenerateStockLogReportXML);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async generateStockLogReportPDF(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.GenerateStockLogReportPDF);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getStoreOfficeApprovalShowSuspenseMaterialIndentdata(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetStoreOfficeApprovalShowSuspenseMaterialIndentdata);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      wmMaterialsIndentId?: string;
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
      if (filterParams.wmMaterialsIndentId) {
        queryParams.wmMaterialsIndentId = filterParams.wmMaterialsIndentId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  getStoreOfficeApprovalShowStoreMaterialIndentdata(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetStoreOfficeApprovalShowStoreMaterialIndentdata);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      wmMaterialsIndentId?: string;
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
      if (filterParams.wmMaterialsIndentId) {
        queryParams.wmMaterialsIndentId = filterParams.wmMaterialsIndentId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

}
