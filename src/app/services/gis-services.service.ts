import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class GisServicesService extends RestAPIService {
  gettappingDetailsData(parms: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GISTappingDetails,
      new Map(), 
      true
    );
    return this.sendRequest<any>(endpoint, parms);
  }

  getwithoutAccountTappingDetails(parms: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.withOutAccountTappingDetails,
      new Map(),
      true 
    );
    return this.sendRequest<any>(endpoint, parms);
  }

  getSaveGisViewData(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GISSavedTappingDetails,
      new Map(),
      true 
    );
    const queryParams: { referenceCode?: string } = {};
    if (filterParams && filterParams.referenceCode) {
      queryParams.referenceCode = filterParams.referenceCode;
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getFeasibilityDetailsData(gisParam) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GISFeasibilityDetails,
      new Map(),
      true 
    );
    return this.sendRequest<any>(endpoint, gisParam);
  }

  getSaveFeasibilityGisViewData(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GISUpdatedFeasibility,
      new Map(),
      true 
    );
    const queryParams: { referenceNumber?: string } = {};
    if (filterParams && filterParams.referenceNumber) {
      queryParams.referenceNumber = filterParams.referenceNumber;
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
}
