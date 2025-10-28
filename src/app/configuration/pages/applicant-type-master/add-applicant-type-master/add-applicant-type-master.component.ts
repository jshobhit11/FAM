import { Component } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-applicant-type-master',
  templateUrl: './add-applicant-type-master.component.html',
  styleUrls: ['./add-applicant-type-master.component.scss'],
})
export class AddApplicantTypeMasterComponent {
  notificationRef: any;
  applicantTypeForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit() {
    this.applicantTypeForm = this.formBuilder.group({
      applicantTypeName: ['', Validators.required],
      applicantTypeCode: ['', Validators.required],
    });
  }

  applicantTypeObj = {
    applicantTypeName: '',
    applicantTypeCode: '',
  };

  onAddApplicantType() {
    Object.keys(this.applicantTypeForm.controls).forEach((key) => {
      this.applicantTypeForm.get(key)?.markAsTouched();
    });
    if (this.applicantTypeForm.valid) {
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
        applicantTypeName: this.applicantTypeForm.value.applicantTypeName,
        applicantTypeCode: this.applicantTypeForm.value.applicantTypeCode,
      };
      this.configurationService
        .getApplicantTypeSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Applicant Type Updated');
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
      this.applicantTypeForm.get('applicantTypeName').invalid ||
      this.applicantTypeForm.get('applicantTypeCode').invalid
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
