import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { EstimateService } from 'src/app/services/estimate.service';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
export function permitRequiredFormValidator(control: FormControl) {
  const permitRequired = control.parent?.get('permitRequired')?.value;
  return permitRequired === '1' ? Validators.required(control) : null;
}
@Component({
  selector: 'app-work-order-form',
  templateUrl: './work-order-form.component.html',
  styleUrls: ['./work-order-form.component.scss'],
})
export class WorkOrderFormComponent implements OnInit {
  workOrderFormGroup: FormGroup;
  sh = 1;
  isChecked: boolean;
  toggleTable = true;
  additionalCharges: any = [];
  globalArray: any = [];
  budgetData: any = [];
  data: any = {};
  estimationRegisteredId: any;
  workorderRegisteredId: any;
  serviceRegistrationsId: any;
  budget: any = {};
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  regularArray: any[] = [];
  creditArray: any[] = [];
  raisedBy: any;
  estimationType: any;
  type: any;
  isEmergencyWork: boolean = false;
  error: string;
  currentValue: any;
  private permitRequiredSubscription: Subscription;
  @ViewChild('accountHeadSelected') accountHeadSelected: MatSelect;

  constructor(
    private route: ActivatedRoute,
    private workOrderService: WorkOrderService,
    private estimateService: EstimateService,
    private router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.workOrderFormGroup = new FormGroup({
      estimationNo: new FormControl('', []),
      workType: new FormControl('', []),
      escom: new FormControl('', []),
      manualWorkOrder: new FormControl('', []),
      division: new FormControl('', []),
      permitRequired: new FormControl('', [Validators.required]),
      permitRequiredForm: new FormControl('', permitRequiredFormValidator),
      allotBudget: new FormControl('', []),
      budgetRemaining: new FormControl('', []),
      currentEstimateCost: new FormControl('', []),
      executionMethod: new FormControl('', []),
      workCategory: new FormControl('', []),
      office: new FormControl('', []),
      manualWorkDate: new FormControl('', []),
      divisionBudgetHead: new FormControl('', []),
      approvedBy: new FormControl('', []),
      shutdownRequired: new FormControl('', [Validators.required]),
      alreadyApprovedCost: new FormControl('', []),
      expenseInccured: new FormControl('', []),
      balanceBudget: new FormControl('', []),
      workDescription: new FormControl('', []),
      priority: new FormControl('low', [Validators.required]),
      adddays: new FormControl('', [Validators.required, Validators.max(360)]),
      raisedBy: new FormControl('', []),
      workOrderEndDate: new FormControl('', []),
      workAwardRequired: new FormControl('', [Validators.required]),
      divisionAccountHeadDescription: new FormControl('', []),
      divisionBudgetHeadI: new FormControl('', []),
      divisionBudgetHeadId: new FormControl('', []),
      creditAccountHeadMasterId: new FormControl('', []),
      budgetControl: new FormControl('', []), 
    });
  }

  ngOnInit() {
    this.raisedBy = `${sessionStorage.getItem('user-name')}-${sessionStorage.getItem('user-role')}`;
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.estimationRegisteredId = params['estimationRegisteredId'];
      this.estimationType = params['estimationType'];
      this.type = params['type'];
      this.workorderRegisteredId = params['workorderRegisteredId'];
      this.serviceRegistrationsId = params['serviceRegistrationsId'];
      this.resetForm();
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      this.data = await this.workOrderService.getRegisteredWorkOrderData({
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        estimationRegisteredId: this.estimationRegisteredId,
        operationCode: this.estimationType == 'RE' ? 'R' : 'C',
      });
      const {
        estimationWorkScope,
        estimationRegistered,
        estimationAddlChargesRegistered,
        estimationMaterailsRegistered,
      } = this.data;
      const skipCodes = [3151, 3149, 579];
      const accountHeadMasterId = parseInt(estimationRegistered.accountHeadMasterId, 10);
      const accountMainHeadCode = estimationRegistered.accountMainHeadCode ? estimationRegistered.accountMainHeadCode.toString() : '';
      // const is74Series = accountMainHeadCode.startsWith('74'); && !is74Series
      if (accountHeadMasterId && !skipCodes.includes(accountHeadMasterId) ) {
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode,
        });
      
