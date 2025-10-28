import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BmrReportsService } from 'src/app/services/bmr-reports.service';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { LoaderService } from 'src/app/services/loader.service';

const cRegisteredForm = new FormGroup({
  storeCode: new FormControl('', [Validators.required]),  
  outputFormat: new FormControl('pdf', [Validators.required])  

}); 

@Component({
  selector: 'app-pending-suspence-meter-report',
  templateUrl: './pending-suspence-meter-report.component.html',
  styleUrls: ['./pending-suspence-meter-report.component.scss']
})
export class PendingSuspenceMeterReportComponent {
  data: any[] = [];
  officeMasterID: any[] = [];
  officeOptions: any[] = [];
  storeData: any[] = [];
  @Input() loading: boolean = true;
  blob: any;
  allStores: string[] = [];
  filteredStore: Observable<string[]>;
  searchInput: FormControl = new FormControl();
  filteredOfficeOptions: Observable<any[]>;
  storeCode: any; 
  storeType : any; 
  officeError: boolean = false;
  cRegisteredForm: FormGroup = cRegisteredForm;
  error: string;
  apiUrl = environment.baseURL;

  constructor(
    private bmrreportservice: BmrReportsService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private storeOfficeService: StoreOfficeService,
    private loader: LoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loader.show('Loading Data');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.storeData = await this.storeOfficeService.getAllStoreMasterData(filter);
    // this.allStores = this.storeData.map((v: any) => `${v.storeCode}-${v.storeName}`);
    // this.loadOfficeOptions(filters);
     this.officeOptions = this.storeData
     .filter((v: any) => v.storeType === "VIRTUAL")
     .map((v: any) => ({
      storeCode: `${v.storeCode}-${v.storeName}`,
      storeType: v.storeType
     }));
    this.filterOfficeOptions(''); 
    this.loader.hide();
  }

  filterOfficeOptions(value: string): void {
    this.filteredOfficeOptions = this.cRegisteredForm.get('storeCode')?.valueChanges.pipe(
      startWith(value),
      map(val => this.filterOptions(val))
    );
  }

  filterOptions(value: string): any[] {
    const typedValue = value ? value.toLowerCase().trim() : '';
    const filtered = this.officeOptions.filter(option =>

      option.storeCode && option.storeCode.toLowerCase().includes(typedValue)  // Changed to storeCode
    );
    console.log('Filtered Options:', filtered); // Log the filtered options
  return filtered;
  }

  async loadOfficeOptions(filters: any) {
    this.officeMasterID = await this.bmrreportservice.storeCodeSelectBoxreport(filters);
    // this.officeOptions = this.officeMasterID.map((data: any) => ({
    //   storeCode: data.storeCode,  // Changed to storeCode
    // }));
  }

  selectOffice(option: string) {
    if (option) {
      const storeCode = option.split('-')[0].trim();  // Extract store code before the dash
      console.log('Selected storeCode:', storeCode);
     
      this.cRegisteredForm.get('storeCode')?.setValue(option);  
    } else {
      console.error('No option selected or option is invalid');
    }
  }
  
  resetForm() {
    this.cRegisteredForm = new FormGroup({
      storeCode: new FormControl('', [Validators.required]),  
    });
  }

  generatePrndingMeterReport() {
    this.cRegisteredForm.markAllAsTouched();
    if (this.isValidForm()) {
      this.officeError = false;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      const selectedType = this.cRegisteredForm.get('outputFormat')?.value;  // Get selected radio button value
      const givenStoreCode = this.cRegisteredForm.get('storeCode')?.value.split('-')[0].trim();  // Get selected radio button value

      console.log('selectedType is',selectedType);
      let url = null;
      // let fileExtension = '';
      if(selectedType == "pdf")
         url = `${this.apiUrl}/api/pendingRegistration/generatePendingSuspenceMeterReport`;
      // fileExtension = 'pdf';
      else if(selectedType == "xls")
         url = `${this.apiUrl}/api/pendingRegistration/generatePendingSuspenceMeterReportXLS`;
      // fileExtension = 'xls';


      const queryParams = {
        userName,
        userCode,
        userRole,
        apiKey,
        serviceKey,
        storeCode: givenStoreCode,  // Changed to storeCode
      };

      const fullUrl = `${url}?${this.serialize(queryParams)}`;

      this.http
        .get(fullUrl, { responseType: 'blob' })
        .subscribe((response: Blob) => {
          if(selectedType == "xls")
          saveAs(response, 'Pending_Suspence_Meter_Report.xls');
          this.searchInput.reset();
          this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterOptions(value))
          );
          if(selectedType == "pdf")
            saveAs(response, 'Pending_Suspence_Meter_Report.pdf');
          this.searchInput.reset();
          this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterOptions(value))
          );
        });
        this.resetForm();
    }
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
