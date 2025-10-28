import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-store-master',
  templateUrl: './add-store-master.component.html',
  styleUrls: ['./add-store-master.component.scss'],
})
export class AddStoreMasterComponent {
  notificationRef: any;
  storeTypes = [];
  storeMasterForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any
  ) {
    dialogRef.disableClose = true;
    this.storeTypes = getAllData.field1;
  }
  ngOnInit() {
    this.storeMasterForm = this.formBuilder.group({
      storeMasterId: [''],
      storeCode: ['', [Validators.required]],
      storeName: ['', [Validators.required]],
      storeAddress: ['', [Validators.required]],
      storeType: ['', Validators.required],
    });
  }
  storeMasterObj = {
    storeCode: '',
    storeName: '',
    storeAddress: '',
    storeType: '',
  };

  onAddStoreMaster() {
    Object.keys(this.storeMasterForm.controls).forEach((key) => {
      this.storeMasterForm.get(key)?.markAsTouched();
    });
    if (this.storeMasterForm.valid) {
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
        storeName: this.storeMasterForm.value.storeName,
        storeAddress: this.storeMasterForm.value.storeAddress,
        storeType: this.storeMasterForm.value.storeType,
        storeCode: this.storeMasterForm.value.storeCode,
      };
      this.configurationService
        .getStoreMasterSaveData(filters, reqBody)
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
    if (
      this.storeMasterForm.get('storeCode').invalid ||
      this.storeMasterForm.get('storeName').invalid ||
      this.storeMasterForm.get('storeAddress').invalid ||
      this.storeMasterForm.get('storeType').invalid
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
