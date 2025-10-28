import { Component, Inject, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-meter-type-master',
  templateUrl: './add-meter-type-master.component.html',
  styleUrls: ['./add-meter-type-master.component.scss']
})
export class AddMeterTypeMasterComponent implements OnInit {
  notificationRef: any;
  meterTypeForm: FormGroup;
  error: string;
  meterMaterials: any;
  options: string[];
  filteredOptions: any;
  tempData: any;

  constructor(
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
  )
   { dialogRef.disableClose = true; 
  }

  async ngOnInit(): Promise<void> {
    this.meterTypeForm = this.formBuilder.group({
      meterType: ['', Validators.required],
      materialCode: ['', Validators.required],
    });

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filters = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };
    this.meterMaterials = await this.configurationService.getSRMaterialsData(filters);
    this.tempData = this.meterMaterials;
      console.log('Meter Type Master Data from service', this.meterMaterials);

  }
  materialObj = {
    meterType: '',
    materialCode: '',
  };

  onAddMeter() {
    Object.keys(this.meterTypeForm.controls).forEach((key) => {
      this.meterTypeForm.get(key)?.markAsTouched();
    });
    if (this.meterTypeForm.valid) {
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
        meterType: this.meterTypeForm.value.meterType,
        materialCode: this.meterTypeForm.value.materialCode,
      };
      this.configurationService
        .getMeterTypeSaveData(filters, reqBody)
        .then((response) => {
          this.meterMaterials = response.data;
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Material Type Updated');
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
  onInputChange(value: string) {
    if (value.trim() === '') {
      this.meterMaterials = this.tempData; 
    } else {
      this.filteredOptions = this.meterMaterials.filter(option =>
        option.mlCode.toLowerCase().includes(value.toLowerCase())
      );
      this.meterMaterials = this.filteredOptions;

    }
  }
   isValidForm(): boolean {
    if (
      this.meterTypeForm.get('meterType').invalid ||
      this.meterTypeForm.get('materiaCode').invalid
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




