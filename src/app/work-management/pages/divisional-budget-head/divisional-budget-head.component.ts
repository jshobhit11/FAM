import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { DivisionalBudgetHeadService } from 'src/app/services/divisional-budget-head.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-divisional-budget-head',
  templateUrl: './divisional-budget-head.component.html',
  styleUrls: ['./divisional-budget-head.component.scss'],
})
export class DivisionalBudgetHeadComponent implements OnInit {
  @ViewChild('accountHeadDescription', { static: false }) accountHeadDescription!: ElementRef;
  divisionValue: string = '';
  accHeadValue: string = '';
  financialYear: string = '';
  divisionalBudgetHead: string[] = [];
  divisionOptions: any[] = [];
  accountHeadoptions: any[] = [];
  budgetYearOption: any[];
  accountHeadDescriptions: any[] = [];
  selectedData: any;
  accountData: any;
  divisionOffice: any;
  budgetYearOptions: any;
  accountHeadMasterId: string;
  addedData: any[] = [];
  budgetWorkType: string = '';
  divisionalBudgetHeadMatched: boolean = false;
  disableAddNewButton: boolean = false;
  private snackBarRef: MatSnackBarRef<any>;
  constructor(
    private snackBar: MatSnackBar,
    private divisionalbudgetheadservice: DivisionalBudgetHeadService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.selectedData = null;
  }

