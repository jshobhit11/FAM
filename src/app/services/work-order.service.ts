import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WorkOrderService extends RestAPIService {
  private workDescription = new BehaviorSubject('');
  private workorderNo = new BehaviorSubject('');
  updatedWorkDescription = this.workDescription.asObservable();
  updatedWorkorderNo = this.workorderNo.asObservable();

  passWorkDescription(value: string) {
    this.workDescription.next(value);
  }

  passWorkorderNo(value: string) {
    this.workorderNo.next(value);
  }

  getRegisteredWorkOrderData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetWorkOrderData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      estimationRegisteredId?: string;
      operationCode?: string;
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
      if (filterParams.estimationRegisteredId) {
        queryParams.estimationRegisteredId = filterParams.estimationRegisteredId;
      }
      if (filterParams.operationCode) {
        queryParams.operationCode = filterParams.operationCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  saveWorkOrderData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.saveWorkOrderData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationsId?: string;
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
        queryParams.serviceRegistrationsId = filterParams.serviceRegistrationsId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  approveWorkOrderData(filterParams: any, body: Object) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.WorkOrderApproveData);

    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  getWorkOrderReport(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.GetWorkOrderReport);
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

  forwardWorkOrderData(filterParams: any, body: Object) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.forwardWorkOrderData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationsId?: string;
      forwardingTo?: string;
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
        queryParams.serviceRegistrationsId = filterParams.serviceRegistrationsId;
      }
      if (filterParams.forwardingTo) {
        queryParams.forwardingTo = filterParams.forwardingTo;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  saveReviseddWorkOrderData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.saveRevisedWorkOrderData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  getWorkOrderCreditAndRegularList(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetCreditAndRegularWorkOrderData);

    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getWorkOrderCreditReport(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GenerateWorkOrderCreditReport);

    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  // Account Meter Mapping

  saveAccountMeterMapping(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveAccountMeterMapping);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  getAccountMeterMappingDataById(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetWmAccountMeterMappingDataById);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getDataByServiceRegistrationsId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByServiceRegistrationsId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  // Meter Change Details

  saveMeterChangeDetails(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveMeterChangeDetails);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  saveMultipleMeterChangeDetails(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveMultipleMeterChangeDetails);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  getMeterChangeDetailsDataById(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetMeterChangeDetailsDataById);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getDataByWorkOrderRegisteredId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByWorkOrderRegisteredId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  validateMaterials(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.ValidateMaterials);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  saveAccountMeterSingle(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.saveAccountMeterSingle);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  meterReplacementSaveData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.meterReplacementSaveData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
}
