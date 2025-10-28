import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BmrReportsService } from 'src/app/services/bmr-reports.service';

@Component({
  selector: 'app-pc-test-report',
  templateUrl: './pc-test-report.component.html',
  styleUrls: ['./pc-test-report.component.scss']
})
export class PCTestReportComponent implements OnInit {
  data: any[] = [];
  officeOptions: any[] = [];
  searchInput: FormControl = new FormControl('');
  filteredOfficeOptions: Observable<any[]>;
  serviceRegistrationsId: string; // Changed to string for better handling
  officeError: boolean = false;
  error: string = '';

  // Form Group with default values
  cRegisteredForm = new FormGroup({
    serviceRegistrationsId: new FormControl('', [Validators.required]),
    outputFormat: new FormControl('pdf', [Validators.required])
  });

  apiUrl = environment.baseURL;

  constructor(
    private bmrreportservice: BmrReportsService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.filterOfficeOptions('');
  }

  filterOfficeOptions(value: string): void {
    this.filteredOfficeOptions = this.searchInput.valueChanges.pipe(
      startWith(value),
      map(val => this.filterOptions(val))
    );
  }

  filterOptions(value: string): any[] {
    const typedValue = value ? value.toLowerCase().trim() : '';
    return this.officeOptions.filter(option =>
      option.serviceRegistrationsId && option.serviceRegistrationsId.toLowerCase().includes(typedValue)
    );
  }

  async loadOfficeOptions(filters: any) {
    this.officeOptions = await this.bmrreportservice.pctestReportpdf(filters);
  }

  selectOffice(option: any) {
    console.log('Selected Office Code:', option);
    this.cRegisteredForm.patchValue({ serviceRegistrationsId: option.serviceRegistrationsId });
  }

  resetForm() {
    this.cRegisteredForm.reset({
      serviceRegistrationsId: '',
      outputFormat: 'pdf'
    });
    this.searchInput.reset();
  }

  generatePCTestReport() {
    this.cRegisteredForm.markAllAsTouched();
    
    if (this.cRegisteredForm.valid) {
      this.officeError = false;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      const selectedType = this.cRegisteredForm.get('outputFormat')?.value;
      const givenServiceRegistrationsId = this.cRegisteredForm.get('serviceRegistrationsId')?.value;

      let url = `${this.apiUrl}/api/pcTest/generatePcTestReport`;

      const queryParams = {
        userName,
        userCode,
        userRole,
        apiKey,
        serviceKey,
        serviceRegistrationsId: givenServiceRegistrationsId,
      };

      const fullUrl = `${url}?${this.serialize(queryParams)}`;

      this.http
        .get(fullUrl, { responseType: 'blob' })
        .subscribe((response: Blob) => {
          if (selectedType === 'pdf') {
            saveAs(response, 'PC_Test_Report.pdf');
          }

          this.resetForm();  // Reset form and search input after report generation
        }, (error) => {
          console.error('Error downloading report:', error);
        });
    } else {
      this.error = 'Please fill out all required fields.';
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
}
