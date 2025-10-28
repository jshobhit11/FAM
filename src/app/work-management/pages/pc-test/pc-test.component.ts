import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AssetService } from 'src/app/services/asset.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import { AbstractControl } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { MobileUtils } from 'src/app/lib/mobile-utils';

export function fileSizeValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  const file = control.value;
  if (file instanceof FileList) {
    const fileSize = file[0].size || 0;
    const fileSizeInMB = fileSize / (1024 * 1024);
    return fileSizeInMB > 5 ? { fileSize: true } : null;
  }
  return null;
}
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
const pcTestForm = new FormGroup({
  pcTestDate: new FormControl('', [Validators.required]),
  remarks: new FormControl('pdf', [Validators.required]),
  reportType: new FormControl('', [Validators.required]),
});
interface FilterData {
  serviceRegistrationsId: string;
  discom: string;
  serviceRequestNo: string;
  requestedDate: string;
  caseId: string;
  accountId: string;
  problemDescription: string;
}
@Component({
  selector: 'app-pc-test',
  templateUrl: './pc-test.component.html',
  styleUrls: ['./pc-test.component.scss'],
})
export class PcTestComponent implements OnInit {
  blob: any;
  remarks: string = '';
  discom = '';
  serviceRegistrationsId = '';
  serviceRequestNo = '';
  pcTestDate = '';
  requestedDate = '';
  workOrderNo: string = '';
  workOrderDate: string = '';
  caseId: string = '';
  accountId: string = '';
  problemDescription: string = '';
  ccbServiceRequestId: any;
  data: any = {};

  filterData: FilterData = {
    discom: '',
    serviceRequestNo: '',
    serviceRegistrationsId: '',
    requestedDate: '',
    caseId: '',
    accountId: '',
    problemDescription: '',
  };
  isDataLoaded = false;
  isInvalidInput: boolean = false;
  isLoading: boolean = false;
  pcReportHt: boolean = false;
  pcReportLt: boolean =false;
  error: string;
  pcTestForm: FormGroup = pcTestForm;

