import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-application-status-process-mapping',
  templateUrl: './add-application-status-process-mapping.component.html',
  styleUrls: ['./add-application-status-process-mapping.component.scss'],
})
export class AddApplicationStatusProcessMappingComponent implements OnInit {
  notificationRef: any;
  applicationData: any[] = [];
  processData: any[] = [];
  appStatusProcessForm: FormGroup;
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
    this.applicationData = getAllData.field1;
    this.processData = getAllData.field2;
  }

  ngOnInit(): void {
    console.log('comp');
    this.appStatusProcessForm = this.formBuilder.group({
      applicationStatusId: ['', Validators.required],
      processTypeMasterId: ['', Validators.required],
      typeWiseSequence: ['', Validators.required],
      displayFlag: ['', Validators.required],
    });
  }
  applicationMappingObj = {
    applicationStatusId: '',
    processTypeMasterId: '',
    typeWiseSequence: '',
    displayFlag: '',
  };

  onAddApplicationStatusProcessType() {
    Object.keys(this.appStatusProcessForm.controls).forEach((key) => {
      this.appStatusProcessForm.get(key)?.markAsTouched();
    });
    if (this.appStatusProcessForm.valid) {
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
        applicationStatusId:
          this.appStatusProcessForm.value.applicationStatusId,
        processTypeMasterId:
          this.appStatusProcessForm.value.processTypeMasterId,
        typeWiseSequence: this.appStatusProcessForm.value.typeWiseSequence,
        displayFlag: this.appStatusProcessForm.value.displayFlag,
      };
      this.configurationService
        .getappStatusProMapSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            
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
                this.Service.sendUpdate('Application Mapping Updated');
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
      this.appStatusProcessForm.get('applicationStatusId').invalid ||
      this.appStatusProcessForm.get('processTypeMasterId').invalid
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
