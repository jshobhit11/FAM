import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { AlternateMaterialService } from 'src/app/services/alternate-material.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
@Component({
  selector: 'app-material-popup',
  templateUrl: './material-popup.component.html',
  styleUrls: ['./material-popup.component.scss']
})
export class MaterialPopupComponent implements OnInit {
  @Output() saveDataEvent = new EventEmitter<any>();
  dataItems: any;
  AlternateMaterialData: any;
  StoreInventoryData: any; 
  addedMaterials: any[] = [];
  selectedMaterial: any = {};
  issuedQty: any;
  selectedMaterialRecords: any[] = [];
  totalIssuedQty: number = 0;
  totalAmount: number = 0;
  filteredAlternateMaterialData: any[] = [];
  snackBarRef: MatSnackBarRef<SimpleSnackBar>;
  searchText: string = '';
  recordAdded: boolean = false;
  wmMaterialsIndentTransLogId: any;
  constructor(
    public dialogRef: MatDialogRef<MaterialPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private alternatematerialService: AlternateMaterialService,
    private snackBar: MatSnackBar,
    private dataSharingService: DataSharingService,
  ) { 
    this.dataItems = dialogData.matIndentTLog;
    this.issuedQty = dialogData.totalIssuedQty;
    this.StoreInventoryData = {};
    console.log('dataItems:', this.dataItems);
  }
  
  async ngOnInit() {
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
      mlRate: this.dataItems.materialRate,
      storeInventoryId: this.dataItems.storeInventoryId,
      materialTypeMasterId: this.dataItems.materialTypeMasterId,
    };
    this.AlternateMaterialData = await this.alternatematerialService.getAlternateMaterialRateAndMaterialBymaterialMasterId(filter);
    this.filteredAlternateMaterialData = [...this.AlternateMaterialData];
    console.log("old material details",this.dataItems)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateFilteredData() {
    this.filteredAlternateMaterialData = this.AlternateMaterialData.filter(material =>
      material.mlName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  async addMaterial() {
    if (this.recordAdded) {
      return;
    }
      const mlName = this.selectedMaterial.mlName;
      const materialsLabourMasterId = mlName.materialsLabourMasterId;
      const storeInventoryId = mlName.storeInventoryId;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const storeFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        storeInventoryId: storeInventoryId,
        materialMasterId: materialsLabourMasterId,
      };
  
      try {
        const response = await this.alternatematerialService.getStoreInventoryDataForAlternateMaterials(storeFilter);

        if (Array.isArray(response) && response.length > 0) {
          const firstItem = response[0]; 
          if ('newCurrentQty' in firstItem && 'usedCurrentQty' in firstItem) {
            const newQuantity = firstItem.newCurrentQty;
            const usedQuantity = firstItem.usedCurrentQty;
            const part=firstItem.part;
            const wmMaterialsIndentTransLogId = firstItem.wmMaterialsIndentTransLogId;
            this.wmMaterialsIndentTransLogId = wmMaterialsIndentTransLogId;
            const materialsMasterId = this.dataItems.materialsMasterId;
            const wmWorkorderRegisteredId=this.dataItems.wmWorkorderRegisteredId;
            const newRecord = {
              mlName: mlName.mlName,
              mlCode: mlName.mlCode,
              mlUnit: mlName.mlUnit,
              mlRate: mlName.mlRate,
            //  materialsLabourMasterId: mlName.materialsLabourMasterId,
              storeInventoryId: mlName.storeInventoryId,
              estimatedQty: this.dataItems.estimatedQuantity,
              drawnQty: this.dataItems.receivedQuantity,
              requestedQty: this.dataItems.requestQuantity,
              alternateRequestedQty: Number(this.dataItems.requestQuantity) - Number(this.issuedQty),
              issuedNewQty: 0,
              issuedUsedQty: 0,
              storeNewQunatity: newQuantity,
              storeUsedQunatity: usedQuantity,
              part:this.dataItems.part,
              materialsLabourMasterId:mlName.materialsLabourMasterId,
              wmMaterialsIndentTransLogId: this.dataItems.wmMaterialsIndentTransLogId,
              materialsMasterId: materialsMasterId,
              wmWorkorderRegisteredId:wmWorkorderRegisteredId,
            };
  
            this.selectedMaterialRecords.push(newRecord);
            this.addedMaterials.push(this.selectedMaterial);
            this.selectedMaterial = {};
            this.recordAdded = true;
          } else {
            console.error('Properties newCurrentQty and usedCurrentQty are missing in the first object of the response.');
            this.recordAdded = false;
          }
        } else {
          console.error('API response is not an array or is empty.');
          this.showSnackbar('Selected Materials not available in the store');
          this.recordAdded = false;
        }
      } catch (error) {
        console.error('Error fetching Store Inventory Data:', error);
        this.recordAdded = false;
      }
  }
  showSnackbar(message: string) {
    this.snackBarRef = this.snackBar.open(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      panelClass: ['error-snackbar'],
    });
  
    this.snackBarRef.onAction().subscribe(() => {
      this.snackBarRef.dismiss();
    });
  }
  
