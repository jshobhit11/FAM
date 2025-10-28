import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DivisionalBudgetHeadService } from 'src/app/services/divisional-budget-head.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { BudgetEntryService } from 'src/app/services/budget-entry.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { EstimateService } from 'src/app/services/estimate.service';

@Component({
  selector: 'app-budget-froms',
  templateUrl: './budget-froms.component.html',
  styleUrls: ['./budget-froms.component.scss'],
})
export class BudgetFromsComponent implements OnInit, AfterViewInit {
  @ViewChild('divisionSelectRef') divisionSelectRef: MatSelect;
  @ViewChild('accountHeadSelectRef') accountHeadSelectRef: MatSelect;
  @ViewChild('dateInputRef') dateInputRef: MatDatepickerInput<Date>;
  budgetData: any = {};
  budgetYear: string = 'currentYear';
  budgetFinancialYears: string[] = [];
  budgetFinancialYear: string;
  divisionOffice: any;
  divisionOptions: any[] = [];
  accountData: any;
  accountHeadoptions: any[] = [];
  accountHeadDescriptions: any[] = [];
  selectedData: any;
  tableData: any[] = [];
  divisionalAccHeadDetails: any[] = [];
  divisionalHeadData: any;
  selectedTransactionType: string;
  selectedDivisionCode: string;
  selectedAccountHead: string;
  divisionalBudgetHead: string;
  divisionalAccountHeadNo: string;
  divisionalBudgetHeadSuffix: string = '';
  divisionalAccHeadDetailsTableData: any[];
  newTotalBudgetAmount: number;
  private recordCount: number = 0;
  presentTotalBudgetAmount: number;
  addAmountRecordsAdded: boolean = false;
  reduceAmountRecordsAdded: boolean = false;
  initialDivisionalDetails: any[] = [];
  initialDivisionalDetailsCaptured = false;
  accountHeadDetailsData: any[] = [];
  plusButtonClicked: boolean = false;
  divisionalBudgetDetailsId: string;
  snackbarOpen: boolean = false;
  private selectedBudgetYear: string = 'currentYear';
  currentDivision: string;
  currentFinacialYear: any;
  currentAccountNo: string;

  constructor(
    private budgetservices: DivisionalBudgetHeadService,
    private estimateService: EstimateService,
    private snackBar: MatSnackBar,
    private budgetentryservice: BudgetEntryService,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {    
    this.onBudgetYearChange();
    try {
      const filters: any = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
      };
      this.divisionOffice = await this.budgetservices.getDivisionOfficeId(filters);
      console.log('division office', this.divisionOffice);
      this.divisionOptions = this.divisionOffice.map((v: any) => ({
        officeMasterId: v.officeMasterId,
        divisionCode: v.officeCode,
        divisionName: v.officeName,
      }));

      this.accountData = await this.budgetservices.getDivisionAccountHeadData(filters);
     // this.accountHeadoptions = Array.from(new Set(this.accountData.map((data: any) => data.accountHeadCode)));
     this.accountHeadoptions = Array.from(new Set(this.accountData.map((data: any) => data.accountHeadCode)))
     .sort((a, b) => {
       return (typeof a == 'number' && typeof b == 'number') ? a - b : String(a).localeCompare(String(b));
     });
      this.accountHeadDescriptions = Array.from(new Set(this.accountData.map((data: any) => data.accountHeadDescription)));
      //this.budgetFinancialYear = new Date().getFullYear().toString();
      //this.onBudgetYearChange();
      this.currentFinacialYear = this.budgetFinancialYear;
      this.budgetYear = 'currentYear';
      //this.budgetFinancialYears = this.calculateBudgetFinancialYears();
      //this.budgetFinancialYear = this.budgetFinancialYears[0];
    } catch (err) {
      console.log(err);
    }
  }

  ngAfterViewInit() {
    this.updateRadioButtonsState();
  }

