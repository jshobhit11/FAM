import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap,Router} from '@angular/router';
import { MaterialsIntentService } from '../../../services/materialsIntent.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { StoretPopupComponent } from '../storet-popup/storet-popup.component';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-store-transfer-request',
  templateUrl: './store-transfer-request.component.html',
  styleUrls: ['./store-transfer-request.component.scss'],
})
export class StoreTransferRequestComponent implements OnInit {
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
  constructor(
    private formBuilder: FormBuilder,
    private materialIntentService: MaterialsIntentService,
    private configurationService: ConfigurationService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
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
      this.senderStore = await this.materialIntentService.getSenderStore({
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      });
      this.receiverStore = await this.materialIntentService.getReceiverStore({
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      });
      this.receiverDivision =
        await this.materialIntentService.getSenderReceiverDivisionOffice({
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          divisionStoreCode: this.receiverStore.storeCode,
        });
      this.materialData =
        await this.configurationService.getmaterialLabourMasterGetDataMlType({
          apiKey,
          serviceKey,
          userCode,
          userName,
          userRole,
          mlType: 'MATERIAL',
        });
      console.log(this.materialData);
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
      (store.storeCode + ' - ' + store.storeName).toLowerCase().includes(filterValue)
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
    return (
      !!this.selectedSenderStore &&
      this.data.some((item) => !!item.requestedQuantity && item.requestedQuantity > 0)
    );
  }
  
  
  displayMaterial(material: any): string {
    return material ? `${material.mlCode} - ${material.mlName}` : '';
  }
  addDataItem(): void {
    const selectedMaterial = this.materialSearchControl.value;
    const materialData = this.materialData.find(
      (data) => data.mlName === selectedMaterial.mlName
    );
    if (materialData) {
      const existingItem = this.data.find(
        (item) => item.mlName === selectedMaterial.mlName
      );
      if (existingItem) {
        existingItem.requestedQuantity = materialData.requestedQuantity;
      } else {
        const newItem = {
          materialsLabourMasterId: materialData.materialsLabourMasterId,
          materialCode: materialData.mlCode,
          materialName: materialData.mlName,
          unit: materialData.mlUnit,
          rate: materialData.mlRate,
          requestedQuantity: materialData.requestedQuantity,
        };
        this.data.push(newItem);
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
  onRecevierDivisionChnage(event) {
    this.payload.receiverOfficeId = event;
  }
  openApprovalpopupDialog() {
    const dialogRef = this.dialog.open(StoretPopupComponent);
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
      return {
        materialsMasterId: d.materialsLabourMasterId,
        requestQuantity: d.requestedQuantity,
      };
    });
   
    const saveData =
      await this.materialIntentService.saveMaterialTransferRequestData(
        filterParams,
        {
          wmMaterialsIndentDTO: {
            officeId: sessionStorage.getItem('office-id'),
            storeCode: this.selectedSenderStore.storeCode,
            storeMasterId: this.selectedSenderStore.storeMasterId, 
            receiverStoreId: this.receiverStore.storeMasterId,
            receiverStoreCode: this.receiverStore.storeCode,
         //   receiverOfficeId: this.payload.receiverOfficeId,
         //   senderOfficeId: this.payload.senderOfficeId,
            typeOfIndent: 'STOCK_INDENT',
          },
          wmMaterialsIndentTransLogDTO: [...this.payloadMaterialData],
        }
      );
  
      this.data = [];
      this.materialSearchControl.reset();
      this.payload = {};
      const { wmMaterialsIndentId, materialsIndentNo, materialsIndentDate } = saveData;
      this.snackBar
        .open('Store Material Transfer Request Success', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/store-management', 'material-store-indent-generated'], {
            queryParams: {
              wmMaterialsIndentId,
              materialsIndentNo,
              materialsIndentDate,
            },
          });
        });
    }
  
}
