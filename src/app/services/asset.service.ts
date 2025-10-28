import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class AssetService extends RestAPIService {
  getAssetBomListByOfficeId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetAssetBOMDataByOfficeId
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeMasterId?: string;
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
      if (filterParams.officeMasterId) {
        queryParams.officeMasterId = filterParams.officeMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getAssetBomListByWorkOrderRegisteredId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetAssetListData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      wmWorkorderRegisteredId?: string;
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
      if (filterParams.wmWorkorderRegisteredId) {
        queryParams.wmWorkorderRegisteredId =
          filterParams.wmWorkorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  saveAssetBomData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveAssetBOMData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationsId?: string;
      wmWorkorderRegisteredId?: string;
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
      if (filterParams.serviceRegistrationsId) {
        queryParams.serviceRegistrationsId =
          filterParams.serviceRegistrationsId;
      }
      if (filterParams.wmWorkorderRegisteredId) {
        queryParams.wmWorkorderRegisteredId =
          filterParams.wmWorkorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //PC List
  getPcListData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.PcListData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
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
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getPcTestGetDataById(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.PcTestGetDataById
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      ccbServiceRequestId?: string;
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
      if (filterParams.ccbServiceRequestId) {
        queryParams.ccbServiceRequestId = filterParams.ccbServiceRequestId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  savePcTestSaveData(filterParams: any, body: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.PcTestSaveData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  getDocumentUploadSaveData(
    apiKey: string,
    serviceKey: string,
    userCode: string,
    userName: string,
    userRole: string,
    documentName: string,
    documentReferenceNumber: string,
    serviceRegisterationsId: string,
    processName:string,
    pdfFile: File
  ) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DocumentUploadSaveData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      documentName?: string;
      documentReferenceNumber?: string;
      serviceRegisterationsId?: string;
      processName?:string;
    } = {};
    queryParams.apiKey = apiKey;
    queryParams.serviceKey = serviceKey;
    queryParams.userCode = userCode;
    queryParams.userName = userName;
    queryParams.userRole = userRole;
    queryParams.documentName = documentName;
    queryParams.documentReferenceNumber = documentReferenceNumber;
    queryParams.serviceRegisterationsId = serviceRegisterationsId;
    queryParams.processName = processName;
    const formData = new FormData();
    formData.append('documentFile', pdfFile, pdfFile.name);

    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, formData);
  }
  uploadLTPcTestDetails(
    payload: {
      apiKey: string;
      serviceKey: string;
      userCode: string;
      userName: string;
      userRole: string;
      pcTestDate: string;
      serviceRequestNo: string;
      serviceRegistrationsId: string;
      remarks: string;
    },
    pdfFile: File
  ) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.uploadLTPcTestDetails);
  
    const formData = new FormData();
    if (pdfFile) {
      formData.append('multipartFile', pdfFile);
    } else {
      console.error('No file provided!');
    }
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
  
    return this.sendRequest<any>(endpoint, formData);
  }
  uploadHTPcTestDetails(
    payload: {
      apiKey: string;
      serviceKey: string;
      userCode: string;
      userName: string;
      userRole: string;
      serviceRequestNo: string;
      serviceRegistrationsId: string;
      pcTestDate: string;
      remarks: string;
    },
    pdfFile: File
  ) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.uploadHTPcTestDetails);
  
    const formData = new FormData();
    if (pdfFile) {
      formData.append('multipartFile', pdfFile);
    } else {
      console.error('No file provided!');
    }
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
  
    return this.sendRequest<any>(endpoint, formData);
  }
}
