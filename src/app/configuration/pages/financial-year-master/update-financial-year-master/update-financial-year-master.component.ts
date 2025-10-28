import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-financial-year-master',
  templateUrl: './update-financial-year-master.component.html',
  styleUrls: ['./update-financial-year-master.component.scss'],
})
export class UpdateFinancialYearMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  disFlag = [1, 0];
  financialYearMasterId = [];
  financialForm: FormGroup;
  yearOptions: number[] = [];
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateFinancialYearMasterComponent>,
    private Service: CommonService
     ) {
    dialogRef.disableClose = true;
    this.financialYearMasterId = getAllData.field3;
    this.financialForm = new FormGroup({
      financialYear: new FormControl('', [Validators.required]),
      financialYearStartDate: new FormControl('', [Validators.required]),
      financialYearEndDate: new FormControl('', [Validators.required]),
      displayFlag: new FormControl('', [Validators.required]),
      selectedFinancialYear:  new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.populateYearOptions();
    this.getData.selectedFinancialYear = 2024;
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
    filters.financialYearMasterId = this.getAllData.field3;
    this.filterData = { ...filters };
    this.getFinancialYearDataById(filters);
  }

  async getFinancialYearDataById(filters: any) {
    this.getData = await this.configurationService.getfinancialYearGetById(
      filters
    );
    console.log('Financial Year Get data by id', this.getData);
    const selectedYear = parseInt(this.getData.financialYear.split('-')[0]);
    console.log('Selected Year:', selectedYear);

    // Logging yearOptions for debugging
    console.log('Year Options:', this.yearOptions);
    this.financialForm.patchValue({
      financialYear: this.getData.financialYear,
      financialYearStartDate: this.getData.financialYearStartDate,
      financialYearEndDate: this.getData.financialYearEndDate,
      displayFlag: this.getData.displayFlag,
      selectedFinancialYear: selectedYear,
    });
  }

  populateYearOptions() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    for (let i = currentYear - 15; i <= currentYear + 10; i++) {
      this.yearOptions.push(i);
    }
  }
 
  onFinancialYearSelected(year: number) {
    const financialYearStartDate = year + '-04-01';
    const financialYearEndDate = (year + 1) + '-03-31';
    const financialYear = year + '-' + (year + 1).toString().slice(-2);

    this.financialForm.patchValue({
      financialYearStartDate: financialYearStartDate,
      financialYearEndDate: financialYearEndDate,
      financialYear: financialYear
    });
  }

  onFinancialYearUpdate() {
    this.financialForm.markAllAsTouched();
    
    if (this.isValidForm()) {
      const updateBody = {
        financialYear: this.financialForm.value.financialYear,
        financialYearStartDate: this.financialForm.value.financialYearStartDate,
        financialYearEndDate: this.financialForm.value.financialYearEndDate,
        displayFlag: this.financialForm.value.displayFlag,
        selectedFinancialYear: this.financialForm.value.selectedFinancialYear,
      };
 
      let result = this.configurationService.getfinancialYearUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if (response) {
          this.Service.sendUpdate('Financial Year Updated');
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
    this.financialForm.markAllAsTouched();
    console.log('Form Valid?', this.financialForm.valid);
    let hasError = false;
    Object.keys(this.financialForm.controls).forEach((key) => {
      const control = this.financialForm.get(key);
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
