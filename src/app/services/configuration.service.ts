import { Injectable } from '@angular/core';
import { ApiEndpoint } from './api-endpoint';
import { RestAPIService } from './rest-api.service';
import { APIUrl, RequestMethod } from './types';
import {
  materialTypeparams,
  upadateAdditionChargesparams,
  upadateMeterTypeparams,
} from '../models/configuration.model';
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService extends RestAPIService {
  getupdateMeterInfo_DATA(filters: any): any {
    throw new Error('Method not implemented.');
  }
  SaveMeterTypeData(filters: any, reqBody: { materialTypeName: any; materialTypeCode: any; }) {
    throw new Error('Method not implemented.');
  }
  //Material type services
  async getMaterialTypeData(filterParams: materialTypeparams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialTypeData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  
  async getAdditionalChargesData(filterParams: materialTypeparams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AdditionalChargesMAsterData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  async saveAdditionalChargeData(
    filterParams: any,
    body: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.additionalChargesSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  
  async updateAdditionalChargesDATA(
    filterParams: any,
    body: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.additionalChargesUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
 

  async getupdateMaterialInfo_DATA(
    filterParams: upadateMeterTypeparams
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.updateMaterialType
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeCode?: string;
      materialTypeMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.materialTypeMasterId) {
        queryParams.materialTypeMasterId = filterParams.materialTypeMasterId;
      }
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

  

  async getAdditionalChargesDataByID(
    filterParams: upadateAdditionChargesparams
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.updateAdditionalChargesByID
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeCode?: string;
      additionalChargesMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.additionalChargesMasterId) {
        queryParams.additionalChargesMasterId = filterParams.additionalChargesMasterId;
      }
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

  async getUpdateMaterialTypeData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.UpdateMaterialTypeData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      materialTypeMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.materialTypeMasterId) {
        queryParams.materialTypeMasterId = filterParams.materialTypeMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getCreateMaterialTypeData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.CreateMaterialTypeData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Material Unit Master Services
  async getMaterialUnitMaster(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialUnitMaster
    );
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
      if (filterParams.officeCode) {
        queryParams.officeId = filterParams.officeCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMaterialUnitMasterById(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialUnitMasterById
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      materialUnitMasterId?: string;
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
      if (filterParams.materialUnitMasterId) {
        queryParams.materialUnitMasterId = filterParams.materialUnitMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getupdateMaterialUnitById(filterParams: any, body: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.updateMaterialUnitById
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      materialUnitMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.materialUnitMasterId) {
        queryParams.materialUnitMasterId = filterParams.materialUnitMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getSaveMaterialUnitData(filterParams: any, body: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveMaterialUnitData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Material master services

  async getSrMaterialMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SrMaterialMasterAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSrmaterialMasterById(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SrmaterialMasterById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSrmaterialMasterUpdateData(
    filterParams: any,
    body: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SrmaterialMasterUpdateData
    );
    console.log('filterParams===', filterParams + ' ', body);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getSrmaterialMasterSaveData(
    filterParams: any,
    body: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SrmaterialMasterSaveData
    );
    console.log('queryParams======', filterParams + '  ', body);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getSrmaterialMasterGetDataMlType(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SrmaterialMasterGetDataMlType
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getmaterialLabourMasterGetDataMlType(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.materialLabourMasterGetDataMlType
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      mlType?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.mlType) {
        queryParams.mlType = filterParams.mlType;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
    async getDataByMlTypeCredit(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getDataByMlTypeCredit
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      mlType?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.mlType) {
        queryParams.mlType = filterParams.mlType;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  async getSuspenseMeterlistData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getSuspenseMeterlistData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSrMaterialDatabyMaterialTypeMasterId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SrMaterialDatabyMaterialTypeMasterId
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataWithStoreQuantityByStoreCode(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetDataWithStoreQuantityByStoreCode
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByMlTypeAndVendorIdForTotalTurnkey(
    filterParams: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetDataByMlTypeAndVendorIdForTotalTurnkey
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      mlType?: string;
      rateContractMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.mlType) {
        queryParams.mlType = filterParams.mlType;
      }
      if (filterParams.rateContractMasterId) {
        queryParams.rateContractMasterId = filterParams.rateContractMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByMlTypeAndVendorIdForPartialTurnkey(
    filterParams: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetDataByMlTypeAndVendorIdForPartialTurnkey
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      mlType?: string;
      rateContractMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.mlType) {
        queryParams.mlType = filterParams.mlType;
      }
      if (filterParams.rateContractMasterId) {
        queryParams.rateContractMasterId = filterParams.rateContractMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByMaterialTypeAndMlTypeAndRateType(
    filterParams: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetDataByMaterialTypeAndMlTypeAndRateType
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      mlType?: string;
      materialTypeMasterId?: string;
      rateType?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.mlType) {
        queryParams.mlType = filterParams.mlType;
      }
      if (filterParams.rateType) {
        queryParams.rateType = filterParams.rateType;
      }
      if (filterParams.materialTypeMasterId) {
        queryParams.materialTypeMasterId = filterParams.materialTypeMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  //Constituency Master services

  async getconstituencyMasterAllData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.constituencyMasterAllData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getconstituencyMasterById(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.constituencyMasterById
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeId?: string;
      constituencyId?: string;
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
      if (filterParams.constituencyId) {
        queryParams.constituencyId = filterParams.constituencyId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getconstituencyMasterUpdateData(
    filterParams: any,
    body: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.constituencyMasterUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getconstituencyMasterSaveData(
    filterParams: any,
    body: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.constituencyMasterSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getconstituencyMasterGetDataByConstituencyType(
    filterParams: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.constituencyMasterGetDataByConstituencyType
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      constituencyType?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.constituencyType) {
        queryParams.constituencyType = filterParams.constituencyType;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  // Material Additional Charges Services

  async getMaterialAdditionalChargesAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialAdditionalChargesAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMaterialAdditionalChargesById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialAdditionalChargesById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMaterialAdditionalChargesSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialAdditionalChargesSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getMaterialAdditionalChargesUpdate(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialAdditionalChargesUpdate
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getmaterialAddtionalChargeswoExecutionMethodId(
    filterParams: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.materialAddtionalChargeswoExecutionMethodId
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      woExecutionMethodId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.woExecutionMethodId) {
        queryParams.woExecutionMethodId = filterParams.woExecutionMethodId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  //Estimate Type Master
  async getEstimateTypeMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimateTypeMasterAllData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getEstimateTypeMasterDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimateTypeMasterDataById
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeCode?: string;
      estimateTypeMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.estimateTypeMasterId) {
        queryParams.estimateTypeMasterId = filterParams.estimateTypeMasterId;
      }
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

  async getEstimatesTypeMasterUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimatesTypeMasterUpdateData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      estimateTypeMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.estimateTypeMasterId) {
        queryParams.estimateTypeMasterId = filterParams.estimateTypeMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getEstimatesTypeMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimatesTypeMasterSaveData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Network Extension Type Master
  async getNetworkExtensionTypeAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.NetworkExtensionTypeAllData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getNetworkExtensionTypeDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.NetworkExtensionTypeDataById
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeCode?: string;
      networkId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.networkId) {
        queryParams.networkId = filterParams.networkId;
      }
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

  async getNetworkExtensionTypeUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.NetworkExtensionTypeUpdateData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      networkId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.networkId) {
        queryParams.networkId = filterParams.networkId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getNetworkExtensionTypeSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.NetworkExtensionTypeSaveData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Vendor

  async getAllDataVendor(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getAllDataVendor
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSaveDataVendor(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getSaveDataVendor
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getVendorData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getVendorData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      officeCode?: string;
      vendorMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.vendorMasterId) {
        queryParams.vendorMasterId = filterParams.vendorMasterId;
      }
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

  async getVendorUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getUpdateDataVendor
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      vendorMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.vendorMasterId) {
        queryParams.vendorMasterId = filterParams.vendorMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //fetch vendor data by officeId
  async getVendorByOfficeId(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getVendorByOfficeId
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  //Deviation Type Master

  async getDeviationTypeMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.DeviationType);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDeviationTypeMasterDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DeviationGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDeviationTypeMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DeviationTypeAddData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getDeviationTypeMasterUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.DevitionUpdate);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  // Connection Type Master

  async getConnectionTypeMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ConnectionTypeAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getConnectionTypeMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ConnectionTypeAddData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getConnectionTypeDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ConnectionTypeGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getConnectionTypeMasterUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ConnectionTypeUpdate
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Connection Nature Master

  async getConnectionNatureMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.connectionNature
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getConnectionNatureMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.connectionNatureAddData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getConnectionNatureDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.connectionNatureGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getConnectionNatureMasterUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.connectionNatureUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getconnectionNatureDatabyCategoryId(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.connectionNatureDatabyCategoryId
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMainCategoryData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MainCategoryData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  //Workscope Description Master

  async getWorkscopeDesMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.WorkscopeDes);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getWorkscopeDesMasterGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkscopeGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getWorkscopeDesMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkscopeSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getWorkscopeDesMasterUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkscopeUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Application Type Master

  async getApplicationTypeMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicationType
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getApplicationTypeMasterGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicationTypeGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getApplicationTypeMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicationSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getApplicationTypeMasterUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicationUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Applicant Type Master

  async getApplicantTypeMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.ApplicantType);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getApplicantTypeGetDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicantTypeGetDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getApplicantTypeSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicantTypeSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getApplicantTypeUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicantTypeUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Account Head Master

  async getAccountHeadMasterAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.AccountHead);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAccountHeadMasterDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccountHeadDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAccountHeadMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccountHeadSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getAccountHeadUpdate(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccountHeadUpdate
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Asset Category Master

  async getAssetCategoryGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetCategoryGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAssetCategoryGetDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetCategoryGetDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAssetCategorySaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetCategorySaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getAssetCategoryUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetCategoryUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Work Execution Method

  async getWorkExecutionGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkExecutionGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getWorkExecutionGetDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkExecutionGetDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getWorkExecutionSavaData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkExecutionSavaData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getWorkExecutionUpdateDate(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkExecutionUpdateDate
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Employee Master

  async getEmpMasteGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EmpMasteGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getEmpMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EmpMasterSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getEmpMasterGetDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EmpMasterGetDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getEmpMasterUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EmpMasterUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Work Order Series Master

  async getWorkOrdSeriesGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkOrdSeriesGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  
  async getWorkOrderSeriesGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkOrderSeriesGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }


  async getWorkOrdSeriesSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkOrdSeriesSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getWorkOrdSeriesGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkOrdSeriesGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getWorkOrdSeriesUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkOrdSeriesUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Account Head Main Master

  async getAccHeadMainGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccHeadMainGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAccHeadMainSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccHeadMainSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getAccHeadMainGetDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccHeadMainGetDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAccHeadMainUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccHeadMainUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Account Head Submain Master

  async getAccHeadSubmainAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccHeadSubmainAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAccHeadSubmainSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccHeadSubmainSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getAccHeadSubmainGetDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccHeadSubmainGetDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAccHeadSubmainUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AccHeadSubmainUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Asset Category Material Mapping

  async getAssetCatMaterialAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetCatMaterialAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAssetCatMaterialSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetCatMaterialSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getAssetCatMaterialMasterDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetCatMaterialMasterDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAssetCatMaterialUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetCatMaterialUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Work Category Master
  async getWorkCategoryGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkCategoryGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getWorkCategorySaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkCategorySaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getWorkCategoryGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkCategoryGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getWorkCategoryUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.WorkCategoryUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Application Status Master
  async getApplicationStatusAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicationStatusAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getApplicationStatusSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicationStatusSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getApplicationStatusGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicationStatusGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getApplicationStatusUpdate(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApplicationStatusUpdate
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Special Locality Allowance Master
  async getSpecialLocalityGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SpecialLocalityGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSpecialLocalitySaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SpecialLocalitySaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getSpecialLocalityGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SpecialLocalityGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSpecialLocalityUpdate(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SpecialLocalityUpdate
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //store master

  async getStoreMasterGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.StoreMasterGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getStoreMasterSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.StoreMasterSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getStoreMasterGetDatabyMasterId(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.StoreMasterGetDatabyMasterId
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getStoreMasterUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.StoreMasterUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Designation Master
  async getDesignationMasterGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetAllDesignationMasterData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSaveDesignationMasterData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveDesignationMasterData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async DesignationMasterGetDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DesignationMasterGetDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async DesignationMasterGetDataByName(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DesignationMasterGetDataByName
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getUpdateDesignationMasterData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.UpdateDesignationMasterData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  // Material and Labour Mapping
  async getMaterialLabourMappingGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialLabourMappingGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMaterialLabourMappingGetDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialLabourMappingGetDataById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMaterialLabourMappingSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialLabourMappingSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getMaterialLabourMappingUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialLabourMappingUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getMaterialLabourGetDataByMaterialTypeMasterId(
    filterParams,
    body
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialLabourGetDataByMaterialTypeMasterId
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  // Rc Rates

  async getAllDataRcRates(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getAllDataRcRates
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async rcRatesSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.rcMultipleSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getRcRatesData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getRcRatesData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async rcRatesUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.rcRatesUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getRcRateAllNameData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getAllContractData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  // RC Contract Master
  async getAllContractData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getAllContractData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  // getOfficeIdByDiscomCode
  async getOfficeIdByDiscomCode(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.OfficeIdByDiscomCodeData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getSaveData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getDataById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getDataById);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }


  async getUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getUpdateData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  async getAllDiscomData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getAllDiscomData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  //Delegation of Power Master
  async getDelegationPowerMasterGetAll(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DelegationPowerMasterGetAll
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDelegationPowerMasterGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DelegationPowerMasterGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDelegationPowerMasterSave(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DelegationPowerMasterSave
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getDelegationWorkCategory(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DelegationWorkCategory
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDelegationWorkExecution(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DelegationWorkExecution
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getCategory(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.Category);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDelegationPowerMasterUpdate(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DelegationPowerMasterUpdate
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  //SR/RC Rate

  GetUploadMaterialData(filterParams: any, body: FormData) {
    // const UploadMaterialData = 'http://10.1.45.2:8080/api/materialsLabourMaster/saveMaterialsLabourDataFromXLS';
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.UploadMaterialData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getExcelsheetData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Get,
      APIUrl.getExcelsheetData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      rateType?: string;
      rateContractMasterId?: string;
    } = {};
    if (filterParams) {
      if (filterParams.apiKey) {
        queryParams.apiKey = filterParams.apiKey;
      }
      if (filterParams.serviceKey) {
        queryParams.serviceKey = filterParams.serviceKey;
      }
      if (filterParams.userName) {
        queryParams.userName = filterParams.userName;
      }
      if (filterParams.userCode) {
        queryParams.userCode = filterParams.userCode;
      }
      if (filterParams.userRole) {
        queryParams.userRole = filterParams.userRole;
      }
      if (filterParams.rateType) {
        queryParams.rateType = filterParams.rateType;
      }
      if (filterParams.rateContractMasterId) {
        queryParams.rateContractMasterId = filterParams.rateContractMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  //Process Type Master
  async getprocessTypeGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.processTypeGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getprocessTypeSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.processTypeSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getprocessTypeGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.processTypeGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getprocessTypeUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.processTypeUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Application Status Process Mapping
  async getappStatusProMapGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.appStatusProMapGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getappStatusProMapSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.appStatusProMapSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getappStatusProMapGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.appStatusProMapGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getappStatusProMapUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.appStatusProMapUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //Finanacial Year Master
  async getfinanacialYearGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.finanacialYearGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getfinancialYearSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.financialYearSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getfinancialYearGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.financialYearGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getfinancialYearUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.financialYearUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  //District Master and Office Master
  async getdistrictMasterData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.districtMasterData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getofficeMasterData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.officeMasterData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  //Material Labour Master
  async getMaterialLabourMasterData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialLabourMasterData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  //Store Adjust Reason Master
  async getStoreReasonGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.storeReasonGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getStoreReasonSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.storeReasonSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getStoreReasonGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.storeReasonGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getStoreReasonUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.storeReasonUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  /// Maintenance Master ALL API  ///

  // MAINTENANCE SCHEDULER
  async getMaintenaceSchudulerGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.maintenaceSchudulerGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAllMaintenanceFrequencyMaster(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getMaintenanceFrequencyMaster
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMaintenaceSchudulerGetByID(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getMaintenaceSchudulerGetByID
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAllMaintenanceChecklistMaster(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.getMaintenanceChecklistMaster
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async saveMaintenanceData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.saveMaintenaceSchedulerData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async updateMaintenanceData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.updateMaintenanceSchedularData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getAllMaintenanceAssetType(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaintenanceAssetType
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  // Maintenance Asset Type Master
  async getAssetTypeGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetTypeGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAssetTypeSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetTypeSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getAssetTypeGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetTypeGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAssetTypeUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AssetTypeUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  // maintenace frequency type

  async getmaintenanceFrequencyGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.frequencyTypeGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async getsaveMaintenanceFrequencyData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.frequncyTypeSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }
  async getmaintenanceFrequencyGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.frequencyTypeGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getmaintenanceFrequencyUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.frequencyTypeUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  // Area Specific Loader Master
  async getAreaSpecificLoaderGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AreaSpecificLoaderGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAreaSpecificLoaderSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AreaSpecificLoaderSaveData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getAreaSpecificLoaderGetById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AreaSpecificLoaderGetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAreaSpecificLoaderUpdateData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AreaSpecificLoaderUpdateData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  // Additional Charges Master
  async getAdditionalChargesGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.AdditionalChargesGetAllData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

// Meter Type Master

  async getMeterTypeMasterGetAllData(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MeterTypeData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMeterTypeSaveData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SaveMeterTypeData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

  async getMeterTypeMasterById(filterParams): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MeterTypeMasterById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }


  async getUpdateMeterTypeData(filterParams, body): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.UpdateMeterTypeData
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, body);
  }

// Role resource mapping master

async getRoleResourceTypegetallData(filterParams): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.RoleResourceTypeData
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}

async getRoleResourceTypeSaveData(filterParams, body): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.SaveRoleResourceTypeData
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint, body);
}

async getdesignationMastergetallData(filterParams): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.designationMasterGetAllData
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}

async getRoleResourceMasterById(filterParams): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.RoleResourceTypeMasterById
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}


async getUpdateRoleResourceTypeData(filterParams, body): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.UpdateRoleResourceTypeData
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint, body);
}

UpdateRoleResourceMappingMasterComponent(filterData, body): any {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.RoleResourceTypeMasterById
  );
  endpoint.addQueryParams(filterData);
  return this.sendRequest<any>(endpoint, body);
}

async getSRMaterialsData(filterParams): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.SrMaterialsData
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}
async getAdditionalDataByRateType(filterParams: any): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.GetDataOfNDSmaterial
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}
async getDataByMlTypeForSmartMeter(filterParams: any): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.getDataByMlTypeForSmartMeter
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}
async getDataByMlTypeAndVendorIdForTotalTurnkeySmartMeterCase(filterParams: any): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.getDataByMlTypeAndVendorIdForTotalTurnkeySmartMeterCase
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}
async getDataByMlTypeAndVendorIdForPartialTurnkeySmartMeterCase(filterParams: any): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.getDataByMlTypeAndVendorIdForPartialTurnkeySmartMeterCase
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}
async getDataByNdsRateTypeForSmartMeter(filterParams: any): Promise<any> {
  const endpoint = new ApiEndpoint(
    RequestMethod.Post,
    APIUrl.getDataByNdsRateTypeForSmartMeter
  );
  endpoint.addQueryParams(filterParams);
  return this.sendRequest<any>(endpoint);
}
}
