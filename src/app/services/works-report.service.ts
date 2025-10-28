import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class WorksReportService extends RestAPIService {
  async getAssetUIDSelectbox(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.AssetUIDSelectbox);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
}
