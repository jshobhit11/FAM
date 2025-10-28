import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationPopupComponent } from '../../../../../shared/components/confirmation-popup/confirmation-popup.component';
import { GatepassService } from 'src/app/services/gatepass.service';
@Component({
  selector: 'app-gate-pass-details',
  templateUrl: './gate-pass-details.component.html',
  styleUrls: ['./gate-pass-details.component.scss'],
})
export class GatePassDetailsComponent implements OnInit {
  gatepassdata: any = {};
  data: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gatePassService: GatepassService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const wmMaterialsIndentId = params.get('wmMaterialsIndentId');

      console.log(wmMaterialsIndentId);

      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      this.data = await this.gatePassService.getGatePassDataById({
        apiKey,
        serviceKey,
        userCode,
        userName,
        userRole,
        wmMaterialsIndentId,
      });
      this.gatepassdata.handover = this.data.smStoreDispatchedInvoice[0].materialsHandoverTo;
      this.gatepassdata.vehicleno = this.data.smStoreDispatchedInvoice[0].vehicleNo;
      this.gatepassdata.date = this.data?.smStoreDispatchedInvoice[0]?.issueDate;
    });
  }

  async saveData() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const submit = await this.gatePassService.saveGatePassData(
      { apiKey, serviceKey, userCode, userName, userRole },
      {
        smStoreDispatchedInvoiceId: this.data?.smStoreDispatchedInvoice[0]?.smStoreDispatchedInvoiceId,
        wmMaterialsIndentId: this.data?.smStoreDispatchedInvoice[0]?.wmMaterialsIndentId,
        storeMasterId: this.data?.smStoreDispatchedInvoice[0]?.storeMasterId,
        storeCode: this.data?.smStoreDispatchedInvoice[0]?.storeCode,
        storeInvoice: this.data?.smStoreDispatchedInvoice[0]?.storeInvoice,
        issueDate: this.data?.smStoreDispatchedInvoice[0]?.issueDate,
        issuedBy: this.data?.smStoreDispatchedInvoice[0]?.issuedBy,
        wmWorkorderRegistrationsId: this.data?.smStoreDispatchedInvoice[0]?.wmWorkorderRegistrationsId,
        materialsHandoverTo: this.data?.smStoreDispatchedInvoice[0]?.materialsHandoverTo,
        gatepassNo: this.data?.smStoreDispatchedInvoice[0]?.gatepassNo,
        gatepassIssuedBy: this.data?.smStoreDispatchedInvoice[0]?.gatepassIssuedBy,
        gatepassIssuedDate: this.data?.smStoreDispatchedInvoice[0]?.gatepassIssuedDate,
        vehicleNo: this.gatepassdata.vehicleno,
        handoverOfficeId: this.data?.smStoreDispatchedInvoice[0]?.handoverOfficeId,
        insertedBy: this.data?.smStoreDispatchedInvoice[0]?.insertedBy,
        insertedDate: this.data?.smStoreDispatchedInvoice[0]?.insertedDate,
        modifiedBy: this.data?.smStoreDispatchedInvoice[0]?.modifiedBy,
        modifiedDate: this.data?.smStoreDispatchedInvoice[0]?.modifiedDate,
        sessionIpAddress: this.data?.smStoreDispatchedInvoice[0]?.sessionIpAddress,
        activeStatus: this.data?.smStoreDispatchedInvoice[0]?.activeStatus,
        uniqueCondition: this.data?.smStoreDispatchedInvoice[0]?.uniqueCondition,
      },
    );
    console.log(submit);
    if (submit.messageType == 'SUCCESS') {
      this.snackBar
        .open('Gate Pass Save Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/store-management/gate-pass-report'], {
            queryParams: {
              wmMaterialsIndentId: this.data?.smStoreDispatchedInvoice[0]?.wmMaterialsIndentId,
            },
          });
        });
    }
  }

  convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
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
