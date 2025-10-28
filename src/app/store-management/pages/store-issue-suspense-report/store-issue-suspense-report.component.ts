import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { environment } from 'src/environments/environment';
const storeReportForm = new FormGroup({
  storeCode: new FormControl('', [Validators.required]),
  fromDate: new FormControl('', [Validators.required]),
  toDate: new FormControl('', [Validators.required]),
  outputFormat: new FormControl('pdf', [Validators.required]), 
});

@Component({
  selector: 'app-store-issue-suspense-report',
  templateUrl: './store-issue-suspense-report.component.html',
  styleUrls: ['./store-issue-suspense-report.component.scss']
})
export class StoreIssueSuspenseReportComponent implements OnInit {

  storeReportForm: FormGroup = storeReportForm;
  storeData: any[] = [];
  blob: any;
  error: string = '';
  allStores: string[] = [];
  filteredStore: Observable<string[]>;
  storeCode: string = '';
  apiUrl =environment.baseURL;
  constructor(
    private storeOfficeService: StoreOfficeService, 
    private configureService: ConfigurationService, 
    private http: HttpClient) { }

  async ngOnInit() {
    this.reset();
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.storeData = await this.storeOfficeService.getAllStoreMasterData(filter);
    const mlFilter: any = { apiKey, serviceKey, userRole, userName, userCode, mlType: 'MATERIAL' };
    this.allStores = this.storeData.map((v: any) => `${v.storeCode}-${v.storeName}`);
    this.filteredStore = this.storeReportForm.get('storeCode').valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterStore(value);
      }),
    );
    console.log('filteredStore', this.filteredStore);
    this.resetForm();
  }
  resetForm() {
    this.storeReportForm = new FormGroup({
      storeCode: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      outputFormat: new FormControl('pdf', [Validators.required]),
    });
  }
  reset() {
    return new Promise((resolve) => {
      this.storeReportForm.reset({
        storeCode: '',
        fromDate: '',
        toDate: '',
        outputFormat: '',
      });
      resolve(true);
    });
  }
  getFormattedCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async generateReport() {
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
      storeCode: this.storeReportForm.get('storeCode').value,
      fromTransactionDate: this.storeReportForm.get('fromDate').value,
      toTransactionDate: this.storeReportForm.get('toDate').value,
    };
    if (this.storeReportForm.get('outputFormat').value === 'pdf') {
      await this.storeOfficeService.generateStockLogReportPDF(filter);
    } else if (this.storeReportForm.get('outputFormat').value === 'xls') {
      await this.storeOfficeService.generateStockLogReportXLS(filter);
    }
  }

  isValidForm(): boolean {
    this.storeReportForm.markAllAsTouched();
    console.log('Form Valid?', this.storeReportForm.valid);
    let hasError = false;
    Object.keys(this.storeReportForm.controls).forEach((key) => {
      const control = this.storeReportForm.get(key);
  
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
  
  async generateStockReport() {
    this.storeReportForm.markAllAsTouched();
    console.log('Form Valid1?', this.storeReportForm.valid);
    if (this.isValidForm()) {
      this.getFile().subscribe((data: any) => {
        this.blob = new Blob([data.body, { type: data.body.type }]);
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Store Issue Suspense Report' + `.${this.storeReportForm.get('outputFormat').value}`;
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }      });
    }
  }

  getFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const storeCode = this.storeCode;
    const fromTransactionDate = this.storeReportForm.get('fromDate').value;
    const toTransactionDate = this.storeReportForm.get('toDate').value;
    if (this.storeReportForm.get('outputFormat').value === 'pdf') {
      return this.http.get(
        `${this.apiUrl}/api/storeInventory/getStoreIssuedSuspenseStoreData?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&storeCode=${storeCode}&fromTransactionDate=${fromTransactionDate}&toTransactionDate=${toTransactionDate}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
    // else if (this.storeReportForm.get('outputFormat').value === 'xls') {
    //   return this.http.get(
    //     `${this.apiUrl}/api/storeInventory/generateInventoryAdjustmentXLSXReport?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&storeCode=${storeCode}&fromTransactionDate=${fromTransactionDate}&toTransactionDate=${toTransactionDate}`,
    //     { observe: 'response', responseType: 'blob' },
    //   );
    // }
  }

  // private _filterMaterial(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.allMaterials.filter((name) => name.toLowerCase().includes(filterValue));
  // }

  private _filterStore(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allStores.filter((name) => name.toLowerCase().includes(filterValue));
  }

  // onMaterialSelected(value: string): void {
  //   const code = value.split('-');
  //   const material = this.srMaterialData.find((v) => v.mlCode === code[0]);
  //   this.materialCode = material.mlCode;
  // }

  onStoreSelected(value: string): void {
    const code = value.split('-');
    const store = this.storeData.find((v) => v.storeCode === code[0]);
    this.storeCode = store.storeCode;
  }
}
