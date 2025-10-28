import { Injectable } from '@angular/core';
import { ApiEndpoint } from './api-endpoint';
import { RestAPIService } from './rest-api.service';
import { APIUrl, RequestMethod } from './types';
@Injectable({
  providedIn: 'root',
})
export class EstimationRegisteredService extends RestAPIService {
  async getEstimationTemplateData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetEstimationTemplateData);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      estimationTemplateMasterId?: string;
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
      if (filterParams.estimationTemplateMasterId) {
        queryParams.estimationTemplateMasterId = filterParams.estimationTemplateMasterId;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }



  async getDetailsForEstimationReport(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.EstimationReport);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      serviceRegistrationId?: string;
      estimationRegisteredId?: string;
      accountId?: string;
      applicationStatusCode?: string;
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
        queryParams.estimationRegisteredId = filterParams.estimationRegisteredId;
      }
      if (filterParams.accountId) {
        queryParams.accountId = filterParams.accountId;
      }
      if (filterParams.applicationStatusCode) {
        queryParams.applicationStatusCode = filterParams.applicationStatusCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDetailsForRevisedEstimation(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDetailsForRevisedEstimation);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDetailsByAccountIdAndStatusCode(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.EstimationDetails);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      accountId?: string;
      applicationStatusCode?: string;
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
      if (filterParams.accountId) {
        queryParams.accountId = filterParams.accountId;
      }
      if (filterParams.applicationStatusCode) {
        queryParams.applicationStatusCode = filterParams.applicationStatusCode;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDetailsByServiceRegistrationsIdAndStatusCode(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDetailsByServiceRegistrationsIdAndStatusCode);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDetailsForImprovementEstimation(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDetailsForImprovementEstimation);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getDetailsForImprovementEstimationReport(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDetailsForImprovementEstimationReport);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async generateImprovementEstimationDetailsReport(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GenerateImprovementEstimationDetailsReport);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async saveTemplateData(filterParams: any, param: Object): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveTemplateData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, param);
  }

  async saveTemplateData2(filterParams: any, param: Object): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.SaveTemplateData2);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, param);
  }

  async getDataByTemplate(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetDataByTemplate);
    const queryParams: {
      serviceKey?: string;
      apiKey?: string;
      userCode?: string;
      userName?: string;
      userRole?: string;
      templateNumber?: string;
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
      if (filterParams.templateNumber) {
        queryParams.templateNumber = filterParams.templateNumber;
      }
    }
    endpoint.addQueryParams(queryParams);
    return this.sendRequest<any>(endpoint);
  }

  async generateEstimation(filterParams: any, data: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GenerateEstimation);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, data);
  }

  async generateServiceLineEstimation(filterParams: any, data: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GenerateServiceLineEstimation);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint, data);
  }

  async revisedEstimatesList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.RevisedEstimatesList);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async revisedEstimatesApprovalList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.RevisedEstimatesApprovalList);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getImprovementEstimatesList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.ImprovementEstimatesList);
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

  async getImprovementEstimatesApprovalList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.ImprovementEstimatesApprovalList);
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

  async getEmergencyEstimationList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetEmergencyEstimationList);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getEmergencyEstimationApprovalList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetEmergencyEstimationApprovalList);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getBmrEstimationApprovalList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.GetBmrEstimationApprovalList);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async getServiceMainMaterialData(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getServiceMainMaterialData);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async getDetailsByServiceIdAndStatusCode(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getDetailsByServiceIdAndStatusCode);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async getDetailsForEstimationReportByServiceId(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getDetailsForEstimationReportByServiceId);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }

  async getQmmtEstimationApprovalList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getQmmtEstimationApprovalList);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
  async getQmomEstimationApprovalList(filterParams: any): Promise<any> {
    const endpoint = new ApiEndpoint(RequestMethod.Post, APIUrl.getQmomEstimationApprovalList);
    endpoint.addQueryParams(filterParams);
    return this.sendRequest<any>(endpoint);
  }
}
