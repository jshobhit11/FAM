import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-deviation-type-master',
  templateUrl: './add-deviation-type-master.component.html',
  styleUrls: ['./add-deviation-type-master.component.scss'],
})
export class AddDeviationTypeMasterComponent implements OnInit {
  notificationRef: any;
  deviationTypeForm: FormGroup;
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
    this.deviationTypeForm = this.formBuilder.group({
      deviationType: ['', Validators.required],
    });
  }

  deviateTypeObj = {
    deviationType: '',
  };

  onAddDeviationType() {
    Object.keys(this.deviationTypeForm.controls).forEach((key) => {
      this.deviationTypeForm.get(key)?.markAsTouched();
    });
    if (this.deviationTypeForm.valid) {
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
        deviationType: this.deviationTypeForm.value.deviationType,
      };

      this.configurationService
        .getDeviationTypeMasterSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Deviation Type Updated');
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
    if (this.deviationTypeForm.get('deviationType').invalid) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
