import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimateService } from 'src/app/services/estimate.service';
import { CRegisteredService } from 'src/app/services/c-registered.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
})
export class InvoiceDetailsComponent implements OnInit {
  constructor(
    private cRegisteredService: CRegisteredService,
    private estimateService: EstimateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  invoiceData: any = [];
  smStoreDispatchedInvoiceId: any;
  budgetDetails: any = {};
  currentExpenditure: number = 0;
  totalExpenditureAmount: number = 0;

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const wmMaterialsIndentId = params['wmMaterialsIndentId'];
      this.smStoreDispatchedInvoiceId = params['smStoreDispatchedInvoiceId'];
      this.invoiceData =
        await this.cRegisteredService.getInvoiceDataByWmMaterialIndentId({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          wmMaterialsIndentId,
        });
      this.invoiceData.materialDetailsInvoceNoResponseList =
        this.invoiceData.materialDetailsInvoceNoResponseList.map((invoice) => {
          invoice.issuedUsedQty = Number(invoice.issuedUsedQty);

          return { ...invoice, usedItemRate: 0, usedItemAomount: 0 };
        });

      if (this.invoiceData?.divisionalBudgetDTO == null) {
        return;
      }
      if (Object.keys(this.invoiceData?.divisionalBudgetDTO).length > 0) {
        const [data] =
          await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterId(
            {
              apiKey: sessionStorage.getItem('api-key'),
              serviceKey: sessionStorage.getItem('service-key'),
              userRole: sessionStorage.getItem('user-role'),
              userName: sessionStorage.getItem('user-name'),
              userCode: sessionStorage.getItem('user-code'),
              divisionalOfficeId:
                this.invoiceData?.divisionalBudgetDTO?.divisionOfficeId,
              accountHeadMasterId:
                this.invoiceData?.divisionalBudgetDTO?.accountHeadMasterId,
            }
          );
        this.budgetDetails = data;
      }

      this.calculateCurrentExpenditure();
    });
  }
  onUsedItemRateChange(index, rate, issuedUsedQty) {
    this.invoiceData.materialDetailsInvoceNoResponseList[
      index
    ].usedItemAomount =
      Number(rate) * Number(issuedUsedQty === 'null' ? 0 : issuedUsedQty);

    this.calculateCurrentExpenditure();
  }
  async saveData() {
    const quantityData = this.invoiceData.materialDetailsInvoceNoResponseList.filter(
      (d) => +d.issuedUsedQty > 0
    );
    
    const hasEmptyUsedItemRate = quantityData.some((q) => q.usedItemRate == null || q.usedItemRate === '');
    if (hasEmptyUsedItemRate) {
      this.snackbar.open('Used Item Rate should not be empty', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }
    

    if (
      +Number(this.budgetDetails.totalBudgetAmount).toFixed() >
      +Number(this.totalExpenditureAmount).toFixed()
    ) {
      const payload = this.invoiceData.materialDetailsInvoceNoResponseList.map(
        (data) => {
          return {
            wmMaterialsIndentTransLogId: data.wmMaterialsIndentTransLogId,
            usedIssuedRate: data.usedItemRate || 0,
            usedIssuedAmount: data.usedItemAomount || 0,
          };
        }
      );

      const saveData = await this.cRegisteredService.saveInvoiceData(
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
          .open('Invoice verification done', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => {
            this.snackbar.dismiss();
            this.router.navigate(['/work-management', 'invoice-verification']);
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
    const total = this.invoiceData.materialDetailsInvoceNoResponseList.reduce(
      (acc, item) => acc + parseFloat(item.issuedAmount || '0'),
      0
    );
    return total.toFixed(2);
  }
  calculateCurrentExpenditure() {
    this.currentExpenditure =
      this.invoiceData.materialDetailsInvoceNoResponseList.reduce(
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
        : +this.budgetDetails.totalExpenditureAmount) +
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
