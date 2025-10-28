import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class AlternateMaterialService extends RestAPIService {
  getAlternateMaterialRateAndMaterialBymaterialMasterId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.AlternateMaterialRateAndMaterialBymaterialMasterId);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      mlRate?: string;
      storeInventoryId?:string;
      materialTypeMasterId?:string;
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
      if (filterParams.mlRate) {
        queryParams.mlRate = filterParams.mlRate;
      }
      if (filterParams.storeInventoryId) {
        queryParams.storeInventoryId = filterParams.storeInventoryId;
      }
      if (filterParams.materialTypeMasterId) {
        queryParams.materialTypeMasterId = filterParams.materialTypeMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  getStoreInventoryDataForAlternateMaterials(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.StoreInventoryDataForAlternateMaterials);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      storeInventoryId?: string;
      materialMasterId?:string;
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
      if (filterParams.storeInventoryId) {
        queryParams.storeInventoryId = filterParams.storeInventoryId;
      }
      if (filterParams.materialMasterId) {
        queryParams.materialMasterId = filterParams.materialMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  saveAlternateMaterial(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.saveAlternateMaterial);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      wmMaterialsIndentTransLogId?: string;
      alternateMaterialMasterId?:string;
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
      if (filterParams.wmMaterialsIndentTransLogId) {
        queryParams.wmMaterialsIndentTransLogId = filterParams.wmMaterialsIndentTransLogId;
      }
      if (filterParams.alternateMaterialMasterId) {
        queryParams.alternateMaterialMasterId = filterParams.alternateMaterialMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }
}
