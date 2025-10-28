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
  selector: 'app-store-adjustment-report',
  templateUrl: './store-adjustment-report.component.html',
  styleUrls: ['./store-adjustment-report.component.scss']
})
export class StoreAdjustmentReportComponent implements OnInit {

  storeReportForm: FormGroup = storeReportForm;
  storeData: any[] = [];
  // srMaterialData: any[] = [];
  blob: any;
  error: string = '';
  // allMaterials: string[] = [];
  allStores: string[] = [];
  // filteredMaterial: Observable<string[]>;
  filteredStore: Observable<string[]>;
  storeCode: string = '';
  // materialCode: string = '';
  apiUrl =environment.baseURL;
  constructor(
    private storeOfficeService: StoreOfficeService, 
    private configureService: ConfigurationService, 
    private http: HttpClient) { }

  async ngOnInit() {
    this.resetForm();
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.storeData = await this.storeOfficeService.getAllStoreMasterData(filter);
    const mlFilter: any = { apiKey, serviceKey, userRole, userName, userCode, mlType: 'MATERIAL' };
    // this.srMaterialData = await this.configureService.getSrmaterialMasterGetDataMlType(mlFilter);
    // this.allMaterials = this.srMaterialData.map((v: any) => `${v.mlCode}-${v.mlName}`);
    this.allStores = this.storeData.map((v: any) => `${v.storeCode}-${v.storeName}`);
    // this.filteredMaterial = this.stockReportForm.get('materialCode').valueChanges.pipe(
    //   startWith(''),
    //   map((value) => {
    //     return this._filterMaterial(value);
    //   }),
    // );
    this.filteredStore = this.storeReportForm.get('storeCode').valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterStore(value);
      }),
    );
    this.storeReportForm.updateValueAndValidity();
    // console.log('filteredMaterial', this.filteredMaterial);
    console.log('filteredStore', this.filteredStore);
  }

  resetForm() {
    this.storeReportForm = new FormGroup({
      storeCode: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      outputFormat: new FormControl('pdf', [Validators.required]),
    });
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
      // materialCode: this.stockReportForm.get('materialCode').value,
      fromTransactionDate: this.storeReportForm.get('fromDate').value,
      toTransactionDate: this.storeReportForm.get('toDate').value,
      // transactionType: this.stockReportForm.get('transactionType').value,
    };
    if (this.storeReportForm.get('outputFormat').value === 'pdf') {
      await this.storeOfficeService.generateStockLogReportPDF(filter);
    } else if (this.storeReportForm.get('outputFormat').value === 'xls') {
      await this.storeOfficeService.generateStockLogReportXLS(filter);
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
        link.download = 'Store Adjustment Report' + `.${this.storeReportForm.get('outputFormat').value}`;
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }      });
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
  

  getFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const storeCode = this.storeCode;
    // const materialCode = this.materialCode;
    const fromTransactionDate = this.storeReportForm.get('fromDate').value;
    const toTransactionDate = this.storeReportForm.get('toDate').value;
    // const transactionType = this.stockReportForm.get('transactionType').value;
    if (this.storeReportForm.get('outputFormat').value === 'pdf') {
      return this.http.get(
        `${this.apiUrl}/api/storeInventory/generateInventoryAdjustmentPDFReport?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&storeCode=${storeCode}&fromTransactionDate=${fromTransactionDate}&toTransactionDate=${toTransactionDate}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
    else if (this.storeReportForm.get('outputFormat').value === 'xlsx') {
      return this.http.get(
        `${this.apiUrl}/api/storeInventory/generateInventoryAdjustmentXLSXReport?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&storeCode=${storeCode}&fromTransactionDate=${fromTransactionDate}&toTransactionDate=${toTransactionDate}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
  }

  // private _filterMaterial(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.allMaterials.filter((name) => name.toLowerCase().includes(filterValue));
  // }

  private _filterStore(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allStores.filter((name) => name.toLowerCase().includes(filterValue));
  }

  getFormattedCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onStoreSelected(value: string): void {
    const code = value.split('-');
    const store = this.storeData.find((v) => v.storeCode === code[0]);
    this.storeCode = store.storeCode;
  }
}
