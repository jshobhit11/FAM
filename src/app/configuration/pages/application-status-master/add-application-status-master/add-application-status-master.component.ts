import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-application-status-master',
  templateUrl: './add-application-status-master.component.html',
  styleUrls: ['./add-application-status-master.component.scss'],
})
export class AddApplicationStatusMasterComponent implements OnInit {
  notificationRef: any;
  processData: any[] = [];
  appStatusForm: FormGroup;
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
    this.processData = getAllData.field1;
  }
  ngOnInit() {
    this.appStatusForm = this.formBuilder.group({
      processType: ['', Validators.required],
      displayType: ['', Validators.required],
      statusName: ['', Validators.required],
      statusCode: ['', Validators.required],
      typeWiseSequence: ['', Validators.required],
    });
  }
  AppStatusTypeObj = {
    statusName: '',
    statusCode: '',
    processType: '',
    typeWiseSequence: '',
    displayType: '',
  };

  onAddApplicationStatusType() {
    Object.keys(this.appStatusForm.controls).forEach((key) => {
      this.appStatusForm.get(key)?.markAsTouched();
    });
    if (this.appStatusForm.valid) {
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
        processType: this.appStatusForm.value.processType,
        displayType: this.appStatusForm.value.displayType,
        statusName: this.appStatusForm.value.statusName,
        statusCode: this.appStatusForm.value.statusCode,
        typeWiseSequence: this.appStatusForm.value.typeWiseSequence,
      };

      this.configurationService
        .getApplicationStatusSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Application Status Type Updated');
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
      this.appStatusForm.get('processType').invalid ||
      this.appStatusForm.get('displayType').invalid
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
