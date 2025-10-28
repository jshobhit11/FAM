import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimationRegisteredService } from '../../../services/estimationRegistered';
import { EstimateService } from '../../../services/estimate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigurationService } from '../../../services/configuration.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-emergency-estimation-approval',
  templateUrl: './emergency-estimation-approval.component.html',
  styleUrls: ['./emergency-estimation-approval.component.scss'],
})
export class EmergencyEstimationApprovalComponent implements OnInit {
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
  regularizationArray: any[] = [];
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
  budgetControl = this.fb.control('', Validators.required);
  showError: Boolean;
  @ViewChild('budgetSelect', { static: false }) budgetSelect!: ElementRef;
  estimateTypeMasterData: any[] = [];
  isDivisionalBudgetSCValid: boolean = true;
  isDivisionalBudgetTLValid: boolean = true;
  isLoading: boolean = false;
  approvalErrorMessage: string = '';
  isApproveDisabled: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private estimationReport: EstimationRegisteredService,
    private estimateService: EstimateService,
    private router: Router,
    private snackbar: MatSnackBar,
    private configurationService: ConfigurationService,
    private fb: FormBuilder,
    private loader: LoaderService
  ) {}

  toggleDisplayTableIf() {
    this.toggleTable = !this.toggleTable;
  }

  async ngOnInit() {
    this.forwardControl.setValue('');
    this.returnControl.setValue('');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.loader.show("Data Loading...")
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
      const workFilters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      const accountHeadFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.data =
        await this.estimationReport.getDetailsForImprovementEstimation(filter);
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
        this.regularizationArray = this.globalArray.filter(
          (v) =>
            v.estimate.estimateType ==
            this.estimateTypeMasterData.find(
              (e) => e.estimateTypeCode === 'RLZ'
            )?.estimateTypeMasterId
        );
        console.log(this.globalArray);
        console.log(this.regularizationArray);
      }
      this.grandTotal = 0;
      if (estimationRegisteredDTO && estimationRegisteredDTO.length) {
        const workCategoryData =
          await this.configurationService.getWorkCategoryGetAllData(
            workFilters
          );
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
      this.budgetData = await this.estimateService.getDivisionBudgetData({
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        accountMainHeadCode: 14,
      });
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
        this.budgetControl.disable();
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
    if (!this.data?.estimationRegistered) {
      return '0';
    }
    const materialCostStr =
      this.data.estimationRegisteredDTO[0]?.estimationMaterialCost || '0';
    const labourCostStr =
      this.data.estimationRegisteredDTO[0]?.estimationLabourCost || '0';
    const materialCost = parseFloat(materialCostStr);
    const labourCost = parseFloat(labourCostStr);
    const basicRate = materialCost + labourCost;
    return basicRate.toFixed(2);
  }
  async getDivisionalBudgetData(
    accountHeadMasterId: any,
    divisionalBudgetId?: any
  ) {
    this.loader.show('Fetching budget data...');
    const skipCodes = [3151, 3149, 579];
    this.isDivisionalBudgetSCValid = true;
    this.isDivisionalBudgetTLValid = true;
    this.approvalErrorMessage = '';
    this.isApproveDisabled = false;
    this.divisionalBudgetData = {};
    let data: any;
    const accountHeadMasterIdNumber = Number(accountHeadMasterId);

    try {
    const selectedBudget = this.budgetData.find(
      (b) => b.accountHeadMasterId == accountHeadMasterIdNumber 
    );
  
      if (skipCodes.includes(accountHeadMasterIdNumber)) {
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
        this.snackbar.open(data.messageText, 'Ok', {
          duration: 8000,
          panelClass: ['error-snackbar'],
        });
      return;
    }

    if (!data) {
      this.divisionalBudgetData = {};
      return;
    }

      data.totalBudgetAmount = Number(data?.totalBudgetAmount?.toFixed(2)) || 0;
    data.workOrderIssueAmount =
        Number(data?.workOrderIssueAmount?.toFixed(2)) || 0;
    data.totalReserveAmount =
        Number(data?.totalReserveAmount?.toFixed(2)) || 0;
    data.totalExpenditureAmount =
        Number(data?.totalExpenditureAmount?.toFixed(2)) || 0;
    data.balanceAmount =
      Number(
          (
            data.totalBudgetAmount -
            (data.workOrderIssueAmount + data.totalReserveAmount)
        ).toFixed(2)
      ) || 0;
    this.divisionalBudgetData = data;
    if (
      data.accountHeadCode == '14.400' &&
        this.grandTotal > data.totalBudgetAmount - data.totalExpenditureAmount
    ) {
      this.isDivisionalBudgetSCValid = false;
    } else if (
      data.accountHeadCode != '14.400' &&
        this.grandTotal > data.balanceAmount
    ) {
      this.isDivisionalBudgetTLValid = false;
    }

      this.showError = !(accountHeadMasterId || divisionalBudgetId);

      const actualBalanceAmount =
        data.totalBudgetAmount - data.totalExpenditureAmount;
      if (data.totalBudgetAmount <= 0) {
        this.approvalErrorMessage =
          'Budget is not Added please Add the Budget For the this Account Head!.';
        this.isApproveDisabled = true;
      }
      // if (data.balanceAmount < 0 && data.accountHeadCode !== '14.400') {
      //   this.isApproveDisabled = true;
      //   this.approvalErrorMessage = `Total Estimation Amount: ${this.grandTotal} is greater than Budget Actual Balance Amount: ${actualBalanceAmount}`;
      //   // this.snackbar.open(this.approvalErrorMessage, 'Ok', { duration: 5000, panelClass: ['error-snackbar'] });
      // }
    } catch (error) {
      this.approvalErrorMessage =
        'An error occurred while fetching budget data.';
      this.isApproveDisabled = true;
      this.snackbar.open(this.approvalErrorMessage, 'Ok', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    } finally {
      this.loader.hide(); // Ensures the loader is hidden in all cases
    }

    console.log('divisionalBudgetData', this.divisionalBudgetData);
  }

  moveToEstimateForms() {
    this.router.navigate([
      `/estimates/revised-estimation/${this.estimationRegisteredId}/${this.serviceRegistrationId}`,
    ]);
  }

  async forward() {
    this.loader.show('Forwarding the Emergency estimation...');
    try {
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
              accountHeadMasterId:
                this.divisionalBudgetData.accountHeadMasterId,
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
          const regularization = this.regularizationArray.map(
            (v) => v.estimate
          );
        const rlz: any[] = [];
        regularization.forEach((v) => {
          rlz.push({
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
        this.isLoading = true;
          const data = await this.estimateService.forwardEstimation(
            filter,
            rlz
          );
        this.forwardData = {};
        if (data.messageType == 'SUCCESS') {
          const snackBarRef = this.snackbar
            .open('Emergency Estimation Forwarded Successfully', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            })
            snackBarRef.onAction().subscribe(() => {
              this.router.navigate([
                `estimates/emergency-estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
              ]);
              this.isLoading = false;
            });
             }else if (data.messageType === 'FAILURE') {
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
            }
      } else {
        this.snackbar.open('Please enter remarks', 'OK');
      }
    } else {
      this.snackbar.open('Please select Forwarded To', 'OK');
    }
    } catch (error) {
      this.snackbar.open('An error occurred while forwarding data', 'OK');
    } finally {
      this.loader.hide();
    }
  }

  async return() {
    this.loader.show('Returning the Emergency estimation...');
    try {
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
            `estimates/emergency-estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
          ]);
        });
    }
    } catch (error) {
      this.snackbar.open('An error occurred while returning data', 'OK');
    } finally {
      this.loader.hide();
    }
  }

  async approve() {
    this.loader.show('Approving the Emergency estimation...');
    try {
   if (this.isApproved) {
      const selectedBudget = this.budgetControl.value;
      if (!selectedBudget) {
        this.showError = true;
        this.budgetSelect.nativeElement.focus();
        this.snackbar.open('Please select Divisional Acc. Head No.', 'OK');
        return;
      }
    }
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
      const regularization = this.regularizationArray.map((v) => v.estimate);
      const rlz: any[] = [];
      regularization.forEach((v) => {
        rlz.push({
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
          approvedRemarks: this.forwardData.Remarks,
          serviceRegistrationId:
            this.data.serviceRegistration.serviceRegistrationId,
          estimationRegisteredId:
            this.data.estimationRegisteredDTO[0]?.estimationRegisteredId,
        };
      }
      this.isLoading = true;
      const data = await this.estimateService.sanctionEstimation(filter, rlz);
      this.forwardData = {};
      if (data.messageType == 'SUCCESS') {
       
        const snackBarRef = this.snackbar
          .open('Emergency Estimation Approved Successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          snackBarRef.onAction()
          .subscribe(() => {
            this.router.navigate([
              `estimates/emergency-estimation-report/${data.estmationRegisteredId}/${data.serviceRegistrationId}`,
            ]);
            this.isLoading = false;
          });
      }
    } else {
      this.snackbar.open('Please enter remarks', 'OK');
    }
    } catch (error) {
      this.snackbar.open('An error occurred while Approving data', 'OK');
    } finally {
      this.loader.hide();
    }
  }

  radioType(type: string) {
    const userRole = sessionStorage.getItem('user-role');
    const role = userRole.split('_')[1];
  
    if (type === 'forward') {
      this.forwardData.forwardTo =
        role === this.higherAuthorityData.designationCode
          ? this.lowAuthority.filter((item) => item.flow == 'forward')
          : this.designationList.filter((item) => item.flow == 'forward');
      
      this.forwardControl.setValue('');
    } else if (type === 'return') {
      this.forwardData.forwardTo =
        role === this.higherAuthorityData.designationCode
          ? this.lowAuthority.filter((item) => item.flow == 'return')
          : this.designationList.filter((item) => item.flow == 'return');
      
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
