import { Component, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-designation-master',
  templateUrl: './add-designation-master.component.html',
  styleUrls: ['./add-designation-master.component.scss'],
})
export class AddDesignationMasterComponent {
  notificationRef: any;
  designationTypes = [];
  filterData: any;
  designationData: any[] = [];
  designationTypeForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.designationData = getAllData.field1;
  }
  ngOnInit(): void {
    console.log('comp');
    this.designationTypeForm = this.formBuilder.group({
      designationName: ['', [Validators.required]],
      designationCode: ['', [Validators.required]],
      reportingDesigId: ['', [Validators.required]],
      officeType: ['', [Validators.required]],
    });
  }

  designationMasterObj = {
    designationName: '',
    designationCode: '',
    reportingDesigId: '',
    officeType: '',
  };

  onAddDesignationMaster() {
    Object.keys(this.designationTypeForm.controls).forEach((key) => {
      this.designationTypeForm.get(key)?.markAsTouched();
    });
    if (this.designationTypeForm.valid) {
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
        designationName: this.designationTypeForm.value.designationName,
        designationCode: this.designationTypeForm.value.designationCode,
        reportingDesigId: this.designationTypeForm.value.reportingDesigId,
        officeType: this.designationTypeForm.value.officeType,
      };
      this.filterData = { ...filters };
      this.configurationService
        .getSaveDesignationMasterData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Designation Master Updated');
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
    if (
      this.designationTypeForm.get('designationName').invalid ||
      this.designationTypeForm.get('designationCode').invalid
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
