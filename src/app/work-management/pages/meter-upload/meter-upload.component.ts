import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { UploadMaterialService } from 'src/app/services/upload-material.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { startWith, map } from 'rxjs/operators';
import { SuspensePopupComponent } from '../suspense-popup/suspense-popup.component';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { LoaderService } from 'src/app/services/loader.service';
const meterUploadForm = new FormGroup({
  file: new FormControl('', [Validators.required]),
  uploadfiletype: new FormControl('', [Validators.required]),
  remarks: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-meter-upload',
  templateUrl: './meter-upload.component.html',
  styleUrls: ['./meter-upload.component.scss'],
})
export class MeterUploadComponent implements OnInit {
  data: any = [];
  saveData: any = {};
  storeData: any = [];
  meterData: any = [];
  file: any;
  meterUploadForm: FormGroup = meterUploadForm;
  error: string;
  fileSizeError: boolean = false;
  apiUrl = environment.baseURL;
  type: any;
  isMtrProcurementDone: any;
  applicationTypeCode: string;
  wmWorkorderRegisteredId: any;
  materialSearchControl: FormControl;
  filteredMaterialUnits: any[];
  meterListData: any[];
  estimateCharges: FormGroup;
  errorMessage =
    'Procurement letter is not generated, please initiate the procurement letter';
  lineExtensionErrorMessage = 'Line extension is pending in the GIS.';
  errorMessages: string[] = [];
  payload: any;
  isGisNetworkDone: any;
  isNetworkExtension: any;
  selectedOption = 'meterUpload';
  isLoading: boolean = false;
  mIsButtonDisabled:boolean = false;
  vIsButtonDisabled:boolean = false;

