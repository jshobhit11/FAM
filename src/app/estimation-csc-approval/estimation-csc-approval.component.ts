import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimationRegisteredService } from '../services/estimationRegistered';
import { EstimateService } from '../services/estimate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { PopUpComponent } from '../lr-le-meter-power-approval/pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../services/loader.service';
@Component({
  selector: 'app-estimation-csc-approval',
  templateUrl: './estimation-csc-approval.component.html',
  styleUrls: ['./estimation-csc-approval.component.scss'],
})
export class EstimationCscApprovalComponent implements OnInit {
  sh: number = 1;
  balanceAmount: number = 0;
  data: any = {};
  isChecked: boolean;
  isAE: boolean = false;
  isAEE: boolean = false;
  toggleTable = true;
  forwardControl = new FormControl();
  returnControl = new FormControl();
  globalArray: any[] = [];
  regularArray: any[] = [];
  grandTotal: number = 0;
  labourDetails: any = [];
  budgetData: any = [];
  divisionalBudgetData: any = {};
  forwardData: any = {};
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
  higherAuthorityData: any;
  accountId: any;
  processTypeName: any;
  statusCode: any;
  estimateTypeMasterData: any[] = [];
  creditArray: any[] = [];
  form: FormGroup;
  budgetControl = this.fb.control('', Validators.required);
    isDivisionalBudgetSCValid: boolean = true;
  isDivisionalBudgetTLValid: boolean = true;
  isLoading: boolean = false;
  showError: Boolean
  @ViewChild('budgetSelect', { static: false }) budgetSelect!: ElementRef; 
  @ViewChild('CreditbudgetSelect',{static: false}) CreditbudgetSelect!:ElementRef;
  creditAccountHeadControls: FormControl[] = [];
  filteredCreditAccountHeadData: any[] = [];
  @ViewChildren('creditInput') creditInputRefs!: QueryList<ElementRef>;
  serviceRegistrationsId: string;
  constructor(
    private route: ActivatedRoute,
    private estimationReport: EstimationRegisteredService,
    private estimateService: EstimateService,
    private router: Router,
    private snackbar: MatSnackBar,
    private configurationService: ConfigurationService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private loader:LoaderService
  ) {}

  toggleDisplayTableIf() {
    this.toggleTable = !this.toggleTable;
  }

