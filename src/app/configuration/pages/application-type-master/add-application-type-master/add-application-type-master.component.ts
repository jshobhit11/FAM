import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-application-type-master',
  templateUrl: './add-application-type-master.component.html',
  styleUrls: ['./add-application-type-master.component.scss'],
})
export class AddApplicationTypeMasterComponent implements OnInit {
  notificationRef: any;
  processData = [];
  applicationTypeForm: FormGroup;
  error: any = '';

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
    this.processData = getAllData.field1;
  }

  ngOnInit(): void {
    console.log('comp');
    this.applicationTypeForm = this.formBuilder.group({
      registeredSourceType: ['', [Validators.required]],
      applicationTypeCode: ['', [Validators.required]],
      applicationTypeName: ['', [Validators.required]],
    });
  }

  applicationTypeObj = {
    applicationTypeName: '',
    applicationTypeCode: '',
    registeredSourceType: '',
  };

  onAddApplicationType() {
    Object.keys(this.applicationTypeForm.controls).forEach((key) => {
      this.applicationTypeForm.get(key)?.markAsTouched();
    });
    if (this.applicationTypeForm.valid) {
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
        applicationTypeName: this.applicationTypeForm.value.applicationTypeName,
        applicationTypeCode: this.applicationTypeForm.value.applicationTypeCode,
        registeredSourceType:
          this.applicationTypeForm.value.registeredSourceType,
      };

      this.configurationService
        .getApplicationTypeMasterSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Application Type Updated');
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
      this.applicationTypeForm.get('applicationTypeName').invalid ||
      this.applicationTypeForm.get('applicationTypeCode').invalid
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
