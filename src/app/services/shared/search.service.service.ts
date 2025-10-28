import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { APIUrl, RequestMethod } from '../types';
import { ApiEndpoint } from '../api-endpoint';
import { RestAPIService } from '../rest-api.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService extends RestAPIService {
  private accountIdSubject = new Subject<string>();
  private estimationNoSubject = new Subject<string>();
  private workorderNoSubject = new Subject<string>();

  accountId$ = this.accountIdSubject.asObservable();
  estimationNo$ = this.estimationNoSubject.asObservable();
  workorderNo$ = this.workorderNoSubject.asObservable();

  setAccountId(accountId: string) {
    this.accountIdSubject.next(accountId);
  }
  
  setEstimationNo(estimationNo: string) {
    this.accountIdSubject.next(estimationNo);
  }

  setWorkorderNo(workorderNo: string) {
    this.accountIdSubject.next(workorderNo);
  }

  async getDataByAccountIdAndOfficeId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataBySearchType);

    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByEstimationNoAndOfficeId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByEstimationNoAndOfficeId);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      estimationNo?: string;
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
      if (filterParams.estimationNo) {
        queryParams.estimationNo = filterParams.estimationNo;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByWorkOrderNoAndOfficeId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByWorkOrderNoAndOfficeId);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      workorderNo?: string;
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
      if (filterParams.workorderNo) {
        queryParams.workorderNo = filterParams.workorderNo;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  async getDataByEstimationNo(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByEstimationNo);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      estimationNumber?: string;
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
      if (filterParams.estimationNo) {
        queryParams.estimationNumber = filterParams.estimationNo;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByWorkorderNo(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByWorkorderNo);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async getDataByIndentNo(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByIndentNo);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
}
