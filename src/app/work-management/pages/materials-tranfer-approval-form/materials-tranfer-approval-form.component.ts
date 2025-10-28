import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadMaterialService } from '../../../services/upload-material.service';
import { MaterialsIntentService } from '../../../services/materialsIntent.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TransferSusPopupComponent } from '../transfer-sus-popup/transfer-sus-popup.component';
import { RejectSuspensePopupComponent } from '../reject-suspense-popup/reject-suspense-popup.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
const suspenseApproval = new FormGroup({
  remarks: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-materials-tranfer-approval-form',
  templateUrl: './materials-tranfer-approval-form.component.html',
  styleUrls: ['./materials-tranfer-approval-form.component.scss'],
})
export class MaterialsTranferApprovalFormComponent implements OnInit {
  dataItems: any[] = [];
  data: any = [];
  storeData: any = [];
  approveRemarks: string = '';
  wmMaterialsIndentId: any;
  storeId: any;
  senderOfficeName:any;
  receiverStoreCode:any;
  receiverOfficeName:any;
  suspenseApproval: FormGroup = suspenseApproval;
  error: string;
  constructor(
    private materialIntentService: MaterialsIntentService,
    private uploadMaterialService: UploadMaterialService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  approvalData: any = {};

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
        await this.materialIntentService.getMaterialTransferApprovListData(
          filters
        );

      this.storeData =
        await this.uploadMaterialService.getUploadMaterialStoreData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          officeId: officeCode,
        });
      console.log('DATA ===> ', this.data);

      this.approvalData = [
        ...new Set(
          this.data.map((d) => {
            const { materialsIndentNo, materialsIndentDate, store,receiverOfficeName,receiverStoreCode,senderOfficeName } = d;
            return {
              materialsIndentNo,
              materialsIndentDate,
              store,
              receiverOfficeName,
              receiverStoreCode,
              senderOfficeName,
            };
          })
        ),
      ][0];
      if (userRole === 'ROLE_ASST') {
        this.suspenseApproval.patchValue({
          remarks: 'The Cost Register Entries have been verified and found in order.'
        });
        this.approveRemarks = 'The Cost Register Entries have been verified and found in order.';
      }
    });

    this.resetForm();
  }
  resetForm() {
    this.suspenseApproval = new FormGroup({
      remarks:new FormControl('',[Validators.required])
    });
  }
  convertToCode(materialName: string): string {
    return materialName; 
  }
  openConfirmationDialog() {
    this.suspenseApproval.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(TransferSusPopupComponent, {
      width: 'auto',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onSubmit(); 
      }
    });
  }
  }
  isValidForm(): boolean {
    this.suspenseApproval.markAllAsTouched();
    console.log('Form Valid?', this.suspenseApproval.valid);
    let hasError = false;
    Object.keys(this.suspenseApproval.controls).forEach((key) => {
      const control = this.suspenseApproval.get(key);
  
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
  async onSubmit() {
    const saveData =
      await this.materialIntentService.saveMaterialIndentApproveData(
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
          storeCode: this.selectedStoreData.storeCode || '',
          storeMasterId: this.selectedStoreData.storeMasterId || '',
          typeOfIndent: 'SUSPENSE_INDENT',
        }
      );
    if (saveData.messageType == 'SUCCESS') {
      this.storeId = '';
      this.snackBar
        .open(saveData.messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
        });
        this.router.navigate(['/work-management', 'materials-transfer-approval']);
    }
  }
  openRejectpopupDialog(){
    this.suspenseApproval.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(RejectSuspensePopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onReject();
      }
    });
  }
  }
  async onReject() {
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
          wmMaterialsIndentId: this.wmMaterialsIndentId,
          approveRemarks: this.approveRemarks,
          storeCode: this.selectedStoreData.storeCode || '',
          storeMasterId: this.selectedStoreData.storeMasterId || '',
          typeOfIndent: 'SUSPENSE_INDENT',
        }
      );
    if (saveData.messageType == 'SUCCESS') {
      this.storeId = '';
      this.snackBar
        .open('Material Transfer Rejected Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
        });
        this.router.navigate(['/work-management', 'materials-transfer-approval']);
    }
  }
  selectedStoreData: any = {};
  onStoreChange(event) {
    this.selectedStoreData = this.storeData.find(
      (store) => store.storeMasterId === event.value
    );
  }
}
