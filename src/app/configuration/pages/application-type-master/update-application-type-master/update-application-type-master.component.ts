import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { update } from 'lodash';
@Component({
  selector: 'app-update-application-type-master',
  templateUrl: './update-application-type-master.component.html',
  styleUrls: ['./update-application-type-master.component.scss'],
})
export class UpdateApplicationTypeMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  filterDataUpdate: any;
  notificationRef: any;
  applicationTypeId = [];
  processData = [];
  applicationTypeForm: FormGroup;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateApplicationTypeMasterComponent>,
    private service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.processData = this.getAllData.field1;
    this.applicationTypeId = this.getAllData.field2;

    // Initialize form controls with default values
    this.applicationTypeForm = new FormGroup({
      applicationTypeName: new FormControl('', [Validators.required]),
      applicationTypeCode: new FormControl('', [Validators.required]),
      registeredSourceType: new FormControl('', [Validators.required]),
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
    filters.applicationTypeId = this.applicationTypeId;
    this.filterData = { ...filters };
    this.getData =
      await this.configurationService.getApplicationTypeMasterGetById(filters);
    console.log('application type get data by id', this.getData);

    // Set default values for form controls after data is fetched
    this.applicationTypeForm.patchValue({
      applicationTypeName: this.getData.applicationTypeName,
      applicationTypeCode: this.getData.applicationTypeCode,
      registeredSourceType: this.getData.registeredSourceType,
    });
  }

  onApplicationUpdate() {
    this.applicationTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
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
      const updateBody = {
        applicationTypeName: this.applicationTypeForm.value.applicationTypeName,
        applicationTypeCode: this.applicationTypeForm.value.applicationTypeCode,
        registeredSourceType:
          this.applicationTypeForm.value.registeredSourceType,
      };
      filters.applicationTypeId = this.applicationTypeId;
      this.filterDataUpdate = { ...filters };
      
       let result = this.configurationService.getApplicationTypeMasterUpdateData(this
          .filterDataUpdate,
           updateBody).then((response )=>{
            console.log(" reponse messageText mat type  "+response.messageText);
            console.log(" reponse mat type  "+response);
            if (response) {

              if (this.notificationRef) {
                this.notificationRef.dismiss();
                this.notificationRef = null;
              }
              this.notificationRef = this.snackBar.open(response.messageText,
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
                  this.service.sendUpdate('Application Type Updated');
                }).catch((error) => {
                  console.error('Error closing dialog:', error);
                });
              }
            });
          }
  }

  isValidForm(): boolean {
    this.applicationTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.applicationTypeForm.valid);
    let hasError = false;
    Object.keys(this.applicationTypeForm.controls).forEach((key) => {
      const control = this.applicationTypeForm.get(key);
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