  @ViewChild('pdfFileInput', { static: false }) pdfFileInput: ElementRef;
  fileSizeError = false;
  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    private snackbar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: LoaderService,
    private http: HttpClient
  ) {
    this.pcTestForm = this.fb.group({
      pdfFile: [null, [Validators.required, fileSizeValidator]],
      pcTestDate: new Date(this.pcTestDate),
      remarks: '',
      reportType: '',
    });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.loader.show('Data Loading...');
      this.ccbServiceRequestId = params['ccbServiceRequestId'];
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const ccbServiceRequestId = this.ccbServiceRequestId;
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        ccbServiceRequestId,
      };
      this.filterData = await this.assetService.getPcTestGetDataById(filters);
      if (
        this.filterData &&
        this.filterData.requestedDate &&
        this.filterData.caseId &&
        this.filterData.accountId &&
        this.filterData.problemDescription &&
        this.filterData.serviceRegistrationsId
      ) {
        this.pcTestDate = this.filterData.requestedDate;
        this.caseId = this.filterData.caseId;
        this.accountId = this.filterData.accountId;
        this.problemDescription = this.filterData.problemDescription;
        this.serviceRegistrationsId = this.filterData.serviceRegistrationsId;

        this.initializeForm();
      } else {
        console.error('Incomplete or missing data in API response');
      }
      this.loader.hide();
    });
  }

  initializeForm() {
    this.pcTestForm = this.fb.group({
      pdfFile: [null, [Validators.required, fileSizeValidator]],
      pcTestDate: [new Date(this.pcTestDate), [Validators.required]],
      remarks: '',
      reportType: '',
    });
  }

  onFileChange(event: any) {
    const selectedFile = event.target.files[0];
    console.log('selectedFile===', event.target.files[0].name);

    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      if (fileSizeInMB > 5) {
        this.fileSizeError = true;
        this.pcTestForm.get('pdfFile').setValue(null);
      } else {
        this.fileSizeError = false;
        console.log('Selected File Size:', fileSizeInMB, 'MB');
      }
    }
  }
  downloadLtFile() {
    const fileName = 'LT_PC_test_sheet.xlsx';
    const filePath = `./assets/${fileName}`;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    if (typeof cordova !== 'undefined') {
      MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob);
    } else {
      link.click();
    }
    document.body.removeChild(link);
  }
  downloadHtFile() {
    const fileName = 'HT_PCT_test_sheet.xlsx';
    const filePath = `./assets/${fileName}`;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    if (typeof cordova !== 'undefined') {
      MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob);
    } else {
      link.click();
    }
    document.body.removeChild(link);
  }
  // async documentSaveData() {
  //   const apiKey = sessionStorage.getItem('api-key');
  //   const serviceKey = sessionStorage.getItem('service-key');
  //   const userRole = sessionStorage.getItem('user-role');
  //   const userName = sessionStorage.getItem('user-name');
  //   const userCode = sessionStorage.getItem('user-code');
  //   const documentName = this.pdfFileInput.nativeElement.files[0].name;
  //   const documentReferenceNumber = this.filterData.caseId;
  //   const serviceRegisterationsId = this.filterData.serviceRegistrationsId;
  //   const selectedFile = this.pdfFileInput.nativeElement.files[0];
  //   const processName = 'pc test report';

  //   if (this.pcTestForm.invalid) {
  //     console.error('Form is invalid. Cannot proceed with save operation.');
  //     this.pcTestForm.markAllAsTouched();
  //     return;
  //   }
  //   if (!selectedFile) {
  //     console.error('Please select a file before proceeding.');
  //     this.pcTestForm.get('pdfFile').setErrors({ required: true });
  //     return;
  //   }

  //   if (!documentName || !selectedFile) {
  //     console.error('Data is missing. Cannot proceed with save operation.');
  //     return;
  //   }
  //   console.log('Selected File:', selectedFile);
  //   try {
  //     const submited = await this.assetService.getDocumentUploadSaveData(
  //       apiKey,
  //       serviceKey,
  //       userCode,
  //       userName,
  //       userRole,
  //       documentName,
  //       documentReferenceNumber,
  //       serviceRegisterationsId,
  //       processName,
  //       selectedFile,
  //     );

  //     console.log(submited);
  //     if (submited.messageType === 'SUCCESS') {
  //      this.snackBar
  //         .open(submited.messageText || 'Data Saved Successfully', 'OK', {
  //           verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //         })
  //         .onAction()
  //         .subscribe(() => {
  //           this.snackBar.dismiss();
  //           this.router.navigate(['/store-management/gate-pass-acknowledgement']);
  //         });
  //     } else {
  //       this.snackBar.open(submited.messageText || 'An error occurred', 'OK', {
  //         verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     this.snackBar.open('An error occurred while saving the data', 'OK', {
  //       verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //     });
  //   }
  // }

  onInputChange(event: any) {
    const input = event.target.value;
    this.isInvalidInput = !/^[0-9]*$/.test(input);
  }

  openConfirmationpopupDialog() {
    if (this.pcTestForm.invalid) {
      this.pcTestForm.markAllAsTouched();
      return;
    }

    const selectedFile = this.pdfFileInput.nativeElement.files[0];
    if (!selectedFile) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        // this.documentSaveData();
        this.submit();
      }
    });
  }

  async submit() {
    try {
      const selectedFile = this.pdfFileInput.nativeElement.files[0];
      if (!selectedFile) {
        this.snackbar.open('Please select a file to upload.', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return;
      }

      const pcTestDate = this.pcTestForm.value.pcTestDate
        ? new Date(this.pcTestForm.value.pcTestDate).toISOString().split('T')[0]
        : null;
      const reportType = this.pcTestForm.value.reportType;
      const payload = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        serviceRequestNo: this.filterData.serviceRequestNo,
        serviceRegistrationsId: this.filterData.serviceRegistrationsId,
        pcTestDate: pcTestDate,
        remarks: this.pcTestForm.value.remarks,
      };

      this.isLoading = true;
      if (reportType === 'HT') {
        await this.uploadHtReport(payload, selectedFile);
      } else if (reportType === 'LT') {
        await this.uploadLtReport(payload, selectedFile);
      } else {
        this.snackbar.open('Please select a report type (HT or LT).', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return;
      }
    } catch (error) {
      console.error('Error during submission:', error);
      this.snackbar
        .open('Unexpected error occurred. Please try again later.', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => this.snackbar.dismiss());
    } finally {
      this.isLoading = false;
    }
  }

  async uploadHtReport(payload: any, selectedFile: File) {
    try {
      const res = await this.assetService.uploadHTPcTestDetails(
        payload,
        selectedFile
      );
      if (res?.messageType === 'SUCCESS') {
        this.pcReportHt = true;
        this.snackbar
          .open('HT Report Uploaded Successfully!', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => this.snackbar.dismiss());
        this.pcTestForm.reset();
      } else {
        const errorMessage = res?.messageText;
        this.snackbar
          .open(errorMessage, 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => this.snackbar.dismiss());
      }
    } catch (error) {
      console.error('Error uploading HT Report:', error);
      this.snackbar
        .open('Error uploading HT Report. Please try again.', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => this.snackbar.dismiss());
    }
  }

  async uploadLtReport(payload: any, selectedFile: File) {
    try {
      const res = await this.assetService.uploadLTPcTestDetails(
        payload,
        selectedFile
      );
      if (res?.messageType === 'SUCCESS') {
        this.pcReportLt = true;
        this.snackbar
          .open('LT Report Uploaded Successfully!', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => this.snackbar.dismiss());
        this.pcTestForm.reset();
      } else {
        const errorMessage = res?.messageText;
        this.snackbar
          .open(errorMessage, 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => this.snackbar.dismiss());
      }
    } catch (error) {
      console.error('Error uploading LT Report:', error);
      this.snackbar
        .open('Error uploading LT Report. Please try again.', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => this.snackbar.dismiss());
    }
  }

  isValidForm(): boolean {
    this.pcTestForm.markAllAsTouched();
    console.log('Form Valid?', this.pcTestForm.valid);
    let hasError = false;
    Object.keys(this.pcTestForm.controls).forEach((key) => {
      const control = this.pcTestForm.get(key);

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

  async generatePcLtTestReport() {
    this.getLtPdf().subscribe(
      (data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'LT PC Test Report' + '.pdf';
        if (typeof cordova !== 'undefined') {
          MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob);
        } else {
          link.click();
        }
      }
    );
  }
  getLtPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
      return this.http.get(
        `${environment.baseURL}/api/pcTest/generatePcTestReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationsId=${this.serviceRegistrationsId}`,
        { observe: 'response', responseType: 'blob' }
      );
    
  }
  async generateHtPcTestReport() {
    this.getHtPdf().subscribe(
      (data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'HT PC Test Report' + '.pdf';
        if (typeof cordova !== 'undefined') {
          MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob);
        } else {
          link.click();
        }
      }
    );
  }
  getHtPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
      return this.http.get(
        `${environment.baseURL}/api/pcTest/generateHtPcTestReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationsId=${this.serviceRegistrationsId}`,
        { observe: 'response', responseType: 'blob' }
      );
    
  }
}
