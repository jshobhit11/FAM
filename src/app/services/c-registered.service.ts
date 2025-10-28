import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class CRegisteredService extends RestAPIService {
  getInvoiceListData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetCRegisteredInvoiceData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getInvoiceDataByWmMaterialIndentId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetCRegisteredInvoiceDetailData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  saveInvoiceData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveCRegisteredInvoiceData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  getMaterialAcknowledgementList(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetMaterialAcknowledgement);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getMaterialAcknowledgementDetails(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetMaterialAcknowledgementDetails);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  saveAcknowledgementData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveAcknowledgementData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  getFullDetailsByWorkOrderRegisteredId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetFullDetailsByWorkOrderRegisteredId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getBillSubmissionList(filterParams) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetBillSubmissionList);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getBillSubmissionDetailsByBillSubmissionLogId(filterParams) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetBillSubmissionDetailsByBillSubmissionLogId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  getEntireApplicationDetails(filterParams) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetEntireApplicationDetails);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  saveBillSubmissionLogData(filterParams) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveBillSubmissionLogData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
}