  uploadButtonText: string = 'Upload';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private uploadMaterialService: UploadMaterialService,
    private configurationService: ConfigurationService,
    private snackbar: MatSnackBar,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private loader :LoaderService
  ) {
    this.materialSearchControl = new FormControl();
    this.filteredMaterialUnits = [];
    this.meterListData = [];
    this.estimateCharges = this.formBuilder.group({
      materialSearchControl: [''],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      console.log(params);
 
      const wmWorkorderRegisteredId = params['workOrderRegisteredId'];
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeId = sessionStorage.getItem('office-id');
      this.loader.show('Data Loading...');
      this.storeData =
        await this.uploadMaterialService.getUploadMaterialStoreData({
          apiKey,
          serviceKey,
          userCode,
          userRole,
          userName,
          officeId,
        });
      this.meterData =
        await this.uploadMaterialService.GetMeterUploadDataByWmWorkorderRegisteredId(
          {
            apiKey,
            serviceKey,
            userCode,
            userRole,
            userName,
            wmWorkorderRegisteredId,
          }
        );
      this.meterListData =
        await this.configurationService.getSuspenseMeterlistData({
          apiKey,
          serviceKey,
          userCode,
          userName,
          userRole,
        });
      this.wmWorkorderRegisteredId =
        this.meterData?.meterUploadResponseDTO[0]?.wmWorkorderRegisteredId;
      this.applicationTypeCode =
        this.meterData?.meterUploadResponseDTO[0]?.applicationTypeCode;
      this.isMtrProcurementDone =
        this.meterData?.meterUploadResponseDTO[0]?.isMtrProcurmentDone;
      this.isGisNetworkDone =
        this.meterData?.meterUploadResponseDTO[0]?.isGisNetworkDone;
      this.isNetworkExtension =
        this.meterData?.meterUploadResponseDTO[0]?.isNetworkExtension;
        this.updateErrorMessages();
        this.loader.hide();
    });
    this.resetForm();
    this.materialSearchControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this.filterMaterialUnits(value))
      )
      .subscribe((filteredUnits) => {
        this.filteredMaterialUnits = filteredUnits;
      });
  }
  filterMaterialUnits(value: any): any[] {
    return this.meterListData.filter((data) =>
      (data.serialNo + '-' + data.manufacture)?.toLowerCase().includes(value)
    );
  }
  displayMaterial(material: any): string {
    return material ? `${material.serialNo}-${material.manufacture}` : '';
  }
  addDataItem(): void {
    const selectedMaterial = this.materialSearchControl.value;

    if (selectedMaterial) {
      const meterListData = this.meterListData.find(
        (data) => data.serialNo === selectedMaterial.serialNo
      );

      if (meterListData) {
        const existingItem = this.data.find(
          (item) => item.serialNo === selectedMaterial.serialNo
        );

        if (!existingItem) {
          const newItem = {
            materialSerialStockId: meterListData.materialSerialStockId,
            badgeNumber: meterListData.badgeNumber,
            serialNo: meterListData.serialNo,
            manufacture: meterListData.manufacture,
            materialCode: meterListData.materialCode,
          };
          this.data.push(newItem);
          this.materialSearchControl.reset();
          this.filteredMaterialUnits = [];
        } else {
          this.snackbar.open(
            'Meter already added. Please choose a different Meter.',
            'OK',
            {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              duration: 5000,
            }
          );
        }
      }
    }
  }

  deleteDataItem(index: number): void {
    this.data.splice(index, 1);
  }

  onMaterialUnitSelected(event: any): void {
    const selectedMaterial = event.option.value;
    const materialData = this.meterListData.find(
      (data) => data.mlName === selectedMaterial
    );
  }
  isErrorShown(): boolean {
    return this.errorMessages.length > 0;
  }
  
  updateErrorMessages() {
    this.errorMessages = [];
  
    const connectionCode = this.meterData?.meterUploadResponseDTO[0]?.connectionCode || 
                           this.meterData?.meterUploadResponseDTO[0]?.connectionTypeCode;
  
    if (
      this.isMtrProcurementDone == '0' &&
      this.meterData?.meterUploadResponseDTO[0]?.applicationTypeCode !== 'SMR' &&
      this.meterData?.meterUploadResponseDTO[0]?.applicationTypeCode !== 'BMR' &&
      this.meterData?.meterUploadResponseDTO[0]?.applicationTypeCode !== 'UMT_MT' &&
      connectionCode !== 'JVS' &&
      connectionCode !== 'MC-JVS' &&
      this.meterData?.meterUploadResponseDTO[0]?.applicationTypeCode !== 'LE' &&
      this.meterData?.meterUploadResponseDTO[0]?.applicationTypeCode !== 'LR'
    ) {
      this.errorMessages.push(this.errorMessage);
    }
  
    if (this.isGisNetworkDone == '0' && this.isNetworkExtension == '1') {
      this.errorMessages.push(this.lineExtensionErrorMessage);
    }
  }
  
  resetForm() {
    this.meterUploadForm = new FormGroup({
      file: new FormControl('', [Validators.required]),
      uploadfiletype: new FormControl('', [Validators.required]),
      remarks: new FormControl('', [Validators.required]),
    });
  }
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const selectedFile = target.files[0];
    const fileName = selectedFile.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileExtension !== 'xlsx') {
      this.error = 'Please select a valid XLSX file.';
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (selectedFile.size > maxSizeInBytes) {
      this.fileSizeError = true;
      this.meterUploadForm.get('file').setErrors({ fileSize: true });
    } else {
      this.fileSizeError = false;
      this.error = '';
      if (fileName == 'SM_Meter_Upload.xlsx') {
        this.saveData.docType = 'mtr';
      }
      this.file = selectedFile;
    }
  }
  openConfirmationDialog(buttonType: 'm' | 'v') {
    const dialogRef = this.dialog.open(SuspensePopupComponent, {
      width: 'auto',
      data: { type: 'submit' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onSubmit(buttonType);
      }
    });
  }
  payloadMeterData: any = [];

  async onSubmit(buttonType: 'm' | 'v') {
    if (buttonType === 'm') {
      this.mIsButtonDisabled = true;
    } else if (buttonType === 'v') {
      this.vIsButtonDisabled = true;
    }
    const meterParams = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      wmWorkorderRegisteredId:
        this.meterData?.meterUploadResponseDTO[0]?.wmWorkorderRegisteredId,
      workOrderNo: this.meterData?.meterUploadResponseDTO[0]?.workorderNo,
      accountId: this.meterData?.meterUploadResponseDTO[0]?.accountId,
    };

    this.payloadMeterData = this.data.map((d) => {
      return {
        materialSerialStockId: d.materialSerialStockId,
      };
    });

    this.loader.show('Data Submitting...');
    try {
      const saveData =
        await this.uploadMaterialService.updateUploadMeterDataForJVS(
          meterParams,
          this.payloadMeterData
        );

      this.data = [];
      this.materialSearchControl.reset();
      this.payload = {};

      const { messageText } = saveData;
      this.loader.hide();
      const MatSnackBarRef= this.snackbar
        .open(messageText || 'Meter Materials Data Submitted Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        MatSnackBarRef.onAction()
        .subscribe(() => {
          this.snackbar.dismiss();
          if (buttonType === 'm') {
            this.mIsButtonDisabled = false;
          } else if (buttonType === 'v') {
            this.vIsButtonDisabled = false;
          }
          this.navigate('METER UPLOAD', '15');         
        });
    } catch (error) {
      this.loader.hide();
      if (buttonType === 'm') {
        this.mIsButtonDisabled = false;
      } else if (buttonType === 'v') {
        this.vIsButtonDisabled = false;
      }
      this.snackbar.open('Failed to submit the request. Please try again.', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  }

  blob: any;
  showData: any = {};
  showtable: boolean = false;
  // async submitUploadMaterial() {
  //   let formData = new FormData();
  //   console.log(this.file);
  //   formData.append('multipartFile', this.file);
  //   this.loader.show('Data Submitting...');
  //   this.uploadMaterialService
  //     .saveMeterUpload(
  //       {
  //         apiKey: sessionStorage.getItem('api-key'),
  //         serviceKey: sessionStorage.getItem('service-key'),
  //         userRole: sessionStorage.getItem('user-role'),
  //         userName: sessionStorage.getItem('user-name'),
  //         userCode: sessionStorage.getItem('user-code'),
  //         wmWorkorderRegisteredId: this.wmWorkorderRegisteredId,
  //       },
  //       formData
  //     )
  //     .then((submit) => {
  //       this.isLoading = true;

  //       if (submit?.file) {
  //         this.downloadExcelFileFromServer(submit.file);
  //       }
  //       console.log(submit);
  //       this.showData = submit;
  //       this.showtable = true;
  //       const messageText = submit?.messageText || 'Meters Data Uploaded Successfully';
  //       const messageType = submit?.messageType || 'SUCCESS';
  //       this.loader.hide();
  //       const MatSnackBarRef = this.snackbar.open(messageText, 'OK', {
  //         verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //         // panelClass: messageType === 'FAILURE' ? 'snackbar-error' : 'snackbar-success',
  //       });
  //       MatSnackBarRef.onAction().subscribe(() => {
  //         this.snackbar.dismiss();
  //         if (messageType === 'SUCCESS') {
  //           this.meterUploadForm.reset();
  //           this.isLoading = false;
  //         this.navigate('METER UPLOAD', '15');
  //         }
  //         this.isLoading = false;
  //         this.meterUploadForm.reset();
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //       this.isLoading = false;
  //       const snackBarRef = this.snackbar
  //         .open('Meter Upload Failed', 'OK', {
  //           verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //         })
  //         snackBarRef.onAction()
  //         .subscribe(() => {
  //           this.snackbar.dismiss();
  //           this.navigate('METER UPLOAD', '15');
  //           });
  //           this.isLoading = false;
  //           this.meterUploadForm.reset();
  //     });
  // }

  async submitUploadMaterial() {
    let formData = new FormData();
    console.log(this.file);
    formData.append('multipartFile', this.file);
    this.loader.show('Data Submitting...');
    this.uploadMaterialService
      .saveMeterUpload(
        {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          wmWorkorderRegisteredId: this.wmWorkorderRegisteredId,
        },
        formData
      ).subscribe(
        (responseBlob: HttpResponse<any>) => {
          this.isLoading = true;
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
          }
          else if (contentType?.includes('application/octet-stream') || contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) { 
           // Extract filename from Content-Disposition header
          const contentDisposition = responseBlob.headers.get('Content-Disposition');
          const matches = /filename="([^"]*)"/.exec(contentDisposition);
          const fileName = matches && matches[1] ? matches[1] : 'default_filename.xlsx'; // Fallback filename

          if (fileName.toLowerCase().includes('success')) {
                  this.uploadButtonText = 'Upload Success';  // Change the button text to "Success"
           }else{
            this.uploadButtonText = 'Upload Failure';  // Change the button text to "Failure"
            this.snackbar.open(
              'Please Check the Downloads for Excel data Corrections.',
              'OK',
              {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
                duration: 5000,
              }
            );
           }
          // Handle the file download (binary file or other)
          const fileURL = URL.createObjectURL(responseBlob.body);
          const a = document.createElement('a');
          a.href = fileURL;
          a.download = fileName; // Set the filename for the download


          a.click(); // Trigger the download
          URL.revokeObjectURL(fileURL); // Clean up the object URL
        }
        },
        (error) => {
          this.isLoading = true;
          this.loader.hide();
          console.error('Error downloading file', error);
        }
      );
  }

  downloadExcelFileFromServer(file) {
    // Create a Blob object from the file data
    const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create an object URL for the Blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a link element
    const a = document.createElement('a');
    
    // Set the download attribute with a filename
    a.href = url;
    a.download = 'meter_data.xlsx'; // You can customize the filename here
    
    // Append the link to the DOM (this is necessary for it to work)
    document.body.appendChild(a);
    
    // Trigger a click event on the link
    a.click();
    
    // Clean up by removing the link and revoking the URL
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
     this.meterUploadForm.markAllAsTouched();
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
    this.meterUploadForm.markAllAsTouched();
    console.log('Form Valid?', this.meterUploadForm.valid);
    let hasError = false;
    Object.keys(this.meterUploadForm.controls).forEach((key) => {
      const control = this.meterUploadForm.get(key);

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
  navigateBack() {
    this.navigate('METER UPLOAD', '15');
  }
  navigate(label, code) {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        statusCode: 15,
        label: 'METER UPLOAD',
        type: 'list',
        processTypeName: 'WORKORDER',
      },
    });
  }
}