  calculateBudgetFinancialYears(): string[] {
    const currentYear = new Date().getFullYear();
    const lastyear=currentYear-1;
    const nextYear = currentYear + 1;
    const spillOverYear = `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    return [`${lastyear}-${currentYear.toString().slice(-2)}`, spillOverYear];
  }

  updateRadioButtonsState() {
    if (this.divisionalHeadData) {
      const disableReduceRadio = this.divisionalHeadData.totalBudgetAmount === 0;
      if (disableReduceRadio) {
        this.selectedTransactionType = 'addAmount';
      }
      const reduceRadio = document.getElementById('reduceAmount') as HTMLInputElement;
      if (reduceRadio) {
        reduceRadio.disabled = disableReduceRadio;
      }
    }
  }

  updateBudgetFinancialYear(): void {
    if (this.budgetYear) {
      if (this.budgetYear === 'currentYear') {
        const currentYear = new Date().getFullYear();
        this.budgetFinancialYear = `${currentYear}-${currentYear + (1 % 100)}`;
      } else if (this.budgetYear === 'spillOver') {
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        this.budgetFinancialYear = `${previousYear}-${currentYear % 100}`;
      } else {
        this.budgetFinancialYear = null;
      }
    }
  }

  onBudgetYearChange(): void {
    if (this.budgetYear === 'currentYear') {
      this.selectedBudgetYear = 'currentYear';
      const currentYear1 = new Date().getFullYear();
      const currentYear= currentYear1-1
      const nextYear = currentYear + 1;
      const currentYearSuffix = nextYear.toString().slice(-2);
      this.budgetFinancialYears = [`${currentYear}-${currentYearSuffix}`];
      this.budgetFinancialYear = `${currentYear}-${currentYearSuffix}`;
      this.divisionalBudgetHeadSuffix = 'C';
    } else if (this.budgetYear === 'spillOver') {
      this.selectedBudgetYear = 'spillOver';
      const currentYear1 = new Date().getFullYear();
      const currentYear= currentYear1-1
      const previousYear = currentYear - 1;
      const currentYearSuffix = currentYear.toString().slice(-2);
      //const previousYearSuffix = previousYear.toString().slice(-2);
      this.budgetFinancialYears = [`${previousYear}-${currentYearSuffix}`];
      this.budgetFinancialYear = `${previousYear}-${currentYearSuffix}`;
      this.divisionalBudgetHeadSuffix = 'S';
    } else {
      this.budgetFinancialYear = '';
      this.divisionalBudgetHeadSuffix = '';
    }
  }

  updateDivisionalBudgetHeadSuffix(): void {
    if (this.budgetYear === 'currentYear') {
      this.divisionalBudgetHeadSuffix = 'C';
    } else if (this.budgetYear === 'spillOver') {
      this.divisionalBudgetHeadSuffix = 'S';
    } else {
      this.divisionalBudgetHeadSuffix = '';
    }
  }

  onDivisionChange(event: any) {
    this.currentDivision = event.target.value;
  }

  onBudgetFinacialYear(event: any): void {
    this.currentFinacialYear = event;
  }

  async onAccountHeadSelectChange(accountHead: string, currentFinacialYear: any) {
    console.log("accountHead ----------------",accountHead);
    this.currentAccountNo = accountHead;
    this.selectedAccountHead = accountHead;
    this.selectedData = this.accountData.find((data: any) => data.accountHeadCode === accountHead);
    const accountHeadMasterId = this.selectedData.accountHeadMasterId;
    this.currentFinacialYear = currentFinacialYear;
    const [startYear, endYear] = this.currentFinacialYear.split('-');
    const formattedFinancialYear = `${startYear}-${endYear.slice(-2)}`;
    this.divisionalBudgetHead = `${this.currentDivision},${formattedFinancialYear},${this.divisionalAccountHeadNo}`;

    if (this.selectedData) {
      try {
        await this.fetchDivisionalHeadData(this.currentDivision, formattedFinancialYear, accountHeadMasterId);
      } catch (error) {
        console.error('Error fetching divisional head data:', error);
        this.snackBar.open('Selected divisional budget head is not available. Create a new divisional budget head.', 'Ok', {
          duration: 3000,
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    } else {
      this.divisionalHeadData = null;
    }
  }

  async fetchDivisionalHeadData(currentDivision: string, formattedFinancialYear: string, accountHeadMasterId: string): Promise<void> {
    try {
      const filters: any = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        divisionalOfficeId: currentDivision,
        accountHeadMasterId: accountHeadMasterId,
        financialYear: formattedFinancialYear,
      };
      console.log('filter', filters);
      const divisionalHeadDataResponse = await this.estimateService.getDataByDivisionOfficeIdAccountHeadMasterIdFY(filters);
      if (divisionalHeadDataResponse && divisionalHeadDataResponse.length > 0) {
        const divisionalHeadData = divisionalHeadDataResponse[0];
        this.presentTotalBudgetAmount = divisionalHeadData.totalBudgetAmount;
        this.divisionalHeadData = {
          divisionalBudgetId: divisionalHeadData.divisionalBudgetId,
          divisionalBudgetHead: divisionalHeadData.divisionalBudgetHead,
          totalBudgetAmount: divisionalHeadData.totalBudgetAmount || 0,
          workOrderAmount: divisionalHeadData.workOrderIssueAmount || 0,
          balanceAmount: (divisionalHeadData.totalBudgetAmount || 0) - (divisionalHeadData.workOrderIssueAmount || 0),
          budgetWorkType: divisionalHeadData.budgetWorkType,
          TotalReducedAmount: divisionalHeadData.totalReduceAmount || 0,
          ExpenditureAmount: divisionalHeadData.totalExpenditureAmount || 0,
          TotalAddedAmount: divisionalHeadData.TotalAddedAmount || 0,
        };

        this.selectedData.divisionalBudgetId = divisionalHeadData.divisionalBudgetId;

        if (divisionalHeadData.divisionalBudgetId !== null) {
          // Only assign divisional budget ID if it's not null
          const fetchedDivisionalBudgetId = divisionalHeadData.divisionalBudgetId;
          this.tableData.forEach((entry) => {
            entry.divisionalBudgetDetailsId = fetchedDivisionalBudgetId;
          });
        } else {
          this.snackBar.open('Divisional Budget Head is not available. Create a new divisional budget head.', 'Ok', {
            duration: 3000,
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
        }
      } else {
        this.snackBar.open('Divisional Budget Head is not available. Create a new divisional budget head.', 'Ok', {
          duration: 3000,
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  getDivisionalBudgetHead(): string {
    return this.divisionalBudgetHead;
  }


  generateRequestNumber(): string {    
    if (this.plusButtonClicked) {
      this.recordCount++;
      this.plusButtonClicked = false;
    }
    const division = this.divisionOffice.find((data: any) => data.officeMasterId === parseInt(this.selectedDivisionCode));
    const officeCode =  division.officeCode ;

    const accountHeadCode = this.selectedData.accountHeadCode;

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString().substr(-2);

    const paddedRecordCount = this.recordCount.toString().padStart(3, '0');

    const requestNumber = `${officeCode}-${accountHeadCode}-${day}${month}${year}-${paddedRecordCount}`;

    return requestNumber;
  }

  addData(index: number, amount: string, date: string, omNo: string, remarks: string): void {
    if (!amount || !omNo || !remarks||!date) {
      this.snackBar.open('Please fill in all mandatory fields:Amount, Date., OM No., and Remarks.', 'Ok', {
        duration:5000,
        verticalPosition:"top"
      });
      return;
    }
    this.plusButtonClicked = true;    
    const requestNumber = this.generateRequestNumber();
    const newData = {
      requestNo: requestNumber,
      amount: parseFloat(amount),
      date,
      omNo,
      remarks,
      divisionalBudgetHead: this.getDivisionalBudgetHead(),
      divisionalBudgetDetailsId: this.divisionalHeadData.divisionalBudgetId,
    };
    if (index !== null && index >= 0 && index < this.tableData.length) {
      this.tableData[index] = newData;
    } else {
      this.tableData.push(newData);
    }
    this.accountHeadDetailsData.push(newData);
    const existingDivisionDataIndex = this.divisionalAccHeadDetails.findIndex(
      (data) => data.divisionalBudgetHead === this.getDivisionalBudgetHead(),
    );
    if (existingDivisionDataIndex !== -1) {
      this.divisionalAccHeadDetails[existingDivisionDataIndex].newTotalBudgetAmount += newData.amount;
    } else {
      const divisionalData = {
        divisionalBudgetHead: this.getDivisionalBudgetHead(),
        presentTotalBudgetAmount: this.divisionalHeadData.totalBudgetAmount,
        newTotalBudgetAmount: this.divisionalHeadData.totalBudgetAmount + newData.amount,
        divisionalAccHeadDetailsTableData: [],
      };
      this.divisionalAccHeadDetails.push(divisionalData);
    }
    this.updateRadioButtonsState();
    this.cdRef.detectChanges();
  }

  handleAddAmount(newData: any): void {
    const existingData = this.divisionalAccHeadDetails.find((data) => data.divisionalBudgetHead === newData.divisionalBudgetHead);
    if (existingData) {
      existingData.newTotalBudgetAmount += newData.amount;
    } else {
      const divisionalData = {
        divisionalBudgetHead: newData.divisionalBudgetHead,
        presentTotalBudgetAmount: this.divisionalHeadData.totalBudgetAmount,
        newTotalBudgetAmount: this.divisionalHeadData.totalBudgetAmount + newData.amount,
        divisionalAccHeadDetailsTableData: [],
      };
      this.divisionalAccHeadDetails.push(divisionalData);
    }
  }

  handleReduceAmount(newData: any): void {
    const existingDataIndex = this.divisionalAccHeadDetails.findIndex((data) => data.divisionalBudgetHead === newData.divisionalBudgetHead);
    if (existingDataIndex !== -1) {
      const existingData = this.divisionalAccHeadDetails[existingDataIndex];
      const reducedAmount = Math.min(existingData.newTotalBudgetAmount, newData.amount);
      existingData.newTotalBudgetAmount -= reducedAmount;
      this.divisionalHeadData.totalBudgetAmount -= reducedAmount;
      this.divisionalHeadData.balanceAmount += reducedAmount;
    } else {
      const divisionalData = {
        divisionalBudgetHead: newData.divisionalBudgetHead,
        presentTotalBudgetAmount: this.divisionalHeadData.totalBudgetAmount,
        newTotalBudgetAmount: this.divisionalHeadData.totalBudgetAmount - newData.amount,
        divisionalAccHeadDetailsTableData: [],
      };
      this.divisionalAccHeadDetails.push(divisionalData);
      this.divisionalHeadData.totalBudgetAmount -= newData.amount;
      this.divisionalHeadData.balanceAmount += newData.amount;
    }
  }

  async saveData(formData: any) {
    console.log(formData);
    const filterParams = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    };
    const hasMissingIds = this.tableData.some(
      (entry) => entry.divisionalBudgetDetailsId === undefined || entry.divisionalBudgetDetailsId === null,
    );

    if (hasMissingIds) {
      this.snackBar.open('Please fetch divisional budget details before saving.', 'Ok', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: ['error-snackbar'],
      });
      return;
    }
    try {
      const payload = this.tableData.map((entry) => {
        const transactionType = this.selectedTransactionType.replace('Amount', '').toUpperCase();
        return {
          divisionalBudgetDetailsId: entry.divisionalBudgetDetailsId,
          transactionType: transactionType,
          budgetYearType: this.budgetYear === 'currentYear' ? 'current_year' : 'spillover',
          referenceNo: entry.requestNo,
          amount: entry.amount,
          allocatedBudgetDate: this.formatDate(entry.date),
          remarks: entry.remarks,
          omNumber: entry.omNo,
        };
      });
      const response = await this.budgetentryservice.SaveBudgetEntry(filterParams, payload);
      console.log('Save Response', response);
      document.body.style.pointerEvents = 'none';
      if (response && response.length) {
        this.snackBar
          .open('Data saved successfully!', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => {
            document.body.style.pointerEvents = 'auto';
            window.location.reload();
          });
      }
    } catch (error) {
      console.error('Save error:', error);
      this.snackBar.open('Error saving data. Please try again.', 'Ok', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  deleteRow(index: number): void {
    const deletedData = this.tableData.splice(index, 1)[0];

    if (this.selectedTransactionType === 'reduceAmount') {
      this.handleReduceAmount(deletedData);
    }
    const divisionalDataIndex = this.divisionalAccHeadDetails.findIndex(
      (data) => data.divisionalBudgetHead === deletedData.divisionalBudgetHead,
    );

    if (divisionalDataIndex !== -1) {
      const divisionalData = this.divisionalAccHeadDetails[divisionalDataIndex];
      divisionalData.newTotalBudgetAmount -= deletedData.amount;
      if (divisionalData.newTotalBudgetAmount <= 0) {
        this.divisionalAccHeadDetails.splice(divisionalDataIndex, 1);
      }
    }
    this.cdRef.detectChanges();
  }

  limitInputToTenDigits(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (inputValue.length > 20) {
      inputElement.value = inputValue.slice(0, 20);
    }
  }

  updateDivisionalHeadData(): void {
    if (this.divisionalHeadData) {
      this.divisionalHeadData.balanceAmount = this.divisionalHeadData.totalBudgetAmount - this.divisionalHeadData.workOrderAmount;
    }
  }

  validateDateInput(event: Event): boolean {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!inputValue.match(datePattern)) {
      inputElement.value = '';
    }
    return false;
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
        this.saveData(Event);
      } else if (result === 'no') {
      }
    });
  }
}
