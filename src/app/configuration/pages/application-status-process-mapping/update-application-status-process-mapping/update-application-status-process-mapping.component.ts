import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-application-status-process-mapping',
  templateUrl: './update-application-status-process-mapping.component.html',
  styleUrls: ['./update-application-status-process-mapping.component.scss'],
})
export class UpdateApplicationStatusProcessMappingComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  disFlag = [1, 0];
  applicationData: any[] = [];
  processData: any[] = [];
  applicationStatusProcessMappingId = [];
  appStatusProcessForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateApplicationStatusProcessMappingComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.applicationData = getAllData.field1;
    this.processData = getAllData.field2;
    this.applicationStatusProcessMappingId = getAllData.field4;

    this.appStatusProcessForm = new FormGroup({
      applicationStatusId: new FormControl('', [Validators.required]),
      processTypeMasterId: new FormControl('', [Validators.required]),
      typeWiseSequence: new FormControl('', [Validators.required]),
      displayFlag: new FormControl('', [Validators.required]),
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
    filters.applicationStatusProcessMappingId = this.getAllData.field4;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getappStatusProMapGetById(
      filters
    );
    console.log(
      ' Application Status Process Mapping get data by id',
      this.getData
    );
    this.appStatusProcessForm.patchValue({
      applicationStatusId: this.getData.applicationStatusId,
      processTypeMasterId: this.getData.processTypeMasterId,
      typeWiseSequence: this.getData.typeWiseSequence,
      displayFlag: this.getData.displayFlag,
    });
  }
  onAppStatusProcessMappingUpdate() {
    this.appStatusProcessForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        applicationStatusId:
          this.appStatusProcessForm.value.applicationStatusId,
        processTypeMasterId:
          this.appStatusProcessForm.value.processTypeMasterId,
        typeWiseSequence: this.appStatusProcessForm.value.typeWiseSequence,
        displayFlag: this.appStatusProcessForm.value.displayFlag,
      };
      let result = this.configurationService.getappStatusProMapUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if (response) {
          // this.Service.sendUpdate('Application Status  Updated');
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
          this.notificationRef.afterDismissed().toPromise().then(() => {
            this.dialogRef.close();
            this.Service.sendUpdate('Application Mapping Updated');
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
    this.appStatusProcessForm.markAllAsTouched();
    console.log('Form Valid?', this.appStatusProcessForm.valid);
    let hasError = false;
    Object.keys(this.appStatusProcessForm.controls).forEach((key) => {
      const control = this.appStatusProcessForm.get(key);
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
