import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-connection-type-master',
  templateUrl: './add-connection-type-master.component.html',
  styleUrls: ['./add-connection-type-master.component.scss'],
})
export class AddConnectionTypeMasterComponent implements OnInit {
  notificationRef: any;
  connectionTypeForm: FormGroup;
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
    this.connectionTypeForm = this.formBuilder.group({
      connectionTypeName: ['', [Validators.required]],
      connectionTypeCode: ['', [Validators.required]],
    });
  }

  connectTypeObj = {
    connectionTypeName: '',
    connectionTypeCode: '',
  };

  onAddConnectionType() {
    Object.keys(this.connectionTypeForm.controls).forEach((key) => {
      this.connectionTypeForm.get(key)?.markAsTouched();
    });
    if (this.connectionTypeForm.valid) {
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
        connectionTypeName: this.connectionTypeForm.value.connectionTypeName,
        connectionTypeCode: this.connectionTypeForm.value.connectionTypeCode,
      };

      this.configurationService
        .getConnectionTypeMasterSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Connection Type Updated');
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
      this.connectionTypeForm.get('connectionTypeName').invalid ||
      this.connectionTypeForm.get('connectionTypeCode').invalid
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
