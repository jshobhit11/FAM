import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
const meterChangeDetailsReport = new FormGroup({
  file: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-meter-change-details',
  templateUrl: './meter-change-details.component.html',
  styleUrls: ['./meter-change-details.component.scss'],
})
export class MeterChangeDetailsComponent implements OnInit {
  fileContent: any[][] = [];
  data: any[] = [];
  type: any;
  details: any;
  meterChangeDetailsReport: FormGroup = meterChangeDetailsReport;
  error: string;
  fileSizeError: boolean = false;
  wmWorkorderRegistrationId:string;
  showButton : Boolean = true;
  showTable : Boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private workService: WorkOrderService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const workorderRegisteredId = params['workOrderRegisteredId'];
      this.type = params['type'];
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, workorderRegisteredId };
      this.data = await this.dashboardService.accountMeterMapping(filter);
      this.wmWorkorderRegistrationId=this.data[0]?.wmWorkorderRegisteredId;
      console.log('wmWorkorderRegistered',this.wmWorkorderRegistrationId)
    });
   
    this.resetForm();
  }
  resetForm() {
    this.meterChangeDetailsReport = new FormGroup({
      file: new FormControl('', [Validators.required]),
      isChecked: new FormControl(false)
    });
  }
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const selectedFile = target.files[0];
    const fileSizeInMB = selectedFile.size / (1024 * 1024);
  
    if (fileSizeInMB >5) {
      this.fileSizeError = true;
      this.meterChangeDetailsReport.get('file').setErrors({ 'fileSize': true });
    } else {
      this.fileSizeError = false;
    }
  }

  downloadSampleFile() {
    const fileName = 'meter_change_upload_sheet.xlsx';
    const filePath = `./assets/${fileName}`;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  processFile() {
    const fileInput = document.getElementById('actual-btn') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      this.readFileContent(file);
    }
  }
  

  readFileContent(file: File) {
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
  
      const textColumns = [2, 3, 5, 8];  
      const options = {
        header: 1,
        raw: true, 
        range: 3, 
        cellDates: true 
      };
  
      const sheetData = XLSX.utils.sheet_to_json(worksheet, options) as any[][];
  
      this.fileContent = sheetData
        .map(row => {
          return row.map((cell, index) => {
            if (textColumns.includes(index) && typeof cell === 'number') {
              return cell.toString().padStart(10, '0');  
            }
            return cell;
          });
        })
        .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== '' && cell !== ' '));
  
      this.validateMeterDetails();
    };
    
    reader.readAsArrayBuffer(file);
  }
  
    
async validateMeterDetails() {
  const handleResponse = (submit: any) => {
    return submit;
  };
  const handleError = (error: any) => {
    let messageText;

    if (error?.statusCode === 403) {
      if (error?.error && typeof error.error === 'object') {
        messageText = error.error.messageText || 'Bad Request: Please check the uploaded data.';
      } else if (typeof error.error === 'string') {
        messageText = error.error;
      }
    } else if (error?.error) {
      messageText = error.error.messageText || 'An error occurred. Please try again.';
    }

    this.snackBar.open(messageText, 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    });
  };

  const apiKey = sessionStorage.getItem('api-key');
  const serviceKey = sessionStorage.getItem('service-key');
  const userRole = sessionStorage.getItem('user-role');
  const userName = sessionStorage.getItem('user-name');
  const userCode = sessionStorage.getItem('user-code');
  const serviceRegistrationsId = this.data[0]?.serviceRegistrationsId;
  const workorderNo = this.data[0]?.workorderNo;
  const filter: any = { apiKey, serviceKey, userRole, userName, userCode, serviceRegistrationsId, workorderNo };
  const data = this.fileContent
    .filter((v) => v[1] && v[2] && v[4] && v[8]) 
    .map((v) => ({
      workorderNo: v[1],
      accountId: v[2],
      meterReplacementDate: v[4],
      newBadgeNumber: v[8],
    }));

  if (data.length === 0) {
    this.snackBar.open('No valid records found in the sheet. Please check the data and try again.', 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    });
    return;
  } else {
    // this.snackBar.open(`${data.length} valid records found and processed.`, 'OK', {
    //   verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    // });
  }

  try {
    const submit = await this.dashboardService.validateMeterReplacementDetails(filter, data);

    const response = handleResponse(submit);
    if (response.messageType === 'SUCCESS') {
      this.showButton = false;
      this.showTable = true;
    } else {
      this.showButton = true;
      this.showTable = false;
      this.snackBar.open(response.messageText, 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  } catch (error) {
    handleError(error);
  }
}

  
  parseExcel(buffer: ArrayBuffer): string[][] {
    const wb: XLSX.WorkBook = XLSX.read(buffer as any, { type: 'array' });
    const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];
  }

  isError(): boolean {
    let a: any;
    this.fileContent.forEach((v) => {
      a = v.find((e) => e == true);
    });
    console.log(a);
    return a ? a : false;
  }
  async downloadFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const wmWorkorderRegisteredId = this.wmWorkorderRegistrationId;
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, wmWorkorderRegisteredId };
    try {
      const response= await this.dashboardService.accountMeterExcelData(filter);
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      if (blob.size === 0) {
        this.snackBar.open('No data found for the file.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return;
      }
      const fileName = 'Meter_Data.xlsx';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      this.snackBar.open('No data found for the file.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  }
  

  openConfirmationpopupDialog() {
    this.meterChangeDetailsReport.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.saveData();
      }
    });
  }
}

