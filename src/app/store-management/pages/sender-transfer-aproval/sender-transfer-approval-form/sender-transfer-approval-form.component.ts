import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';
import { MatDialog } from '@angular/material/dialog';
import { SenderPopupComponent } from '../../sender-popup/sender-popup.component';
@Component({
  selector: 'app-sender-transfer-approval-form',
  templateUrl: './sender-transfer-approval-form.component.html',
  styleUrls: ['./sender-transfer-approval-form.component.scss']
})
export class SenderTransferApprovalFormComponent implements OnInit {
  dataItems: any[] = [
  ];
  wmMaterialsIndentId: any;
  data: any = [];
  approvalData: any = {};
  approveRemarks: string = '';

  constructor(
    private materialIntentService: MaterialsIntentService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {}
  storeDivisionData: any;
  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeCode = sessionStorage.getItem('office-id');
      this.wmMaterialsIndentId = params.get('wmMaterialsIndentId');
      const filters = {
        apiKey,
        serviceKey,
        userCode,
        userName,
        userRole,
        wmMaterialsIndentId: params.get('wmMaterialsIndentId'),
      };

      this.data =
        await this.materialIntentService.getMaterialTransferApprovSenderStoreListData(
          filters
        );
        console.log("material data",this.data)
      this.approvalData =
        await this.materialIntentService.GetApproveStoreTransferData(filters);
      this.approvalData = this.approvalData[0];
      console.log('S', this.approvalData);
    });
  }
  openApprovalpopupDialog() {
    const dialogRef = this.dialog.open(SenderPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onSubmit();
      }
    });
  }
  async onSubmit() {
    if (this.approveRemarks == '' || this.approveRemarks == null) {
      this.snackBar.open('Please provide remarks', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }

    const saveData =
      await this.materialIntentService.SaveSenderStoreTransferApprovData(
        {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
        },
        {
          wmMaterialsIndentId: this.wmMaterialsIndentId,
      //    approveRemarks: this.approveRemarks,
        }
      );
    if (saveData.messageType == 'SUCCESS') {
      this.approveRemarks = '';

      this.snackBar
        .open('Sender Store Material Transfer approval Success', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
        });
        this.router.navigate([`/store-management/store-transfer-approval`]);
    }
  }
}
