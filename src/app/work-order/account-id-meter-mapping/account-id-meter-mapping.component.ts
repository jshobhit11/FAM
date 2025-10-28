import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-account-id-meter-mapping',
  templateUrl: './account-id-meter-mapping.component.html',
  styleUrls: ['./account-id-meter-mapping.component.scss'],
})
export class AccountIdMeterMappingComponent implements OnInit {
  saveDataEnabled = false;
  type: any;
  data: any;
  fileContent: any[][] = [];
  finalContent: any[][] = [];
  workDescription: string = '';
  workorderNo: string = '';
  applicationTypeCode: any;
  isFaReceived: any;
  showErrorTemplate: boolean = false;
  workorderRegisteredId: any;
  serviceRegistrationsId: any;
  showTableData: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private workService: WorkOrderService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const workorderRegisteredId = params['workOrderRegisteredId'];
      this.workorderRegisteredId = workorderRegisteredId;
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
      this.serviceRegistrationsId = this.data[0].serviceRegistrationsId;
      if (this.isFaReceived == '0'||this.isFaReceived == '2') {
        this.showErrorTemplate = true;
      }
    });
  }
  async downloadFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const wmWorkorderRegisteredId = this.workorderRegisteredId;
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      wmWorkorderRegisteredId,
    };
    try {
      const response = await this.dashboardService.accountMeterExcelData(
        filter
      );
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      if (blob.size === 0) {
        this.snackbar.open('No data found for the file.', 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return;
      }
      const fileName = 'meter_details.xlsx';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      this.snackbar.open('No data found for the file.', 'Ok', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  }
  navigate(label: any, code: any) {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        type: this.type,
        label: label,
        statusCode: code,
        processTypeName: 'WORKORDER',
      },
    });
  }

  onFileChange(event: any) {
    const target: HTMLInputElement = <HTMLInputElement>event.target;
    const file = target.files ? target.files[0] : null;
    if (file && target.files.length !== 1) {
      this.snackbar.open('Please select exactly one file.', 'Ok', { duration: 3000 });
      target.value = '';
      return;
    }
  
    if (file) {
      const allowedExtensions = ['.xlsx', '.xls'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        this.snackbar.open('Invalid file type. Please select an Excel file (.xlsx or .xls).', 'Ok', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top'
        });
        target.value = ''; 
        return;
      }
      
    } else {
      this.snackbar.open('No file selected. Please choose a file.', 'Ok', { duration: 3000 });
    }
  }
  
  async downloadSampleFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const accountId = this.data[0]?.accountId;
  
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      accountId,
    };
  
    try {
      const response = await this.dashboardService.getSampleFileData(filter);
  
      if (!response.body) {
        this.snackbar.open('No data found for the sample file.', 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return;
      }
  
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              push();
            });
          }
          push();
        }
      });
  
      const blob = await new Response(stream).blob();
      const fileName = 'account_meter_mapping_sheet.xlsx';
  
      if (blob.size === 0) {
        this.snackbar.open('No data found for the sample file.', 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return;
      }
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error('Error downloading sample file:', error);
      this.snackbar.open(
        'An error occurred while downloading the sample file.',
        'Ok',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
    }
  }
    
  processFile() {
    this.finalContent = [];
  
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
      const startRow = 2;
      const options = { header: 1, range: startRow };
      this.fileContent = XLSX.utils.sheet_to_json(worksheet, options);
      console.log('xlsx content', this.fileContent);
      this.validateMaterials();
    };
    reader.readAsArrayBuffer(file);
  }

  
  async validateMaterials() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const serviceRegistrationsId = this.serviceRegistrationsId;
    const wmWorkorderRegisteredId= this.data[0].wmWorkorderRegisteredId;
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, serviceRegistrationsId,wmWorkorderRegisteredId};
    const data: any[] = [];
  
    this.fileContent.forEach((v) => {
      const pfValue = v[8] || 1;
  
      data.push({
        accountId: v[0],
        materialCode: v[1],
        badgeNumber: v[2],
        meterSerialNo: v[3],
        readingDateFormat: v[4],
        pf: pfValue,
      });
    });
  
    const res = await this.workService.validateMaterials(filter, data).catch(error => {
      console.error('Error validating materials:', error);
      this.snackbar.open('An error occurred during validation.', 'Ok', {
        duration: 5000,
        panelClass: 'snackbar-error'
      });
      this.saveDataEnabled = false; 
      return []; 
    });
  
    let errors: { message: string, code: string }[] = [];
    let success = false;
  
    if (Array.isArray(res)) {
      if (res.length > 0 && typeof res[0] == 'object' && res[0].badgeNumber && res[0].messageText) {
        errors = res.map((v: any) => ({
          message: v.messageText,
          code: v.badgeNumber
        }));
        this.snackbar.open(`Component Id /Serial Number (${errors[0].code}): ${errors[0].message}`, 'Ok', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          panelClass: 'snackbar-error'
        });
      } else if (res.length > 0 && typeof res[0] === 'string') {
        errors = res.map((msg: string) => ({
          message: msg,
          code: msg
        }));
      } else if (res.length > 0 && typeof res[0] === 'object') {
        errors = res.map((v: any) => ({
          message: v.messageText,
          code: v.messageText.match(/\d+/g)?.[0] || '0'
        }));
      }
    } else if (typeof res === 'object' && res.messageText) {
      errors = [{
        message: res.messageText,
        code: res.messageText.match(/\d+/g)?.[0] || '0'
      }];
      this.snackbar.open(res.messageText, 'Ok', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: 'snackbar-error'
      });
    } else {
      this.snackbar.open('Unexpected response format.', 'Ok', {
        duration: 5000,
        panelClass: 'snackbar-error'
      });
      this.saveDataEnabled = false;
      return;
    }
    const resultCodes = errors.map((e: any) => e.code); 
    let errorCount = 0;
    this.fileContent.forEach((v) => {
      const hasError = resultCodes.some(code => [v[0], v[1], v[2], v[3], v[4], v[8]].map(val => val?.toString()).includes(code)); 
      v.push(hasError);
      if (hasError) {
        errorCount++;
      }
      this.finalContent.push(v);
    });
  
    if (errorCount === 0) {
      success = true; 
      this.showTableData =true;
    } else {
      this.showTableData =false;
    }
    this.saveDataEnabled = success;
  }
  
  errCount() {
    return this.finalContent.filter((row) => row.includes(true)).length;
  }

  isError(): boolean {
    return this.finalContent.some((row) => row.includes(true));
  }

  parseExcel(buffer: ArrayBuffer): string[][] {
    const wb: XLSX.WorkBook = XLSX.read(buffer as any, { type: 'array' });
    const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];
  }

  removeData(i: any) {
    this.finalContent.splice(i, 1);
  }

  openConfirmationpopupDialog() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.saveData();
      }
    });
  }

  async saveData() {

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
      wmWorkorderRegisteredId: this.data[0]?.wmWorkorderRegisteredId,
    };
    const data: any[] = [];
    this.finalContent.forEach((v) => {
      let readingDate = '';
      if (v[4]) {
        const dateParts = v[4].split('-'); 
        if (dateParts.length === 3) {
          readingDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        } else {
          console.error(`Invalid date format for value: ${v[4]}`);
        }
      }
  
      data.push({
        serviceRegistrationsId: this.data[0]?.serviceRegistrationsId,
        accountId: v[0],
        materialCode: v[1],
        badgeNumber: v[2],
        meterSerialNo: v[3],
        // readingDate: v[4],
        readingDate:readingDate,
        kwhReading: Number(v[5]),
        kvahReading: Number(v[6]),
        kwReading: Number(v[7]),
        pf: Number(v[8]),
      });
    });
    console.log(data);
    try {
      const response = await this.workService.saveAccountMeterMapping(
        filter,
        data
      );
      if (response.messageType === 'SUCCESS') {
        const snackbarRef = this.snackbar.open(
          'Data saved successfully!',
          'Ok',
          {
            horizontalPosition: 'center',
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );

        snackbarRef.onAction().subscribe(() => {
          this.navigate('ACCOUNT ID AND METERS MAPPING', 17);
        });
      } else {
        this.snackbar.open('An error occurred while saving data!', 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      this.snackbar.open('An error occurred while saving data.', 'Ok', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  }
  close(){
    this.navigate('ACCOUNT ID AND METERS MAPPING', 17);
  }
}
