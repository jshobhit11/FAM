import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-account-head-submain-master',
  templateUrl: './update-account-head-submain-master.component.html',
  styleUrls: ['./update-account-head-submain-master.component.scss'],
})
export class UpdateAccountHeadSubmainMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  accountHeadMainData: any[] = [];
  amAccountHeadSubmainMasterId = [];
  accountheadSubmainForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateAccountHeadSubmainMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.accountHeadMainData = getAllData.field1;
    this.amAccountHeadSubmainMasterId = getAllData.field2;

    this.accountheadSubmainForm = new FormGroup({
      amAccountHeadSubmainMasterId: new FormControl(''),
      accountHeadSubmainName: new FormControl('', [Validators.required]),
      accountHeadSubmainCode: new FormControl('', [Validators.required]),
      amAccountHeadMainMasterId: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
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
    filters.amAccountHeadSubmainMasterId = this.getAllData.field2;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getAccHeadSubmainGetDataById(
      filters
    );
    console.log('Account Head Submain Master get data by id', this.getData);
    this.accountheadSubmainForm.patchValue({
      amAccountHeadSubmainMasterId: this.getData.amAccountHeadSubmainMasterId,
      accountHeadSubmainName: this.getData.accountHeadSubmainName,
      accountHeadSubmainCode: this.getData.accountHeadSubmainCode,
      amAccountHeadMainMasterId: this.getData.amAccountHeadMainMasterId,
    });
  }

  onAccHeadSubmainMasterUpdate() {
    this.accountheadSubmainForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        amAccountHeadSubmainMasterId:
          this.accountheadSubmainForm.value.amAccountHeadSubmainMasterId,
        accountHeadSubmainName:
          this.accountheadSubmainForm.value.accountHeadSubmainName,
        accountHeadSubmainCode:
          this.accountheadSubmainForm.value.accountHeadSubmainCode,
        amAccountHeadMainMasterId:
          this.accountheadSubmainForm.value.amAccountHeadMainMasterId,
      };

      let result = this.configurationService
        .getAccHeadSubmainUpdateData(this.filterData, updateBody)
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
    this.accountheadSubmainForm.markAllAsTouched();
    console.log('Form Valid?', this.accountheadSubmainForm.valid);
    let hasError = false;
    Object.keys(this.accountheadSubmainForm.controls).forEach((key) => {
      const control = this.accountheadSubmainForm.get(key);
      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });
    if (hasError) {
      return false;
    } else {
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
