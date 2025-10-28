import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UploadMaterialService extends RestAPIService {
  getUploadMaterialStoreData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetUploadMaterialStoreData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
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
      if (filterParams.officeId) {
        queryParams.officeId = filterParams.officeId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  GetMeterUploadDataByWmWorkorderRegisteredId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getMeterUploadDataByWmWorkorderRegisteredId);
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
        queryParams.wmWorkorderRegisteredId = filterParams.wmWorkorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  // saveUploadMaterial(filterParams: any, body: FormData) {
  //   const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.saveUploadMaterialData);
  //   const queryParams: {
  //     serviceKey?: string;
  //     apiKey?: string;
  //     userCode?: string;
  //     userName?: string;
  //     userRole?: string;
  //     storeOfficeId?: string;
  //     storeCode?: string;
  //     remarks?: string;
  //     docType?: string;
  //   } = {};
  //   if (filterParams) {
  //     if (filterParams.userName) {
  //       queryParams.userName = filterParams.userName;
  //     }
  //     if (filterParams.userCode) {
  //       queryParams.userCode = filterParams.userCode;
  //     }
  //     if (filterParams.userRole) {
  //       queryParams.userRole = filterParams.userRole;
  //     }
  //     if (filterParams.apiKey) {
  //       queryParams.apiKey = filterParams.apiKey;
  //     }
  //     if (filterParams.serviceKey) {
  //       queryParams.serviceKey = filterParams.serviceKey;
  //     }
  //     if (filterParams.storeOfficeId) {
  //       queryParams.storeOfficeId = filterParams.storeOfficeId;
  //     }
  //     if (filterParams.storeCode) {
  //       queryParams.storeCode = filterParams.storeCode;
  //     }
  //     if (filterParams.remarks) {
  //       queryParams.remarks = filterParams.remarks;
  //     }
  //     if (filterParams.docType) {
  //       queryParams.docType = filterParams.docType;
  //     }
  //   }
  //   endpoint.addQueryParams(queryParams);
  //   return this.sendRequest<any>(endpoint, body);
  // }

  saveUploadMaterial(filterParams: any, body: FormData): Observable<HttpResponse<any>> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.saveUploadMaterialData);
  
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      storeOfficeId?: string;
      storeCode?: string;
      remarks?: string;
      docType?: string;
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
      if (filterParams.storeOfficeId) {
        queryParams.storeOfficeId = filterParams.storeOfficeId;
      }
      if (filterParams.storeCode) {
        queryParams.storeCode = filterParams.storeCode;
      }
      if (filterParams.remarks) {
        queryParams.remarks = filterParams.remarks;
      }
      if (filterParams.docType) {
        queryParams.docType = filterParams.docType;
      }
    }
    // Add the query parameters to the endpoint
    endpoint.addQueryParams(queryParams);
  
    // Use HttpClient to send the request with the responseType set to 'blob' for file download
    return this.sendRequestBlob<any>(endpoint, body, {
      responseType: 'blob', 
      observe: 'response' // Ensure we get the full HttpResponse, including headers
    });
  }

  getUploadMaterialApprovalDataByOfficeId(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetUploadMaterialApprovalData);
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

  getUploadInventoryFileData(filterParams: any) {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetExcptionLogReport);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      portingStartDate?: string;
      portingEndDate?: string;
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
      if (filterParams.portingStartDate) {
        queryParams.portingStartDate = filterParams.portingStartDate;
      }
      if (filterParams.portingEndDate) {
        queryParams.portingEndDate = filterParams.portingEndDate;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  
// saveMeterUpload(filterParams: any, body: FormData) {
//   const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.MeterUploadSave);
//   const queryParams: {
//     serviceKey?: string;
//     apiKey?: string;
//     userCode?: string;
//     userName?: string;
//     userRole?: string;
//     wmWorkorderRegisteredId?:string;
//   } = {};
//   if (filterParams) {
//     if (filterParams.userName) {
//       queryParams.userName = filterParams.userName;
//     }
//     if (filterParams.userCode) {
//       queryParams.userCode = filterParams.userCode;
//     }
//     if (filterParams.userRole) {
//       queryParams.userRole = filterParams.userRole;
//     }
//     if (filterParams.apiKey) {
//       queryParams.apiKey = filterParams.apiKey;
//     }
//     if (filterParams.serviceKey) {
//       queryParams.serviceKey = filterParams.serviceKey;
//     }
//     if (filterParams.wmWorkorderRegisteredId) {
//       queryParams.wmWorkorderRegisteredId = filterParams.wmWorkorderRegisteredId;
//     }
//     // if (filterParams.storeCode) {
//     //   queryParams.storeCode = filterParams.storeCode;
//     // }
//     // if (filterParams.remarks) {
//     //   queryParams.remarks = filterParams.remarks;
//     // }
//     // if (filterParams.docType) {
//     //   queryParams.docType = filterParams.docType;
//     // }
//   }
//   endpoint.addQueryParams(queryParams);
//   return this.sendRequest<any>(endpoint, body);
// }

saveMeterUpload(filterParams: any, body: FormData): Observable<HttpResponse<any>> {
  const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.MeterUploadSave);

  // Prepare query parameters from filterParams
  const queryParams: {
    serviceKey?: string;
    apiKey?: string;
    userCode?: string;
    userName?: string;
    userRole?: string;
    wmWorkorderRegisteredId?: string;
  } = {};

  // Populate queryParams with the filterParams
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
      queryParams.wmWorkorderRegisteredId = filterParams.wmWorkorderRegisteredId;
    }
  }

  // Add the query parameters to the endpoint
  endpoint.addQueryParams(queryParams);

  // Use HttpClient to send the request with the responseType set to 'blob' for file download
  return this.sendRequestBlob<any>(endpoint, body, {
    responseType: 'blob', 
    observe: 'response' // Ensure we get the full HttpResponse, including headers
  });
}



