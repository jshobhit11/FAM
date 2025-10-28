import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-applicant-type-master',
  templateUrl: './update-applicant-type-master.component.html',
  styleUrls: ['./update-applicant-type-master.component.scss'],
})
export class UpdateApplicantTypeMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  filterDataUpdate: any;
  notificationRef: any;
  applicantTypeForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public applicantId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateApplicantTypeMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.applicantTypeForm = new FormGroup({
      applicantTypeName: new FormControl('', [Validators.required]),
      applicantTypeCode: new FormControl('', [Validators.required]),
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
    filters.applicantId = this.applicantId;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getApplicantTypeGetDataById(
      filters
    );
    console.log('applicant type get data by id', this.getData);
    this.applicantTypeForm.patchValue({
      applicantTypeName: this.getData.applicantTypeName,
      applicantTypeCode: this.getData.applicantTypeCode,
    });
  }
  onApplicantUpdate() {
    this.applicantTypeForm.markAllAsTouched();
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
        applicantTypeName: this.applicantTypeForm.value.applicantTypeName,
        applicantTypeCode: this.applicantTypeForm.value.applicantTypeCode,
      };
      filters.applicantTypeId = this.applicantId;
      this.filterDataUpdate = { ...filters };
      let result = this.configurationService.getApplicantTypeUpdateData(
        this.filterDataUpdate,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        //return;
        if (response) {
          this.Service.sendUpdate('Applicant Type Updated');
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
          }).catch((error) => {
            console.error('Error closing dialog:', error);
          });
        }
      });
    }
  }

  isValidForm(): boolean {
    this.applicantTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.applicantTypeForm.valid);
    let hasError = false;
    Object.keys(this.applicantTypeForm.controls).forEach((key) => {
      const control = this.applicantTypeForm.get(key);
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
