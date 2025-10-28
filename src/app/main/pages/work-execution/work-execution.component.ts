import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActualQuantityComponent } from './pop-up/actual-quantity/actual-quantity.component';
import { WorkExecutionService } from '../../../services/work-execution.service';
import { StructureBlockComponent } from './pop-up/structure-block/structure-block.component';
import { StructureSpanComponent } from './pop-up/structure-span/structure-span.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as dayjs from 'dayjs';
import { ConfirmationComponent } from './pop-up/confirmation/confirmation.component';
import { WorkExecutionMaterialComponent } from './work-execution-material/work-execution-material.component';
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
import { LoaderService } from 'src/app/services/loader.service';
const workExecution = new FormGroup({
  estimationNo: new FormControl('', []),
  workorderNo: new FormControl('', []),
  workExecutionMethod: new FormControl('', []),
  workType: new FormControl('', []),
  workCategory: new FormControl('', []),
  approvedAmount: new FormControl('', []),
  manualTentativeWorkorderDate: new FormControl('', []),
  permitRequiredFrom: new FormControl('', []),
  workorderEndDate: new FormControl('', []),
  workDescription: new FormControl('', []),
  manualTentativeWorkorderNo: new FormControl('', []),
  approvalRemarks: new FormControl('', []),
  estimationTotalCost: new FormControl('', []),
  estimationCost: new FormControl('', []),
  workorderInstallationDate: new FormControl(
    dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
    Validators.required
  ),
  // workorderExecutionRemarks: new FormControl('', []),
});
@Component({
  selector: 'app-work-execution',
  templateUrl: './work-execution.component.html',
  styleUrls: ['./work-execution.component.scss'],
})
export class WorkExecutionComponent implements OnInit {
  workExecution: FormGroup = workExecution;
  previousMaterialId: number | null = null;
  hideSearchIcons: boolean[] = [];
  materialData: any = { data: {} };
  constructor(
    public dialog: MatDialog,
    private workExecutionService: WorkExecutionService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private loader:LoaderService
  ) {}

  remarks: any;

  labourdetails: any = {};
  workOrderRegisteredId: any;
  materialIndentData: any = [];
  estimationLabourResponse: any[] = [];
  estRegisteredResponse: any[] = [];
  materialPopupData: any = {};
  actualQuantityData: any = {};
  spanData: any = {};
  data: any = {};
  type: any;
  spanFlag: boolean = false;
  structureBlockFlag: boolean = false;
  actualQtyFlag: boolean = false;
  isClose: boolean = false;
  selectedSerialNumbers: Set<string> = new Set();
  spanDataEntries: { [workPart: string]: any[] } = {};

