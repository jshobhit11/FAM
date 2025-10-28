import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EstimateService } from 'src/app/services/estimate.service';
import { CRegisteredService } from 'src/app/services/c-registered.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-bill-submission-detail-cregister',
  templateUrl: './bill-submission-detail-cregister.component.html',
  styleUrls: ['./bill-submission-detail-cregister.component.scss'],
})
export class BillSubmissionDetailCregisterComponent implements OnInit {
  constructor(
    private cRegisteredService: CRegisteredService,
    private estimateService: EstimateService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  budgetDetails: any = {};
  billSubmissionDetails: any = {};
  totalExpenditureAmount: any;
  billSubmissionLogId: any;
  ngOnInit() {
    this.route.params.subscribe(async (params: ParamMap) => {
      this.billSubmissionLogId = params['id'];
      const data =
        await this.cRegisteredService.getBillSubmissionDetailsByBillSubmissionLogId(
          {
            apiKey: sessionStorage.getItem('api-key'),
            serviceKey: sessionStorage.getItem('service-key'),
            userRole: sessionStorage.getItem('user-role'),
            userName: sessionStorage.getItem('user-name'),
            userCode: sessionStorage.getItem('user-code'),
            billSubmissionLogId: this.billSubmissionLogId,
          }
        );

      this.billSubmissionDetails =
        data.cregisterBillSubmissionDataResponseList[0];

      [this.budgetDetails] =
        await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterId(
          {
            apiKey: sessionStorage.getItem('api-key'),
            serviceKey: sessionStorage.getItem('service-key'),
            userRole: sessionStorage.getItem('user-role'),
            userName: sessionStorage.getItem('user-name'),
            userCode: sessionStorage.getItem('user-code'),
            divisionalOfficeId: data?.divisionalBudgetDTO?.divisionOfficeId,
            accountHeadMasterId: data?.divisionalBudgetDTO?.accountHeadMasterId,
          }
        );

      this.calculateTotalExpenditureAmount();
    });
  }
  calculateTotalExpenditureAmount() {
    this.totalExpenditureAmount =
      +(this.budgetDetails.totalExpenditureAmount == 'null'
        ? 0
        : +this.budgetDetails.totalExpenditureAmount) +
      +this.billSubmissionDetails.billAmount;
  }
  async saveData() {
    const saveData = await this.cRegisteredService.saveBillSubmissionLogData({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      billSubmissionLogId: this.billSubmissionLogId,
      currentExpenditureAmount: +this.billSubmissionDetails.billAmount,
    });

    if (saveData.messageType == 'SUCCESS') {
      this.snackBar
        .open('Bill Submission Saved Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/work-management/c-register-bill-submission']);
        });
    }
  }
  openConfirmationpopupDialog() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.saveData();
      }
    });
  }
}
