import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { WorkAwardService } from 'src/app/services/work-award.service';
import { EstimateService } from 'src/app/services/estimate.service';
import { RateContractorService } from '../../../services/rate-contractor.service';
import * as dayjs from 'dayjs';
@Component({
  selector: 'app-work-award',
  templateUrl: './work-award.component.html',
  styleUrls: ['./work-award.component.scss'],
})
export class WorkAwardComponent implements OnInit {
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
  forwardData: any = {};
  userRole: string = '';
  type: any;
  workAwardedAmount: any;
  constructor(
    private route: ActivatedRoute,
    private workAwardService: WorkAwardService,
    private router: Router,
    private estimateService: EstimateService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private rcService: RateContractorService
  ) {}

  ngOnInit() {
    this.userRole = sessionStorage.getItem('user-role').split('_')[1];
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.workorderRegisteredId = params['workorderRegisteredId'];
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
        // officeId: 936,
      });
      console.log(this.data);

      this.labourAwardAmount = Number(
        this.data?.estimationRegisteredResponse[0]?.totalLabourCharges
      );
      this.workAwardedAmount = Number(
        this.data?.wmWorkAwardedLogDTOList[0]?.workAwardedAmount
      )
      if (this.data.estimationMaterialLabourDetails) {
        this.data.estimationMaterialLabourDetails.forEach(
          (labourDetails: any) => {
            this.total +=
              Number(labourDetails.amount) ;
          }
        );
        const gst = Number(this.total) * 0.18;
        this.gsttotal = gst.toFixed();
        this.grandtotal = Number(this.total) + Number(this.gsttotal);
        this.labourAwardAmount = Number(
          this.data?.estimationRegisteredResponse[0]?.totalLabourCharges
        );
      }

      const { estimationRegisteredResponse } = this.data;

      if (
        estimationRegisteredResponse[0].rateContractMasterId &&
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
        console.log('RC DETAILS ==>', this.rcdetails, {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          rateContractMasterId:
            this.data.wmWorkAwardedLogDTOList[0]?.rateContractMasterId,
        });
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
      if (this.data.wmWorkAwardedLogDTOList.length > 0) {
        await this.getVendorId(
          this.data.wmWorkAwardedLogDTOList[0].vendorMasterId
        );
      }
    });
  }
  vendorId: number;

  async submitWorkAward() {
    if (!this.formData.workStartDate && !this.formData.workEndDate) {
      this.snackBar.open(
        'Please enter work start data and work end date first',
        'OK'
      );
    } else {
      const filter: any = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        workOrderRegisteredId:
          this.data.wmWorkorderRegistered.wmWorkorderRegisteredId,

        VendorMasterId: this.data.wmWorkAwardedLogDTOList[0]?.vendorMasterId,
        workAwardNo: this.data.wmWorkorderRegistered.workAwardNo,
        WorkAwardDate: this.data.wmWorkorderRegistered.workAwardDate,
        scheduleStartDate: this.formData.workStartDate,
        scheduleEndDate: this.formData.workEndDate,
        workawardedAmount: this.labourAwardAmount,
        workAwardedBy: this.data.wmWorkorderRegistered.workAwardedBy,
      };
      const params: any = {
        wmWorkorderRegisteredId:
          this.data.wmWorkorderRegistered.wmWorkorderRegisteredId,

        vendorMasterId: this.data.wmWorkAwardedLogDTOList[0]?.vendorMasterId,
        workAwardedAmount: Number(this.labourAwardAmount),
        emdAmount: this.vendorData.emdAmount,
        emdReceiptNo: this.vendorData.emdReceiptNo,
        emdReceiptDate: this.vendorData.emdReceiptDate,

        rateContractorMasterId:
          this.data.wmWorkAwardedLogDTOList[0]?.rateContractMasterId,
      };
      console.log(filter, params);
      const saveWorkAward = await this.workAwardService.saveWorkAwardData(
        filter,
        params
      );
      console.log(saveWorkAward);
      if (saveWorkAward.messageType == 'SUCCESS') {
        this.snackBar
          .open('Work award created successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => {
            this.snackBar.dismiss();
            this.router.navigate([
              `/main/awarding-of-work-on-labour-contract/${this.workorderRegisteredId}`,
            ]);
          });
      }
    }
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

    this.vendorId = this.vendorData.vendorMasterId;
    this.formData.workStartDate =
      this.data.wmWorkorderRegistered.scheduleStartDate;
    this.formData.workEndDate = this.data.wmWorkorderRegistered.scheduleEndDate;
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
    // if (this.pendingWorkAwardData.WmWorkorderRegisteredData.length) {
    //   const workAwardedAmounts =
    //     this.pendingWorkAwardData.WmWorkorderRegisteredData.map(
    //       (v: any) => v.workAwardedAmount
    //     );
    //   if (workAwardedAmounts.length) {
    //     const newArr: any[] = [];
    //     workAwardedAmounts.forEach((v: any) => {
    //       if (v && v !== null && v !== 'null') {
    //         newArr.push(Number(v));
    //       }
    //     });
    //     sumAmt = newArr.reduce(
    //       (accumulator, currentValue) => accumulator + currentValue,
    //       0
    //     );
    //   }
    //   const sumAmt2 = sumAmt.toFixed(2);
    //   this.workAwardSumAmount = Number(sumAmt2);
    //   const denominator =
    //     (Number(this.vendorData.emdEligibilityPercentage) / 100) *
    //     Number(this.vendorData.emdAmount);

    //   const wAwardedAmt =
    //     Number(this.labourAwardAmount) + Number(sumAmt2) / Number(denominator);
    //   console.log(wAwardedAmt);
    //   // console.log(sumAmt2, wAwardedAmt, this.vendorData.emdAmount);
    //   // console.log(
    //   //   this.pendingWorkAwardData.WmWorkorderRegisteredData.length,
    //   //   this.vendorData.noofworksAllocated
    //   // );

    //   if (Number(wAwardedAmt) > Number(this.vendorData.emdAmount)) {
    //     this.isSaveDisabled = true;
    //     this.snackBar.open(
    //       'Work awarded amounts is more than emd amount, so new work cannot be awarded.',
    //       'OK'
    //     );
    //   } else if (
    //     this.pendingWorkAwardData.WmWorkorderRegisteredData.length >=
    //     Number(this.vendorData.noofworksAllocated)
    //   ) {
    //     this.isSaveDisabled = true;
    //     this.snackBar.open(
    //       `Maximum ${this.vendorData.noofworksAllocated} works can be allocate, so new work cannot be awarded.`,
    //       'OK'
    //     );
    //   }
    // }
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
      const wAwardedAmt = Number(this.labourAwardAmount) + Number(sumAmt2);
      console.log(denominator, wAwardedAmt);

      // if (Number(wAwardedAmt) > Number(this.vendorData.emdAmount)) {
      //   this.isSaveDisabled = true;
      //   this.snackBar.open(
      //     'Work awards amounts is more than emd amount, so new work cannot be awarded.',
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
        // this.snackBar.open('No Work order Registered Data Found', 'OK');
      }
    }
  }

  onReport() {
    this.router.navigate(['/main/awarding-of-work-on-labour-contract']);
  }

  openConfirmationpopupDialog(displaybutton) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        if (displaybutton == 'Forward') {
          this.submitForward();
        }
        if (displaybutton == 'Approve') {
          this.submitApproved();
        }
      }
    });
  }

  sh: any;
  approveData: any = {};
  displayButton: any = '';
  onRadioChange(value, key) {
    console.log(value, key);
    this.sh = value;
    this.forwardData.forwardBy = `${this.userRole} - ${sessionStorage.getItem(
      'user-name'
    )}`;
    this.approveData.date = dayjs().format('YYYY-MM-DD');
    this.approveData.remarks = this.data?.wmWorkAwardedLogDTOList[0]?.remarks;
    if (this.userRole == 'AE') {
      this.forwardData.forwardTo = 'AEE';
      this.forwardData.forwardRemarks =
        this.data?.wmWorkAwardedLogDTOList[0]?.remarks;
      this.displayButton = 'Forward';
    }
    if (this.userRole == 'AEE') {
      this.forwardData.forwardTo = 'AETDO';
      this.forwardData.forwardRemarks =
        this.data?.wmWorkAwardedLogDTOList[0]?.remarks;
      this.displayButton = 'Forward';
    }
    if (this.userRole == 'AETDO') {
      this.forwardData.forwardTo = 'AEEO';
      this.forwardData.forwardRemarks =
        this.data?.wmWorkAwardedLogDTOList[0]?.remarks;
      this.displayButton = 'Forward';
    }
    if (this.userRole == 'AEEO') {
      this.forwardData.forwardTo = 'AOIA';
      this.forwardData.forwardRemarks =
        this.data?.wmWorkAwardedLogDTOList[0]?.remarks;
      this.displayButton = 'Forward';
    }
    if (this.userRole == 'AOIA') {
      this.forwardData.forwardTo = 'EE';
      this.forwardData.forwardRemarks =
        this.data?.wmWorkAwardedLogDTOList[0]?.remarks;
      this.displayButton = 'Forward';
    }
    if (this.userRole == 'EE') {
      this.approveData.approvedBy = `${this.userRole} - ${sessionStorage.getItem(
        'user-name'
      )}`;
      this.displayButton = 'Approve';
    }
  }

  async submitForward() {
    if (!this.formData.workStartDate && !this.formData.workEndDate) {
      this.snackBar.open(
        'Please ,enter work start data and work end date first',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
    }
    if (Number(this.workAwardedAmount) >= 100000 && this.data?.estimationRegisteredResponse?.woExecutionMethodCode ==='LC' ) {
      this.snackBar.open(
        'Each Work allotted to Vendor as a work award should not be greater than 1 Lakh',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      this.isSaveDisabled = true;
      return;
    }
    const TotalAmount =
      Number(this.workAwardSumAmount) + Number(this.labourAwardAmount);
    console.log(TotalAmount);

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
        workawardedAmount: this.workAwardedAmount,
        wmWorkAwardedLogId:
          this.data.wmWorkAwardedLogDTOList[0]?.wmWorkAwardedLogId || 0,
        designationId: '',
      };
      const body: any = {
        wmWorkorderRegisteredId: this.workorderRegisteredId,
        vendorMasterId: this.VendorMasterId
          ? this.VendorMasterId
          : this.rcdetails.vendorId,

        workAwardedAmount: this.workAwardedAmount,
        emdAmount: this.vendorData.emdAmount,
        emdReceiptNo: this.vendorData.emdReceiptNo,
        emdReceiptDate: this.vendorData.emdReceiptDate,
        rateContractMasterId: this.rcdetails?.vendorId
          ? this.rcdetails.vendorId
          : 0,
        remarks: this.forwardData.forwardRemarks,
      };

      const result = await this.workAwardService.saveWorkAwardForwardData(
        filter,
        body
      );
      console.log(result);
      if (result.messageType == 'SUCCESS') {
        this.snackBar
          .open('Work award forwarded successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => {
            this.snackBar.dismiss();
            this.router.navigate([
              `/main/awarding-of-work-on-labour-contract/${this.workorderRegisteredId}`,
            ]);
          });
      }
    }
  }

  async submitApproved() {
    if (!this.formData.workStartDate && !this.formData.workEndDate) {
      this.snackBar.open(
        'Please enter work start data and work end date first',
        'OK'
      );
    }
    if (Number(this.workAwardedAmount) >= 100000 && this.data?.estimationRegisteredResponse?.woExecutionMethodCode ==='LC') {
      this.snackBar.open(
        'Each Work allotted to Vendor as a work award should not be greater than 1 Lakh',
        'OK'
      );
      this.isSaveDisabled = true;
      return;
    }
    const TotalAmount =
      Number(this.workAwardSumAmount) + Number(this.labourAwardAmount);
    console.log(TotalAmount);

    const FIVE_PRECENT_MATERIAL =
      (Number(this.vendorData.emdEligibilityPercentage) / 100) *
      Number(TotalAmount);
    console.log(FIVE_PRECENT_MATERIAL);
    if (FIVE_PRECENT_MATERIAL > this.vendorData.emdAmount) {
      this.snackBar.open(
        '5% of ongoing works awarded amount should not be greater than E.M.D Amount.',
        'OK'
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
        WorkAwardDate: this.data.wmWorkorderRegistered.workAwardDate,
        scheduleStartDate: this.formData.workStartDate,
        scheduleEndDate: this.formData.workEndDate,
        workawardedAmount: this.workAwardedAmount,
        wmWorkAwardedLogId:
          this.data.wmWorkAwardedLogDTOList[0]?.wmWorkAwardedLogId || 0,
        designationId: '',
      };
      const body: any = {
        wmWorkorderRegisteredId: this.workorderRegisteredId,
        vendorMasterId: this.VendorMasterId
          ? this.VendorMasterId
          : this.rcdetails.vendorId,

        workAwardedAmount: this.workAwardedAmount,
        emdAmount: this.vendorData.emdAmount,
        emdReceiptNo: this.vendorData.emdReceiptNo,
        emdReceiptDate: this.vendorData.emdReceiptDate,
        rateContractMasterId: this.rcdetails?.vendorId
          ? this.rcdetails.vendorId
          : 0,
        remarks: this.approveData.remarks,
      };
      console.log(filter, body);
      const result = await this.workAwardService.saveWorkAwardApprovalData(
        filter,
        body
      );
      console.log(result);
      if (result.messageType == 'SUCCESS') {
        this.snackBar
          .open('Work award approved successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => {
            this.snackBar.dismiss();
            this.router.navigate([
              `/main/awarding-of-work-on-labour-contract/${this.workorderRegisteredId}`,
            ]);
          });
      }
    }
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
}