  async ngOnInit() {
    this.form = this.fb.group({
      budget: this.budgetControl,
    });
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
      console.log('applicationStatusCode', applicationStatusCode, typeof applicationStatusCode);
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      if (userRole === 'ROLE_AE') {
        this.isBudgetDetails = false;
      }
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
      const appfilter: any = { apiKey, serviceKey, userRole, userName, userCode, accountId, applicationStatusCode };
      const accountHeadFilter: any = { apiKey, serviceKey, userRole, userName, userCode };
      this.data = await this.estimationReport.getDetailsForEstimationReportByServiceId(ServiceFilter);
      this.estimateTypeMasterData = await this.estimateService.getEstimateTypeMasterData(appfilter);
      this.creditAccountHeadData = await this.configurationService.getAccountHeadMasterAllData(accountHeadFilter);
      const {
        estimationWorkScopeDataDTO,
        estimationMaterailsRegisteredDTOList,
        estimationMaterialLabourDetailsDTOList,
        estimationRegisteredDTO,
        estimationAddlChargesRegisteredDTOList,
        designationMasterDTOList,
        higherAuthorityData,
      } = this.data;
   
      // if (estimationRegisteredDTO[0]?.woExecutionMethodName == 'Self Execution') {
      //   this.isBudgetDetails = false;
      // }

      if (higherAuthorityData && Object.keys(higherAuthorityData).length) {
        this.higherAuthorityData = higherAuthorityData;
        this.displayText = `Approval Authority : ${higherAuthorityData.designationCode} - ${higherAuthorityData.designationName}`;
        const roleUser = sessionStorage.getItem('user-role');
        const role = roleUser.split('_');
        if (higherAuthorityData.designationCode === role[1]) {
          this.isApproved = true;
        }
      } else {
        this.snackbar.open('DOP for Approval Authority is not configured. Please Configure the DOP', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }

      if (designationMasterDTOList.length) {
        this.lowAuthority = designationMasterDTOList.filter((v: any) => v.level === 'LOW');
        this.highAuthority = designationMasterDTOList.filter((v: any) => v.level === 'HIGH');
        this.designationList = designationMasterDTOList;
      }

      if (estimationAddlChargesRegisteredDTOList) {
        this.addChargesBeforeTotalLabour = estimationAddlChargesRegisteredDTOList.filter((v: any) => Number(v.chargesSequenceOrder) < 5);
        this.addChargesAfterTotalLabour = estimationAddlChargesRegisteredDTOList.filter((v: any) => Number(v.chargesSequenceOrder) >= 5);
      }

      if (estimationWorkScopeDataDTO && estimationWorkScopeDataDTO.length) {
        estimationWorkScopeDataDTO?.forEach((estimate: any) => {
          const a = estimationMaterailsRegisteredDTOList?.filter(
            (e: any) => e.estimationWorkScopeDataId === estimate.estTemplateWorkScopeMasterId,
          );
          estimate.materialCost = estimate.materialCost;
          estimate.labourCost = estimate.labourCost;
          this.globalArray.push({ estimate, data: a });
        });
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
        this.filteredCreditAccountHeadData = this.creditAccountHeadData;
        this.creditArray.forEach(() => {
          const control = new FormControl('');
          this.creditAccountHeadControls.push(control);
          console.log(this.creditAccountHeadControls); 
        });
        this.creditAccountHeadControls = this.creditArray.map(() => new FormControl(null, Validators.required));
        this.creditAccountHeadControls.forEach((control, index) => {
          control.valueChanges.subscribe(value => { 
            this.applyFilter(value, index);
          });
        });
      }
      this.grandTotal = 0;
      if (estimationRegisteredDTO && estimationRegisteredDTO.length) {
        const workCategoryData = await this.configurationService.getWorkCategoryGetAllData(workFilters);
        this.workCategoryName = workCategoryData.find(
          (v: any) => Number(v.workCategoryMasterId) === Number(estimationRegisteredDTO[0].workCategoryMasterId),
        )?.workCategoryName;
        this.grandTotal = Number(estimationRegisteredDTO[0].estimationTotalCost);
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

      if (estimationRegisteredDTO[0]?.workCategoryCode == 'SEW') {
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
      } else if (estimationRegisteredDTO[0]?.workCategoryCode == 'DCW') {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 47,
        });
      } else if (estimationRegisteredDTO[0]?.workCategoryCode== 'RMW'&& estimationRegisteredDTO[0]?.woExecutionMethodCode =='SE' ) {
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
      } else if (estimationRegisteredDTO[0]?.workCategoryCode== 'RMW'&& estimationRegisteredDTO[0]?.woExecutionMethodCode =='DP' ) {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 74, 
        });
      } else {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 14,
        });
      } if (estimationRegisteredDTO && estimationRegisteredDTO.length && estimationRegisteredDTO[0].estimationNo) {
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
        (registerDetail: any) => registerDetail.accountHeadMasterId !== 'null',
      );
      if (filteredAccountHeadMasterId) {
        const [filteredBudgetData] = this.budgetData.filter(
          (budget: any) => budget.accountHeadMasterId === filteredAccountHeadMasterId.accountHeadMasterId,
        );
        if (filteredBudgetData) {
          this.selectedValue = filteredBudgetData?.accountHeadCode;
        }
        this.budgetControl.setValue(filteredAccountHeadMasterId?.accountHeadMasterId);
        this.budgetControl.disable();
        if (filteredAccountHeadMasterId.divisionalBudgetId) {
          await this.getDivisionalBudgetData(null, filteredAccountHeadMasterId.divisionalBudgetId);
        } else if (filteredAccountHeadMasterId.accountHeadMasterId) {
          await this.getDivisionalBudgetData(filteredAccountHeadMasterId.accountHeadMasterId);
        }
      }
      this.forwardData.forwardBy = `${this.data?.serviceRegistration?.designationShortCode} - ${sessionStorage.getItem('user-name')}`;
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
  applyFilter(filterValue: any, index: number) { 
    const lowerCaseFilter = typeof filterValue === 'string' ? filterValue.toLowerCase() : '';
  
    this.filteredCreditAccountHeadData = this.creditAccountHeadData.filter(item => {
      const accountHeadCode = item.accountHeadCode.toLowerCase();
      const accountHeadDescription = item.accountHeadDescription.toLowerCase();
      return accountHeadCode.includes(lowerCaseFilter) || accountHeadDescription.includes(lowerCaseFilter);
    });
  }
  
  onAccountHeadSelected(accountHeadDataItem: { accountHeadCode: string; accountHeadDescription: string; accountHeadMasterId: string }, index: number) {
    const control = this.creditAccountHeadControls[index];
    if (control) {
      const formattedValue = `${accountHeadDataItem.accountHeadCode} - ${accountHeadDataItem.accountHeadDescription}`;
      control.setValue(formattedValue);
      this.creditArray[index].accountHeadMasterId = accountHeadDataItem.accountHeadMasterId;
    } else {
      console.error(`Control at index ${index} is undefined.`);
    }
  }
  
  async getDivisionalBudgetData(accountHeadMasterId: any, divisionalBudgetId?: any) {

    const skipCodes = [3151, 3149,579];
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
      [data] = await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterId({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        divisionalOfficeId: sessionStorage.getItem('office-id'),
        accountHeadMasterId,
      });
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
    data.totalBudgetAmount = Number(Number(data?.totalBudgetAmount).toFixed(2)) || 0;
    data.workOrderIssueAmount = Number(Number(data?.workOrderIssueAmount).toFixed(2)) || 0;
    data.totalReserveAmount = Number(Number(data?.totalReserveAmount).toFixed(2)) || 0;
    data.totalExpenditureAmount = Number(Number(data?.totalExpenditureAmount).toFixed(2)) || 0;
    data.balanceAmount = Number(Number(data?.totalBudgetAmount - (data?.workOrderIssueAmount + data?.totalReserveAmount)).toFixed(2)) || 0;
    this.divisionalBudgetData = data;
    if (data.accountHeadCode == '14.400' && this.grandTotal > data?.totalBudgetAmount - data?.totalExpenditureAmount) {
      this.isDivisionalBudgetSCValid = false;
    } else if (data.accountHeadCode != '14.400' && this.grandTotal > data?.balanceAmount) {
      this.isDivisionalBudgetTLValid = false;
    }
    console.log('divisionalBudgetData', this.divisionalBudgetData);
  }

  creditAccountHead(accountHeadMasterId: any, index: any) {
    this.creditArray[index].estimate.accountHeadMasterId = accountHeadMasterId;
    console.log(this.creditArray);
  }

  moveToEstimateForms() {
    this.router.navigate([`/main/estimate-forms/${this.statusCode}/${this.serviceRegistrationsId}/edit/${this.processTypeName}`]);
  }

  get basicRate(): string {
    const materialCostStr = this.data?.estimationRegisteredDTO[0]?.estimationMaterialCost || '0';
    const labourCostStr = this.data?.estimationRegisteredDTO[0]?.estimationLabourCost || '0';
    const materialCost = parseFloat(materialCostStr);
    const labourCost = parseFloat(labourCostStr);
    const basicRate = materialCost + labourCost;
    return basicRate.toFixed(2);
  }
  async forward() {
    if (this.forwardControl.value) {
      if (this.forwardData && this.forwardData.Remarks) {
        const apiKey = sessionStorage.getItem('api-key');
        const serviceKey = sessionStorage.getItem('service-key');
        const userRole = sessionStorage.getItem('user-role');
        const userName = sessionStorage.getItem('user-name');
        const userCode = sessionStorage.getItem('user-code');
        const workFilter: any = { apiKey, serviceKey, userRole, userName, userCode };
        const workscopeDescriptionData = await this.estimateService.getWorkDescMasterData(workFilter);
        let filter: any = {};
        if (this.isBudgetDetails) {
          filter = {
            forwardingTo: this.forwardControl.value,
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            serviceRegistrationId: this.data.serviceRegistration.serviceRegistrationId,
            estimationRegisteredId: this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
            forwardRemarks: this.forwardData.Remarks,
            accountHeadMasterId: this.divisionalBudgetData.accountHeadMasterId,
            divisionalBudgetId: this.divisionalBudgetData.divisionalBudgetId,
            totalBudgetAmount: this.divisionalBudgetData.totalBudgetAmount,
            workOrderIssueAmount: this.divisionalBudgetData.workOrderIssueAmount,
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
            serviceRegistrationId: this.data.serviceRegistration.serviceRegistrationId,
            estimationRegisteredId: this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
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
            workscopeDescMasterId: workscopeDescriptionData.find((work: any) => work.workscopeDescription === v.workscopeDescription)
              .workscopeDescMasterId,
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
              workscopeDescMasterId: workscopeDescriptionData.find((work: any) => work.workscopeDescription === v.workscopeDescription)
                .workscopeDescMasterId,
              estimationWorkScopeDataId: v.estTemplateWorkScopeMasterId,
            });
          } else {
            payload.push({
              workType: v.workType,
              workPart: v.workPart,
              materialCost: v.materialCost,
              labourCost: v.labourCost,
              estimateType: v.estimateType,
              workscopeDescMasterId: workscopeDescriptionData.find((work: any) => work.workscopeDescription === v.workscopeDescription)
                .workscopeDescMasterId,
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
            .open(`${this.processTypeName} Estimation Forwarded Successfully`, 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            })
            snackBarRef.onAction().subscribe(() => {
              this.router.navigate([`main/estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`]);
              this.isLoading = false;
            });
        } else if (data.messageType === 'FAILURE') {
          const snackFailBar = this.snackbar.open(
            data.messageText,
              'ok',
              {
                  verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              }
          );
          
          snackFailBar.onAction().subscribe(() => {
              this.snackbar.dismiss();
              this.isLoading = false;
          });
      } else {
        this.snackbar.open('Please enter remarks', 'OK');
      }
    } else {
      this.snackbar.open('Please select Forwarded To', 'OK');
    }
  }
}

  async return() {
    const data = await this.estimateService.returnEstimation({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      serviceRegistrationId: this.data.serviceRegistration.serviceRegistrationId,
      estimationRegisteredId: this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
      returningTo: this.returnControl.value,
      returnRemarks: this.forwardData.Remarks,
    });
    this.forwardData = {};
    if (data.messageType == 'SUCCESS') {
      this.snackbar
        .open('CSC Estimation Returned successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate([`main/estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`]);
        });
    }
  }
  openApproveDialog(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action: 'estimation_approve' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.approve();
      }
    });
  }
  async approve() {
    if(this.isApproved){
      if (this.processTypeName !== 'DND'){
      const selectedBudget = this.budgetControl.value; 
      if (!selectedBudget) {
        this.showError = true; 
        this.budgetSelect.nativeElement.focus();
        this.snackbar.open('Please select Divisional Acc. Head No.', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom', 
        });
        return
      } else {
        this.showError = false; 
      }
     }
    }
    if (this.isApproved && this.creditArray.length > 0) {
      const allCreditHeadsSelected = this.creditAccountHeadControls.every(control => control.value);
      if (!allCreditHeadsSelected) {
        const firstInvalidIndex = this.creditAccountHeadControls.findIndex(control => !control.value);
        this.snackbar.open('Please select all credit account heads.', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        if (firstInvalidIndex >= 0 && this.creditInputRefs.length > firstInvalidIndex) {
          this.creditInputRefs.toArray()[firstInvalidIndex].nativeElement.focus();
        }
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
          serviceRegistrationId: this.data.serviceRegistration.serviceRegistrationId,
          estimationRegisteredId: this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
          accountHeadMasterId: this.divisionalBudgetData.accountHeadMasterId ||this.budgetControl.value,
          divisionalBudgetId: this.divisionalBudgetData.divisionalBudgetId||0,
          totalBudgetAmount: this.divisionalBudgetData.totalBudgetAmount||0,
          workOrderIssueAmount: this.divisionalBudgetData.workOrderIssueAmount||0,
          balanceAmount: this.divisionalBudgetData.balanceAmount||0,
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
          serviceRegistrationId: this.data.serviceRegistration.serviceRegistrationId,
          estimationRegisteredId: this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
        };
      }
      this.isLoading = true;
      const data = await this.estimateService.sanctionEstimation(filter, wet);
      this.forwardData = {};
      if (data.messageType == 'SUCCESS') {
        const snackBarRef = this.snackbar
          .open(`${this.processTypeName} Estimation Approved Successfully`, 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          snackBarRef.onAction().subscribe(() => {
            this.router.navigate([`main/estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`]);
            this.isLoading = false;
          });
      }
    } else {
      this.snackbar.open('Please enter remarks', 'OK');
    }
  }

  radioType(type: string) {
    const userRole = sessionStorage.getItem('user-role');
    const role = userRole.split('_')[1];
  
    if (type === 'forward') {
      this.forwardData.forwardTo = (role === this.higherAuthorityData.designationCode)
        ? this.lowAuthority.filter(item => item.flow == 'forward')
        : this.designationList.filter(item => item.flow == 'forward');
      
      this.forwardControl.setValue('');
    } else if (type === 'return') {
      this.forwardData.forwardTo = (role === this.higherAuthorityData.designationCode)
        ? this.lowAuthority.filter(item => item.flow == 'return')
        : this.designationList.filter(item => item.flow == 'return');
      
      this.returnControl.setValue(''); 
    }
  }
  printPageArea(areaID: any) {
    var printContent = document.getElementById(areaID).innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }
}
