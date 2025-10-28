import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-process-type-master',
  templateUrl: './update-process-type-master.component.html',
  styleUrls: ['./update-process-type-master.component.scss'],
})
export class UpdateProcessTypeMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  processTypeForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public processTypeMasterId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateProcessTypeMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.processTypeForm = new FormGroup({
      processTypeName: new FormControl('', [Validators.required]),
      processTypeHeader: new FormControl('', [Validators.required]),
      processDisplayOrder: new FormControl('', [Validators.required]),
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
    filters.processTypeMasterId = this.processTypeMasterId;
    console.log('filters.processTypeMasterId====', filters.processTypeMasterId);
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getprocessTypeGetById(
      filters
    );
    console.log(' Process type get data by id', this.getData);
    this.processTypeForm.patchValue({
      processTypeName: this.getData.processTypeName,
      processTypeHeader: this.getData.processTypeHeader,
      processDisplayOrder: this.getData.processDisplayOrder,
    });
  }
  onProcessUpdate() {
    this.processTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        processTypeName: this.processTypeForm.value.processTypeName,
        processTypeHeader: this.processTypeForm.value.processTypeHeader,
        processDisplayOrder: this.processTypeForm.value.processDisplayOrder,
      };
      let result = this.configurationService.getprocessTypeUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        //return;
        if (response) {
          this.Service.sendUpdate('Process Type  Updated');
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
            this.Service.sendUpdate('Process Type Updated');
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
    this.processTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.processTypeForm.valid);
    let hasError = false;
    Object.keys(this.processTypeForm.controls).forEach((key) => {
      const control = this.processTypeForm.get(key);
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
