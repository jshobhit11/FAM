import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-workscope-description-master',
  templateUrl: './add-workscope-description-master.component.html',
  styleUrls: ['./add-workscope-description-master.component.scss'],
})
export class AddWorkscopeDescriptionMasterComponent {
  notificationRef: any;
  workTypeApplicables = [];
  estimateData: any[] = [];
  workScopeTypeForm: FormGroup;
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
    this.workTypeApplicables = getAllData.field1;
    this.estimateData = getAllData.field3;
  }
  ngOnInit(): void {
    console.log('comp');
    this.workScopeTypeForm = this.formBuilder.group({
      workscopeDescription: ['', Validators.required],
      workscopeDescCode: ['', Validators.required],
      workTypeApplicable: ['', Validators.required],
      estimateType: ['', Validators.required],
    });
  }
  workscopeObj = {
    workscopeDescription: '',
    workscopeDescCode: '',
    workTypeApplicable: '',
    estimateType: '',
  };

  onAddWorkscopeType() {
    Object.keys(this.workScopeTypeForm.controls).forEach((key) => {
      this.workScopeTypeForm.get(key)?.markAsTouched();
    });
    if (this.workScopeTypeForm.valid) {
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
        workscopeDescription: this.workScopeTypeForm.value.workscopeDescription,
        workscopeDescCode: this.workScopeTypeForm.value.workscopeDescCode,
        workTypeApplicable: this.workScopeTypeForm.value.workTypeApplicable,
        estimateType: this.workScopeTypeForm.value.estimateType,
      };
      this.configurationService
        .getWorkscopeDesMasterSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Workscope Des Type Updated');
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
      this.workScopeTypeForm.get('workscopeDescription').invalid ||
      this.workScopeTypeForm.get('workscopeDescCode').invalid
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