  calculateTotalIssuedQty() {
    let total = 0;
    for (const record of this.selectedMaterialRecords) {
      const issuedNewQty = record.issuedNewQty || 0;
      const issuedUsedQty = record.issuedUsedQty || 0;
      total += issuedNewQty + issuedUsedQty;
    }
    this.totalIssuedQty = total;
  }
  
  calculateTotalAmount() {
    let total = 0;
    let showSnackBar = false;

    for (const record of this.selectedMaterialRecords) {
      const rate = record.mlRate || 0;
      const issuedNewQty = record.issuedNewQty || 0;
      const issuedUsedQty = record.issuedUsedQty || 0;
      const totalIssuedQty = issuedNewQty + issuedUsedQty;

      if (totalIssuedQty <= record.alternateRequestedQty) {
        const amount = rate * totalIssuedQty;
        total += amount;
        record.amount = amount;
      } else {
        showSnackBar = true;
        record.issuedNewQty = 0;
        record.issuedUsedQty = 0;
        record.amount = 0;
      }
    }

    this.totalAmount = total;

    if (showSnackBar) {
      this.snackBarRef = this.snackBar.open('Total issued quantity cannot be greater than the alternate material quantity.', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: ['error-snackbar'],

      });

      this.snackBarRef.onAction().subscribe(() => {
        this.snackBarRef.dismiss();
        this.resetFields();
      });
    }
  }

  resetFields() {
    this.totalIssuedQty = 0;
    this.totalAmount = 0;
    this.selectedMaterialRecords.forEach(record => {
      record.issuedNewQty = 0;
      record.issuedUsedQty = 0;
      record.amount = 0;
    });
  }
  updateStoreBalance(record: any) {
    if (record.issuedNewQty !== undefined && record.issuedUsedQty !== undefined) {

      const newBalanceNewQty = record.storeNewQunatity - record.issuedNewQty;
      const newBalanceUsedQty = record.storeUsedQunatity - record.issuedUsedQty;
      record.storeNewBalanceQunatity = newBalanceNewQty;
      record.storeUsedBalanceQunatity = newBalanceUsedQty;
    }
  }
  saveAlternateMaterials() {
    console.log('Saving alternate materials:', this.selectedMaterialRecords);
    this.calculateTotalIssuedQty();
    
    this.selectedMaterialRecords.forEach(record => {
      record.totalIssuedQty = this.totalIssuedQty;
      record.materialMasterId = this.dataItems.materialMasterId;
      record.materialTypeMasterId = this.dataItems.materialTypeMasterId;
      record.wmWorkorderRegisteredId=this.dataItems.wmWorkorderRegisteredId;
      record.wmMaterialsIndentTransLogId = this.dataItems.wmMaterialsIndentTransLogId;
    });
  
    this.dataSharingService.updateAlternateMaterialsData(this.selectedMaterialRecords);
    this.selectedMaterialRecords = [];
    this.showSuccessNotification('Alternate Materials Data added successfully');
  }
  
  showSuccessNotification(message: string) {
    document.body.style.pointerEvents = 'none'; 
    this.snackBarRef = this.snackBar.open(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      panelClass: ['success-snackbar'],
    });
  
    this.snackBarRef.onAction().subscribe(() => {
      document.body.style.pointerEvents = 'auto';
      this.snackBarRef.dismiss();
      this.closeDialog(); 
    });
  }
  
  
  
  
  displayMaterialName(material: any): string {
    return material ? `${material.mlCode} - ${material.mlName}` : '';
  }
  
  deleteDataItem(index: number): void {
    this.selectedMaterialRecords.splice(index, 1);
    this.recordAdded = false;
  }
}
