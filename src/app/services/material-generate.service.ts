import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class MaterialGenerateService extends RestAPIService {
  async getMaterialIndentPdfData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.MaterialIndentGeneratePdf);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      rateType?: string;
      wmMaterialsIndentId?: string;
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
      if (filterParams.rateType) {
        queryParams.rateType = filterParams.rateType;
      }
      if (filterParams.wmMaterialsIndentId) {
        queryParams.wmMaterialsIndentId = filterParams.wmMaterialsIndentId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

}
