import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-estimate-type-master',
  templateUrl: './add-estimate-type-master.component.html',
  styleUrls: ['./add-estimate-type-master.component.scss'],
})
export class AddEstimateTypeMasterComponent implements OnInit {
  notificationRef: any;
  estimateTypeForm: FormGroup;
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
    console.log('comp');
    this.estimateTypeForm = this.formBuilder.group({
      estimateTypeName: ['', Validators.required],
      estimateTypeCode: ['', Validators.required],
    });
  }

  estimatesTypeObj = {
    estimateTypeName: '',
    estimateTypeCode: '',
  };

  onAddEstimateType() {
    Object.keys(this.estimateTypeForm.controls).forEach((key) => {
      this.estimateTypeForm.get(key)?.markAsTouched();
    });
    if (this.estimateTypeForm.valid) {
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
        estimateTypeName: this.estimateTypeForm.value.estimateTypeName,
        estimateTypeCode: this.estimateTypeForm.value.estimateTypeCode,
      };
      this.configurationService
        .getEstimatesTypeMasterSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Estiamte Type Updated');
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

  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }

  isValidForm(): boolean {
    if (
      this.estimateTypeForm.get('estimateTypeName').invalid ||
      this.estimateTypeForm.get('estimateTypeCode').invalid
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
