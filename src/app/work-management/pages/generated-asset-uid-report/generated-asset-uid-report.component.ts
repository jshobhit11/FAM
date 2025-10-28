import { Component, OnInit } from '@angular/core';
import { WorksReportService } from 'src/app/services/works-report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { APIUrl } from 'src/app/services/types';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
const cRegisteredForm = new FormGroup({
  workOrderNo: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-generated-asset-uid-report',
  templateUrl: './generated-asset-uid-report.component.html',
  styleUrls: ['./generated-asset-uid-report.component.scss'],
})
export class GeneratedAssetUidReportComponent implements OnInit {
  data: any[] = [];
  workOrders: any[] = [];
  workOrderOptions: any[] = [];
  searchInput: FormControl = new FormControl();
  filteredWorkOrderOptions: Observable<any[]>;
  wmWorkorderRegisteredId: any;
  workOrderError: boolean = false;
  cRegisteredForm: FormGroup = cRegisteredForm;
  error: string;
  apiUrl = environment.baseURL;
  constructor(
    private worksreportservice: WorksReportService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  filterWorkOrders(value: string): void {
    this.filteredWorkOrderOptions = this.searchInput.valueChanges.pipe(
      startWith(value),
      map((val) => this.filterWorkOrderOptions(val))
    );
  }

  filterWorkOrderOptions(value: string): any[] {
    const typedValue = value ? value.toLowerCase().trim() : '';
    return this.workOrderOptions.filter(
      (option) =>
        option.workOrderNo &&
        option.workOrderNo.toLowerCase().includes(typedValue)
    );
  }
  ngOnInit() {
    const filters: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    };
    this.loadWorkOrderOptions(filters);
    this.filterWorkOrders('');
  }

  async loadWorkOrderOptions(filters: any) {
    this.workOrders = await this.worksreportservice.getAssetUIDSelectbox(
      filters
    );
    this.workOrderOptions = this.workOrders.map((data: any) => ({
      workOrderNo: data.workorderNo,
      wmWorkorderRegisteredId: data.wmWorkorderRegisteredId,
    }));
  }

  selectWorkOrder(option: any) {
    console.log('Selected Work Order:', option);
    this.wmWorkorderRegisteredId = option.wmWorkorderRegisteredId;
    this.searchInput.setValue(option.workOrderNo);
  }
  resetForm() {
    this.cRegisteredForm = new FormGroup({
      workOrderNo: new FormControl('', [Validators.required]),
    });
  }

  generateAssetUIDReport() {
    this.cRegisteredForm.markAllAsTouched();
    if (this.isValidForm()) {
      this.workOrderError = false;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      const url = `${this.apiUrl}/api/amAssetRegisterLog/generateAmAssetIdGenerationReport`;
      const queryParams = {
        userName: userName,
        userCode: userCode,
        userRole: userRole,
        apiKey: apiKey,
        serviceKey: serviceKey,
        wmWorkorderRegisteredId: this.wmWorkorderRegisteredId,
      };

      const fullUrl = `${url}?${this.serialize(queryParams)}`;

      this.http
        .get(fullUrl, { responseType: 'blob' })
        .subscribe((response: Blob) => {
          saveAs(response, 'Asset_Id_Generation_Report.pdf');
          this.searchInput.reset();
          this.filteredWorkOrderOptions = this.searchInput.valueChanges.pipe(
            startWith(''),
            map((value) => this.filterWorkOrderOptions(value))
          );
        });
    }
  }

  serialize(obj: any): string {
    const params = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        params.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
        );
      }
    }
    return params.join('&');
  }

  isValidForm(): boolean {
    this.cRegisteredForm.markAllAsTouched();
    console.log('Form Valid?', this.cRegisteredForm.valid);
    let hasError = false;
    Object.keys(this.cRegisteredForm.controls).forEach((key) => {
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
