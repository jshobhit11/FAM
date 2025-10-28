import { Injectable } from '@angular/core';
import { ApiEndpoint } from './api-endpoint';
import { RestAPIService } from './rest-api.service';
import { APIUrl, RequestMethod } from './types';
@Injectable({
  providedIn: 'root',
})
export class EstimateService extends RestAPIService {
  getTemplateData(filterParams: any) : Promise<any>{
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetTemplateData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      // templateNo?:string;
      // estimationTemplateName?:string;  
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
      // if (filterParams.workExecutionMethod) {
      //   queryParams.workExecutionMethod = filterParams.workExecutionMethod;
      // }
      // if (filterParams.workCategoryMasterId) {
      //   queryParams.workCategoryMasterId = filterParams.workCategoryMasterId;
      // }
      // if (filterParams.templateNo) {
      //   queryParams.templateNo = filterParams.templateNo;
      // }
      // if (filterParams.estimationTemplateName) {
      //   queryParams.estimationTemplateName = filterParams.estimationTemplateName;
      // }
      // if (filterParams.estimateType) {
      //   queryParams.estimateType = filterParams.estimateType;
      // }
      // if (filterParams.rateType) {
      //   queryParams.rateType = filterParams.rateType;
      // }
      // if (filterParams.officeId) {
      //   queryParams.officeId = filterParams.officeId;
      // }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getWorkExecutionMethodData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.WoExecution);
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

  async getDivisionBudgetData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimationApprovalBudgetService
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;

      accountMainHeadCode?: string;
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
      if (filterParams.accountMainHeadCode) {
        queryParams.accountMainHeadCode = filterParams.accountMainHeadCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByDivisionOfficeIdAccountHeadMasterId(
    filterParams: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DivisionBudgetData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      divisionalOfficeId?: string;
      accountHeadMasterId?: string;
      financialYear?: string;
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
      if (filterParams.divisionalOfficeId) {
        queryParams.divisionalOfficeId = filterParams.divisionalOfficeId;
      }
      if (filterParams.accountHeadMasterId) {
        queryParams.accountHeadMasterId = filterParams.accountHeadMasterId;
      }
      if (filterParams.financialYear) {
        queryParams.financialYear = filterParams.financialYear;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByDivisionOfficeIdAccountHeadMasterIdFY(
    filterParams: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.DivisionBudgetDataFinanceYear
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      divisionalOfficeId?: string;
      accountHeadMasterId?: string;
      financialYear?: string;
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
      if (filterParams.divisionalOfficeId) {
        queryParams.divisionalOfficeId = filterParams.divisionalOfficeId;
      }
      if (filterParams.accountHeadMasterId) {
        queryParams.accountHeadMasterId = filterParams.accountHeadMasterId;
      }
      if (filterParams.financialYear) {
        queryParams.financialYear = filterParams.financialYear;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByDivisionalBudgetId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetDivisionalBudgetById
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async forwardEstimation(filterParams: any, params: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ForwardEstimation
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationId?: string;
      estimationRegisteredId?: string;
      forwardRemarks?: string;
      accountHeadMasterId?: string;
      divisionalBudgetId?: string;
      totalBudgetAmount?: string;
      workOrderIssueAmount?: string;
      balanceAmount?: string;
      forwardingTo?: string;
      isPowerSanctioned?: string;
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
      if (
        filterParams.serviceRegistrationId ||
        filterParams.serviceRegistrationId === ''
      ) {
        queryParams.serviceRegistrationId = filterParams.serviceRegistrationId;
      }
      if (
        filterParams.estimationRegisteredId ||
        filterParams.estimationRegisteredId === ''
      ) {
        queryParams.estimationRegisteredId =
          filterParams.estimationRegisteredId;
      }
      if (filterParams.forwardRemarks || filterParams.forwardRemarks === '') {
        queryParams.forwardRemarks = filterParams.forwardRemarks;
      }
      if (
        filterParams.accountHeadMasterId ||
        filterParams.accountHeadMasterId === ''
      ) {
        queryParams.accountHeadMasterId = filterParams.accountHeadMasterId;
      }
      if (
        filterParams.divisionalBudgetId ||
        filterParams.divisionalBudgetId === ''
      ) {
        queryParams.divisionalBudgetId = filterParams.divisionalBudgetId;
      }
      if (
        filterParams.totalBudgetAmount ||
        filterParams.totalBudgetAmount === 0
      ) {
        queryParams.totalBudgetAmount = filterParams.totalBudgetAmount;
      }
      if (
        filterParams.workOrderIssueAmount ||
        filterParams.workOrderIssueAmount === 0
      ) {
        queryParams.workOrderIssueAmount = filterParams.workOrderIssueAmount;
      }
      if (filterParams.forwardingTo) {
        queryParams.forwardingTo = filterParams.forwardingTo;
      }
      if (
        filterParams.isPowerSanctioned ||
        filterParams.isPowerSanctioned === 0
      ) {
        queryParams.isPowerSanctioned = filterParams.isPowerSanctioned;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, params);
  }

  async approvalEstimation(filterParams: any, params: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApprovalEstimation
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationId?: string;
      estimationRegisteredId?: string;
      approvedRemarks?: string;
      accountHeadMasterId?: string;
      divisionalBudgetId?: string;
      totalBudgetAmount?: string;
      workOrderIssueAmount?: string;
      balanceAmount?: string;
      isPowerSanctioned?: string;
      dcwAmount?:string;
    } = {};
    if (filterParams) {
      if (
        filterParams.isPowerSanctioned ||
        filterParams.isPowerSanctioned === 0
      ) {
        queryParams.isPowerSanctioned = filterParams.isPowerSanctioned;
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
      if (filterParams.serviceRegistrationId) {
        queryParams.serviceRegistrationId = filterParams.serviceRegistrationId;
      }
      if (filterParams.estimationRegisteredId) {
        queryParams.estimationRegisteredId =
          filterParams.estimationRegisteredId;
      }
      if (filterParams.approvedRemarks) {
        queryParams.approvedRemarks = filterParams.approvedRemarks;
      }
      if (filterParams.accountHeadMasterId) {
        queryParams.accountHeadMasterId = filterParams.accountHeadMasterId;
      }
      if (filterParams.divisionalBudgetId) {
        queryParams.divisionalBudgetId = filterParams.divisionalBudgetId;
      }
      if (filterParams.totalBudgetAmount) {
        queryParams.totalBudgetAmount = filterParams.totalBudgetAmount;
      }
      if (
        filterParams.workOrderIssueAmount ||
        filterParams.workOrderIssueAmount === 0
      ) {
        queryParams.workOrderIssueAmount = filterParams.workOrderIssueAmount;
      }
      if (filterParams.balanceAmount) {
        queryParams.balanceAmount = filterParams.balanceAmount;
      }
      if (filterParams.dcwAmount) {
        queryParams.dcwAmount = filterParams.dcwAmount;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, params);
  }

  async sanctionEstimation(filterParams: any, params: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.SanctionEstimation
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, params);
  }

  async approvalForServiceMainEstimates(
    filterParams: any,
    params: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ApprovalForServiceMainEstimates
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, params);
  }

  async revisedEstimationApproval(
    filterParams: any,
    params: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.RevisedEstimationApproval
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, params);
  }
  async revisedEstimationForApproval(filterParams: any, params: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.revisedEstimationsApproval
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, params);
  }
  async returnEstimation(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.ReturnEstimation
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationId?: string;
      estimationRegisteredId?: string;
      returningTo?:string;
      returnRemarks?: string;
      accountHeadMasterId?: string;
      divisionalBudgetId?: string;
      totalBudgetAmount?: string;
      workOrderIssueAmount?: string;
      balanceAmount?: string;
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
      if (filterParams.serviceRegistrationId) {
        queryParams.serviceRegistrationId = filterParams.serviceRegistrationId;
      }
      if (filterParams.estimationRegisteredId) {
        queryParams.estimationRegisteredId =
          filterParams.estimationRegisteredId;
      }
      if (filterParams.returningTo) {
        queryParams.returningTo = filterParams.returningTo;
      }
      if (filterParams.returnRemarks) {
        queryParams.returnRemarks = filterParams.returnRemarks;
      }
      if (filterParams.returningTo) {
        queryParams.returningTo = filterParams.returningTo;
      }
      if (filterParams.accountHeadMasterId) {
        queryParams.accountHeadMasterId = filterParams.accountHeadMasterId;
      }
      if (filterParams.divisionalBudgetId) {
        queryParams.divisionalBudgetId = filterParams.divisionalBudgetId;
      }
      if (filterParams.totalBudgetAmount) {
        queryParams.totalBudgetAmount = filterParams.totalBudgetAmount;
      }
      if (filterParams.workOrderIssueAmount) {
        queryParams.workOrderIssueAmount = filterParams.workOrderIssueAmount;
      }
      if (filterParams.balanceAmount) {
        queryParams.balanceAmount = filterParams.balanceAmount;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getEstimationHistory(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimationHistory
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      estimationNumber?: string;
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
      if (filterParams.estimationNumber) {
        queryParams.estimationNumber = filterParams.estimationNumber;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async estimationRegistrationDetails(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimationRegistrationDetails
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationId?: string;
      estimationRegistrationId?: string;
      isImprovementReport?: string;
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
      if (filterParams.serviceRegistrationId) {
        queryParams.serviceRegistrationId = filterParams.serviceRegistrationId;
      }
      if (filterParams.estimationRegistrationId) {
        queryParams.estimationRegistrationId =
          filterParams.estimationRegistrationId;
      }
      if (filterParams.isImprovementReport) {
        queryParams.isImprovementReport = filterParams.isImprovementReport;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getEstimateTypeMasterData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.EstimateType);
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

  async getWorkDescMasterData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.WorkScopeDesc);
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

  async getMaterialTypeMasterData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialTypeMaster
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      rateType?: string;
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
      if (filterParams.rateType) {
        queryParams.rateType = filterParams.rateType;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getAdditionalChargesMasterData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimationAdditionalCharges
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
      if (filterParams.woExecutionMethodId) {
        queryParams.woExecutionMethodId = filterParams.woExecutionMethodId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMaterialLabourMasterData(filterParams: any): Promise<any> {
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
      materialTypeMasterId?: string;
      mlType?: string;
      rateType?: string;
      workExecutionMethodCode?:string;
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
      if (filterParams.materialTypeMasterId) {
        queryParams.materialTypeMasterId = filterParams.materialTypeMasterId;
      }
      if (filterParams.mlType) {
        queryParams.mlType = filterParams.mlType;
      }
      if (filterParams.rateType) {
        queryParams.rateType = filterParams.rateType;
      }
      if (filterParams.workExecutionMethodCode) {
        queryParams.workExecutionMethodCode = filterParams.workExecutionMethodCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDataByMlTypeAndMaterialTypeMasterId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MlTypeAndMaterialTypeMasterId
    );
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async saveEstimationData(filterParams: any, param: Object): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.EstimationSaveData
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      isEmergencyEstimation?: string;
      isMantenanceEstimation?:string;
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
      if (filterParams.isEmergencyEstimation) {
        queryParams.isEmergencyEstimation = filterParams.isEmergencyEstimation;
      }
      if (filterParams.isMantenanceEstimation) {
        queryParams.isMantenanceEstimation = filterParams.isMantenanceEstimation;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint, param);
  }

  async getTemplateList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.TemplateList);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      workExecutionMethod?: string;
      workCategoryMasterId?:string;
      estimateType?: string;
      rateType?: string;
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
      if (filterParams.workExecutionMethod) {
        queryParams.workExecutionMethod = filterParams.workExecutionMethod;
      }
      if (filterParams.workCategoryMasterId) {
        queryParams.workCategoryMasterId = filterParams.workCategoryMasterId;
      }
      if (filterParams.estimateType) {
        queryParams.estimateType = filterParams.estimateType;
      }
      if (filterParams.rateType) {
        queryParams.rateType = filterParams.rateType;
      }
      if (filterParams.officeId) {
        queryParams.officeId = filterParams.officeId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getMaterialLabourMapping(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.MaterialLabourMapping
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      materialMasterId?: string;
      srMaterialsMasterId?: string;
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
      if (filterParams.srMaterialsMasterId) {
        queryParams.srMaterialsMasterId = filterParams.srMaterialsMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getSpecialLocalityAllowanceDataByOfficeId(
    filterParams: any
  ): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.GetSpecialLocalityAllowanceDataByOfficeId
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
      if (filterParams.officeId) {
        queryParams.officeId = filterParams.officeId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async forwardloadPowerSanction(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.forwardPowerSanctionLELR
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationId?: string;
      forwardRemarks?: string;
      forwardingTo?: string;
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
      if (
        filterParams.serviceRegistrationId ||
        filterParams.serviceRegistrationId === ''
      ) {
        queryParams.serviceRegistrationId = filterParams.serviceRegistrationId;
      }
    
      if (filterParams.forwardRemarks || filterParams.forwardRemarks === '') {
        queryParams.forwardRemarks = filterParams.forwardRemarks;
      }
      if (filterParams.forwardingTo) {
        queryParams.forwardingTo = filterParams.forwardingTo;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  async returnPowerSanction(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.returnPowerSanctionLELR
    );
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationId?: string;
      returningTo?:string;
      returnRemarks?: string;

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
      if (filterParams.serviceRegistrationId) {
        queryParams.serviceRegistrationId = filterParams.serviceRegistrationId;
      }
      if (filterParams.returningTo) {
        queryParams.returningTo = filterParams.returningTo;
      }
      if (filterParams.returnRemarks) {
        queryParams.returnRemarks = filterParams.returnRemarks;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }
  async approvalLoadPowerSanction(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(
      RequestMethod.Post,
      APIUrl.approvalPowerwithoutMtrLELR
    );
    
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

}
