import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-meter-change-details-sc',
  templateUrl: './meter-change-details-sc.component.html',
  styleUrls: ['./meter-change-details-sc.component.scss'],
})
export class MeterChangeDetailsScComponent implements OnInit {
  data: any;
  type: any;
  oldAccountMappingData: any[] = [];
  newAccountMappingData: any[] = [];
  oldMeterData: any[] = [];
  newMeterData: any[] = [];
  meterData: any[] = [];
  isFaReceived: any;
  isButtonDisabled:boolean = false;
  submitError:string ='';
  private oldAccountIds = new Set<0>();
  private newAccountIds = new Set<0>();
  applicationTypeCode: any;
  isSubmitting: boolean = false;
  isRequestInProgress = false;
  wmWorkorderRegisteredId: string = '';
  errorMessage: string = '';
  registeredOn: string = ''; 
  dateError: string | null = null;
  minDate: string = '';
  maxDate: string = '';
  selectedDate: string | null = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private workService: WorkOrderService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private loader :LoaderService
  ) {}

  ngOnInit() {
   this.loadData();
  }
  async loadData(){
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.loader.show('Data Loading...')
      const workorderRegisteredId = params['workOrderRegisteredId'];
      this.wmWorkorderRegisteredId =workorderRegisteredId
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
      this.registeredOn =this.data[0]?.registeredOn;
      if (this.registeredOn) {
        this.minDate = this.registeredOn;
    }
    
      const serviceRegistrationsId = this.data[0].serviceRegistrationsId;
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        serviceRegistrationsId,
      };

      this.oldMeterData = await this.dashboardService.getOldMeterRegistersByServiceRegistrationsId(filters);
      this.newMeterData = await this.dashboardService.getNewMeterRegistersByServiceRegistrationsId(filters);
      this.oldAccountMappingData = this.oldMeterData.length ? [this.oldMeterData[0]] : [];
      this.newAccountMappingData = this.newMeterData.length ? [this.newMeterData[0]] : [];
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
  
    // if (selectedDateObj < registeredOnObj) {
    //   this.dateError = `Reading date cannot be before the Registered On date (${this.formatDate(this.registeredOn)}).`;
    //   return;
    // }
  
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
  validateInputs() {
    let isValid = true;
    const oldMeterErrors = this.oldMeterData.filter(
      item => item.registerReading == null || item.registerReading === ''
    );
    if (oldMeterErrors.length > 0) {
      this.snackBar.open('Please provide valid readings for all old meters.', 'Ok', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      isValid = false;
      oldMeterErrors.forEach(item => {
        item.error = true; 
      });
    } else {
      this.oldMeterData.forEach(item => (item.error = false)); 
    }
  
    const newMeterErrors = this.newMeterData.filter(
      item => item.registerReading == null || item.registerReading === ''
    );
    if (newMeterErrors.length > 0) {
      this.snackBar.open('Please provide valid readings for all new meters.', 'Ok', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      isValid = false;
      newMeterErrors.forEach(item => {
        item.error = true; 
      });
    } else {
      this.newMeterData.forEach(item => (item.error = false)); 
    }
  
    return isValid;
  }
  
  preventTyping(event: KeyboardEvent) {
    event.preventDefault();
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Control', 'Meta', 'Shift'];
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
        item.registerReading = '';
      }
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: cordova !== undefined ? 'bottom' : 'top'
    });
  }
  async saveData() {
    if (this.isButtonDisabled) {
      return;
    }
    this.loader.show('Data Submitting...')
    this.submitError='';
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const wmWorkorderRegisteredId = this.data[0]?.wmWorkorderRegisteredId;

    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      wmWorkorderRegisteredId,
    };

    const oldWmMeterRegistersLogDTO = this.oldMeterData.map((item) => ({
      wmMeterRegistersId: item.wmMeterRegistersId,
      discom: item.discom,
      serviceRegistrationsId: item.serviceRegistrationsId,
      serviceRequestNo: item.serviceRequestNo,
      accountId: item.accountId,
      badgeNumber: item.badgeNumber,
      registerId: item.registerId,
      registerReadSeqNo: item.registerReadSeqNo,
      registerUom: item.registerUom,
      registerTou: item.registerTou,
      registerReadType: item.registerReadType,
      registerReading: parseFloat(item.registerReading).toFixed(1),
      insertedBy: item.insertedBy,
      insertedDate: item.insertedDate,
      modifiedBy: item.modifiedBy,
      modifiedDate: item.modifiedDate,
      sessionIpAddress: item.sessionIpAddress,
      activeStatus: item.activeStatus,
      uniqueCondition: item.uniqueCondition,
      meterFlag: 'O',
    }));

    const newWmMeterRegistersLogDTO = this.newMeterData.map((item) => ({
      wmMeterRegistersId: item.wmMeterRegistersId,
      discom: item.discom,
      serviceRegistrationsId: item.serviceRegistrationsId,
      serviceRequestNo: item.serviceRequestNo,
      accountId: item.accountId,
      badgeNumber: item.badgeNumber,
      registerId: item.registerId,
      registerReadSeqNo: item.registerReadSeqNo,
      registerUom: item.registerUom,
      registerTou: item.registerTou,
      registerReadType: item.registerReadType,
      registerReading: parseFloat(item.registerReading).toFixed(1),
      insertedBy: item.insertedBy,
      insertedDate: item.insertedDate,
      modifiedBy: item.modifiedBy,
      modifiedDate: item.modifiedDate,
      sessionIpAddress: item.sessionIpAddress,
      activeStatus: item.activeStatus,
      uniqueCondition: item.uniqueCondition,
      meterFlag: 'N',
    }));

    const accountMapping = this.newAccountMappingData[0];
    const isValid = this.validateInputs();

    if (!isValid) {
      return; 
    }
    const formattedSelectedDate = this.formatDateToISO(this.selectedDate);
    const data = {
      wmAccountMeterMappingDTO: {
        serviceRegistrationsId: this.data[0].serviceRegistrationsId,
        accountId: accountMapping.accountId,
        badgeNumber: accountMapping.badgeNumber,
        discom: parseInt(this.data[0].discom),
        readingDate: formattedSelectedDate,
      },
      oldWmMeterRegistersLogDTO,
      newWmMeterRegistersLogDTO,
    };
    try {
      const response = await this.workService.meterReplacementSaveData(filter, data);
      this.loader.hide();
      if (response.messageType === 'SUCCESS') {
        const snackbarRef = this.snackBar.open('Meter Replacement done successfully!', 'Ok', {
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        snackbarRef.onAction().subscribe(() => {
          this.submitError='';
          this.isButtonDisabled = false;
          this.navigate('METER REPLACEMENT', '23');
        });
      } else if (response.messageType === 'FAILURE'){
        this.submitError = response.messageText;
        this.isButtonDisabled = false;
      }
    } catch (error) {
      console.error('Error saving data:', error);
      this.snackBar.open('An error occurred while saving data.', 'Ok', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.isButtonDisabled = false;
    }
  }
  navigate(label: any, code: any) {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        type:'list',
        label:'METER REPLACEMENT',
        statusCode:23,
        processTypeName: 'WORKORDER',
      },
    });
  }
}
