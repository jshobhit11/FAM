import { Injectable } from '@angular/core';
import { ApiEndpoint } from './api-endpoint';
import { RestAPIService } from './rest-api.service';
import { APIUrl, RequestMethod } from './types';
@Injectable({
  providedIn: 'root',
})
export class DivisionalBudgetHeadService extends RestAPIService {
  async getDivisionOfficeId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.DivisionOfficeId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDivisionAccountHeadData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.DivisionAccountHeadData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  SaveDivsionalBudgetData(filterParams: any, requestBody: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveDivsionalBudgetData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, requestBody);
  }

  async getDataFinacialYear(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.DataFinacialYear);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDivisionalBudgetHead(divisionalBudgetHead: string): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.DivisionalBudgetHead);
    const queryParams: any = {
      serviceKey: sessionStorage.getItem('service-key'),
      apiKey: sessionStorage.getItem('api-key'),
      userCode: sessionStorage.getItem('user-code'),
      userName: sessionStorage.getItem('user-name'),
      userRole: sessionStorage.getItem('user-role'),
      divisionalBudgetHead: divisionalBudgetHead,
    };
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  async getCorporate(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.DivisionOfficeId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async getCircleOptions(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.officeMasterData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
}
