import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimationRegisteredService } from 'src/app/services/estimationRegistered';
import { EstimateService } from 'src/app/services/estimate.service';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-revised-estimation-report',
  templateUrl: './revised-estimation-report.component.html',
  styleUrls: ['./revised-estimation-report.component.scss'],
})
export class RevisedEstimationReportComponent implements OnInit {
  workCategoryName: string = '';
  sh: number = 1;
  estimationRegistrationId: string = '';
  serviceRegistrationId: string = '';
  orginalEstimationRegisteredId: string = '';
  data: any = {};
  isChecked: boolean;
  toggleTable: boolean = true;
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  globalArray: any[] = [];
  regularArray: any[] = [];
  creditArray: any[] = [];
  grandTotal: any;
  labourDetails: any = [];
  blob: any;
  divisionalBudgetData: any = {};
  forwardData: any = {};
  creditAccountHeadData: any[] = [];
  estimateTypeMasterData: any[] = [];
  balanceAmount: number = 0;
  workExecutionData: any[] = [];
  apiUrl =environment.baseURL;
  constructor(
    private route: ActivatedRoute,
    private estimationReport: EstimationRegisteredService,
    private estimateService: EstimateService,
    private router: Router,
    private http: HttpClient,
    private configurationService: ConfigurationService,
    private loader :LoaderService
  ) {}

  toggleDisplayTableIf() {
    this.toggleTable = !this.toggleTable;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.loader.show('Data Loading...');
      const estimationRegistrationId = params.get('estimationId');
      const serviceRegistrationId = params.get('registrationId');
      this.estimationRegistrationId = estimationRegistrationId;
      this.serviceRegistrationId = serviceRegistrationId;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        estimationRegistrationId,
        serviceRegistrationId,
      };
      const workFilters: any = { apiKey, serviceKey, userRole, userName, userCode };
      this.data = await this.estimateService.estimationRegistrationDetails(filter);
      this.workExecutionData = await this.estimateService.getWorkExecutionMethodData(filter);
      this.estimateTypeMasterData = await this.estimateService.getEstimateTypeMasterData(filter);
      this.balanceAmount = Number(
        Number(
          this.data?.estimationRegisteredDTO[0]?.totalBudgetAmount -
            (this.data?.estimationRegisteredDTO[0]?.workOrderIssueAmount +
              Number(this.data?.estimationRegisteredDTO[0]?.totalReserveAmount)),
        ).toFixed(2),
      );
      console.log(this.data);
      const accountHeadFilter: any = { apiKey, serviceKey, userRole, userName, userCode };
      this.creditAccountHeadData = await this.configurationService.getAccountHeadMasterAllData(accountHeadFilter);
      const {
        estimationWorkScopeDataDTO,
        estimationMaterailsRegisteredDTOList,
        estimationMaterialLabourDetailsDTOList,
        estimationRegisteredDTO,
      } = this.data;
      if (estimationWorkScopeDataDTO) {
        estimationWorkScopeDataDTO?.forEach((estimate: any) => {
          const a = estimationMaterailsRegisteredDTOList.filter(
            (e: any) => e.estimationWorkScopeDataId === estimate.estTemplateWorkScopeMasterId,
          );
          this.globalArray.push({ estimate, data: a });
          this.regularArray = this.globalArray.filter(
            (v) => v.estimate.estimateType == this.estimateTypeMasterData.find((e) => e.estimateTypeCode === 'RGL')?.estimateTypeMasterId,
          );
          const cArr = this.globalArray.filter(
            (v) => v.estimate.estimateType == this.estimateTypeMasterData.find((e) => e.estimateTypeCode === 'CRD')?.estimateTypeMasterId,
          );
          cArr.forEach((v) => {
            this.creditArray.push({
              data: v.data,
              estimate: {
                estTemplateWorkScopeMasterId: v.estimate.estTemplateWorkScopeMasterId,
                workType: v.estimate.workType,
                workPart: v.estimate.workPart,
                workscopeDescription: v.estimate.workscopeDescription,
                materialCost: v.estimate.materialCost,
                labourCost: v.estimate.labourCost,
                estimateType: v.estimate.estimateType,
                accountHeadMasterId: v.estimate.accountHeadMasterId,
                accountMainHeadDescription: v.estimate.accountMainHeadDescription,
                accountMainHeadCode: v.estimate.accountMainHeadCode,
                isSelectAccountHead: v.estimate.accountHeadMasterId == 'null' ? true : false,
              },
            });
          });
          console.log(this.globalArray, this.regularArray, this.creditArray);
        });
      }
      if (estimationRegisteredDTO && estimationRegisteredDTO.length) {
        this.orginalEstimationRegisteredId = estimationRegisteredDTO[0]?.orginalEstimationRegisteredId;
        if (estimationRegisteredDTO[0].workCategoryMasterId) {
          const workCategoryData = await this.configurationService.getWorkCategoryGetAllData(workFilters);
          this.workCategoryName = workCategoryData.find(
            (v: any) => v.workCategoryMasterId == estimationRegisteredDTO[0]?.workCategoryMasterId,
          )?.workCategoryName;
        }
      }

