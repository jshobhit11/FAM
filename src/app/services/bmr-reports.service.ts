import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class BmrReportsService  extends RestAPIService {
  async officeMasterIDSelectbox(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.BMROfficeMasterIDSelectbox);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async officeMasterIDSelectboxForErrorreport(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.BMROfficeMasterIDSelectboxForErrorReportpdf);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async officeMasterIDSelectboxForErrorreportxls(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.BMROfficeMasterIDSelectboxForErrorReportxls);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async pctestReportpdf(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.PCTestReportpdf);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async storeCodeSelectBoxreport(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.PendingSuspenceMeterReportpdf);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async storeCodeSelectBoxreportXLS(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Get, APIUrl.PendingSuspenceMeterReportxls);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }


}

