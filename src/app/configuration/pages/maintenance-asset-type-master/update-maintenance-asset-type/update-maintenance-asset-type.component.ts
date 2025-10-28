import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-maintenance-asset-type',
  templateUrl: './update-maintenance-asset-type.component.html',
  styleUrls: ['./update-maintenance-asset-type.component.scss'],
})
export class UpdateMaintenanceAssetTypeComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  assetTypeForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public mmMaintenanceAssetTypeMasterId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateMaintenanceAssetTypeComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.assetTypeForm = new FormGroup({
      assetType: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
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
    filters.mmMaintenanceAssetTypeMasterId =
      this.mmMaintenanceAssetTypeMasterId;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getAssetTypeGetById(filters);
    console.log(' Asset Type get data by id', this.getData);

    this.assetTypeForm.patchValue({
      assetType: this.getData.assetType,
    });
  }

  onAssetTypeUpdate() {
    this.assetTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        assetType: this.getData.assetType,
      };

      let result = this.configurationService.getAssetTypeUpdateData(
        this.filterData,
        updateBody
      );
      console.log(result);
      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }
      this.notificationRef = this.snackBar.open(
        'Asset Type Name Updated Successfully',
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
          this.Service.sendUpdate('Asset Type Updated');
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
    this.assetTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.assetTypeForm.valid);
    let hasError = false;
    Object.keys(this.assetTypeForm.controls).forEach((key) => {
      const control = this.assetTypeForm.get(key);
      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });
    if (hasError) {
      return false;
    } else {
      return true;
    }
  }
}
