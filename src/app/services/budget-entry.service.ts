import { Injectable } from '@angular/core';
import { ApiEndpoint } from './api-endpoint';
import { RestAPIService } from './rest-api.service';
import { APIUrl, RequestMethod } from './types';

@Injectable({
  providedIn: 'root',
})
export class BudgetEntryService extends RestAPIService {
  async getbudgetapprovalGetAllData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.budgetapprovalGetAllData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async SaveBudgetEntry(filterParams: any, requestBody: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.saveBudgetEntry);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, requestBody);
  }

  async UpdateAprroveData(filterParams: any, body: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.UpdateAprroveData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      budgetYearType?: string;
      transactionType?: string;
      budgetStatus?: string;
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
      if (filterParams.budgetYearType) {
        queryParams.budgetYearType = filterParams.budgetYearType;
      }
      if (filterParams.transactionType) {
        queryParams.transactionType = filterParams.transactionType;
      }
      if (filterParams.budgetStatus) {
        queryParams.budgetStatus = filterParams.budgetStatus;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }
}
