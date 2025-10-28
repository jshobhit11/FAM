import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EstimateService } from 'src/app/services/estimate.service';
import { CRegisteredService } from 'src/app/services/c-registered.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-acknowledgement-details',
  templateUrl: './acknowledgement-details.component.html',
  styleUrls: ['./acknowledgement-details.component.scss'],
})
export class AcknowledgementDetailsComponent implements OnInit {
  constructor(
    private cRegisteredService: CRegisteredService,
    private estimateService: EstimateService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  acknowledgementData: any = [];
  smStoreDispatchedInvoiceId: any;
  budgetDetails: any = {};
  currentExpenditure: number = 0;
  totalExpenditureAmount: number = 0;

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const wmMaterialsIndentId = params['wmMaterialsIndentId'];
      this.smStoreDispatchedInvoiceId = params['smStoreDispatchedInvoiceId'];
      this.acknowledgementData =
        await this.cRegisteredService.getMaterialAcknowledgementDetails({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          wmMaterialsIndentId,
        });

      this.acknowledgementData.materialDetailsInvoceNoResponseList =
        this.acknowledgementData.materialDetailsInvoceNoResponseList.map(
          (invoice) => {
            invoice.issuedUsedQty = Number(invoice.issuedUsedQty);
            return { ...invoice, usedItemRate: 0, usedItemAomount: 0 };
          }
        );

      if (this.acknowledgementData?.divisionalBudgetDTO == null) {
        return;
      }

      if (
        Object.keys(this.acknowledgementData?.divisionalBudgetDTO).length > 0
      ) {
        const [data] =
          await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterId(
            {
              apiKey: sessionStorage.getItem('api-key'),
              serviceKey: sessionStorage.getItem('service-key'),
              userRole: sessionStorage.getItem('user-role'),
              userName: sessionStorage.getItem('user-name'),
              userCode: sessionStorage.getItem('user-code'),
              divisionalOfficeId:
                this.acknowledgementData?.divisionalBudgetDTO?.divisionOfficeId,
              accountHeadMasterId:
                this.acknowledgementData?.divisionalBudgetDTO
                  ?.accountHeadMasterId,
            }
          );
        this.budgetDetails = data;
      }
      this.calculateCurrentExpenditure();
    });
  }
  onUsedItemRateChange(index, rate, issuedUsedQty) {
    this.acknowledgementData.materialDetailsInvoceNoResponseList[
      index
    ].usedItemAomount =
      Number(rate) * Number(issuedUsedQty === 'null' ? 0 : issuedUsedQty);
    this.calculateCurrentExpenditure();
  }

  async saveData() {
    const quantityData =
      this.acknowledgementData.materialDetailsInvoceNoResponseList.filter(
        (d) => +d.issuedUsedQty > 0
      );
    const isUsedItemAmount = quantityData.every((q) => q.usedItemAomount == 1);
    if (isUsedItemAmount === false) {
      this.snackbar.open('Used Item Rate should not be empty', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }
    if (
      +Number(this.budgetDetails.totalBudgetAmount).toFixed() >
      +Number(this.totalExpenditureAmount).toFixed()
    ) {
      const payload =
        this.acknowledgementData.materialDetailsInvoceNoResponseList.map(
          (data) => {
            return {
              wmMaterialsIndentTransLogId: data.wmMaterialsIndentTransLogId,
              usedIssuedRate: data.usedItemRate || 0,
              usedIssuedAmount: data.usedItemAomount || 0,
            };
          }
        );

      const saveData = await this.cRegisteredService.saveAcknowledgementData(
        {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          smStoreDispatchedInvoiceId: this.smStoreDispatchedInvoiceId,
          currentExpenditureAmount: +this.currentExpenditure,
        },
        payload
      );
      if (saveData.messageType === 'SUCCESS') {
        this.snackbar
          .open('Acknowledgment verification done', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => {
            this.snackbar.dismiss();
            this.router.navigate([
              '/work-management',
              'acknowledgment-verification',
            ]);
          });
      }
    } else {
      this.snackbar.open(
        'Total Expenditure Amount is greater than Total Budget Amount , So C Registered should not be verified',
        'OK'
      );
      return;
    }
  }
  getTotalIssuedAmount() {
    const total =
      this.acknowledgementData.materialDetailsInvoceNoResponseList.reduce(
        (acc, item) => acc + parseFloat(item.issuedAmount || '0'),
        0
      );
    return total.toFixed(2);
  }
  calculateCurrentExpenditure() {
    this.currentExpenditure =
      this.acknowledgementData.materialDetailsInvoceNoResponseList.reduce(
        (total, item) => {
          return (
            total +
            (parseFloat(item.issuedAmount) +
              parseFloat(item.usedItemAomount || '0'))
          );
        },
        0
      );

    this.calculateTotalExpenditureAmount();
  }
  calculateTotalExpenditureAmount() {
    this.totalExpenditureAmount =
      +(this.budgetDetails.totalExpenditureAmount == 'null'
        ? 0
        : +this.budgetDetails.totalExpenditureAmount) -
      +this.currentExpenditure;
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
