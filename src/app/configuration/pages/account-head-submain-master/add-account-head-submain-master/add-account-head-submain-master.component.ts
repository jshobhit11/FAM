import { Component, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-account-head-submain-master',
  templateUrl: './add-account-head-submain-master.component.html',
  styleUrls: ['./add-account-head-submain-master.component.scss'],
})
export class AddAccountHeadSubmainMasterComponent {
  notificationRef: any;
  accountHeadMainData: any[] = [];
  accountHeadSubmainForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.accountHeadMainData = getAllData.field1;
  }
  ngOnInit() {
    this.accountHeadSubmainForm = this.formBuilder.group({
      accountHeadSubmainName: ['', [Validators.required]],
      accountHeadSubmainCode: ['', [Validators.required]],
      amAccountHeadMainMasterId: ['', [Validators.required]],
    });
  }
  accHeadSubmainMasterObj = {
    accountHeadSubmainName: '',
    accountHeadSubmainCode: '',
    amAccountHeadMainMasterId: '',
  };

  onAddAccountHeadSubmainMaster() {
    Object.keys(this.accountHeadSubmainForm.controls).forEach((key) => {
      this.accountHeadSubmainForm.get(key)?.markAsTouched();
    });
    if (this.accountHeadSubmainForm.valid) {
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
        accountHeadSubmainName:
          this.accountHeadSubmainForm.value.accountHeadSubmainName,
        accountHeadSubmainCode:
          this.accountHeadSubmainForm.value.accountHeadSubmainCode,
        amAccountHeadMainMasterId:
          this.accountHeadSubmainForm.value.amAccountHeadMainMasterId,
      };
      this.configurationService
        .getAccHeadSubmainSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Account Head Submain Master Updated');
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
      this.accountHeadSubmainForm.get('accountHeadSubmainName').invalid ||
      this.accountHeadSubmainForm.get('accountHeadSubmainCode').invalid ||
      this.accountHeadSubmainForm.get('amAccountHeadMainMasterId').invalid
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
