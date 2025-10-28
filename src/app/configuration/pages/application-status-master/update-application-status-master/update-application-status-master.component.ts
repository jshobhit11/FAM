import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-application-status-master',
  templateUrl: './update-application-status-master.component.html',
  styleUrls: ['./update-application-status-master.component.scss'],
})
export class UpdateApplicationStatusMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  processData: any[] = [];
  displayTypes = [1, 0];
  appStatusForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateApplicationStatusMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.processData = getAllData.field1;
    this.appStatusForm = new FormGroup({
      processType: new FormControl('', [Validators.required]),
      displayType: new FormControl('', [Validators.required]),
      statusName: new FormControl('', [Validators.required]),
      statusCode: new FormControl('', [Validators.required]),
      typeWiseSequence: new FormControl('', [Validators.required]),
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
    filters.applicatoinStatusId = this.getAllData.field2;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getApplicationStatusGetById(
      filters
    );
    console.log(' Application Status get data by id', this.getData);
    this.appStatusForm.patchValue({
      processType: this.getData.processType,
      displayType: this.getData.displayType,
      statusName: this.getData.statusName,
      statusCode: this.getData.statusCode,
      typeWiseSequence: this.getData.typeWiseSequence,
    });
  }
  onApplicationStatusUpdate() {
    this.appStatusForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        processType: this.appStatusForm.value.processType,
        displayType: this.appStatusForm.value.displayType,
        statusName: this.appStatusForm.value.statusName,
        statusCode: this.appStatusForm.value.statusCode,
        typeWiseSequence: this.appStatusForm.value.typeWiseSequence,
      };
      let result = this.configurationService.getApplicationStatusUpdate(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
        this.Service.sendUpdate('Application Status Type Updated');
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
  
  isValidForm(): boolean {
    this.appStatusForm.markAllAsTouched();
    console.log('Form Valid?', this.appStatusForm.valid);
    let hasError = false;
    Object.keys(this.appStatusForm.controls).forEach((key) => {
      const control = this.appStatusForm.get(key);
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
