import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DivisionalBudgetHeadService } from '../../../services/divisional-budget-head.service';
import { environment } from '../../../../environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';

@Component({
  selector: 'app-budget-abstract-report',
  templateUrl: './budget-abstract-report.component.html',
  styleUrls: ['./budget-abstract-report.component.scss'],
})
export class BudgetAbstractReportComponent implements OnInit {
  formGroup: FormGroup;
  selectedWorkOrderNumber: string;
  workOrders: any[] = [
    { number: 1, financialYear: '2023-24', divisionOffice: 'Division1' },
  ];

  selectedWorkOrder: any;
  divisionOptions: any[] = [];
  divisionOffice: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private divisionalbudgetheadservice: DivisionalBudgetHeadService
  ) {}

  ngOnInit() {
    const filters: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    };
    this.formGroup = this.formBuilder.group({
      financialYear: ['', [Validators.required]],
      divisionOffice: ['', [Validators.required]],
    });
    this.route.paramMap.subscribe(async (route: ParamMap) => {
      this.divisionOffice =
        await this.divisionalbudgetheadservice.getDivisionOfficeId(filters);
      this.divisionOptions = this.divisionOffice.map((data: any) => ({
        divisionCode: data.officeCode,
        divisionName: data.officeName,
        officeMasterId: data.officeMasterId,
      }));
      console.log('Divisional Office ===> ', this.divisionOffice);
    });
  }

  handleWorkOrderSelection() {
    const selectedWorkOrderNumber = this.selectedWorkOrderNumber;
    this.selectedWorkOrder = this.workOrders.find(
      (order) => order.number.toString() === selectedWorkOrderNumber
    );
  }

  pdfType: string = 'pdf';
  onRadioChange(val) {
    console.log(val);
    this.pdfType = val;
  }

  async generateBudgetAbstractReport() {
    Object.keys(this.formGroup.controls).forEach((key) => {
      this.formGroup.get(key)?.markAsTouched();
    });
    if (this.isValidForm()) {
      this.getPdf().subscribe((data: any) => {
        const blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Budget Abstract Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }      });
    }
  }

  error: any = '';
  isValidForm(): boolean {
    if (
      this.formGroup.get('divisionOffice').invalid ||
      this.formGroup.get('financialYear').invalid
    ) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const divisionOfficeId = this.formGroup.value.divisionOffice;
    const financialYear = this.formGroup.value.financialYear;
    return this.http.get(
      `${environment.baseURL}/api/divisionalBudget/generateBudgetAbstractPDFReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&divisionOfficeId=${divisionOfficeId}&financialYear=${financialYear}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const divisionOfficeId = this.formGroup.value.divisionOffice;
    const financialYear = this.formGroup.value.financialYear;
    return this.http.get(
      `${environment.baseURL}/api/divisionalBudget/generateBudgetAbstractXLSReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&divisionOfficeId=${divisionOfficeId}&financialYear=${financialYear}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  downloadExcelFile() {
    // if (this.isValidForm()) {
    this.getExcelFile().subscribe((fileData: any) => {
      //  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      const blob: any = new Blob([fileData.body], {
        type: fileData.type,
      });
      let link = document.createElement('a');
      if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Budget Abstract Report.xlsx`);
        document.body.appendChild(link);
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
        document.body.removeChild(link);
      }
    });
  }
}
