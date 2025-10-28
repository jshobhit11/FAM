import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';
import { AcceptPopupComponent } from 'src/app/shared/components/accept-popup/accept-popup.component';
import { RejectPopupComponent } from 'src/app/shared/components/reject-popup/reject-popup.component';
import { RejectReturnPopupComponent } from '../reject-return-popup/reject-return-popup.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
const returnApproval = new FormGroup({
  remarks: new FormControl('', [Validators.required]),
  description: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-materials-return-approval-form',
  templateUrl: './materials-return-approval-form.component.html',
  styleUrls: ['./materials-return-approval-form.component.scss'],
})
export class MaterialsReturnApprovalFormComponent implements OnInit {
  approveRemarks: string = '';
  approveMaterialIndentData: any[] = [];
  returnData: any[] = [];
  workscopeDescCode: string = '';
  returnApproval: FormGroup = returnApproval;
  error: string;
  isLoading: boolean =false;
  constructor(
    private materialsIntentService: MaterialsIntentService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async (param: ParamMap) => {
      const wmMaterialsIndentId = param.get('materialIntentId') as string;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, wmMaterialsIndentId };
      this.approveMaterialIndentData = await this.materialsIntentService.getApproveMaterialIndentData(filter);
      const responseData = await this.materialsIntentService.getApproveMaterialIndentEstData(filter);
    this.returnData = responseData.map(item => ({
      ...item,
      returnedQuantity: item.returnedQuantity === "null" ? "0" : item.returnedQuantity
    }));
    if (responseData.length > 0) {
      this.workscopeDescCode = responseData[0].workscopeDescCode;
    }
    if (userRole === 'ROLE_ASST') {
      this.returnApproval.patchValue({
        remarks: 'The Cost Register Entries have been verified and found in order.'
      });
      this.approveRemarks = 'The Cost Register Entries have been verified and found in order.';
    }
  });
  this.resetForm();
  }
  resetForm() {
    this.returnApproval = new FormGroup({
      remarks:new FormControl('',[Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }
  convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
  }

  openApprovalpopupDialog() {
    this.returnApproval.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(AcceptPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.approval();
      }
    });
  }
  }

  openRejectpopupDialog() {
    this.returnApproval.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(RejectReturnPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.reject();
      }
    });
  }
  }
  isValidForm(): boolean {
    this.returnApproval.markAllAsTouched();
    console.log('Form Valid?', this.returnApproval.valid);
    let hasError = false;
    Object.keys(this.returnApproval.controls).forEach((key) => {
      const control = this.returnApproval.get(key);
  
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
  async approval() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    const approveObject: any = {
      wmMaterialsIndentId: Number(this.approveMaterialIndentData[0].wmMaterialsIndentId),
      materialsIndentNo: Number(this.approveMaterialIndentData[0].materialsIndentNo),
      approveRemarks: this.approveRemarks,

    };
    this.isLoading = true;
    const approve = await this.materialsIntentService.materialIntentApproveData(filter, approveObject).catch((e: any) => console.log(e));
    if (approve.messageType === 'SUCCESS') {
      const snackBarRef = this.snackbar.open('Return Indent approved successfully', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/work-management', 'materials-return-approval']);
      this.isLoading = false;
      });
      }else if (approve.messageType === 'FAILURE') {
       const snackFailBar = this.snackbar.open(approve.messageText, 'ok',{
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
           }
        );
        snackFailBar.onAction().subscribe(() => {
        this.snackbar.dismiss();
        this.isLoading = false;
    });
  }
}
   async reject() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    const approveObject: any = {
      wmMaterialsIndentId: Number(this.approveMaterialIndentData[0].wmMaterialsIndentId),
      materialsIndentNo: Number(this.approveMaterialIndentData[0].materialsIndentNo),
      approveRemarks: this.approveRemarks,
      isMaterialsIndentApproved: 0,
    };
    this.isLoading = true;
    const approve = await this.materialsIntentService.RejectStoreTransferApprovData(filter, approveObject).catch((e: any) => console.log(e));
    if (approve.messageType === 'SUCCESS') {
      const snackBarRef =this.snackbar.open('Return Indent rejected successfully', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/work-management', 'materials-return-approval']);
      this.isLoading = false;
    });
  }else if (approve.messageType === 'FAILURE') {
    const snackFailBar = this.snackbar.open(approve.messageText, 'ok',{
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
    );
    snackFailBar.onAction().subscribe(() => {
        this.snackbar.dismiss();
        this.isLoading = false;
    });
  }
  }
}
