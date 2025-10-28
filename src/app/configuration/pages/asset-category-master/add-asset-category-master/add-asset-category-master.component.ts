import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-asset-category-master',
  templateUrl: './add-asset-category-master.component.html',
  styleUrls: ['./add-asset-category-master.component.scss'],
})
export class AddAssetCategoryMasterComponent implements OnInit {
  notificationRef: any;
  assetCategoryForm: FormGroup;
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
    this.assetCategoryForm = this.formBuilder.group({
      assetCategoryName: ['', [Validators.required]],
      assetCategoryCode: ['', [Validators.required]],
    });
  }

  assetCategoryObj = {
    assetCategoryName: '',
    assetCategoryCode: '',
  };

  onAddAssetCategory() {
    Object.keys(this.assetCategoryForm.controls).forEach((key) => {
      this.assetCategoryForm.get(key)?.markAsTouched();
    });
    if (this.assetCategoryForm.valid) {
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
        assetCategoryName: this.assetCategoryForm.value.assetCategoryName,
        assetCategoryCode: this.assetCategoryForm.value.assetCategoryCode,
      };
      this.configurationService
        .getAssetCategorySaveData(filters, reqBody)
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
    if (
      this.assetCategoryForm.get('assetCategoryName').invalid ||
      this.assetCategoryForm.get('assetCategoryCode').invalid
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
