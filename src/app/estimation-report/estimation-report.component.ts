import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimationRegisteredService } from '../services/estimationRegistered';
import { EstimateService } from '../services/estimate.service';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../services/configuration.service';
import { environment } from 'src/environments/environment';
import { MobileUtils } from '../lib/mobile-utils';
@Component({
  selector: 'app-estimation-report',
  templateUrl: './estimation-report.component.html',
  styleUrls: ['./estimation-report.component.scss'],
})
export class EstimationReportComponent implements OnInit {
  workCategoryName: string = '';
  sh: number = 1;
  estimationRegistrationId: string = '';
  serviceRegistrationId: string = '';
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
  showButton: boolean;
  applicationTypeCode: any;
  constructor(
    private route: ActivatedRoute,
    private estimationReport: EstimationRegisteredService,
    private estimateService: EstimateService,
    private router: Router,
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {}

  toggleDisplayTableIf() {
    this.toggleTable = !this.toggleTable;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const estimationRegistrationId = params.get('estimationId');
      const serviceRegistrationId = params.get('registrationId');
      this.estimationRegistrationId = estimationRegistrationId;
      this.serviceRegistrationId = serviceRegistrationId;
      const type = this.route.snapshot.queryParamMap.get('type');
      this.showButton = type === 'GE' || type === 'RG';      
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, estimationRegistrationId, serviceRegistrationId };
      const workFilters: any = { apiKey, serviceKey, userRole, userName, userCode };
      this.data = await this.estimateService.estimationRegistrationDetails(filter);
      this.workExecutionData = await this.estimateService.getWorkExecutionMethodData(filter);
      console.log(this.data);
      this.balanceAmount = Number(
        Number(
          this.data?.estimationRegisteredDTO[0]?.totalBudgetAmount -
            (this.data?.estimationRegisteredDTO[0]?.workOrderIssueAmount +
              Number(this.data?.estimationRegisteredDTO[0]?.totalReserveAmount)),
        ).toFixed(2),
      );
      this.applicationTypeCode=this.data?.serviceRegistration?.applicationTypeCode
      this.estimateTypeMasterData = await this.estimateService.getEstimateTypeMasterData(filter);
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

      if (estimationRegisteredDTO && estimationRegisteredDTO.length && estimationRegisteredDTO[0].workCategoryMasterId) {
        const workCategoryData = await this.configurationService.getWorkCategoryGetAllData(workFilters);
        this.workCategoryName = workCategoryData.find(
          (v: any) => Number(v.workCategoryMasterId) === Number(estimationRegisteredDTO[0].workCategoryMasterId),
        )?.workCategoryName;
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
    });
  }
  get basicRate(): string {
    const materialCostStr = this.data?.estimationRegisteredDTO[0]?.estimationMaterialCost || '0';
    const labourCostStr = this.data?.estimationRegisteredDTO[0]?.estimationLabourCost || '0';
    const materialCost = parseFloat(materialCostStr);
    const labourCost = parseFloat(labourCostStr);
    const basicRate = materialCost + labourCost;
    return basicRate.toFixed(2);
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

  async generateWorkOrderReport() {
    this.getPdf().subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Estimation Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }    });
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const serviceRegistrationId = this.serviceRegistrationId;
    const estimationRegistrationId = this.estimationRegistrationId;
    return this.http.get(
      `${this.apiUrl}/api/estimationRegistered/generateEstimationDetailsReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}`,
      { observe: 'response', responseType: 'blob' },
    );
  }
  goBack(){
    this.router.navigate([
      `/main/estimation-approval/${3}/${this.data?.serviceRegistration?.registeredSource}/${this.data?.serviceRegistration?.accountId}`,
    ]);
  }
}
