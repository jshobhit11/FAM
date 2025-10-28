import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class GatePassAcknowledgementService extends RestAPIService {
  getGatePassAcknowledgementDataById(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GatePassAcknowledgementById
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      wmMaterialsIndentId?: string;
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
      if (filterParams.wmMaterialsIndentId) {
        queryParams.wmMaterialsIndentId = filterParams.wmMaterialsIndentId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  saveGatePassAcknowledgementData(
    apiKey: string,
    serviceKey: string,
    userCode: string,
    userName: string,
    userRole: string,
    smStoreDispatchedInvoiceId: string,
    wmMaterialsIndentId: string,
    pdfFile: File
  ) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveGatePassAcknowledgement
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      smStoreDispatchedInvoiceId?: string;
      wmMaterialsIndentId?: string;
    } = {};
    queryParams.apiKey = apiKey;
    queryParams.serviceKey = serviceKey;
    queryParams.userCode = userCode;
    queryParams.userName = userName;
    queryParams.userRole = userRole;
    queryParams.smStoreDispatchedInvoiceId = smStoreDispatchedInvoiceId;
    queryParams.wmMaterialsIndentId = wmMaterialsIndentId;

    const formData = new FormData();
    formData.append('gatePassAcknowledgement', pdfFile, pdfFile.name);

    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, formData);
  }

  saveDocumentUploadData(
    apiKey: string,
    serviceKey: string,
    userCode: string,
    userName: string,
    userRole: string,
    documentName: string,
    documentTypeId: string,
    documentReferenceNumber: string,
    pdfFile: File
  ) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.savedocumentUpoload
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      documentName?: string;
      documentTypeId?: string;
      documentReferenceNumber?: string;
    } = {};
    queryParams.apiKey = apiKey;
    queryParams.serviceKey = serviceKey;
    queryParams.userCode = userCode;
    queryParams.userName = userName;
    queryParams.userRole = userRole;
    queryParams.documentName = documentName;
    queryParams.documentTypeId = documentTypeId;
    queryParams.documentReferenceNumber = documentReferenceNumber;
    const formData = new FormData();
    formData.append('documentFile', pdfFile, pdfFile.name);

    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, formData);
  }

  getDataByServiceRegistrationsId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getDetailsByServiceregistion
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationsId?: string;
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
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  documentUploadService(
    apiKey: string,
    serviceKey: string,
    userCode: string,
    userName: string,
    userRole: string,
    documentName: string,
    serviceRegisterationsId: string,
    documentReferenceNumber: string,
    processName:string,
    pdfFile: File
  ) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.documentStoredata
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      documentName?: string;
      serviceRegisterationsId?: string;
      documentReferenceNumber?: string;
      processName?:string;
    } = {};
    queryParams.apiKey = apiKey;
    queryParams.serviceKey = serviceKey;
    queryParams.userCode = userCode;
    queryParams.userName = userName;
    queryParams.userRole = userRole;
    queryParams.documentName = documentName;
    queryParams.serviceRegisterationsId = serviceRegisterationsId;
    queryParams.documentReferenceNumber = documentReferenceNumber;
    queryParams.processName = processName;
    const formData = new FormData();
    formData.append('documentFile', pdfFile, pdfFile.name);
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, formData);
  }

}
