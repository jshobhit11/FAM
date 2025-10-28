import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimationRegisteredService } from '../../../services/estimationRegistered';
import { EstimateService } from '../../../services/estimate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigurationService } from '../../../services/configuration.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-revised-estimation-approval',
  templateUrl: './revised-estimation-approval.component.html',
  styleUrls: ['./revised-estimation-approval.component.scss'],
})
export class RevisedEstimationApprovalComponent implements OnInit {
  sh: number = 1;
  balanceAmount: number = 0;
  serviceRegistrationId: any;
  data: any = {};
  isChecked: boolean;
  isAE: boolean = false;
  isAEE: boolean = false;
  toggleTable = true;
  forwardControl = new FormControl();
  returnControl = new FormControl();
  globalArray: any[] = [];
  regularArray: any[] = [];
  creditArray: any[] = [];
  grandTotal: number = 0;
  labourDetails: any = [];
  budgetData: any = [];
  divisionalBudgetData: any = {};
  forwardData: any = {};
  estimationRegisteredId: any;
  history: any;
  isBudgetDetails: boolean = true;
  selectedValue: any;
  displayAuthorities: boolean = false;
  isApproved: boolean = false;
  displayText: any = null;
  typeAuthority: any = null;
  creditAccountHeadData: any;
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  designationList: any[] = [];
  lowAuthority: any[] = [];
  highAuthority: any[] = [];
  workCategoryName: string = '';
  higherAuthorityData: any;
  estimateTypeMasterData: any[] = [];
  budgetControl = this.fb.control('', Validators.required);
  showError: Boolean;
  @ViewChild('budgetSelect', { static: false }) budgetSelect!: ElementRef;
  isDivisionalBudgetSCValid: boolean = true;
  isDivisionalBudgetTLValid: boolean = true;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private estimationReport: EstimationRegisteredService,
    private estimateService: EstimateService,
    private router: Router,
    private snackbar: MatSnackBar,
    private configurationService: ConfigurationService,
    private fb: FormBuilder,
    private loader :LoaderService
  ) {}

  toggleDisplayTableIf() {
    this.toggleTable = !this.toggleTable;
  }

  async ngOnInit() {
    this.forwardControl.setValue('');
    this.returnControl.setValue('');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.loader.show('Data Loading...');
      const serviceRegistrationId = params.get('serviceRegistrationId');
      const estimationRegisteredId = params.get('estimationRegisteredId');
      this.serviceRegistrationId = serviceRegistrationId;
      this.estimationRegisteredId = estimationRegisteredId;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      if (userRole === 'ROLE_AE') {
        this.isBudgetDetails = false;
      }
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        serviceRegistrationId,
        estimationRegistrationId: estimationRegisteredId,
      };
      const workFilters: any = { apiKey, serviceKey, userRole, userName, userCode };
      const accountHeadFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.data = await this.estimationReport.getDetailsForRevisedEstimation(
        filter
      );
      this.estimateTypeMasterData =
        await this.estimateService.getEstimateTypeMasterData(filter);
      this.creditAccountHeadData =
        await this.configurationService.getAccountHeadMasterAllData(
          accountHeadFilter
        );
      const {
        estimationWorkScopeDataDTO,
        estimationMaterailsRegisteredDTOList,
        estimationMaterialLabourDetailsDTOList,
        estimationRegisteredDTO,
        estimationAddlChargesRegisteredDTOList,
        designationMasterDTOList,
        higherAuthorityData,
      } = this.data;

      if (
        estimationRegisteredDTO[0]?.woExecutionMethodName == 'Self Execution'
      ) {
        this.isBudgetDetails = false;
      }

      if (higherAuthorityData && Object.keys(higherAuthorityData).length) {
        this.higherAuthorityData = higherAuthorityData;
        this.displayText = `Approval Authority : ${higherAuthorityData.designationCode} - ${higherAuthorityData.designationName}`;
        const roleUser = sessionStorage.getItem('user-role');
        const role = roleUser.split('_');
        if (higherAuthorityData.designationCode === role[1]) {
          this.isApproved = true;
        }
      } else {
        this.snackbar.open(
          'DOP for Approval Authority is not configured. Please Configure the DOP',
          'OK',
          {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
      }

      if (designationMasterDTOList.length) {
        this.lowAuthority = designationMasterDTOList.filter(
          (v: any) => v.level === 'LOW'
        );
        this.highAuthority = designationMasterDTOList.filter(
          (v: any) => v.level === 'HIGH'
        );
        this.designationList = designationMasterDTOList;
      }

      if (estimationAddlChargesRegisteredDTOList) {
        this.addChargesBeforeTotalLabour =
          estimationAddlChargesRegisteredDTOList.filter(
            (v: any) => Number(v.chargesSequenceOrder) < 5
          );
        this.addChargesAfterTotalLabour =
          estimationAddlChargesRegisteredDTOList.filter(
            (v: any) => Number(v.chargesSequenceOrder) >= 5
          );
      }

      if (estimationWorkScopeDataDTO && estimationWorkScopeDataDTO.length) {
        estimationWorkScopeDataDTO?.forEach((estimate: any) => {
          const a = estimationMaterailsRegisteredDTOList?.filter(
            (e: any) =>
              e.estimationWorkScopeDataId ===
              estimate.estTemplateWorkScopeMasterId
          );
          estimate.materialCost = estimate.materialCost;
          estimate.labourCost = estimate.labourCost;
          this.globalArray.push({ estimate, data: a });
        });
        this.regularArray = this.globalArray.filter(
          (v) =>
            v.estimate.estimateType ==
            this.estimateTypeMasterData.find(
              (e) => e.estimateTypeCode === 'RGL'
            )?.estimateTypeMasterId
        );
        const cArr = this.globalArray.filter(
          (v) =>
            v.estimate.estimateType ==
            this.estimateTypeMasterData.find(
              (e) => e.estimateTypeCode === 'CRD'
            )?.estimateTypeMasterId
        );
        cArr.forEach((v) => {
          this.creditArray.push({
            data: v.data,
            estimate: {
              estTemplateWorkScopeMasterId:
                v.estimate.estTemplateWorkScopeMasterId,
              workType: v.estimate.workType,
              workPart: v.estimate.workPart,
              workscopeDescription: v.estimate.workscopeDescription,
              materialCost: v.estimate.materialCost,
              labourCost: v.estimate.labourCost,
              estimateType: v.estimate.estimateType,
              accountHeadMasterId: v.estimate.accountHeadMasterId,
              accountMainHeadDescription: v.estimate.accountMainHeadDescription,
              accountMainHeadCode: v.estimate.accountMainHeadCode,
              isSelectAccountHead:
                v.estimate.accountHeadMasterId == 'null' ? true : false,
            },
          });
        });
        console.log(this.globalArray, this.regularArray, this.creditArray);
      }
      this.grandTotal = 0;
      if (estimationRegisteredDTO && estimationRegisteredDTO.length) {
        const workCategoryData =
          await this.configurationService.getWorkCategoryGetAllData(workFilters);
        this.workCategoryName = workCategoryData.find(
          (v: any) =>
            v.workCategoryMasterId ==
            estimationRegisteredDTO[0].workCategoryMasterId
        )?.workCategoryName;
        this.grandTotal = Number(
          estimationRegisteredDTO[0].estimationTotalCost
        );
      }
      estimationMaterialLabourDetailsDTOList?.forEach((estimate: any) => {
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
      if (estimationRegisteredDTO[0]?.workCategoryCode == 'RMW'&& estimationRegisteredDTO[0]?.woExecutionMethodCode =='SE') {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 16,
        });
        this.budgetControl.setValue(3151);
        await this.getDivisionalBudgetData(this.budgetControl.value);
        this.budgetControl.disable();
      } else if (estimationRegisteredDTO[0]?.workCategoryCode == 'RMW') {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 74,
        });
      } else if (estimationRegisteredDTO[0].workCategoryCode == 'SEW') {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 15,
        });
        this.budgetControl.setValue(3149);
        await this.getDivisionalBudgetData(this.budgetControl.value);
        this.budgetControl.disable();
      } else if (estimationRegisteredDTO[0].workCategoryCode == 'DCW') {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 47,
        });
        // this.budgetControl.setValue(1860);
        // this.budgetControl.disable();
      } else if (estimationRegisteredDTO[0].workCategoryCode == 'SCN'&& estimationRegisteredDTO[0]?.woExecutionMethodCode =='SE' ) {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 16, 
        });
         this.budgetControl.setValue(3151);
         await this.getDivisionalBudgetData(this.budgetControl.value);
         this.budgetControl.disable();
      } else {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 14,
        });
      }
      
      // this.displayAuthority(estimationRegisteredDTO);
      if (
        estimationRegisteredDTO &&
        estimationRegisteredDTO.length &&
        estimationRegisteredDTO[0].estimationNo
      ) {
        this.history = await this.estimateService.getEstimationHistory({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          estimationNumber: estimationRegisteredDTO[0].estimationNo,
        });
      }
      const filteredAccountHeadMasterId = estimationRegisteredDTO.find(
        (registerDetail: any) => registerDetail.accountHeadMasterId !== 'null'
      );
      if (filteredAccountHeadMasterId) {
        const [filteredBudgetData] = this.budgetData.filter(
          (budget: any) =>
            budget.accountHeadMasterId ===
            filteredAccountHeadMasterId.accountHeadMasterId
        );
        if (filteredBudgetData) {
          this.selectedValue = filteredBudgetData?.accountHeadCode;
        }
        this.budgetControl.setValue(
          filteredAccountHeadMasterId?.accountHeadMasterId
        );
        // this.budgetControl.disable();
        if (filteredAccountHeadMasterId.divisionalBudgetId) {
          await this.getDivisionalBudgetData(
            null,
            filteredAccountHeadMasterId.divisionalBudgetId
          );
        } else if (filteredAccountHeadMasterId.accountHeadMasterId) {
          await this.getDivisionalBudgetData(
            filteredAccountHeadMasterId.accountHeadMasterId
          );
        }
      }
      this.forwardData.forwardBy = `${
        this.data?.serviceRegistration?.designationShortCode
      } - ${sessionStorage.getItem('user-name')}`;
      this.forwardData.forwardDate = new Date().toISOString().substring(0, 10);
      if (this.data?.serviceRegistration?.designationShortCode === 'AE') {
        this.isAE = true;
      }
      if (this.data?.serviceRegistration?.designationShortCode === 'AEE') {
        this.isAEE = true;
      }
      this.loader.hide();
    });
  }
  get basicRate(): string {
    const materialCostStr =
      this.data.estimationRegisteredDTO[0]?.estimationMaterialCost || '0';
    const labourCostStr =
      this.data.estimationRegisteredDTO[0]?.estimationLabourCost || '0';
    const materialCost = parseFloat(materialCostStr);
    const labourCost = parseFloat(labourCostStr);
    const basicRate = materialCost + labourCost;
    return basicRate.toFixed(2);
  }
  getAccountHeadDetails(id: any): string {
    if (this.creditAccountHeadData.length) {
      const accountHead = this.creditAccountHeadData.find(
        (v: any) => Number(v.accountHeadMasterId) === Number(id)
      );
      return accountHead;
    }
  }

  async getDivisionalBudgetData(
    accountHeadMasterId: any,
    divisionalBudgetId?: any
  ) {
    const skipCodes = [3151, 3149,579,1860];
    this.isDivisionalBudgetSCValid = true;
    this.isDivisionalBudgetTLValid = true;
    let data: any;
    const accountHeadMasterIdNumber = Number(accountHeadMasterId);

    const selectedBudget = this.budgetData.find(
      (b) => b.accountHeadMasterId == accountHeadMasterIdNumber 
    );
  
    if (
      skipCodes.includes(accountHeadMasterIdNumber) 
    ) {
      this.divisionalBudgetData = {};
      return;
    }
  
    if (accountHeadMasterId) {
      data =
        await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterId(
          {
            apiKey: sessionStorage.getItem('api-key'),
            serviceKey: sessionStorage.getItem('service-key'),
            userRole: sessionStorage.getItem('user-role'),
            userName: sessionStorage.getItem('user-name'),
            userCode: sessionStorage.getItem('user-code'),
            divisionalOfficeId: sessionStorage.getItem('office-id'),
            accountHeadMasterId,
          }
        );
    } else if (divisionalBudgetId) {
      data = await this.estimateService.getDataByDivisionalBudgetId({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        divisionalBudgetId,
      });
    }
    if (Array.isArray(data)) {
      data = data[0] || {};  
  }


  if (data?.messageText) {
      this.snackbar.open(data.messageText, 'Ok', { duration: 8000 });
      return;
  }

  if (!data) {
      this.divisionalBudgetData = {};
      return;
  }
    data.totalBudgetAmount =
      Number(Number(data?.totalBudgetAmount).toFixed(2)) || 0;
    data.workOrderIssueAmount =
      Number(Number(data?.workOrderIssueAmount).toFixed(2)) || 0;
    data.totalReserveAmount =
      Number(Number(data?.totalReserveAmount).toFixed(2)) || 0;
    data.totalExpenditureAmount =
      Number(Number(data?.totalExpenditureAmount).toFixed(2)) || 0;
    data.balanceAmount =
      Number(
        Number(
          data?.totalBudgetAmount -
            (data?.workOrderIssueAmount + data?.totalReserveAmount)
        ).toFixed(2)
      ) || 0;
    this.divisionalBudgetData = data;
    if (
      data.accountHeadCode == '14.400' &&
      this.grandTotal > data?.totalBudgetAmount - data?.totalExpenditureAmount
    ) {
      this.isDivisionalBudgetSCValid = true;
    } else if (
      data.accountHeadCode != '14.400' &&
      this.grandTotal > data?.balanceAmount
    ) {
      this.isDivisionalBudgetTLValid = false;
    }
    if (accountHeadMasterId||divisionalBudgetId) {
      this.showError = false; 
    }else{
      this.showError =true;
    }
    console.log('divisionalBudgetData', this.divisionalBudgetData);
  }
  creditAccountHead(accountHeadMasterId: any, index: any) {
    this.creditArray[index].estimate.accountHeadMasterId = accountHeadMasterId;
    console.log(this.creditArray);
  }

  moveToEstimateForms() {
    this.router.navigate([
      `/estimates/revised-estimation/${this.estimationRegisteredId}/${this.serviceRegistrationId}/edit`,
    ]);
  }

  async forward() {
    if (this.forwardControl.value) {
      if (this.forwardData && this.forwardData.Remarks) {
        const apiKey = sessionStorage.getItem('api-key');
        const serviceKey = sessionStorage.getItem('service-key');
        const userRole = sessionStorage.getItem('user-role');
        const userName = sessionStorage.getItem('user-name');
        const userCode = sessionStorage.getItem('user-code');
        const workFilter: any = {
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
        };
        const workscopeDescriptionData =
          await this.estimateService.getWorkDescMasterData(workFilter);
        let filter: any = {};
        if (this.isBudgetDetails) {
          filter = {
            forwardingTo: this.forwardControl.value,
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            serviceRegistrationId:
              this.data.serviceRegistration.serviceRegistrationId,
            estimationRegisteredId:
              this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
            forwardRemarks: this.forwardData.Remarks,
            accountHeadMasterId: this.divisionalBudgetData.accountHeadMasterId,
            divisionalBudgetId: this.divisionalBudgetData.divisionalBudgetId,
            totalBudgetAmount: this.divisionalBudgetData.totalBudgetAmount,
            workOrderIssueAmount:
              this.divisionalBudgetData.workOrderIssueAmount,
            balanceAmount: this.divisionalBudgetData.balanceAmount,
          };
        } else {
          filter = {
            forwardingTo: this.forwardControl.value,
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            serviceRegistrationId:
              this.data.serviceRegistration.serviceRegistrationId,
            estimationRegisteredId:
              this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
            forwardRemarks: this.forwardData.Remarks,
          };
        }
        const payload: any[] = [];
        const estCred = this.creditArray.map((v) => v.estimate);
        const regular = this.regularArray.map((v) => v.estimate);
        const reg: any[] = [];
        regular.forEach((v) => {
          reg.push({
            workType: v.workType,
            workPart: v.workPart,
            materialCost: v.materialCost,
            labourCost: v.labourCost,
            estimateType: v.estimateType,
            estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
            workscopeDescMasterId: workscopeDescriptionData.find(
              (work: any) =>
                work.workscopeDescription === v.workscopeDescription
            ).workscopeDescMasterId,
          });
        });
        estCred.forEach((v) => {
          if (v.accountHeadMasterId != 'null') {
            payload.push({
              workType: v.workType,
              workPart: v.workPart,
              materialCost: v.materialCost,
              labourCost: v.labourCost,
              estimateType: v.estimateType,
              accountHeadMasterId: v.accountHeadMasterId,
              workscopeDescMasterId: workscopeDescriptionData.find(
                (work: any) =>
                  work.workscopeDescription === v.workscopeDescription
              ).workscopeDescMasterId,
              estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
            });
          } else {
            payload.push({
              workType: v.workType,
              workPart: v.workPart,
              materialCost: v.materialCost,
              labourCost: v.labourCost,
              estimateType: v.estimateType,
              workscopeDescMasterId: workscopeDescriptionData.find(
                (work: any) =>
                  work.workscopeDescription === v.workscopeDescription
              ).workscopeDescMasterId,
              estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
            });
          }
        });
        let wet: any[] = [];
        if (!reg.length) {
          wet = payload;
        } else if (!payload.length) {
          wet = reg;
        } else {
          wet = [...reg, ...payload];
        }
        this.isLoading = true;
        console.log(filter, payload, wet);
        const data = await this.estimateService.forwardEstimation(filter, wet);
        this.forwardData = {};
        if (data.messageType == 'SUCCESS') {
          const snackBarRef = this.snackbar
            .open('Revised Estimation Forwarded Successfully', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            })
            snackBarRef.onAction()
            .subscribe(() => {
              this.router.navigate([
                `estimates/revised-estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
              ]);
              this.isLoading = false;
            });
        }
      } else {
        this.snackbar.open('Please enter remarks', 'OK');
      }
    } else {
      this.snackbar.open('Please select Forwarded To', 'OK');
    }
  }

  async return() {
    const data = await this.estimateService.returnEstimation({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      serviceRegistrationId:
        this.data.serviceRegistration.serviceRegistrationId,
      estimationRegisteredId:
        this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
      returnRemarks: this.forwardData.Remarks,
    });
    this.forwardData = {};
    if (data.messageType == 'SUCCESS') {
      this.snackbar
        .open('Data Submitted successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate([
            `estimates/revised-estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
          ]);
        });
    }
  }

  async approve() {
    if (this.isApproved) {
      const selectedBudget = Number(this.budgetControl.value); 
      const skipCodes = [3151, 3149, 579, 1860];

      if (skipCodes.includes(selectedBudget)) {
        this.isBudgetDetails = false;
      }
  
      if (!selectedBudget && !skipCodes.includes(selectedBudget)) {
        this.showError = true; 
        this.budgetSelect.nativeElement.focus();
        this.snackbar.open('Please select Divisional Acc. Head No.', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom', 
        });
        return;
      } else {
        this.showError = false; 
      }
    }    
  
    // Check for work execution method
    if (this.data.estimationRegisteredDTO[0]?.woExecutionMethodCode !== 'SE') {
      if (!this.budgetControl.value) {
        this.snackbar.open('Please select a Budget Control', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return;
      }
    }
  
    if (this.forwardData && this.forwardData.Remarks) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
  
      const workFilter: any = { apiKey, serviceKey, userRole, userName, userCode };
      const workscopeDescriptionData = await this.estimateService.getWorkDescMasterData(workFilter);
  
      const payload: any[] = [];
      const estCred = this.creditArray.map((v) => v.estimate);
      const regular = this.regularArray.map((v) => v.estimate);
      const reg: any[] = [];
  
      if (estCred.length) {
        estCred.forEach((v) => {
          const workScopeId = workscopeDescriptionData.find(
            (work: any) => work.workscopeDescription === v.workscopeDescription
          )?.workscopeDescMasterId;
  
          const item = {
            workType: v.workType,
            workPart: v.workPart,
            materialCost: v.materialCost,
            labourCost: v.labourCost,
            estimateType: v.estimateType,
            workscopeDescMasterId: workScopeId,
            estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
          };
  
          if (v.accountHeadMasterId != 'null') {
            item["accountHeadMasterId"] = v.accountHeadMasterId;
          }
  
          payload.push(item);
        });
      }
  
      if (regular.length) {
        regular.forEach((v) => {
          reg.push({
            workType: v.workType,
            workPart: v.workPart,
            materialCost: v.materialCost,
            labourCost: v.labourCost,
            estimateType: v.estimateType,
            workscopeDescMasterId: workscopeDescriptionData.find(
              (work: any) => work.workscopeDescription === v.workscopeDescription
            )?.workscopeDescMasterId,
            estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
          });
        });
      }
  
      let wet = reg.length ? [...reg, ...payload] : payload.length ? payload : reg;
  
      let filter: any = {
        forwardingTo: this.forwardControl.value,
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        approvedRemarks: this.forwardData.Remarks,
        serviceRegistrationId: this.data.serviceRegistration.serviceRegistrationId,
        estimationRegisteredId: this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
        isRevisedEstimation: 1,
      };
  
      if (this.isBudgetDetails) {
        filter = {
          ...filter,
          accountHeadMasterId: this.divisionalBudgetData.accountHeadMasterId,
          divisionalBudgetId: this.divisionalBudgetData.divisionalBudgetId,
          totalBudgetAmount: this.divisionalBudgetData.totalBudgetAmount,
          workOrderIssueAmount: this.divisionalBudgetData.workOrderIssueAmount,
          balanceAmount: this.divisionalBudgetData.balanceAmount,
        };
      }
  
      this.isLoading = true;
      const data = await this.estimateService.revisedEstimationForApproval(filter, wet);
      this.forwardData = {};
  
      if (data.messageType === 'SUCCESS') {
        const snackBarRef = this.snackbar.open('Revised Estimation Approved Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        snackBarRef.onAction().subscribe(() => {
          this.router.navigate([
            `estimates/revised-estimation-report/${data.estimationRegisteredId}/${data.serviceRegistrationId}`,
          ]);
          this.isLoading = false;
        });
      } else if (data.messageType === 'FAILURE') {
        const snackFailBar = this.snackbar.open(data.messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
  
        snackFailBar.onAction().subscribe(() => {
          this.snackbar.dismiss();
          this.isLoading = false;
        });
      }
    } else {
      this.snackbar.open('Please enter remarks', 'OK');
    }
  }
  
  
  radioType(type: any) {
    if (type === 'forward') {
      this.forwardData.forwardTo = [];
      const userRole = sessionStorage.getItem('user-role');
      const role = userRole.split('_');
      console.log(role[1], this.higherAuthorityData.designationCode);
      if (role[1] === this.higherAuthorityData.designationCode) {
        this.forwardData.forwardTo = this.lowAuthority;
      } else {
        this.forwardData.forwardTo = this.designationList;
      }
    }
    if (type === 'return') {
      this.forwardData.forwardTo = [];
      if (this.data?.serviceRegistration?.designationShortCode == 'AEE') {
        this.forwardData.forwardTo = ['AET', 'AE'];
        this.returnControl.setValue('AET');
      } else if (this.data?.serviceRegistration?.designationShortCode == 'EE') {
        this.forwardData.forwardTo = ['AEE'];
        this.returnControl.setValue('AEE');
      } else if (this.data?.serviceRegistration?.designationShortCode == 'SE') {
        this.forwardData.forwardTo = ['EE'];
        this.returnControl.setValue('EE');
      }
    }
    console.log(this.forwardData.forwardTo);
  }

  printPageArea(areaID: any) {
    var printContent = document.getElementById(areaID).innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }
}
