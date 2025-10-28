import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-network-extension-type-master',
  templateUrl: './add-network-extension-type-master.component.html',
  styleUrls: ['./add-network-extension-type-master.component.scss'],
})
export class AddNetworkExtensionTypeMasterComponent {
  notificationRef: any;
  networkExtensionTypeForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<any>
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.networkExtensionTypeForm = this.formBuilder.group({
      networkExtensionTypeName: ['', Validators.required],
      networkExtensionTypeCode: ['', Validators.required],
    });
  }

  networkTypeObj = {
    networkExtensionTypeName: '',
    networkExtensionTypeCode: '',
  };

  addNetworkType() {
    Object.keys(this.networkExtensionTypeForm.controls).forEach((key) => {
      this.networkExtensionTypeForm.get(key)?.markAsTouched();
    });
    if (this.networkExtensionTypeForm.valid) {
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
        networkExtensionTypeName:
          this.networkExtensionTypeForm.value.networkExtensionTypeName,
        networkExtensionTypeCode:
          this.networkExtensionTypeForm.value.networkExtensionTypeCode,
      };

      this.configurationService
        .getNetworkExtensionTypeSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Network Extension Type Updated');
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
      this.networkExtensionTypeForm.get('networkExtensionTypeName').invalid ||
      this.networkExtensionTypeForm.get('networkExtensionTypeCode').invalid
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
