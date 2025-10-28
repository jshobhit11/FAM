import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimationRegisteredService } from '../services/estimationRegistered';
import { EstimateService } from '../services/estimate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigurationService } from '../services/configuration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopUpComponent } from '../lr-le-meter-power-approval/pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../services/loader.service';
const estimationSanctionForm = new FormGroup({
  budgetControl: new FormControl('', [Validators.required]),
  forwardBy: new FormControl('', [Validators.required]),
  forwardDate: new FormControl('', [Validators.required]),
  Remarks: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-estimation-sanction',
  templateUrl: './estimation-sanction.component.html',
  styleUrls: ['./estimation-sanction.component.scss'],
})
export class EstimationSanctionComponent implements OnInit {
  balanceAmount: number = 0;
  accountId: any;
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
  statusCode: any;
  history: any;
  isBudgetDetails: boolean = true;
  selectedValue: any;
  displayAuthorities: boolean = false;
  isApproved: boolean = false;
  displayText: any = null;
  typeAuthority: any = null;
  creditAccountHeadData: any[] = [];
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  designationList: any[] = [];
  lowAuthority: any[] = [];
  highAuthority: any[] = [];
  workCategoryName: string = '';
  processTypeName: string = '';
  estimateTypeMasterData: any[] = [];
  budgetControl = new FormControl('', []);
  estimationSanctionForm: FormGroup = estimationSanctionForm;
  error: string;
  isLoading: boolean = false;
  serviceRegistrationsId: string;
  constructor(
    private route: ActivatedRoute,
    private estimationReport: EstimationRegisteredService,
    private estimateService: EstimateService,
    private router: Router,
    private snackbar: MatSnackBar,
    private configurationService: ConfigurationService,
    private dialog: MatDialog,
    private loader: LoaderService,
  ) {}

  toggleDisplayTableIf() {
    this.toggleTable = !this.toggleTable;
  }

