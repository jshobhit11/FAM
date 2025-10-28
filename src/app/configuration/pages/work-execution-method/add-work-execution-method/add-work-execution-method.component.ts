import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-work-execution-method',
  templateUrl: './add-work-execution-method.component.html',
  styleUrls: ['./add-work-execution-method.component.scss'],
})
export class AddWorkExecutionMethodMasterComponent {
  notificationRef: any;
  workExecutionForm: FormGroup;
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
    this.workExecutionForm = this.formBuilder.group({
      woExecutionMethodName: ['', [Validators.required]],
      woExecutionMethodCode: ['', [Validators.required]],
    });
  }
  workExecutionObj = {
    woExecutionMethodName: '',
    woExecutionMethodCode: '',
  };

  onAddWorkExecution() {
    Object.keys(this.workExecutionForm.controls).forEach((key) => {
      this.workExecutionForm.get(key)?.markAsTouched();
    });
    if (this.workExecutionForm.valid) {
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
        woExecutionMethodName:
          this.workExecutionForm.value.woExecutionMethodName,
        woExecutionMethodCode:
          this.workExecutionForm.value.woExecutionMethodCode,
      };

      this.configurationService
        .getWorkExecutionSavaData(filters, reqBody)
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
    if (
      this.workExecutionForm.get('woExecutionMethodName').invalid ||
      this.workExecutionForm.get('woExecutionMethodCode').invalid
    ) {
      this.error = 'Please fill out this Field.';
      console.log(this.error);

      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
