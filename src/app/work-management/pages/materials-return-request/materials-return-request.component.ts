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
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
const returnIndentForm = new FormGroup({
  description: new FormControl('', [Validators.required]),
  store: new FormControl('', []),
  workOrderNo: new FormControl('', [Validators.required]),
  qunatity: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-materials-return-request',
  templateUrl: './materials-return-request.component.html',
  styleUrls: ['./materials-return-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsReturnRequestComponent implements OnInit {
  isGenerateRequestButton: boolean = false;
  wmData: any = {};
  data: any = {};
  employeeOptions: any[] = [];
  store: any;
  selectedStoreName: string | null = null;
  selectedStoreCode: string = '';
  selectedStoreMasterId: string = '';
  returnIndentForm: FormGroup = returnIndentForm;
  estimationRegisteredData: any[] = [];
  workOrderRegisteredId: any;
  isStoreCodeAvailable: boolean = false;
  isDropdownDisabled: boolean = false;
  assignCrewData: any[] = [];
  isSelectAll: boolean = false;
  storeData: any = {};
  storeNames: any[] = [];
  selectedStore: any = {};
  isInputDisabled: boolean = true;
  defaultSelectedStore: string = '';
  returnedQuantity: number = 0;
  workscopeDescCode: string = '';
  isStoreSelected: boolean = false;
  private snackbarRef: MatSnackBarRef<any>;
  error: string;
  @Input() loading: boolean = true;

  constructor(
    private materialsIntentService: MaterialsIntentService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private loader: LoaderService
  ) {}

  async ngOnInit() {
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
        await this.materialsIntentService.GetAllDataByOfficeForReturnIndent(
          filter
        );
    }
    this.isDropdownDisabled = false;
    this.defaultSelectedStore = this.selectedStoreName;
    this.resetForm();
  }
  resetForm() {
    this.returnIndentForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      store: new FormControl('', []),
      workOrderNo: new FormControl('', [Validators.required]),
      qunatity: new FormControl('', [Validators.required]),
    });
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
  }

  onStoreChange() {
    if (!this.selectedStoreName) {
      this.selectedStoreName = this.defaultSelectedStore;
    }
    const selectedStoreMasterId = this.selectedStoreName;
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

    this.cdr.detectChanges();
    this.selectedStoreCode = this.selectedStore.storeCode;
    this.selectedStoreMasterId = this.selectedStore.storeMasterId;
  }

  async openMaterialSerialNumbersDialog() {
    this.loader.show('Loading Data');
    const dialogRef = this.dialog.open(MaterialSerialNumbersComponent, {
      data: this.data.workerOrderData,
      width: '100%',
    });
    this.loader.hide();
    dialogRef.afterClosed().subscribe(async (result) => {
      console.log('result', result);
      if (result) {
        const apiKey = sessionStorage.getItem('api-key');
        const serviceKey = sessionStorage.getItem('service-key');
        const userRole = sessionStorage.getItem('user-role');
        const userName = sessionStorage.getItem('user-name');
        const userCode = sessionStorage.getItem('user-code');
        let officeId = sessionStorage.getItem('office-id');

        if (result.storeOfficeId !== null) {
          const storeFilter: any = {
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            storeMasterId: result.storeOfficeId,
          };
          this.storeData =
            await this.materialsIntentService.getStoreDataByStoreMasterId(
              storeFilter
            );
          this.selectedStoreCode = this.storeData.storeCode;
          this.selectedStoreMasterId = this.storeData.storeMasterId;
          this.selectedStoreName = this.storeData.storeMasterId;
          this.isDropdownDisabled = true;
        } else {
          this.selectedStoreName = null;
          this.isDropdownDisabled = false;
        }
        this.wmData = result;
        this.isSelectAll = true;
        const filter: any = {
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          wmWorkorderRegisteredId: this.wmData.wmWorkorderRegisteredId,
          estimateType: this.wmData.estimateType,
        };
        const estimationRegisteredData =
          await this.materialsIntentService.GetDataByEstimationRegisteredIdReturn(
            filter
          );
        this.estimationRegisteredData = estimationRegisteredData.map(
          (v: any) => {
            const returnedQuantity = parseFloat(v.returnedQuantity);
            if (isNaN(returnedQuantity)) {
              return { ...v, isSelected: true, returnedQuantity: 0.0 };
            } else {
              return {
                ...v,
                isSelected: true,
                returnedQuantity: returnedQuantity,
              };
            }
          }
        );
        if (
          this.estimationRegisteredData &&
          this.estimationRegisteredData.length > 0
        ) {
          this.workscopeDescCode =
            this.estimationRegisteredData[0].workscopeDescCode;
        }
        const storePassData =
          await this.materialsIntentService.getStorePassByOfficeId({
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            officeId,
          });
        this.assignCrewData = storePassData;
        this.cdr.detectChanges();
      }
    });
  }

  returnQuantity(
    requestQuantity: number,
    index: number,
    receivedQuantity: number
  ) {
    if (Number(requestQuantity) > Number(receivedQuantity)) {
      const snackbarConfig: MatSnackBarConfig = {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: ['disable-background-click'],
      };
      this.snackbarRef = this.snackbar.open(
        'Requested Quantity should not be greater than the Received Quantity',
        'OK',
        snackbarConfig
      );
      document.body.style.pointerEvents = 'none';
      this.snackbarRef.onAction().subscribe(() => {
        this.snackbarRef.dismiss();
        document.body.style.pointerEvents = 'auto';
        setTimeout(() => {
          this.estimationRegisteredData[index].requestQuantity = 0;
          this.cdr.detectChanges();
        });
      });
    } else {
      this.isGenerateRequestButton = true;
      this.estimationRegisteredData[index].requestQuantity = requestQuantity;
      console.log(
        'Updated Quantity for Index ' + index + ':',
        this.estimationRegisteredData
      );
    }
  }

  onReturnedQuantityChange(material: any) {
    material.returnedQuantity = this.returnedQuantity;
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
    console.log(this.estimationRegisteredData);
  }

  selectedKey(i: any) {
    if (this.estimationRegisteredData[i].isSelected) {
      this.estimationRegisteredData[i].isSelected = true;
    } else {
      this.estimationRegisteredData[i].isSelected = false;
    }
    console.log(this.estimationRegisteredData);
  }

  openConfirmationpopupDialog() {
    this.returnIndentForm.markAllAsTouched();
    if (this.isValidForm()) {
      const officeId = parseInt(sessionStorage.getItem('office-id') || '0', 10);
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
        trangLog.push({
          wmWorkorderRegisteredId: Number(v.wmWorkorderRegisteredId),
          estimationRegisteredId: Number(v.estimationRegisteredId),
          estimationWorkScopeDataId: Number(v.estimationWorkScopeDataId),
          estimationMaterialsRegisteredId: Number(
            v.estimationMaterialsRegisteredId
          ),
          materialsMasterId: Number(v.materialsMasterId),
          part: v.workPart,
          requestQuantity: formatDecimal(v.requestQuantity),
          receivedQuantity: formatDecimal(v.receivedQuantity),
          estimatedQuantity: formatDecimal(v.quantity),
          issuedRate: formatDecimal(v.materialRate),
          issuedAmount: isNaN(parseFloat(v.materailAmount)) ? "0.00" : formatDecimal(v.materailAmount),
        });
      });

      const storeMasterId = parseInt(this.selectedStoreMasterId || '0', 10);
      const indent: any = {
        wmMaterialsIndentDTO: {
          wmWorkorderRegisteredId: this.wmData.wmWorkorderRegisteredId,
          workDescription: this.wmData.workDescription,
          officeId,
          storeCode: this.selectedStoreCode,
          storeMasterId,
          typeOfIndent: 'RETURN_INDENT',
        },
        wmMaterialsIndentTransLogDTO: trangLog,
      };

      const dialogRef = this.dialog.open(GenerateRequestPopupComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.saveData(indent);
        }
      });
    }
  }

  isValidForm(): boolean {
    this.returnIndentForm.markAllAsTouched();
    console.log('Form Valid?', this.returnIndentForm.valid);
    let hasError = false;
    Object.keys(this.returnIndentForm.controls).forEach((key) => {
      const control = this.returnIndentForm.get(key);

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
  async saveData(indent: any) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };

    const updatedTrangLog = indent.wmMaterialsIndentTransLogDTO.map(
      (logItem: any) => {
        const requestQuantity = parseFloat(logItem.requestQuantity);
        if (isNaN(requestQuantity) || requestQuantity <= 0) {
          logItem.requestQuantity = logItem.estimatedQuantity;
          logItem.receivedQuantity = '0.00';
        }
        return logItem;
      }
    );
    indent.wmMaterialsIndentTransLogDTO = updatedTrangLog;
    // console.log("dat of return indent",indent);
    // return;
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
      const workscopeDescCode = res.workscopeDescCode
        ? res.workscopeDescCode
        : '';
      this.snackbar
        .open('Material Request Generated Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.reset();
          this.router.navigate(
            ['/work-management', 'material-Return-generated'],
            {
              queryParams: {
                wmMaterialsIndentId,
                materialsIndentNo,
                materialsIndentDate,
                workscopeDescCode,
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
