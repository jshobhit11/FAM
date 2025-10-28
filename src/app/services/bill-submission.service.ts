import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class BillSubmissionService extends RestAPIService {
  getBillSubmissionDataByOfficeMasterId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetBillSubmissionData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  GetByWorkOrderRegisterId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.billSubmissionGetbyId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  saveWorkCompletionData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveBillSubmission);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
}
