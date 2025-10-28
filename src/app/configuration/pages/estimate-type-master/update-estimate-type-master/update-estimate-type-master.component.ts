import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-estimate-type-master',
  templateUrl: './update-estimate-type-master.component.html',
  styleUrls: ['./update-estimate-type-master.component.scss'],
})
export class UpdateEstimateTypeMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  estimateTypeForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public estimateTypeMasterId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateEstimateTypeMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.estimateTypeForm = new FormGroup({
      estimateTypeName: new FormControl('', [Validators.required]),
      estimateTypeCode: new FormControl('', [Validators.required]),
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
    filters.estimateTypeMasterId = this.estimateTypeMasterId;
    this.filterData = { ...filters };
    this.getData =
      await this.configurationService.getEstimateTypeMasterDataById(filters);
    console.log(' Estimates get data by id', this.getData);
    this.estimateTypeForm.patchValue({
      estimateTypeName: this.getData.estimateTypeName,
      estimateTypeCode: this.getData.estimateTypeCode,
    });
  }

  onEstimatesUpdate() {
    this.estimateTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        estimateTypeName: this.estimateTypeForm.value.estimateTypeName,
        estimateTypeCode: this.estimateTypeForm.value.estimateTypeCode,
      };
      let result = this.configurationService.getEstimatesTypeMasterUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
        this.Service.sendUpdate('Estiamte Type Updated');
        if (this.notificationRef) {
          this.notificationRef.dismiss();
          this.notificationRef = null;
        }
        this.notificationRef = this.snackBar.open(response.messageText,
          'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        this.notificationRef
          .afterDismissed()
          .toPromise()
          .then(() => {
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
    this.estimateTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.estimateTypeForm.valid);
    let hasError = false;
    Object.keys(this.estimateTypeForm.controls).forEach((key) => {
      const control = this.estimateTypeForm.get(key);
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
