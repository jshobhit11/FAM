import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import {
  MatSnackBar,
  MatSnackBarRef,
  MatSnackBarConfig,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MaterialsIntentService } from '../../../services/materialsIntent.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { StoreInvAdjPopupComponent } from '../store-inv-adj-popup/store-inv-adj-popup.component';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-store-inventory-adjustment',
  templateUrl: './store-inventory-adjustment.component.html',
  styleUrls: ['./store-inventory-adjustment.component.scss'],
})
export class StoreInventoryAdjustmentComponent implements OnInit {
  data: any[];
  materialCharges: FormGroup;
  materialData: any[];
  materialSearchControl: FormControl;
  filteredMaterialUnits: any[];
  isFormComplete = false;
  senderStoreControl = new FormControl();
  filteredSenderStore: Observable<any[]>;
  selectedStore: any;
  selectedSenderStore: any = {};
  reasonData: any = {};
  reasonTypeData: any[] = [];
  isGenerateRequestButton: boolean = false;
  private snackbarRef: MatSnackBarRef<any>;
  dataItem: any[] = [];
  cdr: any;
  private errorShown: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private materialIntentService: MaterialsIntentService,
    private configurationService: ConfigurationService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.data = [];
    this.materialData = [];
    this.materialSearchControl = new FormControl();
    this.filteredMaterialUnits = [];

