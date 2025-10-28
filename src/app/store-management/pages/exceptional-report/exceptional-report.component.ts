import { Component, OnInit } from '@angular/core';
import { ExceptionalReportService } from 'src/app/services/exceptional-report.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MobileUtils } from 'src/app/lib/mobile-utils';

@Component({
  selector: 'app-exceptional-report',
  templateUrl: './exceptional-report.component.html',
  styleUrls: ['./exceptional-report.component.scss'],
  providers: [DatePipe],
})
export class ExceptionalReportComponent implements OnInit {
  fileName: string = '';
  date: string = '';
  showTable: boolean = true;
  dataItems: any[] = [];
  portingStartDate: string = '';
  portingEndDate: string = '';
  selectedItemId: any;
  blob: Blob;
  fromDateError: boolean = false;
  toDateError: boolean = false;
  exceptionalForm: FormGroup;
  apiUrl =environment.baseURL;
  constructor(
    private exceptionalReportService: ExceptionalReportService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.exceptionalForm = this.formBuilder.group({
      portingStartDate: ['', Validators.required],
      portingEndDate: ['', Validators.required],
    });
  }

  private formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  async displayTable() {
    this.exceptionalForm.markAllAsTouched();
    if (!this.portingStartDate || !this.portingEndDate) {
      this.fromDateError = !this.portingStartDate;
      this.toDateError = !this.portingEndDate;
      return;
    }

    this.fromDateError = false;
    this.toDateError = false;
     
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');

    const formattedStartDate = this.formatDate(this.portingStartDate);
    const formattedEndDate = this.formatDate(this.portingEndDate);

    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      portingStartDate: formattedStartDate,
      portingEndDate: formattedEndDate,
    };

    try {
      const ExceptionalData = await this.exceptionalReportService.ExceptionalPortingData(filter);
      console.log('porting data', ExceptionalData);
      this.dataItems = ExceptionalData;
     if (this.dataItems.length === 0) {
      this.snackBar.open('No data available in the selected date range.', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: cordova !== undefined ? 'bottom' : 'top'
      });
    }
  } catch (error) {
    console.error('Error fetching exceptional porting data:', error);
  }
  }

  downloadExcelFile() {
    const selectedDataItem = this.dataItems.find(
      (item) => item && item.smInventoryUploadReqId === this.selectedItemId
    );

    if (!selectedDataItem) {
      console.error('Selected item not found or has an invalid structure.');
      return;
    }

    const { smInventoryUploadReqId, portedFileName, portingDate } = selectedDataItem;

    const adjustedId = smInventoryUploadReqId !== null ? smInventoryUploadReqId : 0;

    const formattedPortingDate = this.formatDate(portingDate);

    this.getExcelFile(adjustedId, portedFileName, formattedPortingDate).subscribe(
      (fileData: any) => {
        const blob: any = new Blob([fileData.body], {
          type: fileData.type,
        });

        let link = document.createElement('a');
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `Exceptional_Report.xlsx`);
          document.body.appendChild(link);
          if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }          document.body.removeChild(link);
        }
      }
    );
  }

  getExcelFile(smInventoryUploadReqId: any, portedFileName: string, portingDate: string) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');

    const adjustedId = smInventoryUploadReqId !== 'null' ? smInventoryUploadReqId : 0;

    return this.http.get(
      `${this.apiUrl}/api/smInventoryUploadMaterialsLog/getExceptionLogExcel?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&smInventoryUploadReqId=${adjustedId}&portedFileName=${portedFileName}&portingDate=${portingDate}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
  getFormattedCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