  ngOnInit() {
    console.log(dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'));

    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.workOrderRegisteredId = params['workOrderRegisteredId'];
      this.type = params['type'];
      
      const encodedKey = params['key'];
      if (encodedKey) {
        const staticKey = atob(encodedKey); 
        const workOrderRegisteredId = params['workOrderRegisteredId']; 
        const localData = sessionStorage.getItem(`${workOrderRegisteredId}`);
  
        if (localData) {
          const parsedData = JSON.parse(localData);
            this.data = parsedData.data || {};
            this.materialPopupData = parsedData.materialModalData
            this.actualQuantityData = parsedData.actualQuantityData || []; 
            this.spanDataEntries = parsedData.spanData || {};
            this.remarks = parsedData.remarks || '';
          
        }}
        this.data = await this.workExecutionService.geWorkExecutionData({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        wmWorkorderRegisteredId: this.workOrderRegisteredId,
      });
  
      this.workExecution
        .get('workorderNo')
        .setValue(this.data.WmWorkorderRegistered.workorderNo);
      this.workExecution
        .get('estimationNo')
        .setValue(this.data.WmWorkorderRegistered.estimationNo);
      this.workExecution
        .get('workCategory')
        .setValue(this.data.WmWorkorderRegistered.wrokCategory);
      // this.workExecution
      //   .get('workExecutionMethod')
      //   .setValue(this.data.WmWorkorderRegistered.workExecutionMethod);
      this.workExecution
        .get('permitRequiredFrom')
        .setValue(this.data.WmWorkorderRegistered.permitRequiredFrom);
      this.workExecution
        .get('workDescription')
        .setValue(this.data.WmWorkorderRegistered.workDescription);
      this.workExecution
        .get('workorderEndDate')
        .setValue(
          this.formatDate(this.data.WmWorkorderRegistered.workorderEndDate)
        );
      this.workExecution
        .get('estimationCost')
        .setValue(this.data.WmWorkorderRegistered.estimationCost);
      this.workExecution
        .get('approvalRemarks')
        .setValue(this.data?.WmWorkorderRegistered?.approvalRemarks);
      this.workExecution
        .get('estimationTotalCost')
        .setValue(this.data?.EstimationRegistered?.estimationTotalCost);

      if (
        this.data &&
        this.data.WmWorkorderRegistered &&
        this.data.WmWorkorderRegistered.manualTentativeWorkorderNo
      ) {
        this.workExecution
          .get('manualTentativeWorkorderNo')
          .setValue(this.data.WmWorkorderRegistered.manualTentativeWorkorderNo);
      }

      if (
        this.data &&
        this.data.WmWorkorderRegistered &&
        this.data.WmWorkorderRegistered.manualTentativeWorkorderDate
      ) {
        this.workExecution
          .get('manualTentativeWorkorderDate')
          .setValue(
            this.data.WmWorkorderRegistered.manualTentativeWorkorderDate
          );
      }

      this.checkDrwanQuantity();
      this.data.EstRegisteredResponse = this.data.EstRegisteredResponse.map(
        (item: any) => {
          item.selectedMeterType = 'DT METER';
          return item;
        }
      );
      this.data.EstimationLabourResponse =
        this.data.EstimationLabourResponse.map((v: any) => {
          return { ...v, actualQuantity: v.quantity };
        });

      if (
        this.data.EstimationRegistered.woExecutionMethodName === 'Department' &&
        this.data.EstimationRegistered.applicationTypeName === 'Emergency Works'
      ) {
        this.data.EstRegisteredResponse = this.data.EstRegisteredResponse.map(
          (v: any) => {
            if (v.drawnQuantity == null || v.drawnQuantity == 'null') {
              v.drawnQuantity = '0';
            }
            if (v.estimatedQuantity == null || v.estimatedQuantity == 'null') {
              v.estimatedQuantity = '0';
            }
            if (v.returnedQuantity == null || v.returnedQuantity == 'null') {
              v.returnedQuantity = '0';
            }
            const act = v.estimatedQuantity;
            return {
              ...v,
              actualQuantity: v.estimatedQuantity,
              balanceQty: +act - +act,
              isSearch: false,
              remarks: '',
              qtyByVendor: 0,
            };
          }
        );
      } else {
        this.data.EstRegisteredResponse = this.data.EstRegisteredResponse.map(
          (v: any) => {
            if (v.drawnQuantity == null || v.drawnQuantity == 'null') {
              v.drawnQuantity = '0';
            }
            if (v.estimatedQuantity == null || v.estimatedQuantity == 'null') {
              v.estimatedQuantity = '0';
            }
            if (v.returnedQuantity == null || v.returnedQuantity == 'null') {
              v.returnedQuantity = '0';
            }
            if (v.rateType == 'SR') {
              const drwayQty: any = v.drawnQuantity;
              const returnyQty: any = v.returnedQuantity;

              const actualQty = Number(drwayQty) - Number(returnyQty);

              if (
                this.data?.WmWorkorderRegistered?.workExecutionMethod ===
                'Self Execution'
              ) {
                const act = v.estimatedQuantity;
                return {
                  ...v,
                  actualQuantity: v.estimatedQuantity,
                  balanceQty: +act - +act,
                  isSearch: false,
                  remarks: '',
                  qtyByVendor: 0,
                };
              }

              return {
                ...v,
                actualQuantity: actualQty,
                balanceQty: actualQty - drwayQty,
                isSearch: false,
                remarks: '',
                qtyByVendor: 0,
              };
            }
            if (v.rateType == 'RC' || v.rateType == 'NDS') {
              const estimateQty: any = v.estimatedQuantity;

              const actualQty = estimateQty;
              return {
                ...v,
                actualQuantity: estimateQty,
                balanceQty: actualQty - estimateQty,
                isSearch: false,
                remarks: '',
                qtyByVendor: 0,
              };
            }
          }
        );
      }

      this.estRegisteredResponse.forEach((est) => {
        est.drawnQuantity = est.drawnQuantity;
      });
      this.checkWorkOrderInvoiceData();
    });
    
    const data = JSON.parse(
      sessionStorage.getItem(`${this.workOrderRegisteredId}`)
    );

