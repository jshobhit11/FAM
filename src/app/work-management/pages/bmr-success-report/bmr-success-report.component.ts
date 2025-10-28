import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BmrReportsService } from 'src/app/services/bmr-reports.service';

const cRegisteredForm = new FormGroup({
  officeMasterId: new FormControl('', [Validators.required]),
  outputFormat: new FormControl('pdf', [Validators.required]),
});

@Component({
  selector: 'app-bmr-success-report',
  templateUrl: './bmr-success-report.component.html',
  styleUrls: ['./bmr-success-report.component.scss']
})
export class BMRSuccessReportComponent implements OnInit {
  data: any[] = [];
  officeMasterID: any[] = [];
  officeOptions: any[] = [];
  searchInput: FormControl = new FormControl();
  filteredOfficeOptions: Observable<any[]>;
  officeMasterId: any;
  officeError: boolean = false;
  noDataAvailable: boolean = false;
  cRegisteredForm: FormGroup = cRegisteredForm;
  error: string;
  apiUrl = environment.baseURL;
  selectedFormat: string = 'pdf';
  constructor(
    private bmrreportservice: BmrReportsService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const filters: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      officeMasterId : sessionStorage.getItem('office-id'),
    };
    this.loadOfficeOptions(filters);
    this.filterOfficeOptions('');
  }

  filterOfficeOptions(value: string): void {
    this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
      startWith(value),
      map((val) => this.filterOptions(val))
    );
  }

  filterOptions(value: string): any[] {
    const typedValue = value ? value.toLowerCase().trim() : '';
    const filteredOptions = this.officeOptions.filter(option =>
      option.officeMasterId && option.officeMasterId.toLowerCase().includes(typedValue)
    );
    // this.noDataAvailable = filteredOptions.length === 0 && typedValue.length > 0;
    return filteredOptions;
  }

  async loadOfficeOptions(filters: any) {
    this.officeMasterID = await this.bmrreportservice.officeMasterIDSelectbox(filters);
    this.officeOptions = this.officeMasterID.map((data: any) => ({
      officeMasterId: data.officeMasterId,
    }));
  }

  selectOffice(option: any) {
    this.officeMasterId = option.officeMasterId;
    this.searchInput.setValue(option.officeMasterId);
    this.noDataAvailable = false;
  }

  resetForm() {
    this.cRegisteredForm = new FormGroup({
      officeMasterId: new FormControl('', [Validators.required]),
    });
  }

  generateBMRSuccessReport() {
    this.cRegisteredForm.markAllAsTouched();
    const selectedType = this.cRegisteredForm.get('outputFormat')?.value;
    // if (selectedType==='pdf' && this.noDataAvailable) {
    //   this.generateEmptyPDF();
    //   return;
    //  }  else if (selectedType==='xls'&& this.noDataAvailable){
    //  this.generateEmptyExcel();
    //  return;
    // } else 
    if(this.isValidForm()) {
      this.officeError = false; 
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      const url = `${this.apiUrl}/api/bmrReport/GenerateBmrSuccessReport`;
      const queryParams = {
        userName,
        userCode,
        userRole,
        apiKey,
        serviceKey,
      //  officeMasterId: this.officeMasterId,
        officeMasterId:this.cRegisteredForm.get('officeMasterId').value
      };

      const fullUrl = `${url}?${this.serialize(queryParams)}`;

      this.http
        .get(fullUrl, { responseType: 'blob' })
        .subscribe((response: Blob) => {
          saveAs(response, 'BMR_Success_Report.pdf');
          this.searchInput.reset();
          this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterOptions(value))
          );
        });
    }
  }

  generateEmptyExcel() {
    const emptyData = [
      ['Sr. No', 'Office ID', 'Report Details'],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(emptyData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Empty_BMR_Report');
  
    const workbookBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([workbookBlob], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'Empty_BMR_Report.xlsx');
  }
  generateEmptyPDF() {
    const pdfDoc = new jsPDF();
    pdfDoc.setFontSize(12);
    pdfDoc.text('BMR Report', 10, 10);
    pdfDoc.text('No data available for this report.', 10, 20); 
    pdfDoc.save('Empty_BMR_Report.pdf');
  }

  serialize(obj: any): string {
    const params = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
      }
    }
    return params.join('&');
  }

  isValidForm(): boolean {
    this.cRegisteredForm.markAllAsTouched();
    console.log('Form Valid?', this.cRegisteredForm.valid);
    let hasError = false;

    Object.keys(this.cRegisteredForm.controls).forEach(key => {
      const control = this.cRegisteredForm.get(key);
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
