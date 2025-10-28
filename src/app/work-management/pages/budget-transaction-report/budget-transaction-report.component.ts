import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DivisionalBudgetHeadService } from '../../../services/divisional-budget-head.service';
import { environment } from '../../../../environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-budget-transaction-report',
  templateUrl: './budget-transaction-report.component.html',
  styleUrls: ['./budget-transaction-report.component.scss'],
})
export class BudgetTransactionReportComponent implements OnInit {
  formGroup: FormGroup;
  @Input() loading: boolean = true;
  errorMessages: { [key: string]: string } = {};
  formSubmitted: boolean = false;
  selectedWorkOrderNumber: string;
  divisionOptions: any[] = [];
  divisionOffice: any;
  accountHeadoptions: any[] = [];
  accountData: any;
  workOrders: any[] = [
    {
      number: 1,
      financialYear: '2023-24',
      divisionOffice: 'Division1',
      divisionalAccountHead: 'division1',
      transactionType: 'add',
      budgetYearType: '',
    },
  ];

  selectedWorkOrder: any;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private divisionalbudgetheadservice: DivisionalBudgetHeadService,
    private loader: LoaderService,
  ) {}

  ngOnInit() {
    this.loader.show('Loading Data');
    this.formGroup = this.formBuilder.group({
      financialYear: ['', [Validators.required]],
      divisionOffice: ['', [Validators.required]],
      divisionAcountHead: ['', [Validators.required]],
      transactionType: ['', [Validators.required]],
      budgetYearType: ['', [Validators.required]],
    });
    this.errorMessages = {
      budgetYearType: 'Please select this field',
      divisionOffice: 'Please select this field',
      divisionAcountHead: 'Please select this field',
      financialYear: 'Please select this field',
      transactionType: 'Please select this field',
    };
    const filters: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    };
    this.route.paramMap.subscribe(async (route: ParamMap) => {
      console.log(route);
      this.divisionOffice =
        await this.divisionalbudgetheadservice.getDivisionOfficeId(filters);
      this.divisionOptions = this.divisionOffice.map((data: any) => ({
        divisionCode: data.officeCode,
        divisionName: data.officeName,
        officeMasterId: data.officeMasterId,
      }));
      this.accountData =
        await this.divisionalbudgetheadservice.getDivisionAccountHeadData(
          filters
        );
        this.accountData.sort((a: any, b: any) => {
          if (a.accountHeadCode < b.accountHeadCode) {
            return -1;
          }
          if (a.accountHeadCode > b.accountHeadCode) {
            return 1;
          }
          return 0;
        });
      this.accountHeadoptions = Array.from(
        new Set(
          this.accountData.map((data: any) => {
            return {
              accountHeadCode: data.accountHeadCode,
              accountHeadMasterId: data.accountHeadMasterId,
            };
          })
        )
      );
    });
    this.loader.hide(); 
  }
  getErrorMessage(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (control && control.hasError('required')) {
      return this.errorMessages[controlName];
    } else if (control && !control.value) {
      return (
        'Please select a value for ' +
        controlName.replace(/([A-Z])/g, ' $1').toLowerCase()
      );
    }
    return '';
  }
  error: any = '';
  isValidForm(): boolean {
    if (
      this.formGroup.get('divisionOffice').invalid ||
      this.formGroup.get('financialYear').invalid ||
      this.formGroup.get('divisionAcountHead').invalid ||
      this.formGroup.get('transactionType').invalid ||
      this.formGroup.get('budgetYearType').invalid
    ) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);

      return false;
    } else {
      this.error = '';
      return true;
    }
  }

  handleWorkOrderSelection() {
    const selectedWorkOrderNumber = this.selectedWorkOrderNumber;
    this.selectedWorkOrder = this.workOrders.find(
      (order) => order.number.toString() === selectedWorkOrderNumber
    );
  }

  pdfType: string = 'pdf';
  onRadioChange(val) {
    this.pdfType = val;
  }

  async generateBudgetTransactionReport() {
    this.formSubmitted = true;
    if (this.isValidForm() && this.formGroup.valid) {
      this.getPdf().subscribe((data: any) => {
        const blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Budget Transaction Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
      });
    }
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const divisionalBudgetDetailsId = this.formGroup.value.divisionAcountHead;
    const budgetYearType = this.formGroup.value.budgetYearType;
    if (budgetYearType == 'spillover') {
      return this.http.get(
        `${environment.baseURL}/api/budgetTransactions/generateBudgetTransactionsPDFReportForSpillover?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&divisionalBudgetDetailsId=${divisionalBudgetDetailsId}&budgetYearType=${budgetYearType}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (budgetYearType == 'current_year') {
      return this.http.get(
        `${environment.baseURL}/api/budgetTransactions/generateBudgetTransactionsPDFReportForCurrentYear?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&divisionalBudgetDetailsId=${divisionalBudgetDetailsId}&budgetYearType=${budgetYearType}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
  }

  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const divisionalBudgetDetailsId = this.formGroup.value.divisionAcountHead;
    const budgetYearType = this.formGroup.value.budgetYearType;
    return this.http.get(
      `${environment.baseURL}/api/budgetTransactions/generateBudgetTransactionXLSReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&divisionalBudgetDetailsId=${divisionalBudgetDetailsId}&budgetYearType=${budgetYearType}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  downloadExcelFile() {
    this.formSubmitted = true;
    if (this.isValidForm() && this.formGroup.valid) {
      this.getExcelFile().subscribe((fileData: any) => {
        //  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        const blob: any = new Blob([fileData.body], {
          type: fileData.type,
        });
        let link = document.createElement('a');
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `Budget Transaction Report.xlsx`);
          document.body.appendChild(link);
          if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
          document.body.removeChild(link);
        }
      });
    }
  }
}