      this.grandTotal = 0;
      let total = 0;
      this.data.estimationAddlChargesRegisteredDTOList.forEach((estimate: any) => {
        estimate.amount = parseInt(estimate.amount).toFixed();
        total += parseInt(estimate.amount);
      });
      this.addChargesBeforeTotalLabour = this.data.estimationAddlChargesRegisteredDTOList.filter(
        (v: any) => Number(v.chargesSequenceOrder) < 5,
      );
      this.addChargesAfterTotalLabour = this.data.estimationAddlChargesRegisteredDTOList.filter(
        (v: any) => Number(v.chargesSequenceOrder) >= 5,
      );
      this.grandTotal = total;
      estimationMaterialLabourDetailsDTOList.forEach((estimate: any) => {
        const obj = {
          estimationWorkScopeDataId: estimate.estimationWorkScopeDataId,
          labourMasterId: estimate.labourMasterId,
          labourName: estimate.labourName,
          labourRate: parseInt(estimate.labourRate),
          labourUnit: estimate.labourUnit,
          materialName: estimate.materialName,
          materialsMasterId: estimate.materialsMasterId,
          quantity: parseInt(estimate.quantity) || 0,
        };
        this.labourDetails.push(obj);
      });
     this.loader.hide();
    });
  }

  getWorkExecutionName(id: any) {
    return this.workExecutionData.find((v) => v.woExecutionMethodId == id)?.woExecutionMethodName;
  }

  getAccountHeadDetails(id: any): string {
    if (this.creditAccountHeadData.length) {
      const accountHead = this.creditAccountHeadData.find((v: any) => Number(v.accountHeadMasterId) === Number(id));
      return accountHead;
    }
  }

  printPageArea(areaID: any) {
    var printContent = document.getElementById(areaID).innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }

  async generateReviseEstimateReport() {
    this.getPdf('revise').subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Revise Estimation Report' + '.pdf';
      if (typeof cordova !== 'undefined') {
        MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob);
      } else {
        link.click();
      }
    });
  }

  async generateOriginalEstimateReport() {
    this.getPdf('original').subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Original Estimation Report' + '.pdf';
      if (typeof cordova !== 'undefined') {
        MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob);
      } else {
        link.click();
      }
    });
  }

  getPdf(type: string) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const serviceRegistrationId = this.serviceRegistrationId;
    const estimationRegistrationId = this.estimationRegistrationId;
    if (type === 'revise') {
      return this.http.get(
        `${this.apiUrl}/api/estimationRegistered/generateRevisedEstimationDetailsReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
    if (type === 'original') {
      return this.http.get(
        `${this.apiUrl}/api/estimationRegistered/generateEstimationDetailsReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${this.orginalEstimationRegisteredId}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
  }
}
