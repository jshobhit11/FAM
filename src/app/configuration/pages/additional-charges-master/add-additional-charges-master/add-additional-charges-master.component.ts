import { Component } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-additional-charges-master',
  templateUrl: './add-additional-charges-master.component.html',
  styleUrls: ['./add-additional-charges-master.component.scss'],
})
export class AddAdditionalChargesMasterComponent {
  notificationRef: any;
  additionalChargesForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.additionalChargesForm = this.formBuilder.group({
      additionalChargesName: ['', Validators.required],
      additionalChargesCode: ['', Validators.required],
      chargesSequenceOrder: ['', Validators.required],
    });
  }
  additionalChargesObj = {
    additionalChargesName: '',
    additionalChargesCode: '',
    chargesSequenceOrder: '',
  };
  addAdditionalCharges() {
    Object.keys(this.additionalChargesForm.controls).forEach((key) => {
      this.additionalChargesForm.get(key)?.markAsTouched();
    });
    if (this.additionalChargesForm.valid) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filters: any = { apiKey, serviceKey, userRole, userName, userCode };
      const reqBody = {
        additionalChargesName:
          this.additionalChargesForm.value.additionalChargesName,
        additionalChargesCode:
          this.additionalChargesForm.value.additionalChargesCode,
        chargesSequenceOrder:
          this.additionalChargesForm.value.chargesSequenceOrder,
      };
      this.configurationService
        .saveAdditionalChargeData(filters, reqBody)
        .then((response) => {
          this.Service.sendUpdate('Additional Charges Master Updated');
          if (response) {
            this.Service.sendUpdate('Additional Charges Updated');
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
      this.additionalChargesForm.get('additionalChargesName').invalid ||
      this.additionalChargesForm.get('additionalChargesCode').invalid
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
