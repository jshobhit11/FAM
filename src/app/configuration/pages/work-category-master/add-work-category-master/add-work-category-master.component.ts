import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-work-category-master',
  templateUrl: './add-work-category-master.component.html',
  styleUrls: ['./add-work-category-master.component.scss'],
})
export class AddWorkCategoryMasterComponent {
  notificationRef: any;
  bugdetTypes = [];
  bugdetCheckFlags = [];
  selectedValue: number;
  workCategoryForm: FormGroup;
 
  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any
  ) {
    dialogRef.disableClose = true;
    this.bugdetTypes = getAllData.field1;
    this.bugdetCheckFlags = getAllData.field2;
 
    this.workCategoryForm = this.formBuilder.group({
      workCategoryName: ['', Validators.required],
      workCategoryCode: ['', Validators.required],
      bugdetType: ['', Validators.required],
      bugdetCheckFlag: ['null', Validators.required],
    });
  }
 
  workCategoryTypeObj = {
    workCategoryName: '',
    workCategoryCode: '',
    budgetType: '',
    budgetCheckFlag: '',
  };
 
  onAddWorkCategoryType() {
    this.markAllFieldsTouched();
 
    if (this.workCategoryForm.valid) {
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
      this.workCategoryForm.value.bugdetCheckFlag =
        +this.workCategoryForm.value.bugdetCheckFlag;
      const formValues = {
        workCategoryName: this.workCategoryForm.get('workCategoryName').value,
        workCategoryCode: this.workCategoryForm.get('workCategoryCode').value,
        budgetType: this.workCategoryForm.get('bugdetType').value,
        budgetCheckFlag: +this.workCategoryForm.get('bugdetCheckFlag').value,
      };
 
      this.configurationService.getWorkCategorySaveData(filters, 
        formValues).then((response) => {
          if (response) {
            this.Service.sendUpdate('Work Category Master Updated');
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
   
 
  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
 
  markAllFieldsTouched() {
    Object.values(this.workCategoryForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
 
  budgetCheckFlags = [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' },
  ];
}