import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-work-execution-method',
  templateUrl: './update-work-execution-method.component.html',
  styleUrls: ['./update-work-execution-method.component.scss'],
})
export class UpdateWorkExecutionMethodMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  workExecutionForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public woExecutionMethodId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateWorkExecutionMethodMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.workExecutionForm = new FormGroup({
      woExecutionMethodName: new FormControl('', [Validators.required]),
      woExecutionMethodCode: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const woExecutionMethodId = sessionStorage.getItem('estimate-Id');
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      woExecutionMethodId,
    };
    filters.woExecutionMethodId = this.woExecutionMethodId;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getWorkExecutionGetDataById(
      filters
    );
    this.workExecutionForm.patchValue({
      woExecutionMethodName: this.getData.woExecutionMethodName,
      woExecutionMethodCode: this.getData.woExecutionMethodCode,
    });
  }

  onWorkExecution() {
    this.workExecutionForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        woExecutionMethodName:
          this.workExecutionForm.value.woExecutionMethodName,
        woExecutionMethodCode:
          this.workExecutionForm.value.woExecutionMethodCode,
      };

      let result = this.configurationService
        .getWorkExecutionUpdateDate(this.filterData, updateBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Work Execution Method Updated');
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
    this.workExecutionForm.markAllAsTouched();
    console.log('Form Valid?', this.workExecutionForm.valid);
    let hasError = false;

    Object.keys(this.workExecutionForm.controls).forEach((key) => {
      const control = this.workExecutionForm.get(key);

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
