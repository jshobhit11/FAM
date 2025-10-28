import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-maintenance-frequency-type',
  templateUrl: './add-maintenance-frequency-type.component.html',
  styleUrls: ['./add-maintenance-frequency-type.component.scss']
})
export class AddMaintenanceFrequencyTypeComponent implements OnInit {
  notificationRef: any;
  myForm: FormGroup;
  maintenanceTypeForm: FormGroup;
  error: any = '';

  constructor(
    private configureService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;

  }

  ngOnInit(): void {
    console.log('comp');
    this.maintenanceTypeForm = this.formBuilder.group({
      frequency: ['', [Validators.required]],
      frequencyType: ['', [Validators.required]],
      frequencyStartMonth: ['', [Validators.required]],
      frequencyEndMonth: ['', [Validators.required]],
    });
  }
  maintenanceFreObj = {
    frequency: '',
    frequencyType: '',
    frequencyStartMonth: '',
    frequencyEndMonth: '',
  };

  onMainFrequencyAdd() {
    Object.keys(this.maintenanceTypeForm.controls).forEach((key) => {
      this.maintenanceTypeForm.get(key)?.markAsTouched();
    });
    if (
      this.maintenanceFreObj.frequency &&
      this.maintenanceFreObj.frequencyType
    ) {
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

      this.configureService.getsaveMaintenanceFrequencyData(
        filters,
        this.maintenanceFreObj
      );
      this.Service.sendUpdate('Constitueny Master Updated');
      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }
      this.notificationRef = this.snackBar.open(
        'Frequency data Added Successfully',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      this.Service.sendUpdate('Maintenance Frequency Master Updated');
      this.notificationRef
        .afterDismissed()
        .toPromise()
        .then(() => {
          this.dialogRef.close();
        });
    }

  }
  
}