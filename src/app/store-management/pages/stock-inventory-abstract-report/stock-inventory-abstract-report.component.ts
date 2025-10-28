import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { environment } from 'src/environments/environment';
const stockReportForm = new FormGroup({
  storeCode: new FormControl('', [Validators.required]),
  outputFormat: new FormControl('', [Validators.required]),  
});

@Component({
  selector: 'app-stock-inventory-abstract-report',
  templateUrl: './stock-inventory-abstract-report.component.html',
  styleUrls: ['./stock-inventory-abstract-report.component.scss'],
})
export class StockInventoryAbstractReportComponent implements OnInit {
  stockReportForm: FormGroup = stockReportForm;
  storeData: any[] = [];
  error: string = '';
  blob: any;
  allStores: string[] = [];
  filteredStore: Observable<string[]>;
  storeCode: string = '';
  apiUrl =environment.baseURL;
  constructor(private storeOfficeService: StoreOfficeService, private http: HttpClient, private snackbar: MatSnackBar) {}

  async ngOnInit() {
    this.reset();
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.storeData = await this.storeOfficeService.getAllStoreMasterData(filter);
    this.allStores = this.storeData.map((v: any) => `${v.storeCode}-${v.storeName}`);
    this.filteredStore = this.stockReportForm.get('storeCode').valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterStore(value);
      }),
    );
  }

  reset() {
    return new Promise((resolve) => {
      this.stockReportForm.reset({
        storeCode: '',
        outputFormat: 'pdf',
      });
      resolve(true);
    });
  }

  async generateReport() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, storeCode: this.stockReportForm.get('storeCode').value };
    if (this.stockReportForm.get('outputFormat').value === 'pdf') {
      await this.storeOfficeService.generateStoreInventoryAbstractReport(filter);
    } else if (this.stockReportForm.get('outputFormat').value === 'xls') {
      await this.storeOfficeService.generateStoreInventoryAbstractReportXLS(filter);
    }
  }

  isValidForm(): boolean {
    if (this.stockReportForm.get('storeCode').invalid || this.stockReportForm.get('outputFormat').invalid) {
      this.error = 'Please Fill Out Mandatory Fields';
      return false;
    } else {
      this.error = '';
      return true;
    }
  }

  async generateStockReport() {
    this.stockReportForm.markAllAsTouched();
    if (this.isValidForm()) {
      this.getFile().subscribe((data: any) => {
        this.blob = new Blob([data.body, { type: data.body.type }]);
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Stock Inventory Abstract Report' + `.${this.stockReportForm.get('outputFormat').value}`;
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
    if (this.stockReportForm.get('outputFormat').value === 'pdf') {
      return this.http.get(
        `${this.apiUrl}/api/storeInventory/generateStoreInventoryAbstractReport?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&storeCode=${storeCode}`,
        { observe: 'response', responseType: 'blob' },
      );
    } else if (this.stockReportForm.get('outputFormat').value === 'xls') {
      return this.http.get(
        `${this.apiUrl}/api/storeInventory/generateStoreInventoryAbstractReportXLS?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&storeCode=${storeCode}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
  }

  private _filterStore(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allStores.filter((name) => name.toLowerCase().includes(filterValue));
  }

  onStoreSelected(value: string): void {
    const code = value.split('-');
    const store = this.storeData.find((v) => v.storeCode === code[0]);
    this.storeCode = store.storeCode;
  }
}
