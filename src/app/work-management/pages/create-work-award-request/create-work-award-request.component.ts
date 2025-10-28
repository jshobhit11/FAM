import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { WorkAwardService } from 'src/app/services/work-award.service';
import { EstimateService } from 'src/app/services/estimate.service';
import { RateContractorService } from '../../../services/rate-contractor.service';
import { MobileUtils } from 'src/app/lib/mobile-utils';
@Component({
  selector: 'app-create-work-award-request',
  templateUrl: './create-work-award-request.component.html',
  styleUrls: ['./create-work-award-request.component.scss'],
})
export class CreateWorkAwardRequestComponent implements OnInit {
  form: FormGroup;
  workorderRegisteredId: any;
  data: any = {};
  officeData: any = [];
  formData: any = {};
  vendorData: any = {};
  total: number = 0;
  gsttotal: any = 0;
  grandtotal: any = 0;
  labourAwardAmount: number = 0;
  budgetHead: any = {};
  VendorMasterId: any;
  pendingWorkAwardData: any = {};
  rcdetails: any = {};
  isSaveDisabled: boolean = false;
  type: any;
  vendorId: any;
  formDataValues: any = [];

  constructor(
    private route: ActivatedRoute,
    private workAwardService: WorkAwardService,
    private router: Router,
    private estimateService: EstimateService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private rcService: RateContractorService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      terms: ['', Validators.required],
    });
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.workorderRegisteredId = params['workOrderRegisteredId'];
      this.type = params['type'];

      this.data = await this.workAwardService.getWorkAwardData({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        workorderRegisteredId: this.workorderRegisteredId,
      });
      this.officeData = await this.workAwardService.getVendorDetails({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        officeId: sessionStorage.getItem('office-id'),
      });
      console.log(this.data);
      this.labourAwardAmount = Number(
        this.data?.estimationRegisteredResponse[0]?.totalLabourCharges
      );
      if (this.data.estimationMaterialLabourDetails) {
        this.data.estimationMaterialLabourDetails.forEach(
          (labourDetails: any) => {
            this.total +=
              Number(labourDetails.amount);
          }
        );
        const gst = Number(this.total) * 0.18;
        this.gsttotal = gst.toFixed();
        this.grandtotal = Number(this.total) + Number(this.gsttotal);
        this.labourAwardAmount = Number(
          this.data?.estimationRegisteredResponse[0]?.totalLabourCharges
        );
      }

      if (this.data.wmWorkAwardedLogDTOList.length > 0) {
        this.vendorId = this.data.wmWorkAwardedLogDTOList[0].vendorMasterId;
        await this.getVendorId(
          this.data.wmWorkAwardedLogDTOList[0].vendorMasterId
        );
      }

      const { estimationRegisteredResponse } = this.data;

      if (
        estimationRegisteredResponse[0]?.rateContractMasterId &&
        (this.data?.wmWorkorderRegistered?.workExecutionMethod ==
          'Total Turnkey' ||
          this.data?.wmWorkorderRegistered?.workExecutionMethod ==
            'Partial Turnkey')
      ) {
        this.rcdetails = await this.rcService.getRCContractorDataById({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          rateContractMasterId:
            estimationRegisteredResponse[0]?.rateContractMasterId,
        });
        console.log('RC DETAILS ==>', this.rcdetails);
      }

      const [data] =
        await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterId(
          {
            apiKey: sessionStorage.getItem('api-key'),
            serviceKey: sessionStorage.getItem('service-key'),
            userRole: sessionStorage.getItem('user-role'),
            userName: sessionStorage.getItem('user-name'),
            userCode: sessionStorage.getItem('user-code'),
            divisionalOfficeId: estimationRegisteredResponse[0]?.officeId,
            accountHeadMasterId:
              estimationRegisteredResponse[0]?.accountHeadMasterId,
            // divisionalOfficeId: 936,
            // accountHeadMasterId: 128,
          }
        );
      this.budgetHead = data;
      console.log(data);
    });
  }

  workAwardSumAmount: number = 0;

  async getVendorId(event: any) {
    this.isSaveDisabled = false;
    this.VendorMasterId = event;
    this.vendorData = await this.workAwardService.getDataByVendorMasterId({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      vendorMasterId: event,
    });

    this.pendingWorkAwardData =
      await this.workAwardService.getPendingWorkAwardByVendorId({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        vendorMasterId: event,
      });

    let sumAmt: number = 0;
    if (this.pendingWorkAwardData?.WmWorkorderRegisteredData?.length) {
      const workAwardedAmounts =
        this.pendingWorkAwardData.WmWorkorderRegisteredData.map(
          (v: any) => v.workAwardedAmount
        );
      if (workAwardedAmounts.length) {
        const newArr: any[] = [];
        workAwardedAmounts.forEach((v: any) => {
          if (v && v !== null && v !== 'null') {
            newArr.push(Number(v));
          }
        });
        sumAmt = newArr.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
      }
      const sumAmt2 = sumAmt.toFixed(2);
      this.workAwardSumAmount = Number(sumAmt2);
      const denominator =
        (Number(this.vendorData.emdEligibilityPercentage) / 100) *
        Number(this.vendorData.emdAmount);

      const wAwardedAmt =
        (Number(this.labourAwardAmount) + Number(sumAmt2)) /
        Number(denominator);
      console.log(wAwardedAmt);

      // if (Number(wAwardedAmt) > Number(this.vendorData.emdAmount)) {
      //   this.isSaveDisabled = true;
      //   this.snackBar.open(
      //     'Work awarded amounts is more than emd amount, so new work cannot be awarded.',
      //     'OK'
      //   );
      // }

      if (
        this.pendingWorkAwardData.WmWorkorderRegisteredData.length >=
        Number(this.vendorData.noofworksAllocated)
      ) {
        this.isSaveDisabled = true;
        this.snackBar.open(
          `Maximum ${this.vendorData.noofworksAllocated} works can be allocate, so new work cannot be awarded.`,
          'OK',
          {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
      }
    } else {
      if (
        this.data?.wmWorkorderRegistered?.workExecutionMethod ==
        'Labour Contract'
      ) {
        this.snackBar.open('No Work order Registered Data Found', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    }
  }

  changeFn(event, index) {
    this.data.estimationMaterialLabourDetails =
      this.data.estimationMaterialLabourDetails.map((item) => {
        if (
          item.estimationMaterialsRegisteredId == event.target.value &&
          event.target.checked
        ) {
          const totalFivePercent =
            Number(
              this.data.estimationRegisteredResponse[0].estimationTotalCost
            ) * 0.1;

          if (item.amount > totalFivePercent) {
            this.snackBar.open(
              'Selected materials cost should not be greater than 10% of Total Estimate Cost',
              'OK',
              {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              }
            );
            this.data.estimationMaterialLabourDetails[index].amount = 0;
            this.labourAwardAmount =
              Number(this.labourAwardAmount) - Number(item.amount);
          }

          this.data.estimationMaterialLabourDetails[index].amount = Number(
            item.amount
          ).toFixed(2);

          this.labourAwardAmount =
            Number(this.labourAwardAmount) + Number(item.amount);
          console.log(this.labourAwardAmount);
          return {
            ...item,
            checked: !item.checked,
          };
        }
        if (
          item.estimationMaterialsRegisteredId == event.target.value &&
          event.target.checked == false
        ) {
          const totalFivePercent =
            Number(
              this.data.estimationRegisteredResponse[0].estimationTotalCost
            ) * 0.1;

          if (item.amount > totalFivePercent) {
            this.snackBar.open(
              'Selected materials cost should not be greater than 10% of Total Estimate Cost',
              'OK'
            );
            this.data.estimationMaterialLabourDetails[index].amount = 0;
            this.labourAwardAmount =
              Number(this.labourAwardAmount) - Number(item.amount);
          }

          this.data.estimationMaterialLabourDetails[index].amount = item.amount;
          this.labourAwardAmount =
            Number(this.labourAwardAmount) - Number(item.amount);
          console.log(this.labourAwardAmount);
          return {
            ...item,
            checked: !item.checked,
          };
        } else {
          return item;
        }
      });
  }

  calculateGrandTotal() {
    let additionalTotal = 0;
    if (this.data.estimationAddlChargesRegisteredDetails && Array.isArray(this.data.estimationAddlChargesRegisteredDetails)) {
      for (let item of this.data.estimationAddlChargesRegisteredDetails) {
        additionalTotal += Number(item.amount);
      }
    }
    let grandTotal = additionalTotal + (this.total ? this.total : 0);
    return Number(grandTotal.toFixed(2)); 
  }
  
  openConfirmationpopupDialog() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        // this.onSubmit();
        this.submitWorkAward();
      }
    });
  }

  navigate(label, code) {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        type: this.type,
        label: label,
        statusCode: code,
        processTypeName: 'WORKORDER',
      },
    });
  }

  allChecked: boolean = false;
  selectAll(e) {
    this.allChecked = e;
    this.data.estimationMaterialLabourDetails =
      this.data.estimationMaterialLabourDetails.map((m) => ({
        ...m,
        checked: e,
      }));
  }

  submitWorkAward() {
    const TotalAmount =
      Number(this.workAwardSumAmount) + Number(this.labourAwardAmount);
    const FIVE_PRECENT_MATERIAL =
      (Number(this.vendorData.emdEligibilityPercentage) / 100) *
      Number(TotalAmount);
    console.log(FIVE_PRECENT_MATERIAL);
    if (FIVE_PRECENT_MATERIAL > this.vendorData.emdAmount) {
      this.snackBar.open(
        '5% of ongoing works awarded amount should not be greater than E.M.D Amount.',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      this.isSaveDisabled = true;
      return;
    }

    if (!this.formData.workStartDate && !this.formData.workEndDate) {
      this.snackBar.open(
        'Please enter work start data and work end date first',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      // this.isSaveDisabled = true;
      return;
    }
    if (
      this.pendingWorkAwardData?.WmWorkorderRegisteredDataCount >
      this.vendorData?.noofworksAllocated
    ) {
      this.snackBar.open(
        'Please enter work start data and work end date first',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      this.isSaveDisabled = true;
      return;
    }
    if (Number(this.calculateGrandTotal()) >= 100000 && this.data.estimationRegisteredResponse.woExecutionMethodCode==='LC' ) {
      this.snackBar.open(
        'Each Work allotted to Vendor as a work award should not be greater than 1 Lakh',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      this.isSaveDisabled = true;
      return;
    } else {
      const filter: any = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        workOrderRegisteredId:
          this.data.wmWorkorderRegistered.wmWorkorderRegisteredId,
        VendorMasterId: this.VendorMasterId
          ? this.VendorMasterId
          : this.rcdetails.vendorId,
        workAwardNo: this.data.wmWorkorderRegistered.workAwardNo,
        scheduleStartDate: this.formData.workStartDate,
        scheduleEndDate: this.formData.workEndDate,
        workawardedAmount: this.calculateGrandTotal(),
      };

      const termsAndConditionData = this.formDataValues.map((formData) => {
        return {
          termsConditionsHead: formData.subject,
          termsConditionsData: formData.terms,
          wmWorkorderRegisteredId: this.workorderRegisteredId,
        };
      });

      const body: any = {
        wmWorkAwardedLogDTO: {
          wmWorkorderRegisteredId: this.workorderRegisteredId,
          vendorMasterId: this.VendorMasterId
            ? this.VendorMasterId
            : this.rcdetails.vendorId,
          workAwardedAmount: this.calculateGrandTotal(),
          emdAmount: this.vendorData.emdAmount,
          emdReceiptNo: this.vendorData.emdReceiptNo,
          emdReceiptDate: this.vendorData.emdReceiptDate,
          rateContractMasterId: this.rcdetails?.vendorId
            ? this.rcdetails.vendorId
            : 0,
        },
        wmWorkAwardTermsCondsLogDTOArray: [...termsAndConditionData],
      };
      this.workAwardService
        .saveWorkAwardData(filter, body)
        .then((saveWorkAward) => {
          if (saveWorkAward.messageType == 'SUCCESS') {
            this.snackBar
              .open('Work award created successfully', 'OK', {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              })
              .onAction()
              .subscribe(() => {
                this.snackBar.dismiss();
                this.router.navigate([`/main/work-order-summary`], {
                  queryParams: {
                    label: 'WORK AWARD REQUEST',
                    statusCode: 22,
                    type: 'list',
                    processTypeName: 'WORKORDER',
                  },
                });
              });
          } else if (saveWorkAward.messageType == 'FAILURE') {
            this.snackBar
            .open(saveWorkAward.messageText, 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            })
          }
        })
        .catch((err) => {
          console.log(err);
          this.snackBar.open(
            'Something went wrong while saving work award request.',
            'OK'
          );
        });
    }
  }
  addToTable() {
    if (this.form.valid) {
      this.formDataValues.push(this.form.value);
      this.form.reset();
    }
  }
  deleteRow(index: number) {
    if (index >= 0) {
      this.formDataValues.splice(index, 1);
    }
  }
}
