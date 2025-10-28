import { Component } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-material-unit',
  templateUrl: './add-material-unit.component.html',
  styleUrls: ['./add-material-unit.component.scss'],
})
export class AddMaterialUnitComponent {
  addData: any;
  notificationRef: any;
  materialUnitForm: FormGroup;
  error: string;
  constructor(
    private configureService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.materialUnitForm = this.formBuilder.group({
      materialUnit: ['', Validators.required],
    });
  }

  materialUnitObj = {
    materialUnit: '',
  };

  addMaterialUnit() {
    Object.keys(this.materialUnitForm.controls).forEach((key) => {
      this.materialUnitForm.get(key)?.markAsTouched();
    });
    if (this.materialUnitForm.valid) {
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
        materialUnit: this.materialUnitForm.value.materialUnit,
      };

      this.configureService
        .getSaveMaterialUnitData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Material Unit Updated');
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
    if (this.materialUnitForm.get('materialUnit').invalid) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
