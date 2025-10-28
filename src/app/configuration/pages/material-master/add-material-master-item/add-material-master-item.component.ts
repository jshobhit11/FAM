import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-material-master-item',
  templateUrl: './add-material-master-item.component.html',
  styleUrls: ['./add-material-master-item.component.scss'],
})
export class AddMaterialMasterItemComponent implements OnInit {
  notificationRef: any;
  mlTypes = [];
  materialUnitData: any[] = [];
  materialData: any[] = [];
  materialMasterForm: FormGroup;
  error: string;
  constructor(
    private configureService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.mlTypes = getAllData.field1;
    this.materialUnitData = getAllData.field2;
    this.materialData = getAllData.field4;
  }

  ngOnInit(): void {
    console.log('comp');
    this.materialMasterForm = this.formBuilder.group({
      mlType: ['', Validators.required],
      mlUnit: ['', Validators.required],
      materialTypeMasterId: ['', Validators.required],
      mlCode: ['', Validators.required],
      mlName: ['', Validators.required],
    });
  }
  materialMasterObj = {
    materialTypeMasterId: '',
    mlType: '',
    mlCode: '',
    mlName: '',
    mlUnit: '',
  };

  addMaterialLabour() {
    Object.keys(this.materialMasterForm.controls).forEach((key) => {
      this.materialMasterForm.get(key)?.markAsTouched();
    });
    if (this.materialMasterForm.valid) {
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

      this.materialMasterObj = {
        materialTypeMasterId: this.materialMasterForm.get('materialTypeMasterId')?.value,
        mlType: this.materialMasterForm.get('mlType')?.value,
        mlCode: this.materialMasterForm.get('mlCode')?.value,
        mlName: this.materialMasterForm.get('mlName')?.value,
        mlUnit: this.materialMasterForm.get('mlUnit')?.value,
      };

      this.configureService
        .getSrmaterialMasterSaveData(filters, this.materialMasterObj)
        .then((response) => {
          console.log(" reponse messageText mat type  "+response.messageText);
          console.log(" reponse mat type  "+response);
          if(Response) {
            this.Service.sendUpdate('Material Master Updated');
            if (this.notificationRef) {
              this.notificationRef.dismiss();
              this.notificationRef = null;
            }
              this.notificationRef = this.snackBar.open(response.messageText,
              'OK',
              {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              }
            );
            this.notificationRef.afterDismissed().toPromise().then(() => {
              this.dialogRef.close();
              }).catch((error) => {
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
      this.materialMasterForm.get('mlType').invalid ||
      this.materialMasterForm.get('mlUnit').invalid
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
