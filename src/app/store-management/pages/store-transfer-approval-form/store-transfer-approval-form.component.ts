import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';
import { StoreaPopupComponent } from '../storea-popup/storea-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { RejectStockPopupComponent } from '../reject-stock-popup/reject-stock-popup.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
const stockApprovalForm = new FormGroup({
  remarks: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-store-transfer-approval-form',
  templateUrl: './store-transfer-approval-form.component.html',
  styleUrls: ['./store-transfer-approval-form.component.scss'],
})
export class StoreTransferApprovalFormComponent implements OnInit {
  dataItems: any[] = [
  ];
  wmMaterialsIndentId: any;
  data: any = [];
  approvalData: any = {};
  approveRemarks: string = '';
  stockApprovalForm: FormGroup = stockApprovalForm;
  error: string;
  isLoading:boolean = false;
  constructor(
    private materialIntentService: MaterialsIntentService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
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
        await this.materialIntentService.getMaterialTransferApprovStoreListData(
          filters
        );
      this.approvalData =
        await this.materialIntentService.GetApproveStoreTransferData(filters);
      this.approvalData = this.approvalData[0];
      console.log('S', this.approvalData);
    });
    this.resetForm();
  }
  resetForm() {
    this.stockApprovalForm = new FormGroup({
      remarks: new FormControl('', [Validators.required]),
    });
  }
  openApprovalpopupDialog() {
    this.stockApprovalForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(StoreaPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onSubmit();
      }
    });
  }
  }
  openRejectpopupDialog(){
    this.stockApprovalForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(RejectStockPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onReject();
      }
    });
  }
  }
  isValidForm(): boolean {
    this.stockApprovalForm.markAllAsTouched();
    console.log('Form Valid?', this.stockApprovalForm.valid);
    let hasError = false;
    Object.keys(this.stockApprovalForm.controls).forEach((key) => {
      const control = this.stockApprovalForm.get(key);
  
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
  async onReject(){
    this.isLoading = true;
    const saveData =
      await this.materialIntentService.RejectStoreTransferApprovData(
        {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
        },
        {
          wmMaterialsIndentId:parseFloat(this.wmMaterialsIndentId),
          approveRemarks: this.approveRemarks,
        }
      );
    if (saveData.messageType == 'SUCCESS') {
       this.approveRemarks = '';
       const snackBarRef = this.snackBar.open('Store Material Transfer approval Rejected Sucessfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        snackBarRef.onAction().subscribe(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/store-management', 'store-transfer-approval']);
          this.isLoading = false;
        });  
      } else if (saveData.messageType === 'FAILURE') {
        const snackFailBar = this.snackBar.open(saveData.messageText, 'ok',{
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            }
        );
           snackFailBar.onAction().subscribe(() => {
            this.snackBar.dismiss();
            this.isLoading = false;
        });
      }
}
  async onSubmit() {
    this.isLoading = true;
    const saveData =
      await this.materialIntentService.SaveStoreTransferApprovData(
        {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
        },
        {
          wmMaterialsIndentId: this.wmMaterialsIndentId,
          approveRemarks: this.approveRemarks,
        }
      );
    if (saveData.messageType == 'SUCCESS') {
        this.approveRemarks = '';
        const snackBarRef = this.snackBar.open('Store Material Transfer approval Success', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        snackBarRef.onAction().subscribe(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/store-management', 'store-transfer-approval']);
          this.isLoading = false;
        });
    } else if (saveData.messageType === 'FAILURE') {
      const snackFailBar = this.snackBar.open(saveData.messageText, 'ok',{
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
      );
         snackFailBar.onAction().subscribe(() => {
          this.snackBar.dismiss();
          this.isLoading = false;
      });
    }
  }
}