    this.materialCharges = this.formBuilder.group({
      materialSearchControl: [''],
    });
  }

  senderStore: any = [];
  receiverStore: any;
  receiverDivision: any;
  senderDivision: any;
  payload: any = {};

  ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.receiverStore = await this.materialIntentService.getReceiverStore({
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      });

      this.materialData =
        await this.configurationService.getDataWithStoreQuantityByStoreCode({
          apiKey,
          serviceKey,
          userCode,
          userName,
          userRole,
          storeCode: this.receiverStore.storeCode,
        });
      console.log('stpre qty data', this.materialData);

      this.reasonData =
        await this.configurationService.getStoreReasonGetAllData({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
        });
      console.log('Get All reasonData', this.reasonData);
    });

    this.materialSearchControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this.filterMaterialUnits(value))
      )
      .subscribe((filteredUnits) => {
        this.filteredMaterialUnits = filteredUnits;
      });
    this.filteredSenderStore = this.senderStoreControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterSenderStores(value))
    );
  }
  filterSenderStores(value: string): any[] {
    const filterValue = String(value).toLowerCase();
    return this.senderStore.filter((store) =>
      (store.storeCode + ' - ' + store.storeName)
        .toLowerCase()
        .includes(filterValue)
    );
  }
  displaySenderStore(store: any): string {
    return store ? `${store.storeCode} - ${store.storeName}` : '';
  }

  filterMaterialUnits(value: any): any[] {
    return this.materialData.filter((data) =>
      (data.mlCode + '-' + data.mlName)?.toLowerCase().includes(value)
    );
  }
  isSubmitEnabled(): boolean {
    return this.data.some((item) => !!item.remarks);
  }
  displayMaterial(material: any): string {
    return material ? `${material.mlCode} - ${material.mlName}` : '';
  }
  addDataItem(): void {
    const selectedMaterial = this.materialSearchControl.value;
    const materialData = this.materialData.find(
      (data) => data.mlName === selectedMaterial.mlName,
      (data) => data.storeQuantity === selectedMaterial.mlName
    );
    if (materialData) {
      const existingItem = this.data.find(
        (item) => item.mlName === selectedMaterial.mlName
      );
      if (existingItem) {
        existingItem.adjustmentQuantity = materialData.adjustmentQuantity;
      } else {
        const newItem = {
          materialsLabourMasterId: materialData.srMaterialsMasterId,
          materialCode: materialData.mlCode,
          materialName: materialData.mlName,
          unit: materialData.mlUnit,
          newCurrentQty: materialData.newCurrentQty,
          usedCurrentQty: materialData.usedCurrentQty,

          issuedNewQty: materialData.issuedNewQty,
          issuedUsedQty: materialData.issuedUsedQty,
          adjustmentQuantity: materialData.adjustmentQuantity,
          reason: materialData.storeAdjReasonMasterId,
          remarks: materialData.remarks,
        };
        this.data.push(newItem);
        this.materialSearchControl.reset();
      }
    }
  }

  deleteDataItem(index: number): void {
    this.data.splice(index, 1);
  }

  onStoreUnitSelected(event: any): void {
    const selectedMaterial = event.option.value;
    const materialData = this.materialData.find(
      (data) => data.mlName === selectedMaterial
    );
    console.log(materialData);
  }
  onAdjustmentReasonSelected(dataItem: any) {
    const selectedReasonId = dataItem.adjustmentReason.storeAdjReasonMasterId;
    console.log('selected reason id', selectedReasonId);
  }
  onRecevierDivisionChnage(event) {
    this.payload.receiverOfficeId = event;
  }
  openApprovalpopupDialog() {
    const dialogRef = this.dialog.open(StoreInvAdjPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onSubmit();
      }
    });
  }

  async onSenderStoreChnage(event) {
    this.selectedSenderStore = event.option.value;
    console.log('Selected Sender Store:', this.selectedSenderStore);
    this.payload.senderOfficeCode = event;
    const senderStore = this.senderStore.find((s) => s.storeCode === event);
    this.payload.senderStoreCode = senderStore.storeCode;
    this.payload.senderStoreMasterId = senderStore.storeMasterId;

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    this.senderDivision =
      await this.materialIntentService.getSenderReceiverDivisionOffice({
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        divisionStoreCode: event,
      });
    console.log(this.senderDivision);
  }

  payloadMaterialData: any = [];
  async onSubmit() {
    const filterParams = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    };

    this.payloadMaterialData = this.data.map((d) => {
      const selectedReasonId = d.adjustmentReason.storeAdjReasonMasterId;
      const issuedNewQtyAsNumber: number = Number(d.issuedNewQty);
      const issuedUsedQtyAsNumber: number = Number(d.issuedUsedQty);

      return {
        materialsMasterId: d.materialsLabourMasterId,
        storeAdjReasonMasterId: selectedReasonId,
        remarks: d.remarks,
        issuedNewQty: issuedNewQtyAsNumber,
        issuedUsedQty: issuedUsedQtyAsNumber,
      };
    });

    const saveData =
      await this.materialIntentService.getSaveStoreInventoryAdjustment(
        filterParams,
        {
          wmMaterialsIndentDTO: {
            officeId: parseInt(sessionStorage.getItem('office-id')),

            storeMasterId: parseInt(this.receiverStore.storeMasterId),
            storeCode: this.receiverStore.storeCode,
          },
          wmMaterialsIndentTransLogDTO: [...this.payloadMaterialData],
        }
      );
    if (saveData.messageType == 'SUCCESS') {
      this.data = [];
      this.materialSearchControl.reset();
      this.payload = {};
      this.snackBar
        .open('Store Inventory Adjustment Requested Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
        });
    }
  }

  isAdjustmentGreaterThanAvailable(dataItem: any, i: any) {
    const issuedNewQty = Number(dataItem.issuedNewQty);

    if (issuedNewQty <= 0 && !this.errorShown) {
      this.showSnackbar('Please enter a positive integer quantity');

      this.dataItem[i].issuedNewQty = 0;
      this.isGenerateRequestButton = false;

      this.errorShown = true;
    } else if (issuedNewQty > Number(dataItem.newCurrentQty)) {
      this.showSnackbar(
        'Adjustment New Qty should not be greater than Available Current Qty'
      );

      this.dataItem[i].issuedNewQty = 0;
      this.isGenerateRequestButton = false;
    } else {
      if (this.snackbarRef) {
        this.snackbarRef.dismiss();
        this.snackbarRef = null;
      }

      this.errorShown = false;
    }
  }

  showSnackbar(message: string): void {
    const snackbarConfig: MatSnackBarConfig = {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top' as MatSnackBarVerticalPosition,
      panelClass: ['disable-background-click'],
    };
    this.snackbarRef = this.snackBar.open(message, 'OK', snackbarConfig);
    document.body.style.pointerEvents = 'none';
    this.snackbarRef.onAction().subscribe(() => {
      this.snackbarRef.dismiss();
      document.body.style.pointerEvents = 'auto';
    });
  }

  isAdjustmentGreaterThanAvailableQty(dataItem: any, i: any) {
    const issuedUsedQty = Number(dataItem.issuedUsedQty);

    if (issuedUsedQty <= 0 && !this.errorShown) {
      this.showSnackbar('Please enter a positive integer quantity');

      this.dataItem[i].issuedUsedQty = 0;
      this.isGenerateRequestButton = false;

      this.errorShown = true;
    } else if (issuedUsedQty > Number(dataItem.usedCurrentQty)) {
      this.showSnackbar(
        'Adjustment Used Qty should not be greater than Available Used Qty'
      );

      this.dataItem[i].issuedUsedQty = 0;
      this.isGenerateRequestButton = false;
    } else {
      if (this.snackbarRef) {
        this.snackbarRef.dismiss();
        this.snackbarRef = null;
      }

      this.errorShown = false;
    }
  }

  showSnackbar1(message: string): void {
    const snackbarConfig: MatSnackBarConfig = {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top' as MatSnackBarVerticalPosition,
      panelClass: ['disable-background-click'],
    };
    this.snackbarRef = this.snackBar.open(message, 'OK', snackbarConfig);
    document.body.style.pointerEvents = 'none';
    this.snackbarRef.onAction().subscribe(() => {
      this.snackbarRef.dismiss();
      document.body.style.pointerEvents = 'auto';
    });
  }
}
