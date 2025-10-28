import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class WorkAwardService extends RestAPIService {
  getWorkAwardData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetWorkAwardData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      workorderRegisteredId?: string;
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
      if (filterParams.workorderRegisteredId) {
        queryParams.workorderRegisteredId = filterParams.workorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getDataByOfficeId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByOfficeId);
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

  getAllRateContractData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.rcGetAllNameData);
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

  saveWorkAwardData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.saveWorkAward);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      workOrderRegisteredId?: string;
      VendorMasterId?: string;
      workAwardNo?: string;
      WorkAwardDate?: string;
      scheduleStartDate?: string;
      scheduleEndDate?: string;
      workAwardedBy?: string;
      workawardedAmount?: string;
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
      if (filterParams.workOrderRegisteredId) {
        queryParams.workOrderRegisteredId = filterParams.workOrderRegisteredId;
      }
      if (filterParams.VendorMasterId) {
        queryParams.VendorMasterId = filterParams.VendorMasterId;
      }
      if (filterParams.workAwardNo) {
        queryParams.workAwardNo = filterParams.workAwardNo;
      }
      if (filterParams.WorkAwardDate) {
        queryParams.WorkAwardDate = filterParams.WorkAwardDate;
      }
      if (filterParams.scheduleStartDate) {
        queryParams.scheduleStartDate = filterParams.scheduleStartDate;
      }
      if (filterParams.scheduleEndDate) {
        queryParams.scheduleEndDate = filterParams.scheduleEndDate;
      }
      if (filterParams.workAwardedBy) {
        queryParams.workAwardedBy = filterParams.workAwardedBy;
      }
      if (filterParams.workawardedAmount) {
        queryParams.workawardedAmount = filterParams.workawardedAmount;
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
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetPendingWorkAwardByVendorId);
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

  saveWorkAwardForwardData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.WorkAwardForwardData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      workOrderRegisteredId?: string;
      VendorMasterId?: string;
      workAwardNo?: string;
      scheduleStartDate?: string;
      scheduleEndDate?: string;
      workawardedAmount?: string;
      wmWorkAwardedLogId?: string;
      designationId?: string;
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
      if (filterParams.workOrderRegisteredId) {
        queryParams.workOrderRegisteredId = filterParams.workOrderRegisteredId;
      }
      if (filterParams.VendorMasterId) {
        queryParams.VendorMasterId = filterParams.VendorMasterId;
      }
      if (filterParams.workAwardNo) {
        queryParams.workAwardNo = filterParams.workAwardNo;
      }
      if (filterParams.wmWorkAwardedLogId) {
        queryParams.wmWorkAwardedLogId = filterParams.wmWorkAwardedLogId;
      }
      if (filterParams.scheduleStartDate) {
        queryParams.scheduleStartDate = filterParams.scheduleStartDate;
      }
      if (filterParams.scheduleEndDate) {
        queryParams.scheduleEndDate = filterParams.scheduleEndDate;
      }
      if (filterParams.designationId) {
        queryParams.designationId = filterParams.designationId;
      }
      if (filterParams.workawardedAmount) {
        queryParams.workawardedAmount = filterParams.workawardedAmount;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  saveWorkAwardApprovalData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.WorkAwardApprovalData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      workOrderRegisteredId?: string;
      VendorMasterId?: string;
      workAwardNo?: string;
      scheduleStartDate?: string;
      scheduleEndDate?: string;
      workawardedAmount?: string;
      wmWorkAwardedLogId?: string;
      designationId?: string;
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
      if (filterParams.workOrderRegisteredId) {
        queryParams.workOrderRegisteredId = filterParams.workOrderRegisteredId;
      }
      if (filterParams.VendorMasterId) {
        queryParams.VendorMasterId = filterParams.VendorMasterId;
      }
      if (filterParams.workAwardNo) {
        queryParams.workAwardNo = filterParams.workAwardNo;
      }
      if (filterParams.wmWorkAwardedLogId) {
        queryParams.wmWorkAwardedLogId = filterParams.wmWorkAwardedLogId;
      }
      if (filterParams.scheduleStartDate) {
        queryParams.scheduleStartDate = filterParams.scheduleStartDate;
      }
      if (filterParams.scheduleEndDate) {
        queryParams.scheduleEndDate = filterParams.scheduleEndDate;
      }
      if (filterParams.designationId) {
        queryParams.designationId = filterParams.designationId;
      }
      if (filterParams.workawardedAmount) {
        queryParams.workawardedAmount = filterParams.workawardedAmount;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  getVendorDetails(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetVendorDetails);
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
}
