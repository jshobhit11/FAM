import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { LoaderService } from 'src/app/services/loader.service';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
@Component({
  selector: 'app-account-id-mapping-sc',
  templateUrl: './account-id-mapping-sc.component.html',
  styleUrls: ['./account-id-mapping-sc.component.scss'],
})
export class AccountIdMappingScComponent implements OnInit {
  type: any = 'list';
  workDescription: string = '';
  wmWorkorderRegisteredId: string = '';
  SaveData: {} = {};
  data: any;
  accountMappingData: any[] = [];
  validateMeterData: any[] = [];
  meterReplicated: boolean = false;
  validateMeterDisplayed: boolean = false;
  private fieldActivityId: string | null = null;
  serviceRegistrationsId: any;
  isSaving: boolean = false;
  saveDisabled: boolean = false;
  isFaReceived: any;
  applicationTypeCode: any;
  @ViewChildren('readingRef') readingRefs!: QueryList<ElementRef>;
  meterData: boolean = false; 
  errorMessage: string = '';
  isRequestInProgress = false;
  selectedDate: string | null = null;
  registeredOn: string = ''; 
  dateError: string | null = null;
  minDate: string = '';
  maxDate: string = '';
  isButtonDisabled:boolean = false;
  submitError:string ='';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private workService: WorkOrderService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader:LoaderService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.loadData();
  }
  async loadData() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.loader.show('Data Loading...');
      const workorderRegisteredId = params['workOrderRegisteredId'];
      this.type = params['type'];
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        workorderRegisteredId,
      };
      this.data = await this.dashboardService.accountMeterMapping(filter);
      this.isFaReceived = this.data[0].isFaReceived;
      this.applicationTypeCode = this.data[0].applicationTypeCode;
      this.wmWorkorderRegisteredId = this.data[0]?.wmWorkorderRegisteredId;
      this.registeredOn =this.data[0]?.registeredOn;
      if (this.registeredOn) {
        this.minDate = this.registeredOn;
    }
    
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        wmWorkorderRegisteredId: this.wmWorkorderRegisteredId,
      };
      this.accountMappingData = await this.dashboardService.getAccountSingleMeterData(
        filters
      );
      this.accountMappingData = [this.accountMappingData];
      this.serviceRegistrationsId = this.data[0]?.serviceRegistrationsId;
      const filtersAccount: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        serviceRegistrationsId: this.serviceRegistrationsId,
      };
      this.validateMeterData = await this.dashboardService.getMeterData(
        filtersAccount
      );
      this.saveDisabled = this.validateMeterData.length === 0;
      this.loader.hide();
    });
  }
  async meterReplicatorAndMeterValidatorInCcb() {
    if (this.isRequestInProgress) {
      return;  
    }
    this.loader.show('Request In Progress...')
    this.isRequestInProgress = true; 
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      wmWorkorderRegisteredId: this.wmWorkorderRegisteredId,
      isMeterReplicator: 0,
    };
  
    try {
      const response = await this.dashboardService.meterReplicatorAndMeterValidatorInCcb(filter);
      console.log(response);
  
      if (response.status === 'SUCCESS') {
        this.errorMessage = '';
        await this.loadData();
      } else if (response.status === 'FAILURE') {
        this.meterData = false;
        this.errorMessage = response.message;
      }
    } catch (error) {
      console.error('Error during the request:', error);
    } finally {
      this.loader.hide();
      this.isRequestInProgress = false;  
    }
  }

  validateDate(date: string) {
    this.selectedDate = date;
    this.dateError = null;
  
    if (!this.selectedDate) {
      this.dateError = 'Please select a reading date.';
      return;
    }
  
    const selectedDateObj = this.convertToIST(new Date(this.selectedDate));
    const registeredOnObj = this.convertToIST(new Date(this.registeredOn));
  
    const today = this.convertToIST(new Date());
    const maxPastDate = new Date(today);
    maxPastDate.setDate(today.getDate() - 365);
  
    if (selectedDateObj > today) {
      this.dateError = 'Reading date cannot be in the future.';
      return;
    }
  
    if (selectedDateObj < registeredOnObj) {
      this.dateError = `Reading date cannot be before the Registered On date (${this.formatDate(this.registeredOn)}).`;
      return;
    }
  
    if (selectedDateObj < maxPastDate) {
      this.dateError = `Reading date cannot be older than 365 days from system date.`;
      // (${this.formatDate(maxPastDate.toISOString())})
      return;
    }
  }
  
  addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  convertToIST(date: Date): Date {
    const istOffset = 5 * 60 + 30; 
    const localDate = new Date(date.getTime() + istOffset * 60000);
    return localDate;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  }
  
  
  submitForm() {
    const isValid = this.validateInputs();
    this.validateDate(this.selectedDate);
    if (this.dateError) {
      return;
    }
    if (isValid) {
      this.openConfirmationpopupDialog();
    }
  }
  openConfirmationpopupDialog() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.saveData();
      }
    });
  }
  formatDateToISO(date: string): string {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); 
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  async saveData() {
    if (this.isButtonDisabled) {
      return;
    }
    this.loader.show('Data Submitting...')
    this.submitError='';
    this.isButtonDisabled = true;
    this.saveDisabled = true;
  
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const wmWorkorderRegisteredId = this.data[0]?.wmWorkorderRegisteredId;
    const wmMeterRegistersLogDTO: any[] = [];

    this.validateMeterData.forEach((item) => {
      const wmMeterRegistersLogItem = {
        accountId: item.accountId,
        activeStatus: item.activeStatus,
        badgeNumber: this.accountMappingData[0].badgeNumber,
        discom: this.data[0]?.discom,
        insertedBy: item.insertedBy,
        insertedDate: item.insertedDate,
        meterFlag: item.meterFlag,
        modifiedBy: item.modifiedBy,
        modifiedDate: item.modifiedDate,
        registerId: item.registerId,
        registerReadSeqNo: item.registerReadSeqNo,
        registerReadType: item.registerReadType,
        registerReading: item.registerReading,
        registerTou: item.registerTou,
        registerUom: item.registerUom,
        serviceRegistrationsId: item.serviceRegistrationsId,
        serviceRequestNo: item.serviceRequestNo,
        sessionIpAddress: item.sessionIpAddress,
        uniqueCondition: item.uniqueCondition,
        wmMeterRegistersId: item.wmMeterRegistersId,
      };
      wmMeterRegistersLogDTO.push(wmMeterRegistersLogItem);
    });
    const formattedSelectedDate = this.formatDateToISO(this.selectedDate);
    const wmAccountMeterMappingDTO = {
      serviceRegistrationsId: this.data[0]?.serviceRegistrationsId,
      accountId: this.accountMappingData[0]?.accountId,
      badgeNumber: this.accountMappingData[0]?.badgeNumber,
      meterSerialNo: this.accountMappingData[0]?.serialNo,
      readingDate:formattedSelectedDate,
      discom: this.data[0]?.discom,
    };

    const SaveData = { wmAccountMeterMappingDTO, wmMeterRegistersLogDTO };
    const SaveFilters = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      wmWorkorderRegisteredId,
    };
    this.loader.hide();
    try {
      const response = await this.workService.saveAccountMeterSingle(
        SaveFilters,
        SaveData
      );
      if (response.messageType === 'SUCCESS') {
        const snackbarRef = this.snackBar.open('Account Meter Mapping done successfully!', 'Ok', {
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        snackbarRef.onAction().subscribe(() => {
          this.submitError='';
          this.saveDisabled = false; 
          this.isButtonDisabled = false;
          this.navigate('ACCOUNT ID AND METERS MAPPING', 17);
        });
      } else if (response.messageType === 'FAILURE') {
        if (response.messageText.includes('Duplicate')) {
          setTimeout(() => {
            this.navigate('ACCOUNT ID AND METERS MAPPING', 17);
          }, 0);
        } else {
          this.submitError = response.messageText;
          this.saveDisabled = false; 
          this.isButtonDisabled = false;
        }
      }      
    } catch (error) {
      console.error('Error saving data:', error);
      this.snackBar.open('An error occurred while saving data.', 'Ok', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.saveDisabled = false; 
      this.isButtonDisabled = false;
    }
  }
  validateInputs() {
    let isValid = true;
    this.validateMeterData.forEach((item) => {
      item.error = false;
      item.touched = false;
    });
    const missingReadings = this.validateMeterData.filter(
      (item) => item.registerReading == null || item.registerReading === ''
    );
    if (missingReadings.length > 0) {
      isValid = false;
      missingReadings.forEach((item) => {
        item.error = true;
        item.touched = true;
      });

      // Focus on the first missing reading input, if it exists
      const firstMissingReadingIndex = this.validateMeterData.findIndex(
        item => item.registerReading == null || item.registerReading === ''
      );
      if (firstMissingReadingIndex !== -1 && this.readingRefs.length > firstMissingReadingIndex) {
        const firstMissingReadingInput = this.readingRefs.toArray()[firstMissingReadingIndex];
        firstMissingReadingInput?.nativeElement?.focus();
      }
    }

    return isValid;
  }
  dateFormatValidator(control: FormControl) {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (control.value && !datePattern.test(control.value)) {
      return { invalidDateFormat: true };
    }
    return null;
  }

  preventTyping(event: KeyboardEvent) {
    event.preventDefault();
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Control',
      'Meta',
      'Shift',
    ];
    if (allowedKeys.includes(event.key)) return;

    const inputElement = event.target as HTMLInputElement;
    const isDotPressed = event.key === '.';
    if (isDotPressed && inputElement.value.includes('.')) {
      event.preventDefault();
    }

    if (!/^[0-9.]$/.test(event.key)) {
      event.preventDefault();
    }
  }
  restrictInput(event: Event, item: any): void {
    const inputElement = event.target as HTMLInputElement;
    let validValue = inputElement.value.replace(/[^0-9.]/g, ''); 
  
    const parts = validValue.split('.');
    if (parts.length > 1) {
      parts[1] = parts[1]; 
      validValue = parts[0] + '.' + parts[1];
    }
    if (parts[0].length > 9) {
      validValue = parts[0].slice(0, 9) + (parts[1] ? '.' + parts[1] : '');  
    }
  
    inputElement.value = validValue;
    item.registerReading = validValue; 
  }
  
  validatePFValue(item: any): void {
    if (item.registerUom === 'PF') {
      const numericValue = parseFloat(item.registerReading);
      if (!item.registerReading.startsWith('0.') && numericValue <= 0) {
        this.openSnackBar(
          "Value must be greater than 0 for unit of measure 'PF'.",
          'Ok'
        );
        item.registerReading = ''; // Clear invalid input
      }
    }
  }
  

    
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    });
  }
  navigate(label: any, code: any) {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        type:'list',
        label:'ACCOUNT ID AND METERS MAPPING',
        statusCode:17,
        processTypeName: 'WORKORDER',
      },
    });
  }
}