    if (data) {
      this.materialPopupData = JSON.parse(data.materialModalData);
      this.tempActualQtyData = JSON.parse(data.actualQuantityData);
      this.spanData = JSON.parse(data.spanData);
      this.remarks = data.remarks;
      this.spanFlag = JSON.parse(data.spanFlag);
      this.actualQtyFlag = JSON.parse(data.actualQtyFlag);
      this.structureBlockFlag = JSON.parse(data.structureBlockFlag);
      this.workExecution
        ?.get('installationDate')
        ?.setValue(data.installationDate);
    }
  }

  onMeterTypeChange(material: any, index: number) {
    if (material.selectedMeterType === 'CONSUMER METER') {
      material.isUploadSerialMaterial = '0';
    } else if (material.selectedMeterType === 'DT METER') {
      material.isUploadSerialMaterial = '1';
    }
  }
  tempActualQtyData: any = [];
  onNoStockOptionChange(i: number, selectedNoStockOption: string): void {
    this.data.EstRegisteredResponse[i].noStockFlag = selectedNoStockOption;
  }
  
  openActualQuantityDialog(
    materialsMasterId: string,
    actualQuantity: number,
    materialCode: string,
    workPart: string,
    estimationMaterialsRegisteredId: any
  ) {
    this.actualQtyFlag = true;

    const key = `${workPart}_${estimationMaterialsRegisteredId}`;

    const savedData = this.actualQuantityData[key] || [];

    const dialogRef = this.dialog.open(ActualQuantityComponent, {
      data: {
        materialsMasterId,
        workOrderRegisteredId: this.workOrderRegisteredId,
        actualQuantityData: [...savedData],
        actualQuantity,
        materialCode,
        workPart,
        estimationMaterialsRegisteredId,
      },
      width: '100%',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result && result.estimationMaterialsRegisteredId) {
          const estimationMaterialsRegisteredId =
            result.estimationMaterialsRegisteredId;

          if (result.data && Array.isArray(result.data)) {
            const key = `${workPart}_${estimationMaterialsRegisteredId}`;
            this.actualQuantityData[key] = result.data;
          }
        } else {
          console.log(
            'Dialog was closed without any result or estimationMaterialsRegisteredId was missing'
          );
        }
      },
      (error) => {
        console.error('Error occurred while closing the dialog:', error);
      }
    );
  }


  openStructureBlockDialog(
    materialsMasterId: number,
    actualQuantity: number,
    estimationMaterialsRegisteredId: number,
    workPart: string,
    materialCode: string
  ) {
    this.structureBlockFlag = true;

    if (!this.materialPopupData) {
      this.materialPopupData = {};
    }

    // Use a composite key for storage: `${workPart}_${estimationMaterialsRegisteredId}`
    const uniqueKey = `${workPart}_${estimationMaterialsRegisteredId}`;
    if (!this.materialPopupData[uniqueKey]) {
      this.materialPopupData[uniqueKey] = []; // Initialize if not present
    }

    const dialogRef = this.dialog.open(StructureBlockComponent, {
      data: {
        materialsMasterId,
        workOrderRegisteredId: this.workOrderRegisteredId,
        actualQuantity,
        estimationMaterialsRegisteredId,
        materialPopupData: this.materialPopupData[uniqueKey] || [], // Fetch data based on unique key
        materialCode,
        workPart,
      },
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && Array.isArray(result.data)) {
        if (result.data.length > 0) {
          this.materialPopupData[uniqueKey] = result.data; // Save data using the unique key
        } else {
          delete this.materialPopupData[uniqueKey];
        }
      } else {
        console.error(
          'Expected result.data to be an array:',
          result ? result.data : result
        );
      }
    });
  }
  isPreview: boolean;
  checkDrwanQuantity() {
    const isDrawnQuantity = this.data.EstRegisteredResponse.every(
      (d) => d.drawnQuantity === 0
    );
    this.isPreview = isDrawnQuantity;
  }

  openStructureSpanDialog(
    materialsMasterId: string,
    actualQuantity: number,
    estimationMaterialsRegisteredId: string,
    workPart: string,
    materialCode: string
  ) {
    this.spanFlag = true;

    const savedData = this.spanDataEntries[`${workPart}-${materialCode}`] || {
      data: [],
      numberOfSpans: 0,
    };

    const dialogRef = this.dialog.open(StructureSpanComponent, {
      data: {
        materialsMasterId,
        actualQuantity,
        estimationMaterialsRegisteredId,
        spanData: savedData,
        materialCode,
        workPart,
      },
      width: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && Array.isArray(result.data)) {
        if (!this.spanDataEntries) {
          this.spanDataEntries = {};
        }

        this.spanDataEntries[`${workPart}-${materialCode}`] = result;

        console.log(
          'Stored Data for',
          `${workPart}-${materialCode}:`,
          this.spanDataEntries[`${workPart}-${materialCode}`]
        );
      } else {
        console.error('Expected result.data to be an array:', result.data);
      }
    });
  }

  onMaterialQuantity(
    data,
    i,
    drawnQuantity,
    returnedQuantity,
    rateType,
    estimatedQuantity
  ) {
    const actualQuantity = data ? parseFloat(data) : 0;
    const estimatedQty = parseFloat(estimatedQuantity);
    const drawnQty = parseFloat(drawnQuantity);
    const returnedQty = parseFloat(returnedQuantity);
  
    const epsilon = 1e-6; 
  
    this.hideSearchIcons[i] = actualQuantity === 0;
  
    if (rateType === 'SR') {
      if (actualQuantity <= drawnQty - returnedQty + epsilon) {
        this.data.EstRegisteredResponse[i].actualQuantity = actualQuantity;
        this.data.EstRegisteredResponse[i].balanceQty = drawnQty - returnedQty - actualQuantity;
        this.data.EstRegisteredResponse[i].isSearch = true;
      } else if (actualQuantity === 0) {
        this.data.EstRegisteredResponse[i].isSearch = false;
      } else {
        this.snackBar.open(
          'Actual Quantity should be less than or equal to (Drawn Quantity - Return Quantity).',
          'OK',
          {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
        this.data.EstRegisteredResponse[i].actualQuantity = drawnQty - returnedQty;
      }
    }
  
    if (rateType === 'RC' || rateType === 'NDS') {
      if (actualQuantity <= estimatedQty + epsilon) {
        this.data.EstRegisteredResponse[i].actualQuantity = actualQuantity;
        this.data.EstRegisteredResponse[i].balanceQty = estimatedQty - actualQuantity;
        this.data.EstRegisteredResponse[i].isSearch = true;
      } else if (actualQuantity === 0) {
        this.data.EstRegisteredResponse[i].isSearch = false;
      } else {
        this.snackBar.open(
          'Actual Quantity should be less than or equal to Estimated Quantity.',
          'OK',
          {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
        this.data.EstRegisteredResponse[i].actualQuantity = estimatedQty;
      }
    }
  }
  
  isValidInput(event: KeyboardEvent, actualQuantity: string, isSpanStructure: string): boolean {
    const key = event.key;
    if (isSpanStructure == '1') {
      if (/^[0-9.]$/.test(key)) {
        if (key === '.' && actualQuantity.includes('.')) {
          return false;
        }
        return true;
      }
    } else {
      if (/^[0-9]$/.test(key)) {
        return true;
      }
    }
  
    return false;
  }
  
  isWorkOrderInvoice: boolean = false;

  checkWorkOrderInvoiceData() {
    this.isWorkOrderInvoice = this.data.WmWorkorderInvoiceDetails.some(
      (workOrdr) => workOrdr.invoiceFlag == 'NO'
    );
  }

  onLabourQuantity(data, i, estimateQuantity) {
    console.log(data, estimateQuantity);

    if (data <= estimateQuantity) {
      this.data.EstimationLabourResponse[i].actualQuantity = data;
    } else {
      this.snackBar.open(
        'Actual Quantity should less than estimate quantity',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      this.data.EstimationLabourResponse[i].actualQuantity = 0;
    }
  }
  openCloseDialog(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action: 'close' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.closeWorkExecution();
      }
    });
  }
  async closeWorkExecution() {
    this.loader.show('Closing Work Execution...');
    const submit = await this.workExecutionService.saveWorkExecutionData(
      {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
      },
      {
        wmWorkorderStructureLogDTO: [],
        amAssetRegisterLogDTO: [],
        wmWorkorderRegisteredDTO: {
          wmWorkorderRegisteredId: this.workOrderRegisteredId,
          workorderExecutionRemarks: this.remarks,
          workorderInstallationDate: this.workExecution.get(
            'workorderInstallationDate'
          ).value,
        },
        wmWorkorderEstimationLogDTO: [],
      }
    );
    this.loader.hide();
    this.snackBar
      .open(submit.messageText, 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      })
      .onAction()
      .subscribe(() => {
        if (submit.messageType === 'SUCCESS') {
          sessionStorage.removeItem(
            `${this.data.WmWorkorderRegistered.wmWorkorderRegisteredId}`
          );
          if (
            this.data &&
            this.data.EstimationRegistered &&
            this.data.EstimationRegistered.workCategory !==
              'Repairs & Maintenance Works'
          ) {
            this.router.navigate(['/main/work-order-summary'], {
              queryParams: {
                wmWorkorderRegisteredId:
                  this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
                statusCode: 16,
                label: 'WORK EXECUTION',
                type: 'list',
                processTypeName: 'WORKORDER',
              },
            });
          }
        }
        this.snackBar.dismiss();
      });
  }

  isBtnDisable: boolean = false;
  confirmBeforeSubmit() {
    let showSrPopup = false;
    let showQuantityPopup = false;
    let totalActualQty = 0;
    let totalEstQty = 0;
    let isAnyActualQuantityNonZero = false;
  
    this.data.EstRegisteredResponse.forEach(({ rateType, actualQuantity, estimatedQuantity }) => {
      if (rateType === 'SR' && actualQuantity === 0) showSrPopup = true;
      totalActualQty += actualQuantity;
      totalEstQty += estimatedQuantity;
      if (actualQuantity > 0) isAnyActualQuantityNonZero = true;
    });

    if (!isAnyActualQuantityNonZero) {
      return this.snackBar.open(
        'Actual Quantity should not be Zero for all Materials & Labour items. Please check and fill the Actual Quantity.',
        'OK',
        { verticalPosition: cordova !== undefined ? 'bottom' : 'top' }
      );
    }
  
    if (totalActualQty < totalEstQty) showQuantityPopup = true;

    this.handleConfirmation(showQuantityPopup, showSrPopup);
  }
  
  handleConfirmation(showQuantityPopup, showSrPopup) {
    if (showQuantityPopup) {
      this.showConfirmationPopup(
        'Total Actual Quantity is less than Total Estimate Quantity. Are you sure you want to proceed to preview?',
        () => showSrPopup ? this.showSrConfirmationPopup() : this.submitWorkExecutionForm()
      );
    } else if (showSrPopup) {
      this.showSrConfirmationPopup();
    } else {
      this.submitWorkExecutionForm();
    }
  }
  
  showConfirmationPopup(message, callback) {
    this.dialog.open(ConfirmationComponent, { data: { message } })
      .afterClosed().subscribe((result) => { if (result === 'yes') callback(); });
  }
  
  showSrConfirmationPopup() {
    this.showConfirmationPopup(
      'You have not drawn the materials from store for some of the materials. Are you sure you want to proceed and complete the work execution?',
      () => this.submitWorkExecutionForm()
    );
  }
    
  submitWorkExecutionForm() {
  let allDataValid = true;
  let totalBalanceQuantity = 0;
  let totalActualQty = 0;
  let totalEstQty = 0;
  const errorMessages: string[] = []; 

  this.data.EstRegisteredResponse.forEach((material) => {
    material.balanceQty = Number(material.balanceQty);
    material.actualQuantity = Number(material.actualQuantity);
    material.estimatedQuantity = Number(material.estimatedQuantity);

    totalBalanceQuantity += material.balanceQty;
    totalActualQty += material.actualQuantity;
    totalEstQty += material.estimatedQuantity;

    // Validate span materials
    if (material.isSpanStructure == '1' && material.actualQuantity > 0) {
      if (!this.spanFlag || Object.keys(this.spanDataEntries).length === 0) {
        errorMessages.push(
          `Please select span details for material: ${material.materialName}`
        );
        allDataValid = false;
      }
    }

    // Validate pole structure materials
    if (material.isPoleStructure == '1' && material.actualQuantity > 0) {
      if (!this.structureBlockFlag || Object.keys(this.materialPopupData).length === 0) {
        errorMessages.push(
          `Please select pole structure details for material: ${material.materialName}`
        );
        allDataValid = false;
      }
    }

    // Validate serial materials
    if (material.isUploadSerialMaterial == '1' && material.actualQuantity > 0) {
      if (!this.actualQtyFlag || Object.keys(this.actualQuantityData).length === 0) {
        errorMessages.push(
          `Please upload serial material details for material: ${material.materialName}`
        );
        allDataValid = false;
      }
    }
  });

  // Show errors if validation fails
  if (!allDataValid) {
    errorMessages.forEach((message) => {
      this.snackBar.open(message, 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' });
    });
    return;
  }

   if(this.data.WmWorkorderRegistered.workExecutionMethod !== "Self Execution"){
    if (totalBalanceQuantity > 1) {
      this.snackBar.open(
        'Total Balance Quantity is more than or equal to 1 so process cannot be forwarded.',
        'OK',
        { verticalPosition: cordova !== undefined ? 'bottom' : 'top' }
      );
      return;
    }
   }

    // if (this.spanFlag && Object.keys(this.spanDataEntries).length === 0) {
    //   this.snackBar.open('Select Span Details', 'OK', {
    //     verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    //   });
    //   return;
    // }

    // if (
    //   this.structureBlockFlag &&
    //   Object.keys(this.materialPopupData).length === 0
    // ) {
    //   this.snackBar.open('Select Structure Block Details', 'OK', {
    //     verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    //   });
    //   return;
    // }

    // if (this.actualQtyFlag && Object.keys(this.actualQuantityData).length === 0) {
    //   this.snackBar.open('Select Material Details', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' });
    //   return;
    // }

    // if (!this.structureBlockFlag && !this.spanFlag ) {
    //   this.snackBar.open('Select Structure Details', 'OK', {
    //     verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    //   });
    //   return;
    // }

    // Prepare data for submission
    const data = {
      materialModalData: JSON.stringify(this.materialPopupData),
      formData: JSON.stringify(this.workExecution.value),
      data: JSON.stringify(this.data),
      actualQuantityData: JSON.stringify(this.actualQuantityData),
      spanData: JSON.stringify(this.spanDataEntries),
      remarks: this.remarks,
      spanFlag: this.spanFlag,
      actualQtyFlag: this.actualQtyFlag,
      structureBlockFlag: this.structureBlockFlag,
      installationDate: this.workExecution.get('workorderInstallationDate')
        .value,
    };

    // Store data in session storage
    sessionStorage.setItem(
      `${this.workOrderRegisteredId}`,
      JSON.stringify(data)
    );

    // Conditional navigation based on quantity comparison
    // if (totalActualQty < totalEstQty) {
    //   const dialogRef = this.dialog.open(ConfirmationComponent);
    //   dialogRef.afterClosed().subscribe((result) => {
    //     console.log('Confirmation dialog result:', result);
    //     if (result === 'yes') {
    //       this.router.navigate(['/main/work-execution-details'], {
    //         queryParams: {
    //           type: this.type,
    //           workOrderRegisteredId: this.workOrderRegisteredId,
    //         },
    //       });
    //     }
    //   });
    //   return;
    // }
    this.router.navigate(['/main/work-execution-details'], {
      queryParams: {
        type: this.type,
        workOrderRegisteredId: this.workOrderRegisteredId,
      },
    });
  }

  private formatDate(date: string): string {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1;
    const year = formattedDate.getFullYear();
    return `${year}-${month < 10 ? '0' + month : month}-${
      day < 10 ? '0' + day : day
    }`;
  }

  navigate(label, code) {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        type: this.type,
        label: label,
        statusCode: code,
        processTypeName: 'WORKORDER',
      },
    });
  }

  openWorkExecutionMaterialDialog(workOrderRegisteredId, workOrderNo) {
    const dialogRef = this.dialog.open(WorkExecutionMaterialComponent, {
      data: {
        workOrderRegisteredId,
        workOrderNo,
      },
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((v) => {});
  }
  onCheckboxChange(e: any) {
    console.log(e);
    if (e == true) {
      this.isClose = true;
    }
    if (e == false) {
      this.isClose = false;
    }
  }
  onQtyProvidedByVendorChange(index, qty, actualQty, estQty, drawnQty, returnQty) {
    estQty = +estQty || 0;
    drawnQty = +drawnQty || 0;
    returnQty = +returnQty || 0;

    const formattedQty = parseFloat(qty);
    const maxAllowedQty = estQty + returnQty - drawnQty;
    if (+formattedQty > maxAllowedQty) {
      this.snackBar.open(
        `Quantity provided by vendor should be less than or equal to (${maxAllowedQty}).`,
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      this.data.EstRegisteredResponse[index].qtyByVendor = 0;
      this.data.EstRegisteredResponse[index].actualQuantity = 0;
      return;
    }

    this.data.EstRegisteredResponse[index].qtyByVendor = formattedQty;
    this.data.EstRegisteredResponse[index].actualQuantity = formattedQty;
  }
  
}