  async ngOnInit() {
    this.forwardControl.setValue('');
    this.returnControl.setValue('');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.loader.show('Data Loading...');
      this.route.queryParamMap.subscribe(queryParams => {
        this.serviceRegistrationsId = queryParams.get('serviceRegistrationsId');
      });
      const serviceRegistrationsId =params.get('serviceRegistrationsId');
      this.serviceRegistrationsId=serviceRegistrationsId;
      const accountId = params.get('accountId');
      const applicationStatusCode = params.get('statusCode');
      const processTypeName = params.get('processTypeName');
      this.processTypeName = processTypeName;
      this.accountId = accountId;
      this.statusCode = applicationStatusCode;
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
        accountId,
        applicationStatusCode,
      };
      const ServiceFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        serviceRegistrationsId:this.serviceRegistrationsId,
        applicationStatusCode,
      };
      const workFilters: any = { apiKey, serviceKey, userRole, userName, userCode };
      const accountHeadFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.data = await this.estimationReport.getDetailsForEstimationReportByServiceId(
        ServiceFilter
      );
      this.estimateTypeMasterData =
        await this.estimateService.getEstimateTypeMasterData(filter);
      this.configurationService
        .getAccountHeadMasterAllData(accountHeadFilter)
        .then((v) => (this.creditAccountHeadData = v));
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

      console.log('higherAuthorityData', higherAuthorityData);

      if (higherAuthorityData && Object.keys(higherAuthorityData).length) {
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
        this.creditArray = this.globalArray.filter(
          (v) =>
            v.estimate.estimateType ==
            this.estimateTypeMasterData.find(
              (e) => e.estimateTypeCode === 'CRD'
            )?.estimateTypeMasterId
        );
        console.log(this.globalArray, this.regularArray, this.creditArray);
      }
      this.grandTotal = 0;
      if (estimationRegisteredDTO && estimationRegisteredDTO.length) {
        if (estimationRegisteredDTO[0]?.workCategoryMasterId) {
          const workCategoryData =
            await this.configurationService.getWorkCategoryGetAllData(workFilters);
          this.workCategoryName = workCategoryData.find(
            (v: any) =>
              Number(v.workCategoryMasterId) ===
              Number(estimationRegisteredDTO[0].workCategoryMasterId)
          )?.workCategoryName;
        }
        this.grandTotal = Number(
          estimationRegisteredDTO[0]?.estimationTotalCost
        );
        if (estimationRegisteredDTO[0]?.accountHeadMasterId != 'null') {
          this.getDivisionalBudgetData(
            estimationRegisteredDTO[0].accountHeadMasterId
          );
        }
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
       if (this.data?.serviceRegistration?.categoryCode == 'LT-7') {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 22, 
        });
        this.budgetControl.setValue(579);
         await this.getDivisionalBudgetData(this.budgetControl.value);
        this.budgetControl.disable();
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
          estimationNumber: estimationRegisteredDTO[0]?.estimationNo,
        });
      }
      const filteredAccountHeadMasterId = estimationRegisteredDTO.find(
        (v: any) => v.accountHeadMasterId !== 'null'
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
    this.resetForm();
  }
  resetForm() {
    this.estimationSanctionForm = new FormGroup({
      budgetControl: new FormControl('', []),
      forwardBy: new FormControl('', [Validators.required]),
      forwardDate: new FormControl('', [Validators.required]),
      Remarks: new FormControl('', [Validators.required]),
    });
  }
  async getDivisionalBudgetData(
    accountHeadMasterId: any,
    divisionalBudgetId?: any
  ) {
    const skipCodes = [3151, 3149, 579,1860];
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
    console.log('divisionalBudgetData', this.divisionalBudgetData);
  }

  creditAccountHead(accountHeadMasterId: any, index: any) {
    this.creditArray[index].estimate.accountHeadMasterId = accountHeadMasterId;
    console.log(this.creditArray);
  }

  moveToEstimateForms() {
    this.router.navigate([
      `/main/estimate-forms/${this.statusCode}/${this.accountId}/edit`,
    ]);
  }

  getAccountHeadDetails(id: any): string {
    if (this.creditAccountHeadData.length) {
      const accountHead = this.creditAccountHeadData.find(
        (v: any) => Number(v.accountHeadMasterId) === Number(id)
      );
      return accountHead;
    }
  }
  get basicRate(): string {
    const materialCostStr =
      this.data?.estimationRegisteredDTO[0]?.estimationMaterialCost || '0';
    const labourCostStr =
      this.data?.estimationRegisteredDTO[0]?.estimationLabourCost || '0';
    const materialCost = parseFloat(materialCostStr);
    const labourCost = parseFloat(labourCostStr);
    const basicRate = materialCost + labourCost;
    return basicRate.toFixed(2);
  }

  openApproveDialog(): void {
     const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action: 'sanction' },
    });
    dialogRef.afterClosed().subscribe((result) => {
       if (result === 'yes') {
        this.approve();
      }
    });
  }
  async approve() {
    this.loader.show('Approving Estimation Sanction...');
    this.estimationSanctionForm.markAllAsTouched();
    if (this.isValidForm()) {
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
        const payload: any[] = [];
        const estCred = this.creditArray.map((v) => v.estimate);
        const regular = this.regularArray.map((v) => v.estimate);
        const reg: any[] = [];
        if (estCred.length) {
          estCred.forEach((v, index) => {
            const workscopeDescMasterId = workscopeDescriptionData.find(
              (work: any) => work.workscopeDescription === v.workscopeDescription
            )?.workscopeDescMasterId;
  
            const accountHeadMasterId = this.creditArray[index]?.accountHeadMasterId || v.accountHeadMasterId;
        
            if (accountHeadMasterId && accountHeadMasterId !== 'null') {
              payload.push({
                workType: v.workType,
                workPart: v.workPart,
                materialCost: v.materialCost,
                labourCost: v.labourCost,
                estimateType: v.estimateType,
                accountHeadMasterId,
                workscopeDescMasterId,
                estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
              });
            } else {
              payload.push({
                workType: v.workType,
                workPart: v.workPart,
                materialCost: v.materialCost,
                labourCost: v.labourCost,
                estimateType: v.estimateType,
                workscopeDescMasterId,
                estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
              });
            }
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
                (work: any) =>
                  work.workscopeDescription === v.workscopeDescription
              ).workscopeDescMasterId,
              estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
            });
          });
        }
        let wet: any[] = [];
        if (!reg.length) {
          wet = payload;
        } else if (!payload.length) {
          wet = reg;
        } else {
          wet = [...reg, ...payload];
        }
        let filter: any = {};
        if (this.isBudgetDetails) {
          filter = {
            forwardingTo: this.forwardControl.value,
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            approvedRemarks: this.forwardData.Remarks,
            serviceRegistrationId:
              this.data.serviceRegistration.serviceRegistrationId,
            estimationRegisteredId:
              this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
            accountHeadMasterId: this.divisionalBudgetData.accountHeadMasterId ||this.budgetControl.value,
            divisionalBudgetId: this.divisionalBudgetData.divisionalBudgetId||0,
            totalBudgetAmount: this.divisionalBudgetData.totalBudgetAmount||0,
            workOrderIssueAmount:
              this.divisionalBudgetData.workOrderIssueAmount ||0,
            balanceAmount: this.divisionalBudgetData.balanceAmount ||0,
          };
        } else {
          filter = {
            forwardingTo: this.forwardControl.value,
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            approvedRemarks: this.forwardData.Remarks,
            serviceRegistrationId:
              this.data.serviceRegistration.serviceRegistrationId,
            estimationRegisteredId:
              this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
          };
        }
        this.isLoading = true;
        
        const data = await this.estimateService.sanctionEstimation(filter, wet);
        this.loader.hide();
        if (data.messageType == 'SUCCESS') {
          const snackBarRef = this.snackbar.open('Estimation Approved Successfully', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            })
            snackBarRef.onAction()
            .subscribe(() => {
              this.router.navigate([
                `main/estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
              ]);
              this.isLoading = false;
            });
        } else if (data.messageType == 'FAILURE'){
          const snackBarRef = this.snackbar.open(data.messageText, 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          snackBarRef.onAction()
          .subscribe(() => {
          });
        }
      } else {
        this.snackbar.open('Please enter remarks', 'OK');
        
      }
    }
  }
  isValidForm(): boolean {
    this.estimationSanctionForm.markAllAsTouched();
    console.log('Form Valid?', this.estimationSanctionForm.valid);
    let hasError = false;
    Object.keys(this.estimationSanctionForm.controls).forEach((key) => {
      const control = this.estimationSanctionForm.get(key);

      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });

    if (hasError) {
      this.error = 'Please Fill Out Mandatory Fields';
      return false;
    } else {
      this.error = '';
      return true;
    }
  }

  printPageArea(areaID: any) {
    var printContent = document.getElementById(areaID).innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }

  navigate() {
    console.log(this.statusCode);
    this.router.navigate([
      `/main/home/${this.statusCode}/${this.processTypeName}`,
    ]);
  }
}