docUpload(
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
    APIUrl.uploadDocSample
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


// saveTransformerUpload(filterParams: any, body: FormData) {
//   const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.transformerUpload);
//   const queryParams: {
//     serviceKey?: string;
//     apiKey?: string;
//     userCode?: string;
//     userName?: string;
//     userRole?: string;
//   } = {};
//   if (filterParams) {
//     if (filterParams.userName) {
//       queryParams.userName = filterParams.userName;
//     }
//     if (filterParams.userCode) {
//       queryParams.userCode = filterParams.userCode;
//     }
//     if (filterParams.userRole) {
//       queryParams.userRole = filterParams.userRole;
//     }
//     if (filterParams.apiKey) {
//       queryParams.apiKey = filterParams.apiKey;
//     }
//     if (filterParams.serviceKey) {
//       queryParams.serviceKey = filterParams.serviceKey;
//     }
//   }
//   endpoint.addQueryParams(queryParams);
//   return this.sendRequest1<any>(endpoint, body);
// }
// saveMeterByWorkOrderUpload(filterParams: any, body: FormData): Promise<any> {
//   const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.meterSaveByWorkOrder);
//   const queryParams: {
//     serviceKey?: string;
//     apiKey?: string;
//     userCode?: string;
//     userName?: string;
//     userRole?: string;
//   } = {};
//   if (filterParams) {
//     if (filterParams.userName) {
//       queryParams.userName = filterParams.userName;
//     }
//     if (filterParams.userCode) {
//       queryParams.userCode = filterParams.userCode;
//     }
//     if (filterParams.userRole) {
//       queryParams.userRole = filterParams.userRole;
//     }
//     if (filterParams.apiKey) {
//       queryParams.apiKey = filterParams.apiKey;
//     }
//     if (filterParams.serviceKey) {
//       queryParams.serviceKey = filterParams.serviceKey;
//     }
//   }
//   endpoint.addQueryParams(queryParams);
//   return this.sendRequest1<any>(endpoint, body);
// }
saveTransformerUpload(filterParams: any, body: FormData): Observable<HttpResponse<any>> {
  const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.transformerUpload);

  // Prepare query parameters from filterParams
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
  // Add the query parameters to the endpoint
  endpoint.addQueryParams(queryParams);

  // Use HttpClient to send the request with the responseType set to 'blob' for file download
  return this.sendRequestBlob<any>(endpoint, body, {
    responseType: 'blob', 
    observe: 'response' // Ensure we get the full HttpResponse, including headers
  });
}

saveMeterByWorkOrderUpload(filterParams: any, body: FormData): Observable<HttpResponse<any>> {
  const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.meterSaveByWorkOrder);

  // Prepare query parameters from filterParams
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
  // Add the query parameters to the endpoint
  endpoint.addQueryParams(queryParams);

  // Use HttpClient to send the request with the responseType set to 'blob' for file download
  return this.sendRequestBlob<any>(endpoint, body, {
    responseType: 'blob', 
    observe: 'response' // Ensure we get the full HttpResponse, including headers
  });
}


updateUploadMeterDataForJVS(filterParams: any, body:any) {
  const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.updateUploadMeterDataForJVS);
  const queryParams: {
    serviceKey?: string;
    apiKey?: string;
    userCode?: string;
    userName?: string;
    userRole?: string;
    wmWorkorderRegisteredId?:string;
    workOrderNo?:string;
    accountId?:string;
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
      queryParams.wmWorkorderRegisteredId = filterParams.wmWorkorderRegisteredId;
    }
    if (filterParams.workOrderNo) {
      queryParams.workOrderNo = filterParams.workOrderNo;
    }
    if (filterParams.accountId) {
      queryParams.accountId = filterParams.accountId;
    }
  }
  endpoint.addQueryParams(queryParams);
  return this.sendRequest<any>(endpoint, body);
}

getFieldReport(filterParams: any) {
  const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.fieldReportData);
  const queryParams: {
    serviceKey?: string;
    apiKey?: string;
    userCode?: string;
    userName?: string;
    userRole?: string;
    serviceRegistrationsId?:string;
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
      queryParams.serviceRegistrationsId = filterParams.serviceRegistrationsId;
    }
  }
  endpoint.addQueryParams(queryParams);
  return this.sendRequest<any>(endpoint);
}

}