  async ngOnInit() {
    try {
      const filters: any = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
      };

      this.divisionOffice = await this.divisionalbudgetheadservice.getDivisionOfficeId(filters);
      this.divisionOptions = this.divisionOffice.map((data: any) => ({
        divisionCode: data.officeCode,
        divisionName: data.officeName,
      }));

      this.accountData = await this.divisionalbudgetheadservice.getDivisionAccountHeadData(filters);
      this.accountHeadoptions = Array.from(new Set(this.accountData.map((data: any) => data.accountHeadCode)));
      this.updateDivisionalBudgetHead();
      this.accountHeadDescriptions = Array.from(new Set(this.accountData.map((data: any) => data.accountHeadDescription)));
    } catch (error) {
      console.error(error);
    }
  }

  getDivisionAccountHeadDescription(accountHeadCode: string): string {
    const selectedData = this.accountData.find((data: any) => data.accountHeadCode === accountHeadCode);
    return selectedData ? selectedData.accHeadDescription : '';
  }

  updateSelectedData(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const selectedValue = selectedOption.value;

    if (selectedValue) {
      this.selectedData = this.accountData.find((data) => data.accountHeadCode === selectedValue);
      if (this.selectedData) {
        setTimeout(() => {
          if (this.accountHeadDescription) {
            this.accountHeadDescription.nativeElement.innerText = this.selectedData.accountHeadDescription;
          }
        });
        this.updateDivisionalBudgetHead();
        const divisionalBudgetHeadValue = `${this.divisionValue}-${this.financialYear}-${this.accHeadValue}`;
        this.fetchDivisionalHeadData(divisionalBudgetHeadValue);
      } else {
        if (this.accountHeadDescription) {
          this.accountHeadDescription.nativeElement.innerText = 'N/A';
        }
        this.divisionalBudgetHead = [];
      }
    } else {
      if (this.accountHeadDescription) {
        this.accountHeadDescription.nativeElement.innerText = 'N/A';
      }
      this.divisionalBudgetHead = [];
    }
  }

  updateDivisionalBudgetHead() {
    this.divisionalBudgetHead = [];
    const filteredOptions = this.divisionOffice.filter((data: any) => {
      return (
        data.divisionCode === this.divisionValue && data.accountHeadCode === this.accHeadValue && data.financialYear === this.financialYear
      );
    });
    this.divisionalBudgetHead = filteredOptions.map((data: any) => data.divisionalBudgetHead);
  }

  async fetchDivisionalHeadData(divisionalBudgetHead: string): Promise<void> {
    try {
      const filters: any = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        divisionalBudgetHead: divisionalBudgetHead,
      };

      console.log('filters =>', filters);
      console.log('divisionalBudget =>', divisionalBudgetHead);

      const divisionalHeadDataResponse = await this.divisionalbudgetheadservice.getDivisionalBudgetHead(divisionalBudgetHead);

      if (divisionalHeadDataResponse && divisionalHeadDataResponse.length > 0) {
        this.divisionalBudgetHeadMatched = true;
        this.disableAddNewButton = true;
        this.snackBar.open('Divisional Budget Head with financial year already Created.', 'Ok', {
          duration: 4000,
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      } else {
        this.divisionalBudgetHeadMatched = false;
        this.disableAddNewButton = false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  addData(): void {
    if (!this.divisionValue || !this.accHeadValue || !this.financialYear || !this.budgetWorkType) {
      this.snackBar.open('Please select all the mandatory fields!', 'ok', {
        duration: 4000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }

    const divisionalBudgetHead = `${this.divisionValue}-${this.financialYear}-${this.accHeadValue}`;

    const accountHeadMasterData = this.accountData.find((v: any) => v.accountHeadCode === this.accHeadValue);

    const newData = {
      divisionalBudgetHead,
      divisionOfficeId: this.divisionValue,
      accHeadValue: this.accHeadValue,
      accountHeadMasterId: accountHeadMasterData ? accountHeadMasterData.accountHeadMasterId : 0,
      accountHeadDescription: this.selectedData ? this.selectedData.accountHeadDescription : 'N/A',
      financialYear: this.financialYear,
      budgetWorkType: this.budgetWorkType,
    };

    const exists = this.addedData.some(
      (data: any) => data.accountHeadMasterId === newData.accountHeadMasterId && data.financialYear === newData.financialYear,
    );

    if (exists) {
      this.snackBar.open('Data already exists!', 'ok', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    } else {
      this.addedData.push(newData);
      this.accHeadValue = '';
      this.financialYear = '';
      this.divisionalBudgetHead = [];
      this.budgetWorkType = '';
      this.accountHeadDescription.nativeElement.innerText = '';
      this.divisionValue = '';
    }
  }

  onBudgetWorkTypeChange(event: any) {
    this.budgetWorkType = event;
  }

  async submitDivisionalBudgetData() {
    if (!this.addedData.length) {
      this.snackBar.open('No data to save!', 'ok', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }

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

    const params: any[] = this.addedData
      .filter((v) => v.budgetWorkType !== null && v.budgetWorkType !== undefined && v.budgetWorkType !== '')
      .map((v) => ({
        divisionalBudgetHead: v.divisionalBudgetHead,
        divisionOfficeId: v.divisionOfficeId,
        accountHeadMasterId: v.accountHeadMasterId,
        financialYear: v.financialYear,
        budgetWorkType: v.budgetWorkType,
      }));

    if (params.length === 0) {
      this.snackBar.open('No valid data to save!', 'ok', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }

    try {
      const response = await this.divisionalbudgetheadservice.SaveDivsionalBudgetData(filters, params);
      console.log(response);
      const snackBarRef = this.snackBar.open('Data saved successfully!', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      document.body.style.pointerEvents = 'none';
      snackBarRef.onAction().subscribe(() => {
        this.addedData = [];
        snackBarRef.dismiss();
        document.body.style.pointerEvents = 'auto';
      });
    } catch (error) {
      this.snackBar.open('Error occurred while saving data!', 'OK', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      console.error(error);
    }
  }

  openConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '300px',
      disableClose: true,
      data: {
        title: 'Confirm Save',
        message: 'Are you sure you want to save the data?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.submitDivisionalBudgetData();
      } else if (result === 'no') {
      }
    });
  }

  deleteData(index: number): void {
    this.addedData.splice(index, 1);
  }
}
