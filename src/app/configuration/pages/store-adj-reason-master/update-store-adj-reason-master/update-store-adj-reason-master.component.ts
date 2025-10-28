import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-store-adj-reason-master',
  templateUrl: './update-store-adj-reason-master.component.html',
  styleUrls: ['./update-store-adj-reason-master.component.scss'],
})
export class UpdateStoreAdjReasonMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  storeAdjustmentForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public storeAdjReasonMasterId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateStoreAdjReasonMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.storeAdjustmentForm = new FormGroup({
      adjustmentReason: new FormControl('', [Validators.required]),
      descriptions: new FormControl('', [Validators.required]),
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
    filters.storeAdjReasonMasterId = this.storeAdjReasonMasterId;
    console.log(
      'filters.storeAdjReasonMasterId',
      filters.storeAdjReasonMasterId
    );
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getStoreReasonGetById(
      filters
    );
    console.log(' Store Adjustment get data by id', this.getData);
    this.storeAdjustmentForm.patchValue({
      adjustmentReason: this.getData.adjustmentReason,
      descriptions: this.getData.descriptions,
    });
  }

  onStoreAdjustmentUpdate() {
    this.storeAdjustmentForm.markAllAsTouched();

    if (this.isValidForm()) {
      const updateBody = {
        adjustmentReason:
          this.storeAdjustmentForm.get('adjustmentReason')?.value,
        descriptions: this.storeAdjustmentForm.get('descriptions')?.value,
      };

      let result = this.configurationService
        .getStoreReasonUpdateData(this.filterData, updateBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Store Adj Reason data');
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
    this.storeAdjustmentForm.markAllAsTouched();
    console.log('Form Valid?', this.storeAdjustmentForm.valid);
    let hasError = false;

    Object.keys(this.storeAdjustmentForm.controls).forEach((key) => {
      const control = this.storeAdjustmentForm.get(key);

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
