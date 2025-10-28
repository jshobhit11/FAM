import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-account-head-main-master',
  templateUrl: './update-account-head-main-master.component.html',
  styleUrls: ['./update-account-head-main-master.component.scss'],
})
export class UpdateAccountHeadMainMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  accountheadmainForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public amAccountHeadMainMasterId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateAccountHeadMainMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.accountheadmainForm = new FormGroup({
      amAccountHeadMainMasterId: new FormControl(''),
      accountHeadMainName: new FormControl('', [Validators.required]),
      accountHeadMainCode: new FormControl('', [Validators.required]),
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
    filters.amAccountHeadMainMasterId = this.amAccountHeadMainMasterId;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getAccHeadMainGetDataById(
      filters
    );
    console.log(' Account Head Main Master get data by id', this.getData);
    this.accountheadmainForm.patchValue({
      amAccountHeadMainMasterId: this.getData.amAccountHeadMainMasterId,
      accountHeadMainName: this.getData.accountHeadMainName,
      accountHeadMainCode: this.getData.accountHeadMainCode,
    });
  }

  onAccHeadMainMasterUpdate() {
    this.accountheadmainForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        amAccountHeadMainMasterId:
          this.accountheadmainForm.value.amAccountHeadMainMasterId,
        accountHeadMainName: this.accountheadmainForm.value.accountHeadMainName,
        accountHeadMainCode: this.accountheadmainForm.value.accountHeadMainCode,
      };
      let result = this.configurationService
        .getAccHeadMainUpdateData(this.filterData, updateBody)
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
    this.accountheadmainForm.markAllAsTouched();
    console.log('Form Valid?', this.accountheadmainForm.valid);
    let hasError = false;
    Object.keys(this.accountheadmainForm.controls).forEach((key) => {
      const control = this.accountheadmainForm.get(key);

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
