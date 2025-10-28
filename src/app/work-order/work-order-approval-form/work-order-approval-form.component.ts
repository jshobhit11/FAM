import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { EstimateService } from 'src/app/services/estimate.service';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import * as dayjs from 'dayjs';
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
// import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-work-order-approval-form',
  templateUrl: './work-order-approval-form.component.html',
  styleUrls: ['./work-order-approval-form.component.scss'],
})
export class WorkOrderApprovalFormComponent implements OnInit {
  workOrderFormGroup: FormGroup;
  workorderRegisteredId: any;

  data: any = {};
  budget: any = {};
  globalArray: any = [];
  estimationRegisteredId: any;
  additionalCharges: any = [];
  budgetData: any = [];
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  sh: any;
  raisedBy: any;
  regularArray: any = [];
  creditArray: any = [];
  role: any;
  type: any;
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private workOrderService: WorkOrderService,
    private estimateService: EstimateService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    // private loader: LoaderService,
  ) {
    this.workOrderFormGroup = new FormGroup({
      estimationNo: new FormControl('', []),
      workType: new FormControl('', []),
      escom: new FormControl('', []),
      manualWorkOrder: new FormControl('', [Validators.required]),
      division: new FormControl('', []),
      permitRequired: new FormControl('', []),
      permitRequiredForm: new FormControl('', []),
      allotBudget: new FormControl('', []),
      budgetRemaining: new FormControl('', []),
      currentEstimateCost: new FormControl('', []),
      executionMethod: new FormControl('', []),
      workCategory: new FormControl('', []),
      office: new FormControl('', []),
      manualWorkDate: new FormControl('', [Validators.required]),
      divisionBudgetHead: new FormControl('', []),
      approvedBy: new FormControl('', []),
      shutdownRequired: new FormControl('', [Validators.required]),
      alreadyApprovedCost: new FormControl('', []),
      expenseInccured: new FormControl('', []),
      balanceBudget: new FormControl('', []),
      workDescription: new FormControl('', []),
      priority: new FormControl('low', []),
      adddays: new FormControl('', []),
      raisedBy: new FormControl('', []),
      workOrderEndDate: new FormControl('', []),
      workAwardRequired: new FormControl('', [Validators.required]),
      budgetControl: new FormControl('', []),
      estimationRemarks: new FormControl('', []),
      divisionAccountHeadDescription: new FormControl('', []),
      divisionBudgetHeadI: new FormControl('', []),
    });
  }

  ngOnInit() {
    const userRole = sessionStorage.getItem('user-role');
    this.role = userRole.split('_')[1];

    this.raisedBy = `${sessionStorage.getItem(
      'user-name'
    )}-${sessionStorage.getItem('user-role')}`;

    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.estimationRegisteredId = params['estimationRegisteredId'];
      this.workorderRegisteredId = params['workorderRegisteredId'];
      this.workOrderFormGroup.get('estimationNo').disable;
      this.type = params['type'];
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      this.data = await this.workOrderService.getRegisteredWorkOrderData({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        estimationRegisteredId: this.estimationRegisteredId,
        operationCode: 'A',
      });

      const {
        estimationWorkScope,
        estimationMaterailsRegistered,
        estimationRegistered,
        wmWorkorderRegistered,
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
        }else if (estimationRegistered.workCategory == 'Repairs & Maintenance Works') {
          derivedMainHeadCode = 74;
        }else if (estimationRegistered.woExecutionMethodCode == 'SE' && estimationRegistered.workCategory == 'Service Connection Works') {
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
        } else if (estimationRegistered.woExecutionMethodCode == 'SE' && estimationRegistered.workCategory === 'Service Connection Works') {
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
        
      if (estimationRegistered?.woExecutionMethodName === 'Self Execution') {
        this.workOrderFormGroup.get('workAwardRequired').setValue('0');
        this.workOrderFormGroup.get('workAwardRequired').disable();
      } else if (
        estimationRegistered.woExecutionMethodName === 'Labour Contract' ||
        estimationRegistered.woExecutionMethodName === 'Total Turnkey' ||
        estimationRegistered.woExecutionMethodName === 'Partial Turnkey'
      ) {
        this.workOrderFormGroup.get('workAwardRequired').setValue('1');
        this.workOrderFormGroup.get('workAwardRequired').disable();
      } else if (estimationRegistered?.woExecutionMethodName === 'Department') {
        this.workOrderFormGroup
          .get('workAwardRequired')
          .setValue(this.data?.wmWorkorderRegistered?.isWorkAwardRequired);
      }

      if (estimationWorkScope) {
        estimationWorkScope?.forEach((estimate: any) => {
          const a = estimationMaterailsRegistered.filter(
            (e: any) =>
              e.estimationWorkScopeDataId ===
              estimate.estTemplateWorkScopeMasterId
          );
          this.globalArray.push({ estimate, data: a });
        });
        this.regularArray = this.globalArray.filter(
          (v: any) => v.estimate.estimateType === '1'
        );
        this.creditArray = this.globalArray.filter(
          (v: any) => v.estimate.estimateType === '2'
        );
      }

      if (this.data) {
        const { estimationAddlChargesRegistered } = this.data;
        let accountHeadCode = null;
        if (estimationRegistered.accountHeadMasterId !== 'null') {
          const [filteredBudgetData] = this.budgetData.filter(
            (budget: any) =>
              budget.accountHeadMasterId ==
              estimationRegistered.accountHeadMasterId
          );
          this.budget = filteredBudgetData;
          accountHeadCode = filteredBudgetData?.accountHeadCode;
          await this.getDivisionalBudgetData(
            estimationRegistered.accountHeadMasterId
          );
        }
        this.additionalCharges = estimationAddlChargesRegistered;
        this.addChargesBeforeTotalLabour =
          this.data.estimationAddlChargesRegistered.filter(
            (v: any) => Number(v.chargesSequenceOrder) < 5
          );
        this.addChargesAfterTotalLabour =
          this.data.estimationAddlChargesRegistered.filter(
            (v: any) => Number(v.chargesSequenceOrder) >= 5
          );
        this.workOrderFormGroup
          .get('estimationNo')
          .setValue(estimationRegistered?.estimationNo);
        this.workOrderFormGroup
          .get('executionMethod')
          .setValue(estimationRegistered?.woExecutionMethodName);
        this.workOrderFormGroup
          .get('raisedBy')
          .setValue(
            `${sessionStorage.getItem('user-name')}-${sessionStorage.getItem(
              'user-role'
            )}`
          );
        if (estimationRegistered.woExecutionMethodCode == 'SE') {
        } else {
          this.workOrderFormGroup
            .get('budgetControl')
            .setValue(estimationRegistered.accountHeadMasterId);
        }

        this.workOrderFormGroup
          .get('currentEstimateCost')
          .setValue(estimationRegistered?.estimationTotalCost);
        this.workOrderFormGroup
          .get('divisionBudgetHead')
          .setValue(`${accountHeadCode}-${this.budget.accountHeadDescription}`);
        this.workOrderFormGroup
          .get('workDescription')
          .setValue(estimationRegistered?.estimationWorkDesc);
        this.workOrderFormGroup
          .get('workOrderEndDate')
          .setValue(this.data?.wmWorkorderRegistered?.workorderEndDate);
        this.workOrderFormGroup
          .get('workCategory')
          .setValue(this.data?.wmWorkorderRegistered?.wrokCategory);
        this.workOrderFormGroup
          .get('estimationRemarks')
          .setValue(estimationRegistered?.estimationRemarks);
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
        this.workOrderFormGroup
          .get('manualWorkOrder')
          .setValue(
            this.data?.wmWorkorderRegistered?.manualTentativeWorkorderNo
          );
        this.workOrderFormGroup
          .get('manualWorkDate')
          .setValue(
            this.data?.wmWorkorderRegistered?.manualTentativeWorkorderDate
          );
        this.workOrderFormGroup
          .get('permitRequired')
          .setValue(this.data?.wmWorkorderRegistered?.isPermitRequired);
        this.workOrderFormGroup
          .get('permitRequiredForm')
          .setValue(this.data?.wmWorkorderRegistered?.permitRequiredFrom);
        this.workOrderFormGroup
          .get('shutdownRequired')
          .setValue(this.data?.wmWorkorderRegistered?.isShutdownRequired);
        this.workOrderFormGroup
          .get('expenseInccured')
          .setValue(this.data?.wmWorkorderRegistered?.expenseIncuredCost);
        this.workOrderFormGroup
          .get('adddays')
          .setValue(this.data?.wmWorkorderRegistered?.workPeriod);
        this.workOrderFormGroup
          .get('priority')
          .setValue(this.data?.wmWorkorderRegistered?.workPriorityId);
        // if (estimationRegistered?.woExecutionMethodName === 'Department') {
        //   this.workOrderFormGroup
        //     .get('workAwardRequired')
        //     .setValue(this.data.wmWorkorderRegistered?.isWorkAwardRequired);
        // }

        // this.addDays(
        //   this.workOrderFormGroup
        //     .get('adddays')
        //     .setValue(this.data.wmWorkorderRegistered?.workPeriod)
        // );
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
  }
  onOpenForwardData(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
       data: { action: 'forward_serve' },
    });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
        this.forwardData();
      }
    });
  }
  openConfirmationpopupDialog() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.submitWorkOrderForm();
      }
    });
  }
  get basicRate(): string {
    const materialCostStr =
      this.data?.estimationRegistered?.estimationMaterialCost || '0';
    const labourCostStr =
      this.data?.estimationRegistered?.estimationLabourCost || '0';
    const materialCost = parseFloat(materialCostStr);
    const labourCost = parseFloat(labourCostStr);
    const basicRate = materialCost + labourCost;
    return basicRate.toFixed(2);
  }
  async submitWorkOrderForm() {
    let data = this.workOrderFormGroup.value;
    data.estimationRegisteredId =
      this.data.estimationRegistered.estimationRegisteredId;
    const accountHeadMasterId =
      this.data?.estimationRegistered?.applicationTypeCode == 'PD'
        ? this.data?.estimationWorkScope[0]?.accountHeadMasterId
        : this.workOrderFormGroup.get('budgetControl').value;
    let params: any = {
      wmWorkorderRegisteredId: this.workorderRegisteredId ||this.data.wmWorkorderRegistered.wmWorkorderRegisteredId,
      workorderNo: '',
      workorderDate: '',
      estimationRegisteredId: data.estimationRegisteredId,
      estimationNo: this.data.estimationRegistered.estimationNo,
      workExecutionMethod: data.executionMethod,
      workType: '',
      wrokCategory: this.budget?.budgetWorkType,
      officeId: this.data.estimationRegistered.officeId,
      manualTentativeWorkorderNo: data.manualWorkOrder,
      manualTentativeWorkorderDate: data.manualWorkDate,
      divisionalOfficeId: 0,
      accountHeadMasterId: Number(accountHeadMasterId),
      divisionalBudgetId: this.budget?.divisionalBudgetId,
      isPermitRequired: data.permitRequired,
      permitRequiredFrom: data.permitRequiredForm,
      isShutdownRequired: data.shutdownRequired,
      allotedBudget: data.allotBudget,
      shutdownTime: '',
      alreadyWosApprovedCost: data.alreadyApprovedCost,
      expenseIncuredCost: data.expenseInccured,
      balanceRemainingBudget: data.budgetRemaining,
      estimationCost: data.currentEstimateCost,
      balanceBudgetAfterWoApproval: data.balanceBudget,
      workDescription: data.workDescription,
      pendingAtDesigId: 0,
      approvedBy: 0,
      approvalStatus: '',
      approvalRemarks: this.approveDataPayload.Remarks,
      approvedOn: '',
      designationId: 0,
      woStatus: '',
      workPriorityId: data.priority,
      workPeriod: data.adddays,
      workorderStatus: '',
      workorderEndDate: data.workOrderEndDate,
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
      isWorkAwardRequired:
        this.workOrderFormGroup.get('workAwardRequired').value,
      // estWorkType:this.data?.wmWorkorderRegistered?.estWorkType
      workCategoryMasterId:this.data.estimationRegistered.workCategoryMasterId,
    };
    let query: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      serviceRegistrationsId:
        this.data.estimationRegistered.serviceRegistrationId,
      isRevisedWorkorder:
        this.data?.estimationRegistered?.estimationType === 'RE' ? 1 : 0,
    };
    this.isLoading = true;
    // this.loader.show('Approving work order Data...');
    const submitEstimationForm =
      await this.workOrderService.approveWorkOrderData(query, params);

    console.log(submitEstimationForm);
    if (submitEstimationForm.error) {
      this.snackBar.open(`${submitEstimationForm.error}`, 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }
    if (submitEstimationForm.messageType !== 'SUCCESS') {
      this.snackBar.open(submitEstimationForm.messageText, 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }

    if (submitEstimationForm.messageType == 'SUCCESS') {
      // this.loader.hide();
      const snackBarRef = this.snackBar.open('Work Order Approved Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        snackBarRef.onAction().subscribe(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/main/work-order-package-report'], {
            queryParams: {
              estimationRegisteredId: this.estimationRegisteredId,
            },
          });
          this.isLoading = false;
        });
    }
  }

  addDays() {
    let result = new Date();
    result.setDate(
      result.getDate() + this.workOrderFormGroup.get('adddays').value
    );
    this.workOrderFormGroup
      .get('workOrderEndDate')
      .setValue(result.toISOString().substring(0, 10));
    return result;
  }

  async getDivisionalBudgetData(event) {
    let data = await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterId({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      divisionalOfficeId: sessionStorage.getItem('office-id'),
      accountHeadMasterId: event,
    });
    if (Array.isArray(data)) {
      data = data[0];
    }
    if (!data) {
      return;
    }

    this.budget = data;
    this.workOrderFormGroup.get('divisionAccountHeadDescription').setValue(data.accountHeadDescription);
    this.workOrderFormGroup.get('divisionBudgetHeadI').setValue(data.divisionalBudgetHead);
    // this.workOrderFormGroup.get('divisionBudgetHead').setValue(`${this.budget.accountHeadMasterId} - ${this.budget.accountHeadDescription}`);
    this.workOrderFormGroup.get('alreadyApprovedCost').setValue(data.workOrderIssueAmount);
    this.workOrderFormGroup.get('allotBudget').setValue(data.totalBudgetAmount);
  
    // Calculate balance budget and balance after approval
    const balanceBudget = Number(data.totalBudgetAmount) - Number(data.workOrderIssueAmount);
    this.workOrderFormGroup.get('budgetRemaining').setValue(balanceBudget ? balanceBudget : 0);
    const balanceAfterApproval = balanceBudget - Number(this.workOrderFormGroup.get('currentEstimateCost').value);
    this.workOrderFormGroup.get('balanceBudget').setValue(balanceAfterApproval ? balanceAfterApproval : 0);
  
    // Store calculated values in `this.budget`
    this.budget.balanceBudget = balanceBudget;
    this.budget.balanceAfterApproval = balanceAfterApproval;
  }
  
  async forwardData() {
    let data = this.workOrderFormGroup.value;

    data.accountHeadMasterId = data.divisionBudgetHead;
    data.divisionalBudgetId = data.divisionBudgetHeadId;
    data.estimationRegisteredId =
      this.data.estimationRegistered.estimationRegisteredId;
    const accountHeadMasterId =
      this.data?.estimationRegistered?.applicationTypeCode == 'PD'
        ? this.data?.estimationWorkScope[0]?.accountHeadMasterId
        : this.workOrderFormGroup.get('budgetControl').value;
    const param: any = {

      wmWorkorderRegisteredId:
        this.data.wmWorkorderRegistered.wmWorkorderRegisteredId ||0,
      workorderNo: '',
      workorderDate: '',
      estimationRegisteredId: data.estimationRegisteredId,
      estimationNo: this.data.estimationRegistered.estimationNo,
      workExecutionMethod: data.executionMethod,
      workType: '',
      wrokCategory: this.budget?.budgetWorkType,
      officeId: this.data.estimationRegistered.officeId,
      manualTentativeWorkorderNo: data.manualWorkOrder,
      manualTentativeWorkorderDate: data.manualWorkDate,
      divisionalOfficeId: 0,
      accountHeadMasterId: Number(accountHeadMasterId),
      divisionalBudgetId: this.budget?.divisionalBudgetId,
      isPermitRequired: data.permitRequired,
      permitRequiredFrom: data.permitRequiredForm,
      isShutdownRequired: data.shutdownRequired,
      allotedBudget: data.allotBudget,
      shutdownTime: '',
      alreadyWosApprovedCost: data.alreadyApprovedCost,
      expenseIncuredCost: data.expenseInccured,
      balanceRemainingBudget: data.budgetRemaining,
      estimationCost: data.currentEstimateCost,
      balanceBudgetAfterWoApproval: data.balanceBudget,
      workDescription: data.workDescription,
      pendingAtDesigId: 0,
      approvedBy: 0,
      approvalStatus: '',
      approvalRemarks: this.forwardDataPayload.Remarks,
      approvedOn: '',
      designationId: 0,
      woStatus: '',
      workPriorityId: data.priority,
      workPeriod: data.adddays,
      workorderStatus: '',
      workorderEndDate: data.workOrderEndDate,
      isWorkAwardRequired: data.workAwardRequired,
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
      storeOfficeId: 0,
      storeCode: '',
      serviceRegistrationsId:
        this.data.estimationRegistered.serviceRegistrationId,
      woExecutionMethodId: 0,
      workAwardedAmount: '',
      // workorderExecutedBy: 0,
      // workorderExecutedDate: '2023-08-24T03:41:35.819Z',
      // workorderExecutionRemarks: '',
      // workorderInstallationDate: '2023-08-24T03:41:35.819Z',
      // pkFlag: 0,
    };
    this.isLoading = true;
    // this.loader.show('Forwarding Work order approval data...');
    const submitForward = await this.workOrderService.forwardWorkOrderData(
      {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        serviceRegistrationsId:
          this.data.estimationRegistered.serviceRegistrationId,
        forwardingTo: this.forwardDataPayload.forwardTo,
      },
      param
    );
    if (submitForward.error) {
      this.snackBar.open(`${submitForward.error}`, 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }
    if (submitForward.messageType !== 'SUCCESS') {
      this.snackBar.open(submitForward.messageText, 'OK');
      return;
    }

    if (submitForward.messageType == 'SUCCESS') {
      // this.loader.hide();
       this.snackBar.open('Work order forwarded successfully', 'OK');
       const snackBarRef = this.snackBar.open('Work order forwarded successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        snackBarRef.onAction().subscribe(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/main/work-order-pending'], {
            queryParams: {
              statusCode: 9,
              label: 'WORK ORDER APPROVAL',
              type: 'list',
              processTypeName: 'WORKORDER',
            },
          });
          this.isLoading = false;
        });
    }
  }

  onReport() {
    this.router.navigate(['/main/work-order-package-report']);
  }

  onChangePermitRequired(value: any) {
    if (value === '1') {
      this.workOrderFormGroup
        .get('permitRequiredForm')
        .setValidators([Validators.required]);
    } else {
      this.workOrderFormGroup.get('permitRequiredForm').disable();
    }
  }

  navigate(label, code) {
    this.router.navigate(['/main/work-order-pending'], {
      queryParams: {
        type: this.type,
        label: label,
        statusCode: code,
        processTypeName: 'WORKORDER',
      },
    });
  }

  forwardDataPayload: any = {};
  approveDataPayload: any = {};
  radioType(type: any, value) {
    const userRole = sessionStorage.getItem('user-role');
    const username = sessionStorage.getItem('user-name');

    console.log(userRole, username);

    this.sh = value;

    if (type === 'forward') {
      this.forwardDataPayload.forwardTo = this.data.designationMasterDTOList;
      this.forwardDataPayload.forwardDate = dayjs(new Date()).format(
        'YYYY-MM-DD'
      );
      this.forwardDataPayload.forwardBy = `${username} - ${userRole}`;
    }
    if (type === 'approve') {
      this.approveDataPayload.approvedBy = `${username} - ${userRole}`;

      this.approveDataPayload.approvedDate = dayjs(new Date()).format(
        'YYYY-MM-DD'
      );
    }
  }
}
