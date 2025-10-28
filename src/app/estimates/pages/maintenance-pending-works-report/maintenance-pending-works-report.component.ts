import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
const maintenancePendingForm = new FormGroup({
  maintenanceType: new FormControl('', [Validators.required]),
  assetType: new FormControl('', [Validators.required]),
  fromDate: new FormControl('', [Validators.required]),
  toDate: new FormControl('', [Validators.required]),
  outputFormat: new FormControl('pdf', [Validators.required]),
});
@Component({
  selector: 'app-maintenance-pending-works-report',
  templateUrl: './maintenance-pending-works-report.component.html',
  styleUrls: ['./maintenance-pending-works-report.component.scss'],
})
export class MaintenancePendingWorksReportComponent implements OnInit {
  maintenancePendingForm: FormGroup = maintenancePendingForm;
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
    this.maintenancePendingForm = new FormGroup({
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

  async generateMaintenancePendingReport() {
    this.formSubmitted = true;
    if (this.isValidForm() && this.maintenancePendingForm.valid) {
      this.getPdf().subscribe((data: any) => {
        const blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Maintenance Pending Works Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }      });
    }
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const assetType = this.maintenancePendingForm.get('assetType').value;
    const maintenanceType =
      this.maintenancePendingForm.get('maintenanceType').value;
    const fromDate = this.maintenancePendingForm.get('fromDate').value;
    const toDate = this.maintenancePendingForm.get('toDate').value;
    return this.http.get(
      `${environment.baseURL}/api/maintenanceWorkReports/generatePendingWorkReport?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&assetType=${assetType}&maintenanceType=${maintenanceType}&fromDate=${fromDate}&toDate=${toDate}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  downloadExcelFile() {
    this.formSubmitted = true;
    if (this.isValidForm() && this.maintenancePendingForm.valid) {
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
            `Maintenance Pending Works Report.xlsx`
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
    const assetType = this.maintenancePendingForm.get('assetType').value;
    const maintenanceType =
      this.maintenancePendingForm.get('maintenanceType').value;
    const fromDate = this.maintenancePendingForm.get('fromDate').value;
    const toDate = this.maintenancePendingForm.get('toDate').value;
    return this.http.get(
      `${environment.baseURL}/api/maintenanceWorkReports/generatePendingWorkReportXLS?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&assetType=${assetType}&maintenanceType=${maintenanceType}&fromDate=${fromDate}&toDate=${toDate}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
  isValidForm(): boolean {
    this.maintenancePendingForm.markAllAsTouched();
    console.log('Form Valid?', this.maintenancePendingForm.valid);
    let hasError = false;
    Object.keys(this.maintenancePendingForm.controls).forEach((key) => {
      const control = this.maintenancePendingForm.get(key);
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
