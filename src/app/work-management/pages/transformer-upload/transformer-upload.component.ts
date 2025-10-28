import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { UploadMaterialService } from 'src/app/services/upload-material.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { LoaderService } from 'src/app/services/loader.service';
import * as XLSX from 'xlsx';
const transformerUploadForm = new FormGroup({
  file: new FormControl('', [Validators.required]),
  uploadfiletype: new FormControl('', [Validators.required]),
  remarks: new FormControl('', [Validators.required]),
});

@Component({
  selector: 'app-transformer-upload',
  templateUrl: './transformer-upload.component.html',
  styleUrls: ['./transformer-upload.component.scss'],
})
export class TransformerUploadComponent implements OnInit {
  data: any = [];
  saveData: any = {};
  storeData: any = [];
  file: any;
  transformerUploadForm: FormGroup = transformerUploadForm;
  error: string;
  fileSizeError: boolean = false;
  apiUrl = environment.baseURL;
  fileErrorMessage: string = 'Please select .xlsx or .xls files only.';
  fileSizeErrorMessage: string = 'File size must be up to 1MB.';
  invalidFileTypeMessage: string = 'Only valid files are accepted.';
  selectedUploadType: string;
  notificationRef: MatSnackBarRef<any> | null = null;
  isLoading: boolean = false;
  uploadButtonText: string = 'Upload';

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private uploadMaterialService: UploadMaterialService,
    private snackbar: MatSnackBar,
    private http: HttpClient,
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
      this.storeData =
        await this.uploadMaterialService.getUploadMaterialStoreData({
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
    this.transformerUploadForm = new FormGroup({
      file: new FormControl('', [Validators.required]),
      uploadfiletype: new FormControl('', [Validators.required]),
      remarks: new FormControl('', [Validators.required]),
    });
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;

    if (target.files.length === 0) {
      this.error = 'Please select .xlsx or .xls files only.';
      this.transformerUploadForm.get('file').reset();
      return;
    }

    const selectedFile = target.files[0];
    const fileName = selectedFile.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (fileExtension !== 'xlsx' 
      && fileExtension !== 'xlsm' 
      && fileExtension !== 'xls') {
      this.error = 'Only .xlsx,.xlsm and .xls files are accepted.';
      this.transformerUploadForm.get('file').setErrors({ invalidFileType: true });
      this.transformerUploadForm.get('file').reset();
      return;
    }
  
    const maxSizeInBytes = 1 * 1024 * 1024; 
    if (selectedFile.size > maxSizeInBytes) {
      this.fileSizeError = true;
      this.error = 'File size must be less than 1MB.';
      this.transformerUploadForm.get('file').setErrors({ fileSize: true });
      this.transformerUploadForm.get('file').reset();
    } else {
      this.fileSizeError = false;
      this.error = '';
      this.file = selectedFile;
    }
    // const reader: FileReader = new FileReader();
    // reader.readAsBinaryString(target.files[0]);
    // reader.onload = async (e: any) => {
    //   const binaryStr = e.target.result as string;
    //   const workBook = XLSX.read(binaryStr, { type: 'binary' }) as XLSX.WorkBook;

    //   if (workBook.SheetNames[1]) {
    //     const workSheetName = workBook.SheetNames[1] as string;
    //     const workSheet = workBook.Sheets[workSheetName] as XLSX.WorkSheet;
  
    //     const cellValue = workSheet['A1']?.v;
    //     if (cellValue === 'Valid') {
    //       const data = XLSX.utils.sheet_to_json(workSheet) as Array<any>;

    //     } else {

    //       this.snackbar.open('Please upload fully validated Excel sheet.', 'Close', {
    //         duration: 3000,
    //       });
    //     }
    //   } else {
    //     this.snackbar.open('Please upload fully validated Excel sheet.', 'Close', {
    //       duration: 3000,
    //     });
    //   }
    // };
 
  }
  showData: any = {};
  showtable: boolean = false;
  
  // async submitUploadMaterial() {
  //   this.loader.show('Data Submitting...');
  //   this.selectedUploadType = this.transformerUploadForm.get('uploadfiletype').value;
  //   let formData = new FormData();
  //   formData.append('multipartFile', this.file);
    
  //   const sessionData = {
  //     apiKey: sessionStorage.getItem('api-key'),
  //     serviceKey: sessionStorage.getItem('service-key'),
  //     userRole: sessionStorage.getItem('user-role'),
  //     userName: sessionStorage.getItem('user-name'),
  //     userCode: sessionStorage.getItem('user-code'),
  //   };
  
  //   const handleResponse = (submit: any) => {
  //     return submit; 
  //   };
  
  //   this.isLoading = true; 
  //   try {
  //     let submit;
  //     if (this.selectedUploadType === 'meter') {
  //       submit = await this.uploadMaterialService.saveMeterByWorkOrderUpload(sessionData, formData);
  //     } else {
  //       submit = await this.uploadMaterialService.saveTransformerUpload(sessionData, formData);
  //     }
  //     this.loader.hide();
  //     const response = handleResponse(submit);
  //     if (response.messageText) {
  //       const MatSnackBarRef = this.snackbar.open(response.messageText, 'OK', {
  //         verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //       });
        
  //       MatSnackBarRef.onAction().subscribe(() => {
  //         this.snackbar.dismiss();
  //         this.isLoading = false; 
  //         this.transformerUploadForm.reset();
  //       });
  //     }
  
  //   } catch (error) {
  //     this.loader.hide()
  //     let messageText = '';
  //     if (error?.error && error.error.messageText) {
  //       messageText = error.error.messageText; 
  //     } else if (error?.details?.messageText) {
  //       messageText = error.details.messageText; 
  //     } else if (typeof error === 'string') {
  //       messageText = error;
  //     } else {
  //       messageText = 'An unexpected error occurred.';
  //     } 
  //    const MatSnackBarRef = this.snackbar.open(messageText, 'OK', {
  //       verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //     });
  //     MatSnackBarRef.onAction().subscribe(()=>{
  //       this.snackbar.dismiss();
  //       this.transformerUploadForm.reset(); 
  //       this.isLoading = false; 
  //     })
  //   }
  // }

  reloadPage(){
    window.location.reload(); // This will reload the entire page
  }
  // async submitUploadMaterial() {
  //   this.loader.show('Data Submitting...');
  //   this.selectedUploadType = this.transformerUploadForm.get('uploadfiletype').value;
  //   let formData = new FormData();
  //   formData.append('multipartFile', this.file);
    
  //   const sessionData = {
  //     apiKey: sessionStorage.getItem('api-key'),
  //     serviceKey: sessionStorage.getItem('service-key'),
  //     userRole: sessionStorage.getItem('user-role'),
  //     userName: sessionStorage.getItem('user-name'),
  //     userCode: sessionStorage.getItem('user-code'),
  //   };

  //   try {
  //     if (this.selectedUploadType === 'meter') {
  //       await this.uploadMaterialService.
  //       saveMeterByWorkOrderUpload(sessionData, formData)
  //       .subscribe(
  //         (responseBlob: HttpResponse<any>) => {
  //           this.isLoading = true;
  //           this.loader.hide();
  //           const contentType = responseBlob.headers.get('Content-Type');
  
  //           if (contentType?.includes('application/json')) {
  //             // Handle JSON response
  //             const jsonResponse = responseBlob.body;
  //             if (jsonResponse?.message.toLowerCase().includes('FAILURE')) {
  //                      this.snackbar.open(
  //                       jsonResponse?.messageText,
  //                       'OK',
  //                       {
  //                         verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //                         duration: 5000,
  //                       }
  //                     );
  //             }
  //           }
  //           else if (contentType?.includes('application/octet-stream') || contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) { 
  //            // Extract filename from Content-Disposition header
  //           const contentDisposition = responseBlob.headers.get('Content-Disposition');
  //           const matches = /filename="([^"]*)"/.exec(contentDisposition);
  //           const fileName = matches && matches[1] ? matches[1] : 'default_filename.xlsx'; // Fallback filename
  
  //           if (fileName.toLowerCase().includes('success')) {
  //                   this.uploadButtonText = 'Upload Success';  // Change the button text to "Success"
  //            }else{
  //             this.uploadButtonText = 'Upload Failure';  // Change the button text to "Failure"
  //             this.snackbar.open(
  //               'Please Check the Downloads for Excel data Corrections.',
  //               'OK',
  //               {
  //                 verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //                 duration: 5000,
  //               }
  //             );
  //            }
  //           // Handle the file download (binary file or other)
  //           const fileURL = URL.createObjectURL(responseBlob.body);
  //           const a = document.createElement('a');
  //           a.href = fileURL;
  //           a.download = fileName; // Set the filename for the download
  
  
  //           a.click(); // Trigger the download
  //           URL.revokeObjectURL(fileURL); // Clean up the object URL
  //         }
  //         },
  //         (error) => {
  //           this.isLoading = true;
  //           this.loader.hide();
  //           console.error('Error downloading file', error);
  //         }
  //       );
  //     } else {
  //         await this.uploadMaterialService
  //         .saveTransformerUpload(sessionData, formData)
  //         .subscribe(
  //           (responseBlob: HttpResponse<any>) => {
  //             this.isLoading = true;
  //             this.loader.hide();
  //             const contentType = responseBlob.headers.get('Content-Type');
    
  //             if (contentType?.includes('application/json')) {
  //               // Handle JSON response
  //               const jsonResponse = responseBlob.body;
  //               if (jsonResponse?.message.toLowerCase().includes('FAILURE')) {
  //                        this.snackbar.open(
  //                         jsonResponse?.messageText,
  //                         'OK',
  //                         {
  //                           verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //                           duration: 5000,
  //                         }
  //                       );
  //               }
  //             }
  //             else if (contentType?.includes('application/octet-stream') || contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) { 
  //              // Extract filename from Content-Disposition header
  //             const contentDisposition = responseBlob.headers.get('Content-Disposition');
  //             const matches = /filename="([^"]*)"/.exec(contentDisposition);
  //             const fileName = matches && matches[1] ? matches[1] : 'default_filename.xlsx'; // Fallback filename
    
  //             if (fileName.toLowerCase().includes('success')) {
  //                     this.uploadButtonText = 'Upload Success';  // Change the button text to "Success"
  //              }else{
  //               this.uploadButtonText = 'Upload Failure';  // Change the button text to "Failure"
  //               this.snackbar.open(
  //                 'Please Check the Downloads for Excel data Corrections.',
  //                 'OK',
  //                 {
  //                   verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //                   duration: 5000,
  //                 }
  //               );
  //              }
  //             // Handle the file download (binary file or other)
  //             const fileURL = URL.createObjectURL(responseBlob.body);
  //             const a = document.createElement('a');
  //             a.href = fileURL;
  //             a.download = fileName; // Set the filename for the download
    
    
  //             a.click(); // Trigger the download
  //             URL.revokeObjectURL(fileURL); // Clean up the object URL
  //           }
  //           },
  //           (error) => {
  //             this.isLoading = true;
  //             this.loader.hide();
  //             console.error('Error downloading file', error);
  //           }
  //         );
  //     }
  
  //   } catch (error) {
  //     this.loader.hide()
  //     let messageText = 'DATA NOT SAVED SUCCESSFULLY, For Department / Labour contract, upload should be done by Store, please raise the indent for this work order.';
  //     if (error?.error && error.error.messageText) {
  //       messageText = error.error.messageText; 
  //     } else if (error?.details?.messageText) {
  //       messageText = error.details.messageText; 
  //     } else if (typeof error === 'string') {
  //       messageText = error;
  //     } else {
  //       messageText = 'An unexpected error occurred.';
  //     } 
  //    const MatSnackBarRef = this.snackbar.open(messageText, 'OK', {
  //       verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //     });
  //     MatSnackBarRef.onAction().subscribe(()=>{
  //       this.snackbar.dismiss();
  //       this.transformerUploadForm.reset(); 
  //       this.isLoading = false; 
  //     })
  //   }
  // }
  async submitUploadMaterial() {
    this.loader.show('Data Submitting...');
    this.selectedUploadType = this.transformerUploadForm.get('uploadfiletype').value;
    let formData = new FormData();
    formData.append('multipartFile', this.file);
  
    const sessionData = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    };
  
    try {
      const uploadService =
        this.selectedUploadType === 'meter'
          ? this.uploadMaterialService.saveMeterByWorkOrderUpload(sessionData, formData)
          : this.uploadMaterialService.saveTransformerUpload(sessionData, formData);
  
      await uploadService.subscribe(
        (responseBlob: HttpResponse<any>) => {
          this.isLoading = true;
          this.loader.hide();
          const contentType = responseBlob.headers.get('Content-Type');
  
          if (contentType?.includes('application/json')) {
            const jsonResponse = responseBlob.body;
            if (jsonResponse?.message.toLowerCase().includes('FAILURE')) {
              this.snackbar.open(jsonResponse.messageText, 'OK', {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              });
            }
          } else if (
            contentType?.includes('application/octet-stream') ||
            contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
          ) {
            const contentDisposition = responseBlob.headers.get('Content-Disposition');
            const matches = /filename="([^"]*)"/.exec(contentDisposition);
            const fileName = matches && matches[1] ? matches[1] : 'default_filename.xlsx';
  
            if (fileName.toLowerCase().includes('success')) {
              this.uploadButtonText = 'Upload Success';
            } else {
              this.uploadButtonText = 'Upload Failure';
              this.snackbar.open('Please Check the Downloads for Excel data Corrections.', 'OK', {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              });
            }
  
            const fileURL = URL.createObjectURL(responseBlob.body);
            const a = document.createElement('a');
            a.href = fileURL;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(fileURL);
          }
        },
        async (error) => {
          this.isLoading = false;
          this.loader.hide();
  
          let errorMessageText = 'DATA NOT SAVED SUCCESSFULLY, For Department / Labour contract, upload should be done by Store, please raise the indent for this work order.';
          if (error.error instanceof Blob) {
            try {
              const errorText = await error.error.text();
              const parsedError = JSON.parse(errorText); 
              errorMessageText = parsedError.messageText || errorMessageText;
            } catch (parseError) {
              console.error('Error parsing the Blob response:', parseError);
            }
          } else if (error.error && typeof error.error === 'object') {
            errorMessageText = error.error.messageText || errorMessageText;
          }
          this.snackbar.open(errorMessageText, 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
  
          console.error('Error response:', error);
        }
      );
    } catch (error) {
      this.loader.hide();
      const messageText =
        error?.error?.messageText || error?.details?.messageText;
      const MatSnackBarRef = this.snackbar.open(messageText, 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      MatSnackBarRef.onAction().subscribe(() => {
        this.snackbar.dismiss();
        this.transformerUploadForm.reset();
        this.isLoading = false;
      });
    }
  }
  
  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    return this.http.get(
      `${this.apiUrl}/api/smInventoryUploadMaterialsLog/getExceptionLogExcel?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&portedFileName=${this.showData.fileName}&portingDate=${this.showData.uploadDate}&portingBy=${this.showData.userId}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  openConfirmationpopupDialog() {
   this.transformerUploadForm.markAllAsTouched();
    if (this.isValidForm()) {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.submitUploadMaterial();
        }else{
           }
      });
    }
  }

  isValidForm(): boolean {
    this.transformerUploadForm.markAllAsTouched();
    console.log('Form Valid?', this.transformerUploadForm.valid);
    let hasError = false;
    Object.keys(this.transformerUploadForm.controls).forEach((key) => {
      const control = this.transformerUploadForm.get(key);
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
    const storeData = this.storeData.find(
      (store) => store.storeMasterId == event
    );

    this.saveData.storeCode = storeData.storeCode;
    this.saveData.store = event;
  }

  resetComponent() {
    this.resetForm(); 
    this.file = null; 
    this.showData = {}; 
    this.showtable = false; 
    this.error = '';
  }

  downloadExcelFile() {
    this.getExcelFile().subscribe((fileData: any) => {
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
