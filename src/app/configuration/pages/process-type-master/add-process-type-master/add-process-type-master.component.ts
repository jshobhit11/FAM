import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-process-type-master',
  templateUrl: './add-process-type-master.component.html',
  styleUrls: ['./add-process-type-master.component.scss'],
})
export class AddProcessTypeMasterComponent implements OnInit {
  notificationRef: any;
  processTypeForm: FormGroup;
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
    this.processTypeForm = this.formBuilder.group({
      processTypeName: ['', Validators.required],
      processTypeHeader: ['', Validators.required],
      processDisplayOrder: ['', Validators.required],
    });
  }
  processTypeObj = {
    processTypeName: '',
    processTypeHeader: '',
    processDisplayOrder: '',
  };

  onAddProcessType() {
    Object.keys(this.processTypeForm.controls).forEach((key) => {
      this.processTypeForm.get(key)?.markAsTouched();
    });
    if (this.processTypeForm.valid) {
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
        processTypeName: this.processTypeForm.value.processTypeName,
        processTypeHeader: this.processTypeForm.value.processTypeHeader,
        processDisplayOrder: this.processTypeForm.value.processDisplayOrder,
      };

      this.configurationService
        .getprocessTypeSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Process Type Updated');
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
      this.processTypeForm.get('processTypeName').invalid ||
      this.processTypeForm.get('processTypeHeader').invalid
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
