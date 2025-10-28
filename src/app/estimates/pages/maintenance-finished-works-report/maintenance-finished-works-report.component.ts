import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
const maintenanceFinishedForm = new FormGroup({
  maintenanceType: new FormControl('', [Validators.required]),
  assetType: new FormControl('', [Validators.required]),
  fromDate: new FormControl('', [Validators.required]),
  toDate: new FormControl('', [Validators.required]),
  outputFormat: new FormControl('pdf', [Validators.required]),
});

@Component({
  selector: 'app-maintenance-finished-works-report',
  templateUrl: './maintenance-finished-works-report.component.html',
  styleUrls: ['./maintenance-finished-works-report.component.scss'],
})
export class MaintenanceFinishedWorksReportComponent implements OnInit {
  maintenanceFinishedForm: FormGroup = maintenanceFinishedForm;
  assetTypeData: any[] = [];
  blob: any;
  error: string = '';
  assetType: string = '';
  maintenanceType: string = '';
  apiUrl = environment.baseURL;
  formSubmitted: boolean = false;
  constructor(
    private configurationService: ConfigurationService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.assetTypeData = await this.configurationService.getAssetTypeGetAllData(
      filter
    );
    console.log('assetTypeData', this.assetTypeData);
    this.resetForm();
  }
  resetForm() {
    this.maintenanceFinishedForm = new FormGroup({
      maintenanceType: new FormControl('', [Validators.required]),
      assetType: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      toDate: new FormControl('', [Validators.required]),
      outputFormat: new FormControl('pdf', [Validators.required]),
    });
  }

  pdfType: string = 'pdf';
  onRadioChange(val) {
    this.pdfType = val;
  }

  async generateMaintenanceFinishedReport() {
    this.formSubmitted = true;
    if (this.isValidForm() && this.maintenanceFinishedForm.valid) {
      this.getPdf().subscribe((data: any) => {
        const blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Maintenance Finished Works Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }      });
    }
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const assetType = this.maintenanceFinishedForm.get('assetType').value;
    const maintenanceType =
      this.maintenanceFinishedForm.get('maintenanceType').value;
    const fromDate = this.maintenanceFinishedForm.get('fromDate').value;
    const toDate = this.maintenanceFinishedForm.get('toDate').value;
    return this.http.get(
      `${environment.baseURL}/api/maintenanceWorkReports/generateFinishedWorkReport?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&assetType=${assetType}&maintenanceType=${maintenanceType}&fromDate=${fromDate}&toDate=${toDate}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  downloadExcelFile() {
    this.formSubmitted = true;
    if (this.isValidForm() && this.maintenanceFinishedForm.valid) {
      this.getExcelFile().subscribe((fileData: any) => {
        const blob: any = new Blob([fileData.body], {
          type: fileData.type,
        });
        let link = document.createElement('a');
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute(
            'download',
            `Maintenance Finished Works Report.xlsx`
          );
          document.body.appendChild(link);
          if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }          document.body.removeChild(link);
        }
      });
    }
  }

  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const assetType = this.maintenanceFinishedForm.get('assetType').value;
    const maintenanceType =
      this.maintenanceFinishedForm.get('maintenanceType').value;
    const fromDate = this.maintenanceFinishedForm.get('fromDate').value;
    const toDate = this.maintenanceFinishedForm.get('toDate').value;
    return this.http.get(
      `${environment.baseURL}/api/maintenanceWorkReports/generateFinishedWorkReportXLS?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&assetType=${assetType}&maintenanceType=${maintenanceType}&fromDate=${fromDate}&toDate=${toDate}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
  isValidForm(): boolean {
    this.maintenanceFinishedForm.markAllAsTouched();
    console.log('Form Valid?', this.maintenanceFinishedForm.valid);
    let hasError = false;
    Object.keys(this.maintenanceFinishedForm.controls).forEach((key) => {
      const control = this.maintenanceFinishedForm.get(key);
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
