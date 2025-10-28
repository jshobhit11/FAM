import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-maintenance-frequency-type',
  templateUrl: './update-maintenance-frequency-type.component.html',
  styleUrls: ['./update-maintenance-frequency-type.component.scss']
})
export class UpdateMaintenanceFrequencyTypeComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  maintenanceTypeForm: FormGroup;

  constructor(
    private UpdateFrequencyMasterService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private mmMaintenanceFrequencyMasterId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateMaintenanceFrequencyTypeComponent>,
    private Service: CommonService
  ) { 
    dialogRef.disableClose = true;
   
    this.maintenanceTypeForm = new FormGroup({
      frequency: new FormControl('', [Validators.required]),
      frequencyType: new FormControl('', [Validators.required]),
      frequencyStartMonth: new FormControl('', [Validators.required]),
      frequencyEndMonth: new FormControl('', [Validators.required]),
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
    filters.mmMaintenanceFrequencyMasterId = this.mmMaintenanceFrequencyMasterId;
    this.filterData = { ...filters };
    this.getData =
      await this.UpdateFrequencyMasterService.getmaintenanceFrequencyGetById(
        filters
      );
    console.log(' frequency get data by id', this.getData);

    this.maintenanceTypeForm.patchValue({
      frequency: this.getData.frequency,
      frequencyType: this.getData.frequencyType,
      frequencyStartMonth: this.getData.frequencyStartMonth,
      frequencyEndMonth: this.getData.frequencyEndMonth,
    });
  }

  onMainFrequencyUpdate() {
    this.maintenanceTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        frequency: this.maintenanceTypeForm.value.frequency,
        frequencyType: this.maintenanceTypeForm.value.frequencyType,
        frequencyStartMonth: this.maintenanceTypeForm.value.frequencyStartMonth,
        frequencyEndMonth: this.maintenanceTypeForm.value.frequencyEndMonth,
      };

      this.UpdateFrequencyMasterService.getmaintenanceFrequencyUpdateData(
        this.filterData,
        updateBody
      );
      this.Service.sendUpdate('Constitueny Master Updated');
      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }
      this.notificationRef = this.snackBar.open(
        'Frequency Data Updated Successfully',
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
          this.Service.sendUpdate('Maintenance Frequency Master Updated');
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
    this.maintenanceTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.maintenanceTypeForm.valid);
    let hasError = false;

    Object.keys(this.maintenanceTypeForm.controls).forEach((key) => {
      const control = this.maintenanceTypeForm.get(key);

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
