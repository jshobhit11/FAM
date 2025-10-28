import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';


const cRegisteredForm = new FormGroup({
  sectionName: new FormControl('', [Validators.required]),
  outputFormat: new FormControl('pdf', [Validators.required])
});



@Component({
  selector: 'app-pending-completion-report',
  templateUrl: './pending-completion-report.component.html',
  styleUrls: ['./pending-completion-report.component.scss']
})
export class PendingCompletionReportComponent {
  data: any[] = [];
  officeMasterID: any[] = [];
  officeOptions: any[] = [];
  searchInput: FormControl = new FormControl();
  filteredOfficeOptions: Observable<any[]>;
  sectionName: any;
  selectedValue: string;
 

  cRegisteredForm: FormGroup = cRegisteredForm;
  error: string;
  apiUrl = environment.baseURL;

  sectionOptions = [
    { officeMasterId: 'FRAZER TOWN OMU', label: 'Frazer Town OMU' },
   
  ];
 constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,

  ) {
    this.cRegisteredForm = this.fb.group({
      sectionName: ['', Validators.required],
      outputFormat: ['pdf']
    });
  }

ngOnInit(): void {
    const filters: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
     
    };
    
    this.filterOfficeOptions('');
  }

  onSectionChange(selectedValue: string) {
   
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
      option.sectionName && option.sectionName.toLowerCase().includes(typedValue)
    );
  }

  // async loadOfficeOptions(filters: any) {
  //   this.officeMasterID = await this.bmrreportservice.officeMasterIDSelectboxForErrorreport(filters);
  //   // this.sectionOptions = this.officeMasterID.map((data: any) => ({
  //   //   officeCode: data.officeCode,  // Changed to officeCode
  //   // }));
  // }

  selectOffice(option: any) {
    console.log('Selected Section Name:', option);
    this.sectionName = option.sectionName;
    this.searchInput.setValue(option.sectionName);
  }

  resetForm() {
    this.cRegisteredForm = new FormGroup({
      sectionName: new FormControl('', [Validators.required]),
    });
  }

  generateCompletionReport() {
    this.cRegisteredForm.markAllAsTouched();
    if (this.isValidForm()) {

      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      const selectedType = this.cRegisteredForm.get('outputFormat')?.value;
      const givenSectionName = this.cRegisteredForm.get('sectionName')?.value;

      console.log('selectedType is', selectedType);
      let url = null;
      // let fileExtension = '';
      if (selectedType == "pdf")
        url = `${this.apiUrl}/api/pendingRegistration/generatePendingCompletionReport`;
      // fileExtension = 'pdf';
      if (selectedType == "xls")
        url = `${this.apiUrl}/api/pendingRegistration/generatePendingCompletionReportXLS`;
      // fileExtension = 'xls';


      const queryParams = {
        userName,
        userCode,
        userRole,
        apiKey,
        serviceKey,
        sectionName: givenSectionName,
      };

      const fullUrl = `${url}?${this.serialize(queryParams)}`;

      this.http
        .get(fullUrl, { responseType: 'blob' })
        .subscribe((response: Blob) => {
          if (selectedType == "xls")
            saveAs(response, 'Completion_Report.xlsx');
          this.searchInput.reset();
          this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterOptions(value))
          );
          if (selectedType == "pdf")
            saveAs(response, 'Completion_Report.pdf');
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
