import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MobileUtils } from 'src/app/lib/mobile-utils';
const cRegisteredForm = new FormGroup({
  workOrderNo: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-cost-registered-report',
  templateUrl: './cost-registered-report.component.html',
  styleUrls: ['./cost-registered-report.component.scss'],
})
export class CostRegisteredReportComponent implements OnInit {
  cRegisteredForm: FormGroup = cRegisteredForm;
  workorder: any;
  submitError: boolean = false;
  error: string;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.resetForm();
    console.log('CostRegisteredReportComponent');
  }
  resetForm() {
    this.cRegisteredForm = new FormGroup({
      workOrderNo: new FormControl('', [Validators.required]),
    });
  }
  getPdf(workorder) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');

    return this.http.get(
      `${environment.baseURL}/api/costRegistered/generateCostRegisteredReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&workorderNo=${workorder}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  async generateWorkAwardReport() {
    this.cRegisteredForm.markAllAsTouched();
    if (this.isValidForm()) {
    this.getPdf(this.workorder).subscribe((data: any) => {
      const blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Cost Registered Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
      this.workorder = '';
    });
  }
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