        const defaultOption = estimationRegistered.accountHeadMasterId;
        if (defaultOption) {
          this.workOrderFormGroup.get('budgetControl').setValue(defaultOption);
          this.workOrderFormGroup.get('budgetControl').disable();
        } else {
          this.workOrderFormGroup.get('budgetControl').enable();
        }
      } else {
        let derivedMainHeadCode = 14;
        if (estimationRegistered.categoryCode == 'LT-7') {
          derivedMainHeadCode = 22;
        } else if (estimationRegistered.woExecutionMethodCode == 'SE'&&estimationRegistered.workCategory == 'Repairs & Maintenance Works') {
          derivedMainHeadCode = 16;
        } else if (estimationRegistered.workCategory == 'Repairs & Maintenance Works') {
          derivedMainHeadCode = 74;
        } else if (estimationRegistered.woExecutionMethodCode == 'SE' && estimationRegistered.workCategory == 'Service Connection Works') {
          derivedMainHeadCode = 16;
        } else if (estimationRegistered.woExecutionMethodCode == 'SE' && estimationRegistered.workCategory == 'Self Execution Works') {
          derivedMainHeadCode = 15;
        }
      
        this.budgetData = await this.estimateService.getDivisionBudgetData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          accountMainHeadCode: derivedMainHeadCode,
        });
        if (estimationRegistered.categoryCode == 'LT-7') {
          const defaultOption = this.budgetData.find(data => data.accountHeadCode == '22.731');
          if (defaultOption) {
            this.workOrderFormGroup.get('budgetControl').setValue(defaultOption.accountHeadMasterId);
            this.workOrderFormGroup.get('budgetControl').disable();
          } else {
            this.workOrderFormGroup.get('budgetControl').enable();
          }
        }else if (estimationRegistered.workCategory == 'Repairs & Maintenance Works' && estimationRegistered.woExecutionMethodCode == 'SE') {
          const defaultOption = this.budgetData.find(data => data.accountHeadCode == '16.999');
          if (defaultOption) {
            this.workOrderFormGroup.get('budgetControl').setValue(defaultOption.accountHeadMasterId);
            this.workOrderFormGroup.get('budgetControl').disable();
          } else {
            this.workOrderFormGroup.get('budgetControl').enable();
          }
        } else if (estimationRegistered.workCategory == 'Repairs & Maintenance Works') {
          this.workOrderFormGroup.get('budgetControl').enable();
        } else if (estimationRegistered.woExecutionMethodCode == 'SE' && estimationRegistered.workCategory == 'Service Connection Works') {
          const defaultOption = this.budgetData.find(data => data.accountHeadCode == '16.999');
          if (defaultOption) {
            this.workOrderFormGroup.get('budgetControl').setValue(defaultOption.accountHeadMasterId);
            this.workOrderFormGroup.get('budgetControl').disable();
          } else {
            this.workOrderFormGroup.get('budgetControl').enable();
          }
        } else if (estimationRegistered.woExecutionMethodCode == 'SE' && estimationRegistered.workCategory == 'Self Execution Works') {
          const defaultOption = this.budgetData.find(data => data.accountHeadCode == '15.999');
          if (defaultOption) {
            this.workOrderFormGroup.get('budgetControl').setValue(defaultOption.accountHeadMasterId);
            this.workOrderFormGroup.get('budgetControl').disable();
          } else {
            this.workOrderFormGroup.get('budgetControl').enable();
          }
        } else {
          this.workOrderFormGroup.get('budgetControl').enable();
        }
      }
      
      if (estimationRegistered?.workCategory == 'Repairs & Maintenance Works') {
        this.isEmergencyWork = true;
      } else {
        this.isEmergencyWork = false;
      }
      if (estimationRegistered?.woExecutionMethodName == 'Self Execution') {
        this.workOrderFormGroup.get('workAwardRequired').setValue('0');
        this.workOrderFormGroup.get('workAwardRequired').disable();
      }
      if (
        estimationRegistered?.woExecutionMethodName == 'Labour Contract' ||
        estimationRegistered?.woExecutionMethodName == 'Total Turnkey' ||
        estimationRegistered?.woExecutionMethodName == 'Partial Turnkey'
      ) {
        this.workOrderFormGroup.get('workAwardRequired').setValue('1');
        this.workOrderFormGroup.get('workAwardRequired').disable();
      }

      if (estimationRegistered?.woExecutionMethodName == 'Department') {
        this.workOrderFormGroup.get('workAwardRequired').setValue('0');
        this.workOrderFormGroup.get('workAwardRequired').disable();
      }

      if (estimationWorkScope && estimationWorkScope.length) {
        estimationWorkScope?.forEach((estimate: any) => {
          const a = estimationMaterailsRegistered?.filter(
            (e: any) =>
              e.estimationWorkScopeDataId ===
              estimate.estTemplateWorkScopeMasterId
          );
          estimate.materialCost = estimate.materialCost;
          estimate.labourCost = estimate.labourCost;
          this.globalArray.push({ estimate, data: a });
        });
        this.regularArray = this.globalArray.filter(
          (v: any) => v.estimate.estimateType === '1'
        );
        this.creditArray = this.globalArray.filter(
          (v: any) => v.estimate.estimateType === '2'
        );
      }
      if (
        estimationAddlChargesRegistered &&
        estimationAddlChargesRegistered.length
      ) {
        this.addChargesBeforeTotalLabour =
          estimationAddlChargesRegistered.filter(
            (v: any) => Number(v.chargesSequenceOrder) < 5
          );
        this.addChargesAfterTotalLabour =
          estimationAddlChargesRegistered.filter(
            (v: any) => Number(v.chargesSequenceOrder) >= 5
          );
      }

      if (estimationWorkScope && estimationWorkScope.length) {
        estimationWorkScope?.forEach((estimate: any) => {
          const a = estimationMaterailsRegistered.filter(
            (e: any) =>
              e.estimationWorkScopeDataId ===
              estimate.estTemplateWorkScopeMasterId
          );
          this.globalArray.push({ estimate, data: a });
        });
      }

      // const accountHeadFilter: any = { apiKey, serviceKey, userRole, userName, userCode };
      // this.creditAccountHeadData = await this.configurationService.getAccountHeadMasterAllData(accountHeadFilter);
      if (estimationRegistered) {
        const { estimationRegistered: filteredAccountHeadMasterId } = this.data;

        if (
          filteredAccountHeadMasterId &&
          filteredAccountHeadMasterId.accountHeadMasterId
        ) {
          const [filteredBudgetData] = this.budgetData.filter(
            (budget: any) =>
              Number(budget.accountHeadMasterId) ===
              Number(filteredAccountHeadMasterId.accountHeadMasterId)
          );
          this.budget = filteredBudgetData;

          if (
            this.data.estimationRegistered?.woExecutionMethodName !==
            'Self Execution'
          ) {
            if (filteredAccountHeadMasterId.accountHeadMasterId !== 'null') {
              await this.getDivisionalBudgetData(
                filteredAccountHeadMasterId.accountHeadMasterId
              );
            }
          }
        }
        this.workOrderFormGroup
          .get('estimationNo')
          .setValue(estimationRegistered.estimationNo);
        this.workOrderFormGroup
          .get('executionMethod')
          .setValue(estimationRegistered.woExecutionMethodName);

        this.workOrderFormGroup
          .get('currentEstimateCost')
          .setValue(estimationRegistered.estimationTotalCost);
          if (estimationRegistered.woExecutionMethodCode =='SE') {
          }else{
            this.workOrderFormGroup
            .get('budgetControl')
            .setValue(estimationRegistered.accountHeadMasterId);
          };
          
        this.workOrderFormGroup
          .get('divisionBudgetHeadId')
          .setValue(this.budget?.divisionBudgetId);
        this.workOrderFormGroup
          .get('raisedBy')
          .setValue(
            `${sessionStorage.getItem('user-name')}-${sessionStorage.getItem(
              'user-role'
            )}`
          );
        this.workOrderFormGroup
          .get('workDescription')
          .setValue(estimationRegistered.estimationWorkDesc);
        this.workOrderFormGroup
          .get('workOrderEndDate')
          .setValue(new Date().toISOString().substring(0, 10));
        const balanceBudget =
          Number(this.budget?.totalBudgetAmount) -
          Number(this.budget?.workOrderIssueAmount);
        this.workOrderFormGroup
          .get('budgetRemaining')
          .setValue(balanceBudget ? balanceBudget.toFixed(2) : 0);
        const balanceAfterApproval =
          balanceBudget -
          Number(this.workOrderFormGroup.get('currentEstimateCost').value);
        this.workOrderFormGroup
          .get('balanceBudget')
          .setValue(balanceAfterApproval ? balanceAfterApproval : 0);
      }

      if(estimationRegistered.applicationTypeCode === 'PD'){
        this.workOrderFormGroup.get('workAwardRequired').setValue('0');
        this.workOrderFormGroup.get('workAwardRequired').disable();
        this.workOrderFormGroup.get('permitRequired').setValue('0');
        this.workOrderFormGroup.get('permitRequired').disable();
        this.workOrderFormGroup.get('shutdownRequired').setValue('0');
        this.workOrderFormGroup.get('shutdownRequired').disable();
      }
    });
    this.permitRequiredSubscription = this.workOrderFormGroup
      .get('permitRequired')
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.onChangePermitRequired(value);
      });

      
   this.resetForm();
  }

  resetForm() {
    return new Promise((resolve) => {
      this.workOrderFormGroup.reset({
        estimationNo: '',
        workType: '',
        escom: '',
        manualWorkOrder: '',
        division: '',
        permitRequired: '',
        permitRequiredForm: '',
        allotBudget: '',
        budgetRemaining: '',
        currentEstimateCost: '',
        executionMethod: '',
        workCategory: '',
        office: '',
        manualWorkDate: '',
        divisionBudgetHead: '',
        approvedBy: '',
        shutdownRequired: '',
        alreadyApprovedCost: '',
        expenseInccured: '',
        balanceBudget: '',
        workDescription: '',
        priority: 'low',
        adddays: '',
        raisedBy: '',
        workOrderEndDate: '',
        workAwardRequired: '',
        divisionAccountHeadDescription: '',
        divisionBudgetHeadI: '',
        divisionBudgetHeadId: '',
        creditAccountHeadMasterId: '',
      });
      resolve(true);
    });
  }

  toggleDisplayTableIf() {
    this.toggleTable = !this.toggleTable;
  }

  openConfirmationpopupDialog() {
    this.workOrderFormGroup.markAllAsTouched();
    if (this.isValidForm()) {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent);
      dialogRef.afterClosed().subscribe(async (result) => {
        console.log(result);
        if (result === 'yes') {
          await this.submitWorkOrderForm();
        }
      });
    }
  }
  isValidForm(): boolean {
    this.workOrderFormGroup.markAllAsTouched();
    console.log('Form Valid?', this.workOrderFormGroup.valid);
    let hasError = false;
    Object.keys(this.workOrderFormGroup.controls).forEach((key) => {
      const control = this.workOrderFormGroup.get(key);

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
  get basicRate(): string {
    if (!this.data?.estimationRegistered) {
      return '0';
    }
    const materialCostStr =
      this.data.estimationRegistered.estimationMaterialCost || '0';
    const labourCostStr =
      this.data.estimationRegistered.estimationLabourCost || '0';
    const materialCost = parseFloat(materialCostStr);
    const labourCost = parseFloat(labourCostStr);
    const basicRate = materialCost + labourCost;
    return basicRate.toFixed(2);
  }

  async submitWorkOrderForm() {
    let data = this.workOrderFormGroup.value;

    data.accountHeadMasterId = data?.divisionBudgetHead;
    data.divisionalBudgetId = data?.divisionBudgetHeadId;
    data.estimationRegisteredId = this.data.estimationRegistered.estimationRegisteredId;
    const accountHeadMasterId = this.data?.estimationRegistered?.applicationTypeCode == 'PD'
        ? this.data?.estimationWorkScope[0]?.accountHeadMasterId
        : this.workOrderFormGroup.get('budgetControl').value;

    const param: any = {
        workorderNo: '',
        workorderDate: '',
        estimationRegisteredId: data?.estimationRegisteredId,
        estimationNo: data?.estimationNo,
        workExecutionMethod: data?.executionMethod,
        workType: '',
        workCategory: this.budget?.budgetWorkType,
        officeId: this.data?.estimationRegistered.officeId,
        manualTentativeWorkorderNo: data?.manualWorkOrder,
        manualTentativeWorkorderDate: data?.manualWorkDate,
        estimateType: this.data?.estimationRegistered?.estimateType,
        divisionalOfficeId: 0,
        accountHeadMasterId: Number(accountHeadMasterId),
        divisionalBudgetId: this.budget?.divisionalBudgetId,
        isPermitRequired: data?.permitRequired,
        permitRequiredFrom: data?.permitRequiredForm,
        isShutdownRequired: data?.shutdownRequired,
        allotedBudget: data?.allotBudget,
        shutdownTime: '',
        alreadyWosApprovedCost: data?.alreadyApprovedCost,
        expenseIncuredCost: data?.expenseInccured,
        balanceRemainingBudget: data?.budgetRemaining,
        estimationCost: data?.currentEstimateCost,
        balanceBudgetAfterWoApproval: data?.balanceBudget,
        workDescription: data?.workDescription,
        pendingAtDesigId: 0,
        approvedBy: 0,
        approvalStatus: '',
        approvalRemarks: '',
        approvedOn: '',
        designationId: 0,
        woStatus: '',
        workPriorityId: data?.priority,
        workPeriod: data?.adddays,
        workorderStatus: '',
        workorderEndDate: `${data?.workOrderEndDate}`,
        workorderCompletionRemarks: '',
        workCompletedBy: 0,
        workCompletionNo: '',
        isCrApproved: 0,
        vendorMasterId: 0,
        workAwardNo: '',
        workAwardDate: '',
        scheduleStartDate: '',
        scheduleEndDate: '',
        workTypeApplicable: '',
        isWorkAwardRequired: this.workOrderFormGroup.get('workAwardRequired')?.value,
        serviceRegistrationsId: this.data?.estimationRegistered?.serviceRegistrationId,
        woExecutionMethodId: this.data?.estimationRegistered?.workExecutionMethodId,
        wmWorkorderRegisteredId: this.workorderRegisteredId,
        workCategoryMasterId: this.data?.estimationRegistered?.workCategoryMasterId,
    };

    if (this.estimationType === 'RE') {
        const submitEstimationForm = await this.workOrderService.saveReviseddWorkOrderData(
            {
                apiKey: sessionStorage.getItem('api-key'),
                serviceKey: sessionStorage.getItem('service-key'),
                userRole: sessionStorage.getItem('user-role'),
                userName: sessionStorage.getItem('user-name'),
                userCode: sessionStorage.getItem('user-code'),
                serviceRegistrationsId: this.data.estimationRegistered.serviceRegistrationId,
                originalWmWorkorderRegisteredId: this.workorderRegisteredId,
            },
            param
        );
        if (submitEstimationForm.messageType == 'SUCCESS') {
            this.snackbar
                .open('Revised work order created successfully', 'OK', {
                    verticalPosition: cordova !== undefined ? 'bottom' : 'top',
                })
                .onAction()
                .subscribe(() => {
                    this.snackbar.dismiss();
                    this.router.navigate(['/main/work-order-creation'], {
                        queryParams: {
                            statusCode: 8,
                            label: 'WORK ORDER CREATION',
                            type: 'list',
                            processTypeName: 'WORKORDER',
                        },
                    });
                });
        }
    } else {
        const submitEstimationForm = await this.workOrderService.saveWorkOrderData(
            {
                apiKey: sessionStorage.getItem('api-key'),
                serviceKey: sessionStorage.getItem('service-key'),
                userRole: sessionStorage.getItem('user-role'),
                userName: sessionStorage.getItem('user-name'),
                userCode: sessionStorage.getItem('user-code'),
            },
            param
        );
        if (submitEstimationForm.messageType == 'SUCCESS') {
            this.snackbar
                .open('Work order created successfully', 'OK', {
                    verticalPosition: cordova !== undefined ? 'bottom' : 'top',
                })
                .onAction()
                .subscribe(() => {
                    this.snackbar.dismiss();
                    this.router.navigate(['/main/work-order-creation'], {
                        queryParams: {
                            statusCode: 8,
                            label: 'WORK ORDER CREATION',
                            type: 'list',
                            processTypeName: 'WORKORDER',
                        },
                    });
                });
        } else if (submitEstimationForm.messageType == 'FAILURE') {
            this.snackbar
                .open('Work order creation failed', 'OK', {
                    verticalPosition: cordova !== undefined ? 'bottom' : 'top',
                })
                .onAction()
                .subscribe(() => {
                    this.snackbar.dismiss();
                });
        }
    }
}

  private addDaysUsingTime(date: Date, days: number): Date {
    const millisecondsInADay = 24 * 60 * 60 * 1000; 
    return new Date(date.getTime() + days * millisecondsInADay);
}

addDays(): void {
    const addDaysValue: number = this.workOrderFormGroup.get('adddays').value;

    if (addDaysValue > 360) {
        this.workOrderFormGroup.get('adddays').setErrors({ max: true });
        return;
    }
    else if (addDaysValue < 1 ) {
      this.workOrderFormGroup.get('adddays').setErrors({ min: true });
      return;
  }

    const currentDate: Date = new Date();

    const workOrderEndDate: Date = this.addDaysUsingTime(currentDate, addDaysValue);
    this.workOrderFormGroup.get('workOrderEndDate').setValue(workOrderEndDate.toISOString().substring(0, 10));
}

  async getDivisionalBudgetData(event: any) {
    if (this.data?.estimationRegistered?.workCategory == 'Repairs & Maintenance Works') {
      return;
    }
    let data =
      await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterId({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        divisionalOfficeId: this.data.estimationRegistered.officeId,
        accountHeadMasterId: event,
      });
      if (Array.isArray(data)) {
        data = data[0];
      }
    if (!data) {
      return;
    }
    this.budget = data;

    this.workOrderFormGroup
      .get('divisionAccountHeadDescription')
      .setValue(this.budget.accountHeadDescription);
    this.workOrderFormGroup
      .get('divisionBudgetHead')
      .setValue(
        `${this.budget.accountHeadMasterId} - ${this.budget.accountHeadDescription}`
      );
    this.workOrderFormGroup
      .get('divisionBudgetHeadI')
      .setValue(this.budget.divisionalBudgetHead);
    this.workOrderFormGroup
      .get('divisionBudgetHeadId')
      .setValue(this.budget.divisionalBudgetId);
    // this.workOrderFormGroup
    //   .get('alreadyApprovedCost')
    //   .setValue(this.budget.workOrderIssueAmount);
    // this.workOrderFormGroup
    //   .get('allotBudget')
    //   .setValue(this.budget.totalBudgetAmount);
    // const balanceBudget =
    //   Number(this.budget?.totalBudgetAmount) -
    //   Number(this.budget?.workOrderIssueAmount);

    // this.workOrderFormGroup.get('budgetRemaining').setValue(balanceBudget);
    // const balanceAfterApproval =
    //   balanceBudget -
    //   Number(this.workOrderFormGroup.get('currentEstimateCost').value);
    // this.workOrderFormGroup.get('balanceBudget').setValue(balanceAfterApproval);
    // this.budget.balanceBudget = balanceBudget;
    // this.budget.balanceAfterApproval = balanceAfterApproval;

    this.workOrderFormGroup
      .get('alreadyApprovedCost')
      .setValue(data.workOrderIssueAmount);
    this.workOrderFormGroup.get('allotBudget').setValue(data.totalBudgetAmount);
    const balanceBudget =
      Number(data?.totalBudgetAmount) - Number(data?.workOrderIssueAmount);
    this.workOrderFormGroup
      .get('budgetRemaining')
      .setValue(balanceBudget ? balanceBudget : 0);
    const balanceAfterApproval =
      balanceBudget -
      Number(this.workOrderFormGroup.get('currentEstimateCost').value);
    this.workOrderFormGroup
      .get('balanceBudget')
      .setValue(balanceAfterApproval ? balanceAfterApproval : 0);
    this.budget.balanceBudget = balanceBudget;
    this.budget.balanceAfterApproval = balanceAfterApproval;

    console.log(this.budget);
  }

  onChangePermitRequired(value: any) {
    const permitRequiredForm =
      this.workOrderFormGroup.get('permitRequiredForm');

    if (value === '1') {
      permitRequiredForm.setValidators([Validators.required]);
      permitRequiredForm.enable();
    } else {
      permitRequiredForm.clearValidators();
      permitRequiredForm.disable();
    }

    permitRequiredForm.updateValueAndValidity();
  }

  ngOnDestroy() {
    if (this.permitRequiredSubscription) {
      this.permitRequiredSubscription.unsubscribe();
    }
  }

  navigate(label: any, code: any) {
    this.router.navigate(['/main/work-order-creation'], {
      queryParams: {
        type: this.type,
        label: label,
        statusCode: code,
        processTypeName: 'WORKORDER',
      },
    });
  }
}