async saveData() {
  const apiKey = sessionStorage.getItem('api-key');
  const serviceKey = sessionStorage.getItem('service-key');
  const userRole = sessionStorage.getItem('user-role');
  const userName = sessionStorage.getItem('user-name');
  const userCode = sessionStorage.getItem('user-code');
  const isBulkMeterCompleted = this.meterChangeDetailsReport.value.isChecked ? 1 : 0;  // 1 if checked, 0 if unchecked
  const filter: any = { apiKey, serviceKey, userRole, userName, userCode, isBulkMeterCompleted };
  const data: any[] = [];

  const isValidDate = (day, month, year) => {
    const date = new Date(`${year}-${month}-${day}`);
    return date.getDate() === parseInt(day) &&
           date.getMonth() + 1 === parseInt(month) &&
           date.getFullYear() === parseInt(year);
  };
  for (const v of this.fileContent) {
    if (v[4] && typeof v[4] === 'string') {
      const dateParts = v[4].split('-');
      const monthMap = {
        'JAN': '01',
        'FEB': '02',
        'MAR': '03',
        'APR': '04',
        'MAY': '05',
        'JUN': '06',
        'JUL': '07',
        'AUG': '08',
        'SEP': '09',
        'OCT': '10',
        'NOV': '11',
        'DEC': '12'
  
      };
  
      const day = dateParts[0].padStart(2, '0');
      const month = monthMap[dateParts[1].toUpperCase()];
      const year = dateParts[2];
  
      if (!isValidDate(day, month, year)) {
        const snackBarRef = this.snackBar.open('Please select a valid meter replacement date', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        snackBarRef.onAction().subscribe(() => { 
          this.navigate('METER REPLACEMENT', '23');
        });
        return;
      }

      const formattedDate = `${year}-${month}-${day}`;
      const kwhInitialReading = parseFloat(v[9]).toFixed(1);
      data.push({  
        serviceRegistrationsId: this.data[0]?.serviceRegistrationsId,
        workorderNo: v[1],
        accountId: v[2],
        spId: v[3],
        meterReplacementDate: formattedDate,
        oldBadgeNumber: String(v[5]),
        oldMeterStatus: String(v[6]),
        finalKwhReading: v[7],
        newBadgeNumber: String(v[8]),
        kwhInitialReading: kwhInitialReading,
        mf: v[10], 
        wmWorkorderRegistrationId: parseInt(this.wmWorkorderRegistrationId)
      });
  
    } else {
      console.error('Invalid or missing date value in row:', v);
    }
  
  }
  try {
    const response: any = await this.workService.saveMultipleMeterChangeDetails(filter, data);
    let message = '';
    if (response.messageType === 'FAILURE') {
      message = 'Data not saved successfully';
    } else {
      message = 'Data saved successfully';
    }

    const snackBarRef = this.snackBar.open(message, 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    });

    snackBarRef.onAction().subscribe(() => {
      this.navigate('METER REPLACEMENT', '23');
    });
  
  } catch (error) {
    const snackBarRef = this.snackBar.open('An error occurred. Please try again.', 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    });

    snackBarRef.onAction().subscribe(() => {
      this.navigate('METER REPLACEMENT', '23');
    });
  }
  
  
}
navigate(label: string, code: string) {
  this.router.navigate(['/main/work-order-summary'], {
    queryParams: {
      statusCode:23,
      label: 'METER REPLACEMENT',
      type: 'list',
      processTypeName: 'WORKORDER',
    },
  });
}

isValidForm(): boolean {
  this.meterChangeDetailsReport.markAllAsTouched();
  console.log('Form Valid?', this.meterChangeDetailsReport.valid);
  let hasError = false;
  Object.keys(this.meterChangeDetailsReport.controls).forEach((key) => {
    const control = this.meterChangeDetailsReport.get(key);

    if (control && (control.invalid || control.untouched)) {
      hasError = true;
    }
  });
  
  if (hasError) {
    this.error = 'Please Fill Out Mandatory Fields';
    return false;
  } else {
    this.error = '';
    return true;
  }
}
}
