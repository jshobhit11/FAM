import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';
import { AcceptPopupComponent } from 'src/app/shared/components/accept-popup/accept-popup.component';
import { RejectPopupComponent } from 'src/app/shared/components/reject-popup/reject-popup.component';
import { RejectIndentPopupComponent } from '../reject-indent-popup/reject-indent-popup.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
const IndentApprovalForm = new FormGroup({
  remarks: new FormControl('', [Validators.required]),
  description: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-material-indent-approval-form',
  templateUrl: './material-indent-approval-form.component.html',
  styleUrls: ['./material-indent-approval-form.component.scss'],
})
export class MaterialIndentApprovalFormComponent implements OnInit {
  approveRemarks: string = '';
  approveMaterialIndentData: any[] = [];
  estData: any[] = [];
  IndentApprovalForm: FormGroup = IndentApprovalForm;
  error: string;
  isLoading: boolean =false;
  wmWorkorderRegisteredId: any;
  validateMaintenanceData:any[]=[];
  validationMessage$ = new BehaviorSubject<string | null>(null);
  wmWorkOrderRegisteredId: any;
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
      this.estData = await this.materialsIntentService.getApproveMaterialIndentEstData(filter);
      if (userRole === 'ROLE_ASST') {
        this.IndentApprovalForm.patchValue({
          remarks: 'The Cost Register Entries have been verified and found in order.'
        });
        this.approveRemarks = 'The Cost Register Entries have been verified and found in order.';
      }
      this.wmWorkorderRegisteredId =this.approveMaterialIndentData[0].wmWorkorderRegisteredId;
      if(this.wmWorkorderRegisteredId){
        await this.validateRevenueMaintenance(this.wmWorkorderRegisteredId);
      }
    }); 
    this.resetForm();
  }
  async validateRevenueMaintenance(wmWorkOrderRegisteredId: string) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
  
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      wmWorkOrderRegisteredId,
    };
  
    try {
      const validateMaintenanceData = await this.materialsIntentService.validateQuarter(filter); 
      if (validateMaintenanceData?.messageType == 'FAILURE') {
        this.validationMessage$.next(validateMaintenanceData.messageText);
      } else {
        this.validationMessage$.next(null);
      }
      
    } catch (error) {
      console.error('Error validating revenue maintenance:', error);
    }
  }
  resetForm() {
    this.IndentApprovalForm = new FormGroup({
      remarks:new FormControl('',[Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }
  convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
  }

  openApprovalpopupDialog() {
    this.IndentApprovalForm.markAllAsTouched();
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
    this.IndentApprovalForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(RejectIndentPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.reject();
      }
    });
  }
  }
  isValidForm(): boolean {
    this.IndentApprovalForm.markAllAsTouched();
    console.log('Form Valid?', this.IndentApprovalForm.valid);
    let hasError = false;
    Object.keys(this.IndentApprovalForm.controls).forEach((key) => {
      const control = this.IndentApprovalForm.get(key);
  
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
      const snackBarRef = this.snackbar.open('Data approved successfully', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
         });
         snackBarRef.onAction().subscribe(() => {
         this.router.navigate(['/work-management', 'material-indent-approval']);
         this.isLoading = false;
      });
    }else if (approve.messageType === 'FAILURE') {
      const snackFailBar = this.snackbar.open(approve.messageText,'ok', {
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
     const snackBarRef= this.snackbar.open('Material Indent rejected successfully', 'OK',{
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/work-management', 'material-indent-approval']);
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
