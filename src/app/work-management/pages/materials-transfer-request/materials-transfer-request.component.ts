import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap,Router } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { UploadMaterialService } from '../../../services/upload-material.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { MaterialsIntentService } from '../../../services/materialsIntent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SuspensePopupComponent } from '../suspense-popup/suspense-popup.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
const suspenseForm = new FormGroup({
  suspenseStore: new FormControl('', [Validators.required]),
  senderStore: new FormControl('', [Validators.required]),
  qunatity:new FormControl('',[Validators.required])
});
@Component({
  selector: 'app-materials-transfer-request',
  templateUrl: './materials-transfer-request.component.html',
  styleUrls: ['./materials-transfer-request.component.scss'],
})
export class MaterialsTransferRequestComponent implements OnInit {
  data: any[];
  estimateCharges: FormGroup;
  materialData: any[];
  materialSearchControl: FormControl;
  filteredMaterialUnits: any[];
  storeData: any = [];
  suspenseStoreData: any = [];
  fetchedStoredData: any = {};
  receiverStoredData: any = {};
  payload: any = {};
  suspenseForm: FormGroup = suspenseForm;
  error: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uploadMaterialService: UploadMaterialService,
    private configurationService: ConfigurationService,
    private materialIntentService: MaterialsIntentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.data = [];
    this.materialData = [];
    this.materialSearchControl = new FormControl();
    this.filteredMaterialUnits = [];

    this.estimateCharges = this.formBuilder.group({
      materialSearchControl: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeCode = sessionStorage.getItem('office-id');
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeId: officeCode,
      };
      this.storeData =
        await this.uploadMaterialService.getUploadMaterialStoreData(filter);
      this.materialData =
        await this.configurationService.getmaterialLabourMasterGetDataMlType({
          apiKey,
          serviceKey,
          userCode,
          userName,
          userRole,
          mlType: 'MATERIAL',
        });

      this.suspenseStoreData =
        await this.materialIntentService.getSuspenseStoreMasterByStoreMasterOfficeId(
          filter
        );
    });
    this.materialSearchControl.valueChanges
    .pipe(
        startWith(''),
        map((value) => this.filterMaterialUnits(value))
    )
    .subscribe((filteredUnits) => {
        this.filteredMaterialUnits = filteredUnits;
    });
    this.resetForm();
  }
  resetForm() {
    this.suspenseForm = new FormGroup({
      suspenseStore: new FormControl('', [Validators.required]),
      senderStore: new FormControl('', [Validators.required]),
      qunatity:new FormControl('',[Validators.required])
    });
  }
  filterMaterialUnits(value: any): any[] {
    return this.materialData.filter((data) =>
      (data.mlCode + '-' + data.mlName)?.toLowerCase().includes(value)
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
        this.materialSearchControl.reset();
        this.filteredMaterialUnits = [];
      }
    }
  }
  deleteDataItem(index: number): void {
    this.data.splice(index, 1);
  }

  onMaterialUnitSelected(event: any): void {
    const selectedMaterial = event.option.value;
    const materialData = this.materialData.find(
      (data) => data.mlName === selectedMaterial
    );
  }
  onStoreChange(storeMasterId) {
    this.fetchedStoredData = this.storeData.find(
      (store) => store.storeMasterId === storeMasterId
    );
  }
  onSuspenseStoreChange(storeMasterId) {
    this.receiverStoredData = this.suspenseStoreData.find(
      (store) => store.storeMasterId === storeMasterId
    );
  }
  openConfirmationDialog() {
    this.suspenseForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(SuspensePopupComponent, {
      width: 'auto',
      data: { type: 'indent' }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onSubmit(); 
      }
    });
  }
  }
  isValidForm(): boolean {
    this.suspenseForm.markAllAsTouched();
    console.log('Form Valid?', this.suspenseForm.valid);
    let hasError = false;
    Object.keys(this.suspenseForm.controls).forEach((key) => {
      const control = this.suspenseForm.get(key);
  
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
  
    if (!this.payload.senderStoreId || !this.payload.suspenseStoreId) {
      this.snackBar.open('Please select stores', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }
  
    try {
      const saveData = await this.materialIntentService.saveMaterialTransferRequestData(
        filterParams,
        {
          wmMaterialsIndentDTO: {
            officeId: sessionStorage.getItem('office-id'),
            storeCode: this.fetchedStoredData.storeCode,
            storeMasterId: this.fetchedStoredData.storeMasterId,
            typeOfIndent: 'SUSPENSE_INDENT',
            receiverStoreId: this.receiverStoredData.storeMasterId,
            receiverStoreCode: this.receiverStoredData.storeCode,
          },
          wmMaterialsIndentTransLogDTO: [...this.payloadMaterialData],
        }
      );
  
      this.data = [];
      this.materialSearchControl.reset();
      this.payload = {};
  
      const { wmMaterialsIndentId, materialsIndentNo, materialsIndentDate, messageText } = saveData;
  
      this.snackBar.open(messageText || 'Material Transfer Request Success', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      }).onAction().subscribe(() => {
        this.snackBar.dismiss();
        this.router.navigate(['/work-management', 'material-suspense-generated'], {
          queryParams: {
            wmMaterialsIndentId,
            materialsIndentNo,
            materialsIndentDate,
          },
        });
      });
    } catch (error) {
      console.error('Failed to submit the request:', error);
      this.snackBar.open('Failed to submit the request. Please try again.', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  }
  
}


