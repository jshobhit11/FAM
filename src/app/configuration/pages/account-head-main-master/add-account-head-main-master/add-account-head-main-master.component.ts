import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-account-head-main-master',
  templateUrl: './add-account-head-main-master.component.html',
  styleUrls: ['./add-account-head-main-master.component.scss'],
})
export class AddAccountHeadMainMasterComponent {
  notificationRef: any;
  accountHeadMainForm: FormGroup;
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
  ngOnInit() {
    this.accountHeadMainForm = this.formBuilder.group({
      accountHeadMainName: ['', [Validators.required]],
      accountHeadMainCode: ['', [Validators.required]],
    });
  }
  accHeadMainMasterObj = {
    accountHeadMainName: '',
    accountHeadMainCode: '',
  };

  onAddAccHeadMainMaster() {
    Object.keys(this.accountHeadMainForm.controls).forEach((key) => {
      this.accountHeadMainForm.get(key)?.markAsTouched();
    });
    if (this.accountHeadMainForm.valid) {
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
        accountHeadMainName: this.accountHeadMainForm.value.accountHeadMainName,
        accountHeadMainCode: this.accountHeadMainForm.value.accountHeadMainCode,
      };

      this.configurationService
        .getAccHeadMainSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Account Head Main Master Updated');
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
      this.accountHeadMainForm.get('accountHeadMainName').invalid ||
      this.accountHeadMainForm.get('accountHeadMainCode').invalid
    ) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
}
