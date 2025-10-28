import { Injectable } from '@angular/core';
import { APIUrl, RequestMethod } from './types';
import { RestAPIService } from './rest-api.service';
import { ApiEndpoint } from './api-endpoint';
@Injectable({
  providedIn: 'root',
})
export class MaterialInvoiceService extends RestAPIService {
  getMaterialInvoiceDataByOfficeId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetMaterialInvoiceDataByOfficeId
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

  getMaterialInvoiceByMaterialIndentId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetMaterialInvoiceByMaterialIndentId
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

  getSerializeMaterialsByMaterialMasterIdAndStoreOfficeId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetSerializeMaterialsByMaterialMasterIdAndStoreOfficeId
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      materialMasterId?: string;
      storeMasterId?: string;
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
      if (filterParams.materialMasterId) {
        queryParams.materialMasterId = filterParams.materialMasterId;
      }
      if (filterParams.storeMasterId) {
        queryParams.storeMasterId = filterParams.storeMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  getSerializeMaterialsByMaterialMasterIdAndStoreOfficeIdUsed(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetSerializeMaterialsByMaterialMasterIdAndStoreOfficeIdUsed
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      materialMasterId?: string;
      storeMasterId?: string;
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
      if (filterParams.materialMasterId) {
        queryParams.materialMasterId = filterParams.materialMasterId;
      }
      if (filterParams.storeMasterId) {
        queryParams.storeMasterId = filterParams.storeMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  saveDataMaterialsInvoice(filterParams: any, params: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveMaterialInvoice
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      workscopeDescCode?:string;
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
      if (filterParams.workscopeDescCode) {
        queryParams.workscopeDescCode = filterParams.workscopeDescCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, params);
  }

  getMaterialInvoiceReport(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetMaterialInvoiceReport
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
  getMaterialReturnDataByOfficeId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getMaterialReturnDataByOfficeId
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

  getMaterialSuspenseStoreDataById(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getMaterialSuspenseStoreDataById
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

  getMaterialSuspenseInvoiceReport(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetMaterialInvoiceSuspenseReport
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
  getMaterialSuspenseByMaterialIndentId(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetMaterialSuspenseByMaterialId
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
  // getMaterialSuspenseAcknowledgementByMaterialIndentId(filterParams: any) {
  //   const endpoint = new ApiEndpoint(
  //     RequestMethod.Post,
  //     APIUrl.GetMateralSuspenseAcknowledgement
  //   );
  //   const queryParams: {
  //     serviceKey?: string;
  //     apiKey?: string;
  //     userCode?: string;
  //     userName?: string;
  //     userRole?: string;
  //     wmMaterialsIndentId?: string;
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
  //     if (filterParams.wmMaterialsIndentId) {
  //       queryParams.wmMaterialsIndentId = filterParams.wmMaterialsIndentId;
  //     }
  //   }
  //   endpoint.addQueryParams(queryParams);
  //   return this.sendRequest<any>(endpoint);
  // }
  saveDataMaterialsAcknowledgement(filterParams: any, params: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveMaterialAcknowledgement
    );
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
    return this.sendRequest<any>(endpoint, params);
  }
  getAssignedMaterialForMaterialAcknowledgement(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getAssignedMaterialForMaterialAcknowledgement
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      materialMasterId?: string;
      storeMasterId?: string;
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
      if (filterParams.materialMasterId) {
        queryParams.materialMasterId = filterParams.materialMasterId;
      }
      if (filterParams.storeMasterId) {
        queryParams.storeMasterId = filterParams.storeMasterId;
      }
      if (filterParams.wmWorkorderRegisteredId){
        queryParams.wmWorkorderRegisteredId = filterParams.wmWorkorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  getInstalledMaterialForMaterialAcknowledgement(filterParams: any) {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getInstalledMaterialForMaterialAcknowledgement
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      materialMasterId?: string;
      wmWorkorderRegisteredId?:string;
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
      if (filterParams.materialMasterId) {
        queryParams.materialMasterId = filterParams.materialMasterId;
      }
      if (filterParams.wmWorkorderRegisteredId){
        queryParams.wmWorkorderRegisteredId = filterParams.wmWorkorderRegisteredId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
}
