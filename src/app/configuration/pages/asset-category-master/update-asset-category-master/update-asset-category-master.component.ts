import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-asset-category-master',
  templateUrl: './update-asset-category-master.component.html',
  styleUrls: ['./update-asset-category-master.component.scss'],
})
export class UpdateAssetCategoryMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  assetCategoryForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public amAssetCategoryMasterId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateAssetCategoryMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.assetCategoryForm = new FormGroup({
      assetCategoryName: new FormControl('', [Validators.required]),
      assetCategoryCode: new FormControl('', [Validators.required]),
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
    filters.amAssetCategoryMasterId = this.amAssetCategoryMasterId;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getAssetCategoryGetDataById(
      filters
    );
    console.log(' Asset Category get data by id', this.getData);
    this.assetCategoryForm.patchValue({
      assetCategoryName: this.getData.assetCategoryName,
      assetCategoryCode: this.getData.assetCategoryCode,
    });
  }

  onAssetCategoryUpdate() {
    this.assetCategoryForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        assetCategoryName: this.assetCategoryForm.value.assetCategoryName,
        assetCategoryCode: this.assetCategoryForm.value.assetCategoryCode,
      };

      let result = this.configurationService
        .getAssetCategoryUpdateData(this.filterData, updateBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Asset Category Updated');
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
    this.assetCategoryForm.markAllAsTouched();
    console.log('Form Valid?', this.assetCategoryForm.valid);
    let hasError = false;
    Object.keys(this.assetCategoryForm.controls).forEach((key) => {
      const control = this.assetCategoryForm.get(key);
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
  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
}
