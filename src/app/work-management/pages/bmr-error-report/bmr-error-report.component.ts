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
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoaderService } from 'src/app/services/loader.service';

const cRegisteredForm = new FormGroup({
  officeCode: new FormControl('', [Validators.required]),  // Changed to officeCode
  outputFormat: new FormControl('pdf', [Validators.required]),  // Added outputFormat control
  officeName: new FormControl(''),

}); 

@Component({
  selector: 'app-bmr-error-report',
  templateUrl: './bmr-error-report.component.html',
  styleUrls: ['./bmr-error-report.component.scss']
})
export class BMRErrorReportComponent {
  @Input() loading: boolean = true;
  label: string[] = [];
  id: any[] = [];
  public rows: any | null = null;
  treeControl = new FormControl('', []);
  nodes: any[] = [];
  selected: any; 
  data: any[] = [];
  officeMasterID: any[] = [];
  officeOptions: any[] = [];
  searchInput: FormControl = new FormControl();
  filteredOfficeOptions: Observable<any[]>;
  officeCode: any;  // Changed from officeMasterId to officeCode
  officeError: boolean = false;
  cRegisteredForm: FormGroup = cRegisteredForm;
  error: string;
  apiUrl = environment.baseURL;

  constructor(
    private bmrreportservice: BmrReportsService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private storeOfficeService : StoreOfficeService,
    private configurationService: ConfigurationService,
    private loader: LoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loader.show('Loading Data');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    this.officeCode = officeCode;
    const filters: any = { apiKey, serviceKey, userRole, userName, userCode , officeMasterID:this.officeCode};
     const filteredOfficeOptions = await this.configurationService.getofficeMasterData(filters);
      this.officeOptions = filteredOfficeOptions.map((data: any) => ({
        officeCode: data.officeCode,  
        officeMasterId: data.officeMasterId, 
        officeName: data.officeName,
      }));
    // const officeMasterID = await this.storeOfficeService.getOfficeMasterByOfficeMasterId(filters);
    // this.filteredOfficeOptions = this.officeMasterID.map((v:any)=> ({
    //   officeCode : `${v.officeMasterId}`
    // }))
    // this.loadOfficeOptions(filters);
    this.filterOfficeOptions(''); 
    this.loader.hide(); 
  }

  filterOfficeOptions(value: string): void {
    this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
      startWith(value),
      map((val) => this.filterOptions(val))
    );
  }

  filterOptions(value: string): any[] {
    const typedValue = value ? value.toLowerCase().trim() : '';
    return this.officeOptions.filter(option =>
      option.officeCode && option.officeCode.toLowerCase().includes(typedValue)  // Changed to officeCode
    );
  }

  // async loadOfficeOptions(filters: any) {
  //   this.officeMasterID = await this.bmrreportservice.officeMasterIDSelectboxForErrorreport(filters);
    // this.officeOptions = this.officeMasterID.map((data: any) => ({
    //   officeCode: data.officeCode,  // Changed to officeCode
    // }));
  // }

  selectOffice(option: any) {
    if (option) {
      // Set the officeCode in the form for binding
      this.cRegisteredForm.get('officeCode')?.setValue(option.officeCode); 
      // Update the input field display value with the combined officeCode and officeName
      this.searchInput.setValue(`${option.officeCode} - ${option.officeName}`, { emitEvent: false });
    } else {
      console.warn('No option selected or option is undefined');
    }
  }
  
  resetForm() {
    this.cRegisteredForm = new FormGroup({
      officeCode: new FormControl('', [Validators.required]),  
      officeName: new FormControl(''),
    });
  }

  generateBMRErrorReport() {
    this.cRegisteredForm.markAllAsTouched();
    if (this.isValidForm()) {
      this.officeError = false;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      const selectedType = this.cRegisteredForm.get('outputFormat')?.value;  // Get selected radio button value
      const givenOfficeCode = this.cRegisteredForm.get('officeCode')?.value;  // Get selected radio button value

      console.log('selectedType is',selectedType);
      let url = null;
      if(selectedType == "pdf")
         url = `${this.apiUrl}/api/bmrReport/GenerateBmrErrorReport`;
      
      if(selectedType == "xls")
         url = `${this.apiUrl}/api/bmrReport/GenerateBmrErrorReportXLS`;
      


      const queryParams = {
        userName,
        userCode,
        userRole,
        apiKey,
        serviceKey,
        officeCode: givenOfficeCode,  // Changed to officeCode
      };

      const fullUrl = `${url}?${this.serialize(queryParams)}`;

      this.http
        .get(fullUrl, { responseType: 'blob' })
        .subscribe((response: Blob) => {
          if(selectedType == "xls")
          saveAs(response, 'BMR_Error_Report.xls');
          this.searchInput.reset();
          this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterOptions(value))
          );
          if(selectedType == "pdf")
            saveAs(response, 'BMR_Error_Report.pdf');
          this.searchInput.reset();
          this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterOptions(value))
          );
        });
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
