import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as dayjs from 'dayjs';
import { BillSubmissionService } from 'src/app/services/bill-submission.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
const billSubmissionForm = new FormGroup({
  billSubmissionDate: new FormControl('', [Validators.required]),
  workAwardedAmount: new FormControl('', [Validators.required]),
  billInvoiceNo: new FormControl('', [Validators.required]),
  remarks: new FormControl('pdf', [Validators.required]), 
});
@Component({
  selector: 'app-bill-submission',
  templateUrl: './bill-submission.component.html',
  styleUrls: ['./bill-submission.component.scss'],
})
export class BillSubmissionComponent implements OnInit {
  remarks: string = '';
  rateContractMasterId = '';
  billInvoiceNo = '';
  billAmount = '';
  billSubmissionDate = '';
  workOrderNo: string = '';
  workOrderDate: string = '';
  estimationno: string = '';
  workExecutionmethod: string = '';
  workdescription: string = '';
  vendormasterId: string = '';
  workorderRegisteredId: any;
  data: any = {};
  filterData = [];
  isDataLoaded = false;
  billSubmissions: any[] = [];
  billSubmissionForm: FormGroup = billSubmissionForm;
  isInvalidInput: boolean = false;
  error: string;
  indianCurrencySymbol: string = '₹';
  workAwardedAmount: any;
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private billSubmissionService: BillSubmissionService,
    private snackbar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private loader: LoaderService,
  ) {}

  async ngOnInit() {
    this.billSubmissionDate = dayjs().format('YYYY-MM-DD');
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      this.workorderRegisteredId = params['workorderRegisteredId'];
      const filters: any = { apiKey, serviceKey, userRole, userName, userCode };
      filters.workorderRegisteredId = this.workorderRegisteredId;
      this.filterData = { ...filters };
      await this.billSubmissionService
        .GetByWorkOrderRegisterId(this.filterData)
        .then((res: any) => {
          console.log('res', res);
          this.workOrderNo = res[0].workorderNo;
          this.workOrderDate = res[0].workorderDate;
          this.estimationno = res[0].estimationNo;
          this.workExecutionmethod = res[0].workExecutionMethod;
          this.workdescription = res[0].workDescription;
          this.vendormasterId = res[0].vendorMasterId;
          this.rateContractMasterId = res[0].rateContractMasterId;
          this.workAwardedAmount=res[0].workAwardedAmount;
          this.isDataLoaded = true; 
          this.cdr.detectChanges(); 
        })
        .catch((error: any) => {
          console.error('Error fetching data:', error);
          this.isDataLoaded = true; 
          this.cdr.detectChanges(); 
        });
    });
    this.resetForm();
  }
  onInputChange(event: any) {
    const input = event.target.value;
    this.isInvalidInput = !/^[0-9]*$/.test(input);
  }
  resetForm() {
    this.billSubmissionForm = new FormGroup({
      billSubmissionDate: new FormControl('', [Validators.required]),
      workAwardedAmount: new FormControl('', [Validators.required]),
      billInvoiceNo: new FormControl('', [Validators.required]),
      remarks:new FormControl('',[Validators.required])
    });
  }
  async submit() {
    this.isLoading = true;
    const filter: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    };
    const params: any = {
      wmWorkorderRegisteredId: this.workorderRegisteredId,
      vendorMasterId: this.vendormasterId,
      rateContractMasterId: this.rateContractMasterId,
      billInvoiceNo: this.billInvoiceNo,
      billAmount: this.workAwardedAmount,
      billSubmissionDate: this.billSubmissionDate,
      remarks: this.remarks,
    };
    console.log('filter', 'params', filter, params);
    const res = await this.billSubmissionService.saveWorkCompletionData(filter, params);
   
  //  if (res) {
  //     const snackBarRef = this.snackbar.open('Data Saved Successfully', 'OK' ,{
  //       verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //     })
  //     snackBarRef.onAction().subscribe() => {
  //     this.snackbar.dismiss();
  //     this.router.navigate(['/work-management', 'work-completion-report']);
  //     this.isLoading = false;
  //   });
  //   }
  if (res) {
    const snackBarRef = this.snackbar.open('Data Saved Successfully', 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    });
    snackBarRef.onAction().subscribe(() => {
      this.snackbar.dismiss();
      this.router.navigate(['/work-management', 'work-completion-report']);
      this.isLoading = false;
    });
  }
  }

  openConfirmationpopupDialog() {
     this.billSubmissionForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
        this.submit();
      }
    });
  }
  }
  isValidForm(): boolean {
    this.billSubmissionForm.markAllAsTouched();
    console.log('Form Valid?', this.billSubmissionForm.valid);
    let hasError = false;
    Object.keys(this.billSubmissionForm.controls).forEach((key) => {
      const control = this.billSubmissionForm.get(key);
  
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
