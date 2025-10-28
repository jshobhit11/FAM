import { Component, Inject, OnInit,ViewChild } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-financial-year-master',
  templateUrl: './add-financial-year-master.component.html',
  styleUrls: ['./add-financial-year-master.component.scss'],
})
export class AddFinancialYearMasterComponent implements OnInit {
  notificationRef: any;
  financialForm: FormGroup;
  error: string;
  yearOptions: number[] = [];

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder,
  ) {
    dialogRef.disableClose = true;
  }
 
   ngOnInit(): void {
    this.populateYearOptions();
    console.log('comp');
    this.financialForm = this.formBuilder.group({
      financialYear: ['', [Validators.required]],
      financialYearStartDate: ['', [Validators.required]],
      financialYearEndDate: ['', [Validators.required]],
      displayFlag: ['', [Validators.required]],
    });
  }
  populateYearOptions() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
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
 getFinancialYearStartDate(): string {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    return currentYear+'-04-01' ;
  }

  getFinancialYearEndDate(): string {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const nextYear = currentYear + 1;

    return nextYear+'-03-31' ;
  }

  financialYearObj = {
    financialYear: '',
    financialYearStartDate: '',
    financialYearEndDate: '',
    displayFlag: '',
  };

  onAddFinancialYear() {
    Object.keys(this.financialForm.controls).forEach((key) => {
      this.financialForm.get(key)?.markAsTouched();
      const controlValue = key === 'displayFlag' ? +this.financialForm.get(key)?.value : this.financialForm.get(key)?.value;
      this.financialYearObj[key] = controlValue;

    });
    if (this.financialYearObj.financialYear) {
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

      this.configurationService.getfinancialYearSaveData(
        filters,
        this.financialYearObj
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
    if (
      this.financialForm.get('financialYear').invalid ||
      this.financialForm.get('financialYearStartDate').invalid ||
      this.financialForm.get('financialYearEndDate').invalid ||
      this.financialForm.get('displayFlag').invalid
    ) {
      this.error = 'Please fill out this Field.';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
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
