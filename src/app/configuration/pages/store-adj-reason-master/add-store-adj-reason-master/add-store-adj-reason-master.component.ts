import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-store-adj-reason-master',
  templateUrl: './add-store-adj-reason-master.component.html',
  styleUrls: ['./add-store-adj-reason-master.component.scss'],
})
export class AddStoreAdjReasonMasterComponent implements OnInit {
  notificationRef: any;
  storeAdjustmentForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log('comp');
    this.storeAdjustmentForm = this.formBuilder.group({
      adjustmentReason: ['', [Validators.required]],
      descriptions: ['', [Validators.required]],
    });
  }

  storeAdjustmentObj = {
    adjustmentReason: '',
    descriptions: '',
  };

  onAddStoreAdjustment() {
    Object.keys(this.storeAdjustmentForm.controls).forEach((key) => {
      this.storeAdjustmentForm.get(key)?.markAsTouched();
    });
    if (this.storeAdjustmentForm.valid) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };

      const reqBody = {
        adjustmentReason: this.storeAdjustmentForm.value.adjustmentReason,
        descriptions: this.storeAdjustmentForm.value.descriptions,
      };

      this.configurationService
        .getStoreReasonSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Store Adj Reason data');
            if (this.notificationRef) {
              this.notificationRef.dismiss();
              this.notificationRef = null;
            }
            this.notificationRef = this.snackBar.open(
              response.messageText,
              'OK',
              {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              }
            );
            this.notificationRef
              .afterDismissed()
              .toPromise()
              .then(() => {
                this.dialogRef.close();
              })
              .catch((error) => {
                console.error('Error closing dialog:', error);
              });
          }
        });
    }
  }

  isValidForm(): boolean {
    if (
      this.storeAdjustmentForm.get('adjustmentReason').invalid ||
      this.storeAdjustmentForm.get('descriptions').invalid
    ) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
