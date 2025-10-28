import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-maintenance-asset-type',
  templateUrl: './add-maintenance-asset-type.component.html',
  styleUrls: ['./add-maintenance-asset-type.component.scss'],
})
export class AddMaintenanceAssetTypeComponent implements OnInit {
  notificationRef: any;
  assetTypeForm: FormGroup;
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
    this.assetTypeForm = this.formBuilder.group({
      assetType: ['', [Validators.required]],
    });
  }
  assetTypeObj = {
    assetType: '',
  };

  onAddAssetType() {
    Object.keys(this.assetTypeForm.controls).forEach((key) => {
      this.assetTypeForm.get(key)?.markAsTouched();
    });
    if (this.assetTypeObj.assetType) {
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
      this.configurationService.getAssetTypeSaveData(
        filters,
        this.assetTypeObj
      );
      this.Service.sendUpdate('Asset Type Updated');
      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }
      this.notificationRef = this.snackBar.open(
        'Asset Type Added Successfully',
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
    if (this.assetTypeForm.get('assetType').invalid) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
