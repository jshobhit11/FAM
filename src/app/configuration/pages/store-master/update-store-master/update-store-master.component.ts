import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-store-master',
  templateUrl: './update-store-master.component.html',
  styleUrls: ['./update-store-master.component.scss'],
})
export class UpdateStoreMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  storeTypes = [];
  storeMasterId = [];
  storeMasterForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateStoreMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.storeTypes = getAllData.field1;
    this.storeMasterId = getAllData.field2;
    this.storeMasterForm = new FormGroup({
      storeCode: new FormControl('', [Validators.required]),
      storeName: new FormControl('', [Validators.required]),
      storeAddress: new FormControl('', [Validators.required]),
      storeType: new FormControl('', [Validators.required]),
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
    filters.storeMasterId = this.getAllData.field2;
    this.filterData = { ...filters };
    this.getData =
      await this.configurationService.getStoreMasterGetDatabyMasterId(filters);
    console.log('Store Master get data by id', this.getData);
    this.storeMasterForm.patchValue({
      storeCode: this.getData.storeCode,
      storeName: this.getData.storeName,
      storeAddress: this.getData.storeAddress,
      storeType: this.getData.storeType,
    });
  }

  onStoreMasterUpdate() {
    this.storeMasterForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        storeCode: this.storeMasterForm.value.storeCode,
        storeName: this.storeMasterForm.value.storeName,
        storeAddress: this.storeMasterForm.value.storeAddress,
        storeType: this.storeMasterForm.value.storeType,
      };

      let result = this.configurationService
        .getStoreMasterUpdateData(this.filterData, updateBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Store Master Updated');
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
    this.storeMasterForm.markAllAsTouched();
    console.log('Form Valid?', this.storeMasterForm.valid);
    let hasError = false;

    Object.keys(this.storeMasterForm.controls).forEach((key) => {
      const control = this.storeMasterForm.get(key);

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
