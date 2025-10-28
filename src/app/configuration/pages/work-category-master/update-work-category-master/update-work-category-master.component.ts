import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-work-category-master',
  templateUrl: './update-work-category-master.component.html',
  styleUrls: ['./update-work-category-master.component.scss'],
})
export class UpdateWorkCategoryMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  bugdetTypes = ['CAPITAL', 'REVENUE', 'R & M'];
  bugdetCheckFlags = [];
  workCategoryMaster = [];
  workCategoryForm: FormGroup;
  selectedBudgetCheckFlag: string;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateWorkCategoryMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.bugdetTypes = this.getAllData.field1;
    this.bugdetCheckFlags = this.getAllData.field2;
    this.workCategoryMaster = getAllData.field3;

    this.workCategoryForm = new FormGroup({
      workCategoryName: new FormControl('', [Validators.required]),
      workCategoryCode: new FormControl('', [Validators.required]),
      budgetType: new FormControl('', [Validators.required]),
      budgetCheckFlag: new FormControl('', [Validators.required]),
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
    filters.workCategoryMaster = this.getAllData.field3;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getWorkCategoryGetById(
      filters
    );
    console.log(' Work Category Master get data by id', this.getData);
    this.selectedBudgetCheckFlag = this.getData.budgetCheckFlag;
    this.workCategoryForm.patchValue({
      workCategoryName: this.getData.workCategoryName,
      workCategoryCode: this.getData.workCategoryCode,
      budgetType: this.getData.budgetType,
      budgetCheckFlag: this.getData.budgetCheckFlag,
    });
  }

  onWorkCategoryUpdate() {
    if (this.workCategoryForm.valid) {
      // Get the updated values from the form
      const updateData = {
        workCategoryMasterId: this.getData.workCategoryMasterId,
        workCategoryName: this.workCategoryForm.value.workCategoryName,
        workCategoryCode: this.workCategoryForm.value.workCategoryCode,
        budgetType: this.workCategoryForm.value.budgetType,
        budgetCheckFlag: this.workCategoryForm.value.budgetCheckFlag,
      };

      // Call the update service
      this.configurationService.getWorkCategoryUpdateData(this.filterData, updateData)
        .then((response) => {
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
  isValidForm(): boolean {
    this.workCategoryForm.markAllAsTouched();
    console.log('Form Valid?', this.workCategoryForm.valid);
    let hasError = false;

    Object.keys(this.workCategoryForm.controls).forEach((key) => {
      const control = this.workCategoryForm.get(key);

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
  budgetCheckFlags = [
    { value: 0, label: 'No' },
    { value: 1, label: 'Yes' },
  ];
}
