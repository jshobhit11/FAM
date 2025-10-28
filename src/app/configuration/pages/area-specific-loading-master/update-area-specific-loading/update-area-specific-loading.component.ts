import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-update-area-specific-loading',
  templateUrl: './update-area-specific-loading.component.html',
  styleUrls: ['./update-area-specific-loading.component.scss'],
})
export class UpdateAreaSpecificLoadingComponent implements OnInit {
  getData: any = {};
  filterData: any;
  filterDataUpdate: any;
  notificationRef: any;
  areaSpecificLoadingChargesMasterId = [];
  areaSpecificForm: FormGroup;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateAreaSpecificLoadingComponent>,
    private service: CommonService,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.areaSpecificLoadingChargesMasterId = this.getAllData.field1;



    this.areaSpecificForm = this.formBuilder.group({
      chargesCategory: ['', [Validators.required]],
      chargesPercentage: ['', [Validators.required, Validators.pattern(/^(\d{1,2}(\.\d{1,2})?|100)$/)]],
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
      areaSpecificLoadingChargesMasterId : this.areaSpecificLoadingChargesMasterId,
    };
    this.getData = await this.configurationService.getAreaSpecificLoaderGetById(
      filters
    );
    console.log('Area specific loader master get data by id', this.getData);
    this.areaSpecificForm.patchValue({
      chargesCategory: this.getData.chargesCategory,
      chargesPercentage: this.getData.chargesPercentage,
    });
  }

  onAreaSpecificLoaderUpdate() {
    this.areaSpecificForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        chargesCategory: this.areaSpecificForm.value.chargesCategory,
        chargesPercentage: Number(this.areaSpecificForm.value.chargesPercentage),
      };

      this.configurationService
        .getAreaSpecificLoaderUpdateData(this.getData, updateBody)
        .then((result) => {
          console.log(result);
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }
          this.notificationRef = this.snackBar.open(
            'Area Specific Loader Master Updated Successfully',
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
              this.service.sendUpdate('Area specific loader updated');
            });
        });
    }
  }

  isValidForm(): boolean {
    this.areaSpecificForm.markAllAsTouched();
    console.log('Form Valid?', this.areaSpecificForm.valid);
    let hasError = false;
    Object.keys(this.areaSpecificForm.controls).forEach((key) => {
      const control = this.areaSpecificForm.get(key);
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
