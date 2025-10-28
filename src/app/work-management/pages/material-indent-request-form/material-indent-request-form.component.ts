import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  MatSnackBarConfig,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerateRequestPopupComponent } from 'src/app/shared/components/generateRequest-popup/generateRequest-popup.component';
import { MaterialSerialNumbersComponent } from 'src/app/store-management/pages/dispatch-material-invoice/pop-up/material-serial-numbers/material-serial-numbers.component';
import { LoaderService } from 'src/app/services/loader.service';
import { filter } from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-material-indent-request-form',
  templateUrl: './material-indent-request-form.component.html',
  styleUrls: ['./material-indent-request-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialIndentRequestFormComponent implements OnInit {
  isGenerateRequestButton: boolean = false;
  wmData: any = {};
  data: any = {};
  employeeOptions: any[] = [];
  store: any;
  selectedStoreName: string | null = null;
  selectedStoreCode: string = '';
  selectedStoreMasterId: string = '';
  estimationRegisteredData: any[] = [];
  workOrderRegisteredId: any;
  isStoreCodeAvailable: boolean = false;
  isDropdownDisabled: boolean = false;
  assignCrewData: any[] = [];
  isAllChecked: boolean = false;
  isSelectAll: boolean = false;
  storeData: any = {};
  storeNames: any[] = [];
  selectedStore: any = {};
  defaultSelectedStore: string = '';
  isInputDisabled: boolean = true;
  private snackbarRef: MatSnackBarRef<any>;
  error: string;
  @Input() loading: boolean = true;
  storeNotSelected = false;
  workOrderNotSelected = false;
  showGenerateButton: boolean;
  validateMaintenanceData:any[]=[];
  validationMessage$ = new BehaviorSubject<string | null>(null);
  constructor(
    private materialsIntentService: MaterialsIntentService,
    public dialog: MatDialog,
    private router: Router,
    private snackbar: MatSnackBar,
    private loader: LoaderService,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.loader.show('Data Loading...');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId = sessionStorage.getItem('office-id');

    if (!this.workOrderRegisteredId) {
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeId,
        workExecutionMethodIds: '[]',
      };
      this.data =
        await this.materialsIntentService.getAllDataByOfficeAndWorkExecutionMethod(
          filter
        );
    }
    this.isDropdownDisabled = false;
    this.defaultSelectedStore = this.selectedStoreName;
    this.loader.hide();
  }
  reset() {
    this.isSelectAll = false;
    this.data = {};
    this.storeData = {};
    this.wmData = {};
    this.estimationRegisteredData = [];
    this.selectedStoreName = this.defaultSelectedStore;
  }

  onWorkOrderChange() {
    const selectedWorkOrder = this.data.workerOrderData.find(
      (workOrder) => workOrder.workorderNo === this.wmData.workorderNo
    );
    if (selectedWorkOrder && selectedWorkOrder.storeCode) {
      this.selectedStoreName = selectedWorkOrder.storeMasterId;
      this.isSelectAll = true;
    } else {
      this.selectedStoreName = '';
      this.isSelectAll = false;
    }
    if (selectedWorkOrder) {
      this.workOrderNotSelected = false;
    }
  }
  onStoreChange() {
    if (!this.selectedStoreName) {
      this.selectedStoreName = this.defaultSelectedStore;
    }
    const selectedStoreMasterId = this.selectedStoreName;
    if (this.selectedStoreName) {
      this.storeNotSelected = false;
    }
    const selectedStore = this.assignCrewData.find(
      (store) => store.storeMasterId === selectedStoreMasterId
    );

    if (selectedStore && selectedStore.storeCode !== null) {
      this.selectedStore = {
        ...selectedStore,
        storeCode: selectedStore.storeCode,
        storeMasterId: selectedStore.storeMasterId,
      };
    } else {
      this.selectedStore = {};
    }
    this.selectedStoreCode = this.selectedStore.storeCode;
    this.selectedStoreMasterId = this.selectedStore.storeMasterId;
  }
  validateDecimalInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }
    if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {
      value = value.substring(1);
    }

    // Update value directly without dispatching the event
    inputElement.value = value;
  }

  // openMaterialSerialNumbersDialog(): void {
  //   this.loader.show('Data Loading...');
  //   const dialogRef = this.dialog.open(MaterialSerialNumbersComponent, {
  //     data: this.data.workerOrderData,
  //     width: '100%',
  //   });
  //   this.loader.hide();
  //   dialogRef.afterClosed().subscribe(async (result) => {
  //     if (result) {
  //       const apiKey = sessionStorage.getItem('api-key');
  //       const serviceKey = sessionStorage.getItem('service-key');
  //       const userRole = sessionStorage.getItem('user-role');
  //       const userName = sessionStorage.getItem('user-name');
  //       const userCode = sessionStorage.getItem('user-code');
  //       let officeId = sessionStorage.getItem('office-id');
  //       this.wmData = result;
  //       this.isSelectAll = true;
  //       try {
  //         const storeDataPromise =
  //           result.storeOfficeId !== null
  //             ? this.materialsIntentService.getStoreDataByStoreMasterId({
  //                 apiKey,
  //                 serviceKey,
  //                 userRole,
  //                 userName,
  //                 userCode,
  //                 storeMasterId: result.storeOfficeId,
  //               })
  //             : Promise.resolve(null);

  //         const estimationDataPromise =
  //           this.materialsIntentService.getDataByEstimationRegisteredId({
  //             apiKey,
  //             serviceKey,
  //             userRole,
  //             userName,
  //             userCode,
  //             estimationRegisteredId: this.wmData.estimationRegisteredId,
  //           });

  //         const storePassDataPromise =
  //           this.materialsIntentService.getStorePassByOfficeId({
  //             apiKey,
  //             serviceKey,
  //             userRole,
  //             userName,
  //             userCode,
  //             officeId,
  //           });
  //         const [storeData, estimationRegisteredData, storePassData] =
  //           await Promise.all([
  //             storeDataPromise,
  //             estimationDataPromise,
  //             storePassDataPromise,
  //           ]);
  //         if (storeData) {
  //           this.storeData = storeData;
  //           this.selectedStoreCode = this.storeData.storeCode;
  //           this.selectedStoreMasterId = this.storeData.storeMasterId;
  //           this.selectedStoreName = this.storeData.storeMasterId;
  //           this.isDropdownDisabled = true;
  //         } else {
  //           this.selectedStoreName = null;
  //           this.isDropdownDisabled = false;
  //         }
  //         this.estimationRegisteredData = estimationRegisteredData.map(
  //           (v: any) => ({
  //             ...v,
  //             isSelected: true,
  //           })
  //         );
  //         this.assignCrewData = storePassData;
  //         this.cdRef.detectChanges();
  //       } catch (error) {
  //         console.error('Error loading data', error);
  //       } finally {
  //       }
  //     }
  //   });
  // }


  openMaterialSerialNumbersDialog(): void {
    this.loader.show('Data Loading...');   
    const dialogRef = this.dialog.open(MaterialSerialNumbersComponent, {
      data: this.data.workerOrderData,
      width: '100%',
    });
    this.loader.hide(); 
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const sessionData = {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          officeId: sessionStorage.getItem('office-id'),
        };
  
        this.wmData = result;
        this.isSelectAll = true;
  
        try {

          const storeDataPromise = result.storeOfficeId
            ? this.materialsIntentService.getStoreDataByStoreMasterId({
                ...sessionData,
                storeMasterId: result.storeOfficeId,
              })
            : Promise.resolve(null);
  
          const estimationDataPromise =
            this.materialsIntentService.getDataByEstimationRegisteredId({
              ...sessionData,
              estimationRegisteredId: this.wmData.estimationRegisteredId,
            });
  
          const storePassDataPromise =
            this.materialsIntentService.getStorePassByOfficeId({
              ...sessionData,
              officeId: sessionData.officeId,
            });
  
          const [storeData, estimationRegisteredData, storePassData] =
            await Promise.all([
              storeDataPromise,
              estimationDataPromise,
              storePassDataPromise,
            ]);
  
          if (storeData) {
            this.storeData = storeData;
            this.selectedStoreCode = storeData.storeCode;
            this.selectedStoreMasterId = storeData.storeMasterId;
            this.selectedStoreName = storeData.storeMasterId;
            this.isDropdownDisabled = true;
          } else {
            this.selectedStoreName = null;
            this.isDropdownDisabled = false;
          }
          this.estimationRegisteredData = estimationRegisteredData.map(
            (v: any) => ({ ...v, isSelected: true })
          );
          this.assignCrewData = storePassData;
          this.cdRef.detectChanges();
           
          const wmWorkOrderRegisteredId = this.estimationRegisteredData.length
            ? this.estimationRegisteredData[0].wmWorkorderRegisteredId
            : null;
          if (wmWorkOrderRegisteredId) {
            await this.validateRevenueMaintenance(wmWorkOrderRegisteredId);
          }
        } catch (error) {
          console.error('Error loading data', error);
        }
      }
    });
  }
  
  async validateRevenueMaintenance(wmWorkOrderRegisteredId: string) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
  
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      wmWorkOrderRegisteredId,
    };
  
    try {
      const validateMaintenanceData = await this.materialsIntentService.validateQuarter(filter); 
      if (validateMaintenanceData?.messageType == 'FAILURE') {
        this.validationMessage$.next(validateMaintenanceData.messageText);
      } else {
        this.validationMessage$.next(null);
      }
      
    } catch (error) {
      console.error('Error validating revenue maintenance:', error);
    }
  }
  
    
  requestedQuantity(
    quantity: any,
    i: any,
    estimatedQuantity: any,
    receivedQuantity: any
  ) {
    if (
      Number(quantity) >
      Number(estimatedQuantity) - Number(receivedQuantity)
    ) {
      this.isGenerateRequestButton = false;
      const snackbarConfig: MatSnackBarConfig = {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top' as MatSnackBarVerticalPosition,
        panelClass: ['disable-background-click'],
      };
      this.snackbarRef = this.snackbar.open(
        'Request Quantity should not be greater than the Estimated Quantity',
        'OK',
        snackbarConfig
      );
      document.body.style.pointerEvents = 'none';
      this.snackbarRef.onAction().subscribe(() => {
        this.snackbarRef.dismiss();
        document.body.style.pointerEvents = 'auto';
        this.estimationRegisteredData[i].requestedQuantity = 0;
      });
    } else {
      this.isGenerateRequestButton = true;
      this.estimationRegisteredData[i].requestedQuantity = quantity;
    }
  }

  convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
  }

  checkUncheckAll() {
    if (this.isSelectAll) {
      const estimationRegisteredData = this.estimationRegisteredData.map(
        (v: any) => {
          return { ...v, isSelected: true };
        }
      );
      this.estimationRegisteredData = estimationRegisteredData;
    } else {
      const estimationRegisteredData = this.estimationRegisteredData.map(
        (v: any) => {
          return { ...v, isSelected: false };
        }
      );
      this.estimationRegisteredData = estimationRegisteredData;
    }
  }

  selectedKey(i: any) {
    if (this.estimationRegisteredData[i].isSelected) {
      this.estimationRegisteredData[i].isSelected = true;
    } else {
      this.estimationRegisteredData[i].isSelected = false;
    }
  }

  openConfirmationpopupDialog() {
    if (!this.wmData || !this.wmData.wmWorkorderRegisteredId) {
      const config: MatSnackBarConfig = {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top' as MatSnackBarVerticalPosition,
        panelClass: ['disable-background-click'],
      };

      this.snackbarRef = this.snackbar.open(
        'Please click on the search icon to select a work order.',
        'OK',
        config
      );
      document.body.style.pointerEvents = 'none';

      this.snackbarRef.onAction().subscribe(() => {
        this.snackbarRef.dismiss();
        document.body.style.pointerEvents = 'auto';
      });

      return;
    }
    let emptyQuantity: boolean = false;
    const officeId = parseInt(sessionStorage.getItem('office-id') || '0');
    const onlySelectedArray = this.estimationRegisteredData.filter(
      (v) => v.isSelected === true
    );
    const trangLog: any[] = [];
    const formatDecimal = (value) => {
      const floatVal = parseFloat(value);
      return floatVal.toFixed(
        floatVal % 1 === 0
          ? 0
          : floatVal.toString().split('.')[1]?.length > 2
          ? 3
          : 2
      );
    };
    onlySelectedArray.forEach((v: any) => {
      if (!v.requestedQuantity) {
        emptyQuantity = true;
      }
      trangLog.push({
        wmWorkorderRegisteredId: Number(v.wmWorkorderRegisteredId),
        estimationRegisteredId: Number(v.estimationRegisteredId),
        estimationWorkScopeDataId: Number(v.estimationWorkScopeDataId),
        estimationMaterialsRegisteredId: Number(
          v.estimationMaterialsRegisteredId
        ),
        materialsMasterId: Number(v.materialsMasterId),
        part: v.workPart,
        requestQuantity: formatDecimal(v.requestedQuantity),
        receivedQuantity: formatDecimal(v.receivedQuantity),
        estimatedQuantity: formatDecimal(v.quantity),
        issuedRate: formatDecimal(v.materialRate),
        issuedAmount:isNaN(parseFloat(v.materailAmount)) ? "0.00" : formatDecimal(v.materailAmount),
      });
    });

    const storeMasterId = parseInt(this.selectedStoreMasterId);
    if (!storeMasterId) {
      this.storeNotSelected = true;
      return;
    }
    if (!emptyQuantity) {
      const indent: any = {
        wmMaterialsIndentDTO: {
          wmWorkorderRegisteredId: this.wmData.wmWorkorderRegisteredId,
          workDescription: this.wmData.workDescription,
          officeId,
          storeCode: this.selectedStoreCode,
          storeMasterId,
          typeOfIndent: 'INDENT',
        },
        wmMaterialsIndentTransLogDTO: trangLog,
      };

      const dialogRef = this.dialog.open(GenerateRequestPopupComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.saveData(indent);
        }
      });
    } else {
      const config: MatSnackBarConfig = {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top' as MatSnackBarVerticalPosition,
        panelClass: ['disable-background-click'],
      };

      this.snackbarRef = this.snackbar.open(
        'Please enter the quantity',
        'OK',
        config
      );
      document.body.style.pointerEvents = 'none';

      this.snackbarRef.onAction().subscribe(() => {
        this.snackbarRef.dismiss();
        document.body.style.pointerEvents = 'auto';
      });
    }
  }

  async saveData(indent: any) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    const res = await this.materialsIntentService.saveDataMaterialsIntent(
      filter,
      indent
    );

    if (
      res.wmMaterialsIndentId &&
      res.materialsIndentNo &&
      res.materialsIndentDate
    ) {
      const wmMaterialsIndentId = res.wmMaterialsIndentId;
      const materialsIndentNo = res.materialsIndentNo;
      const materialsIndentDate = res.materialsIndentDate;

      this.snackbar
        .open('Material Request Generated Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.reset();
          this.router.navigate(
            ['/work-management', 'material-indent-generated'],
            {
              queryParams: {
                wmMaterialsIndentId,
                materialsIndentNo,
                materialsIndentDate,
              },
            }
          );
        });
    } else {
      const snackbarRef = this.snackbar.open(
        'Request Generation Failed',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          panelClass: ['error-snackbar'],
        }
      );

      snackbarRef.onAction().subscribe(() => {
        snackbarRef.dismiss();
        document.body.style.pointerEvents = 'auto';
      });
    }
  }
}
