import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { UploadMaterialService } from 'src/app/services/upload-material.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { LoaderService } from 'src/app/services/loader.service';
const uploadInvoiceReport = new FormGroup({
  storeCode: new FormControl('', [Validators.required]),
  uploadfiletype: new FormControl('', [Validators.required]),
  file: new FormControl('', [Validators.required]),
  remarks: new FormControl('pdf', [Validators.required]), 
});
@Component({
  selector: 'app-upload-invoice',
  templateUrl: './upload-invoice.component.html',
  styleUrls: ['./upload-invoice.component.scss'],
})
export class UploadInvoiceComponent implements OnInit {
  data: any = [];
  saveData: any = {};
  storeData: any = [];
  file: any;
  uploadInvoiceReport: FormGroup = uploadInvoiceReport;
  error: string;
  fileSizeError: boolean = false;
  apiUrl =environment.baseURL;
  disableUploadButton: boolean = false;
  isLoading: boolean = false;
  uploadButtonText: string = 'Upload';
  
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private uploadMaterialService: UploadMaterialService,
    private snackbar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private loader:LoaderService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      console.log(params);
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeId = sessionStorage.getItem('office-id');
      this.storeData = await this.uploadMaterialService.getUploadMaterialStoreData({
        apiKey,
        serviceKey,
        userCode,
        userRole,
        userName,
        officeId,
      });
      console.log(this.storeData);
    });
    this.resetForm();
  }
  resetForm() {
    this.uploadInvoiceReport = new FormGroup({
      storeCode: new FormControl('', [Validators.required]),
      uploadfiletype: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      remarks:new FormControl('',[Validators.required])
    });
  }
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
  
    const selectedFile = target.files[0];
    const fileSizeInMB = selectedFile.size / (1024 * 1024);
  
    if (fileSizeInMB >5) {
      this.fileSizeError = true;
      this.uploadInvoiceReport.get('file').setErrors({ 'fileSize': true });
    } else {
      this.fileSizeError = false;
      if (selectedFile.name == 'Non_Serial_No_Upload.xlsx') {
        this.saveData.docType = 'Non-Serial';
      } else if (selectedFile.name == 'SM_Meter_Upload.xlsx') {
        this.saveData.docType = 'mtr';
      } else if (selectedFile.name == 'SM_Transformer_Upload.xlsx') {
        this.saveData.docType = 'dtc';
      }
      this.file = selectedFile;
    }
  }
    blob: any;
    showData: any = {};
    showtable: boolean = false;
    async submitUploadMaterial() {
      this.loader.show('Data Submitting...');
      let formData = new FormData();
      formData.append('multipartFile', this.file);
    
       // Define the session data for easy access
        const sessionData = {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          storeOfficeId: this.saveData.store,
          storeCode: this.saveData.storeCode,
          remarks: this.saveData.Remarks,
          docType: this.saveData.docType,
        };

        // Call the API and handle the response
        await this.uploadMaterialService
          .saveUploadMaterial(sessionData, formData)
          .subscribe(
            (responseBlob: HttpResponse<any>) => {
              this.isLoading = false; // Hide loading indicator
              this.loader.hide();
              
              const contentType = responseBlob.headers.get('Content-Type');
              
              if (contentType?.includes('application/json')) {
                // Handle JSON response
                const jsonResponse = responseBlob.body;
                if (jsonResponse?.messageType.toLowerCase().includes('failure')) {
                  this.snackbar.open(
                    jsonResponse?.messageText,
                    'OK',
                    {
                      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
                      duration: 5000,
                    }
                  );
                }
              } else if (contentType?.includes('application/octet-stream') || contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                // Handle binary file response (e.g., Excel file download)
                const contentDisposition = responseBlob.headers.get('Content-Disposition');
                const matches = /filename="([^"]*)"/.exec(contentDisposition);
                const fileName = matches && matches[1] ? matches[1] : 'default_filename.xlsx'; // Fallback filename
                this.snackbar.open(
                  'Please check the downloaded file and if there are any errors, correct any failed data before re-uploading.',
                  'OK',
                  {
                    verticalPosition: cordova !== undefined ? 'bottom' : 'top',
                    duration: 5000,
                  }
                ).afterDismissed().subscribe(() => {
                  // Refresh the page when snackbar is dismissed (user clicks "OK")
                  window.location.reload();
                });
                

                // Handle the file download
                const fileURL = URL.createObjectURL(responseBlob.body);
                const a = document.createElement('a');
                a.href = fileURL;
                a.download = fileName; // Set the filename for the download

                a.click(); // Trigger the download
                URL.revokeObjectURL(fileURL); // Clean up the object URL
              }
            },
            (error) => {
              this.isLoading = false; // Hide loading indicator on error
              this.loader.hide();
              console.error('Error downloading file', error);
            }
          );

      }

    onClose(){
      // this.router.navigate([`./store-management/upload-invoice`])
      this.uploadInvoiceReport.reset();
      this.showtable = false;
      this.disableUploadButton = false;
    }
  

  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    return this.http.get(
      `${this.apiUrl}/api/smInventoryUploadMaterialsLog/getExceptionLogExcel?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&portedFileName=${this.showData.fileName}&portingDate=${this.showData.uploadDate}&portingBy=${this.showData.userId}`,
      { observe: 'response', responseType: 'blob' },
    );
  }

  openConfirmationpopupDialog() {
    this.uploadInvoiceReport.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.disableUploadButton = true;
        this.submitUploadMaterial();
      }
    });
  }
  }
  isValidForm(): boolean {
    this.uploadInvoiceReport.markAllAsTouched();
    console.log('Form Valid?', this.uploadInvoiceReport.valid);
    let hasError = false;
    Object.keys(this.uploadInvoiceReport.controls).forEach((key) => {
      const control = this.uploadInvoiceReport.get(key);
  
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
  onStoreChange(event) {
    const storeData = this.storeData.find((store) => store.storeMasterId == event);

    this.saveData.storeCode = storeData.storeCode;
    this.saveData.store = event;
  }

  downloadExcelFile() {
    this.getExcelFile().subscribe((fileData: any) => {
      //  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      const blob: any = new Blob([fileData.body], {
        type: fileData.type,
      });
      let link = document.createElement('a');
      if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `exceptions_log.xlsx`);
        document.body.appendChild(link);
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
        document.body.removeChild(link);
      }
    });
  }
}
