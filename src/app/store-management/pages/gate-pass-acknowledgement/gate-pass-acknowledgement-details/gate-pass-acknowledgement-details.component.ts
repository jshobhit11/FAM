import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { GatePassAcknowledgementService } from 'src/app/services/gate-pass-acknowledgement.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
export function fileSizeValidator(control: AbstractControl): { [key: string]: any } | null {
  const file = control.value;
  if (file instanceof FileList) {
    const fileSize = file[0].size || 0;
    const fileSizeInMB = fileSize / (1024 * 1024); 
    return fileSizeInMB > 5 ? { 'fileSize': true } : null;
  }
  return null;
}

@Component({
  selector: 'app-gate-pass-acknowledgement-details',
  templateUrl: './gate-pass-acknowledgement-details.component.html',
  styleUrls: ['./gate-pass-acknowledgement-details.component.scss'],
})
export class GatePassAcknowledgementDetailsComponent implements OnInit {
  gatepassdata: any = {};
  data: any = {};
  requestBy: string | null;
  materialsIndentDate: string | null;
  uploadForm: FormGroup;
  @ViewChild('pdfFileInput', { static: false }) pdfFileInput: ElementRef;
  fileSizeError = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gatePassAcknowledgementService:GatePassAcknowledgementService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef
  ) {
    this.requestBy = this.route.snapshot.queryParamMap.get('requestBy');
    this.materialsIndentDate = this.route.snapshot.queryParamMap.get('materialsIndentDate');
    this.uploadForm = this.fb.group({
      pdfFile: [null, [Validators.required, fileSizeValidator]],
    });    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const wmMaterialsIndentId = params.get('wmMaterialsIndentId');
      console.log(wmMaterialsIndentId);
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      this.data = await this.gatePassAcknowledgementService.getGatePassAcknowledgementDataById({
        apiKey,
        serviceKey,
        userCode,
        userName,
        userRole,
        wmMaterialsIndentId,
      });
      this.gatepassdata.date = this.data?.smStoreDispatchedInvoice[0]?.issueDate;
    });
  }

  onFileChange(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      if (fileSizeInMB > 5) {
        this.fileSizeError = true;
        this.uploadForm.get('pdfFile').setValue(null); 
      } else {
        this.fileSizeError = false;
        console.log('Selected File Size:', fileSizeInMB, 'MB');
      }
    }
  }
  async saveData() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const smStoreDispatchedInvoiceId = this.data?.smStoreDispatchedInvoice[0]?.smStoreDispatchedInvoiceId;
    const wmMaterialsIndentId = this.data?.smStoreDispatchedInvoice[0]?.wmMaterialsIndentId;
    const selectedFile = this.pdfFileInput.nativeElement.files[0];
  
    if (this.uploadForm.invalid || !selectedFile) {
      console.error('Form is invalid or file not selected. Cannot proceed with save operation.');
      this.uploadForm.markAllAsTouched();
      return;
    }
  
    try {
      const submit = await this.gatePassAcknowledgementService.saveGatePassAcknowledgementData(
        apiKey,
        serviceKey,
        userCode,
        userName,
        userRole,
        smStoreDispatchedInvoiceId,
        wmMaterialsIndentId,
        selectedFile 
      );
  
      if (submit.messageType === 'SUCCESS') {
        this.snackBar.open('Gate Pass Acknowledgment Saved Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top'
        }).onAction().subscribe(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/store-management/gate-pass-acknowledgement']);
        });
      } else if (submit.messageType === 'FAILURE') {
        this.snackBar.open(submit.messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          panelClass: ['error-snackbar']
        });
      }
    } catch (error) {
      console.error('Error:', error);
      this.snackBar.open('An error occurred while saving. Please try again later.', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: ['error-snackbar']
      });
    }
  }  
convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
  }

  openConfirmationpopupDialog() {
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    const selectedFile = this.pdfFileInput.nativeElement.files[0];
    if (!selectedFile) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.saveData();
      }
    });
  }
}

