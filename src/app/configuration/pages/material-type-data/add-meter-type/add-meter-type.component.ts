import { Component } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-meter-type',
  templateUrl: './add-meter-type.component.html',
  styleUrls: ['./add-meter-type.component.scss'],
})
export class AddMeterTypeComponent {
  notificationRef: any;
  materialTypeForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.materialTypeForm = this.formBuilder.group({
      materialTypeName: ['', Validators.required],
      materialTypeCode: ['', Validators.required],
    });
  }
  materialObj = {
    materialTypeName: '',
    materialTypeCode: '',
  };
  addMaterial() {
    Object.keys(this.materialTypeForm.controls).forEach((key) => {
      this.materialTypeForm.get(key)?.markAsTouched();
    });
    if (this.materialTypeForm.valid) {
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
        materialTypeName: this.materialTypeForm.value.materialTypeName,
        materialTypeCode: this.materialTypeForm.value.materialTypeCode,
      };
      this.configurationService
        .getCreateMaterialTypeData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Material Type Updated');
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
      this.materialTypeForm.get('materialTypeName').invalid ||
      this.materialTypeForm.get('materialTypeCode').invalid
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
