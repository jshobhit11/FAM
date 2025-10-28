import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimationRegisteredService } from '../../../services/estimationRegistered';
import { EstimateService } from '../../../services/estimate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigurationService } from '../../../services/configuration.service';
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-qmmt-estimation-approval',
  templateUrl: './qmmt-estimation-approval.component.html',
  styleUrls: ['./qmmt-estimation-approval.component.scss']
})
export class QmmtEstimationApprovalComponent implements OnInit {
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
  creditAccountHeadData: any[] = [];
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  designationList: any[] = [];
  lowAuthority: any[] = [];
  highAuthority: any[] = [];
  workCategoryName: string = '';
  higherAuthorityData: any;
  budgetControl = this.fb.control('', Validators.required);
  showError: Boolean;
  @ViewChild('budgetSelect', { static: false }) budgetSelect!: ElementRef;
  estimateTypeMasterData: any[] = [];
  isDivisionalBudgetSCValid: boolean = true;
  isDivisionalBudgetTLValid: boolean = true;
  approveData: any = {};
  isLoading: boolean = false;
  creditAccountHeadControls: FormControl[] = [];
  filteredCreditAccountHeadData: any[] = [];
  @ViewChildren('creditInput') creditInputRefs!: QueryList<ElementRef>;
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
    this.loader.show('Data Loading...')
    this.forwardControl.setValue('');
    this.returnControl.setValue('');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
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
      const accountHeadFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      const workFilters: any = { apiKey, serviceKey, userRole, userName, userCode };
      this.data =
        await this.estimationReport.getDetailsForImprovementEstimation(filter);
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
        const workCategoryData =
          await this.configurationService.getWorkCategoryGetAllData(workFilters);
        this.workCategoryName = workCategoryData.find(
          (v: any) =>
            Number(v.workCategoryMasterId) ===
            Number(estimationRegisteredDTO[0].workCategoryMasterId)
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
      if (estimationRegisteredDTO[0]?.workCategoryCode === 'IMP') {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 14,
        });
      } else if (estimationRegisteredDTO[0]?.workCategoryCode === 'RMW'&& estimationRegisteredDTO[0]?.woExecutionMethodCode =='SE') {
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
      }else if (estimationRegisteredDTO[0]?.workCategoryCode === 'RMW') {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: 74,
        });
      } else if (estimationRegisteredDTO[0]?.workCategoryCode === 'SEW') {
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
        //   this.budgetControl.disable();
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

  calculateAmount(chargesPercentage: number, basicRate: number): number {
    return (basicRate * chargesPercentage) / 100;
  }
  async getDivisionalBudgetData(
    accountHeadMasterId: any,
    divisionalBudgetId?: any
  ) {
    const skipCodes = [3151, 3149, 579];
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
      this.isDivisionalBudgetSCValid = false;
    } else if (
      data.accountHeadCode != '14.400' &&
      this.grandTotal > data?.balanceAmount
    ) {
      this.isDivisionalBudgetTLValid = false;
    }
    console.log('divisionalBudgetData', this.divisionalBudgetData);
  }
  creditAccountHead(accountHeadMasterId: any, index: any) {
    this.creditArray[index].estimate.accountHeadMasterId = accountHeadMasterId;
    console.log(this.creditArray);
  }
  moveToEstimate(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action: 'edit' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.moveToEstimateForms();
      }
    });
  }
  moveToEstimateForms() {
    const statusCode = this.data?.serviceRegistration?.applicationStatusCode;
    this.router.navigate(
      [
        `/estimates/qmmt-estimation/${statusCode}/${this.serviceRegistrationId}`,
      ],
      {
        queryParams: { mode: 'edit' },
      }
    );
  }

  async forward() {
    this.loader.show('Estimation Forward in Progress...')
    if (this.forwardControl.value) {
      if (this.forwardData && this.forwardData.remarks) {
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
            forwardRemarks: this.forwardData.remarks,
            accountHeadMasterId: this.divisionalBudgetData.accountHeadMasterId,
            divisionalBudgetId:
              this.divisionalBudgetData.divisionalBudgetId || 0,
            totalBudgetAmount: this.divisionalBudgetData.totalBudgetAmount || 0,
            workOrderIssueAmount:
              this.divisionalBudgetData.workOrderIssueAmount || 0,
            balanceAmount: this.divisionalBudgetData.balanceAmount || 0,
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
            forwardRemarks: this.forwardData.remarks,
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
       console.log(filter, payload, wet);
       this.isLoading = true;
        const data = await this.estimateService.forwardEstimation(filter, wet);
        this.forwardData = {};
        this.loader.hide();
        if (data.messageType == 'SUCCESS') {
          const snackBarRef = this.snackbar
            .open(
              'Quarterly Maintenance MT Estimation Forwarded Successfully',
              'OK',
              {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              }
            )
            snackBarRef.onAction()
            .subscribe(() => {
              this.router.navigate([
                `main/estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
              ]);
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
    this.loader.show('Estimation Return in Progress')
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
      returningTo: this.returnControl.value,
      returnRemarks: this.forwardData.remarks,
    });
    this.forwardData = {};
    this.loader.hide();
    if (data.messageType == 'SUCCESS') {
      this.snackbar
        .open('Quarterly Maintenance MT Estimation Returned successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate([
            `estimates/improvement-estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
          ]);
        });
    }
  }

  async approve() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
 
    const quarterStart = new Date(year, Math.floor(month / 3) * 3, 1);
    const quarterEnd = new Date(year, Math.floor(month / 3) * 3 + 3, 0);
  
    const registeredOn = new Date(this.data.serviceRegistration?.registeredOn);
    const estimationDate = new Date(this.data.estimationRegisteredDTO[0]?.estimationDate);
  
    const isWithinQuarter = (date: Date) => date >= quarterStart && date <= quarterEnd;
  
    if (!isWithinQuarter(registeredOn) || !isWithinQuarter(estimationDate)) {
      this.snackbar.open(
        `Estimation should be done in the same quarter as the one in which it was created.`,
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          duration: 4000
        }
      );
      return;
    }
  
  
   if(this.isApproved){
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
    this.loader.show('Estimation Approval in Progress...')
    if (this.forwardData && this.forwardData.remarks) {
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
        estCred.forEach((v,index) => {
          if (v.accountHeadMasterId != 'null') {
            payload.push({
              workType: v.workType,
              workPart: v.workPart,
              materialCost: v.materialCost,
              labourCost: v.labourCost,
              estimateType: v.estimateType,
              accountHeadMasterId:this.creditArray[index].accountHeadMasterId,
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
          approvedRemarks: this.forwardData.remarks,
          serviceRegistrationId:
            this.data.serviceRegistration.serviceRegistrationId,
          estimationRegisteredId:
            this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
          accountHeadMasterId:
            this.divisionalBudgetData.accountHeadMasterId ||
            this.budgetControl.value,
          divisionalBudgetId: this.divisionalBudgetData.divisionalBudgetId || 0,
          totalBudgetAmount: this.divisionalBudgetData.totalBudgetAmount || 0,
          workOrderIssueAmount:
            this.divisionalBudgetData.workOrderIssueAmount || 0,
          balanceAmount: this.divisionalBudgetData.balanceAmount || 0,
        };
      } else {
        filter = {
          forwardingTo: this.forwardControl.value,
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          approvedRemarks: this.forwardData.remarks,
          serviceRegistrationId:
            this.data.serviceRegistration.serviceRegistrationId,
          estimationRegisteredId:
            this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
        };
      }
      this.isLoading = true;

      const data = await this.estimateService.sanctionEstimation(filter, wet);
      this.loader.hide();
      this.forwardData = {};
      if (data.messageType == 'SUCCESS') {
        const snackBarRef = this.snackbar
          .open(
            'Quarterly Maintenance MT Estimation Approved Successfully',
            'OK',
            {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            }
          )
          snackBarRef.onAction()
          .subscribe(() => {
            this.router.navigate([
              `main/estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
            ]);
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
