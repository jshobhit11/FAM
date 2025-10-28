import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkExecutionService } from 'src/app/services/work-execution.service';

@Component({
  selector: 'app-actual-quantity',
  templateUrl: './actual-quantity.component.html',
  styleUrls: ['./actual-quantity.component.scss'],
})
export class ActualQuantityComponent implements OnInit {
  tableData: any[] = [];
  quantityCount: number = 0;
  materialCode: string;
  workPart: string;
  selectedSerialNo: string;
  selectedBadgeNumber: string;
  selectedManufacture: string;
  addedData: any[] = [];
  availableSerialNumbers: string[] = [];
  static allAddedSerialNumbers: Set<string> = new Set();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ActualQuantityComponent>,
    private workExecutionService: WorkExecutionService
  ) {}

  async ngOnInit() {
    this.quantityCount = this.data.actualQuantity;
    this.materialCode = this.data.materialCode;
    this.workPart = this.data.workPart;

    // Load previously saved data
    this.addedData = this.data.actualQuantityData || [];

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const wmWorkorderRegisteredId = this.data.workOrderRegisteredId;
    const materialMasterId = this.data.materialsMasterId;

    const filterParams: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      officeCode,
      materialMasterId,
      wmWorkorderRegisteredId,
    };

    const fetchedData =
      await this.workExecutionService.getWorkExecutionMaterialIndentData(
        filterParams
      );
    this.tableData = Array.isArray(fetchedData) ? fetchedData : [fetchedData];

    // Add serial numbers from the loaded addedData to the static Set
    this.addedData.forEach(item => {
      ActualQuantityComponent.allAddedSerialNumbers.add(item.serialNo);
    });

    this.updateAvailableSerialNumbers();
  }

  updateAvailableSerialNumbers() {
    this.availableSerialNumbers = this.tableData
      .filter(
        (item) =>
          !ActualQuantityComponent.allAddedSerialNumbers.has(item.serialNo)
      )
      .map((item) => item.serialNo);

    console.log('Available Serial Numbers:', this.availableSerialNumbers);
  }

  onSerialNoChange(serialNo: string) {
    this.selectedSerialNo = serialNo;
    const selectedItem = this.tableData.find(
      (item) => item.serialNo === serialNo
    );
    this.selectedBadgeNumber = selectedItem ? selectedItem.badgeNumber : '';
    this.selectedManufacture = selectedItem ? selectedItem.manufacture : '';
  }

  addDataToAddedData() {
    if (this.addedData.length < this.quantityCount) {
      const selectedItem = this.tableData.find(
        (item) => item.serialNo === this.selectedSerialNo
      );
      if (selectedItem) {
        this.addedData.push({
          materialCode: this.materialCode,
          part: this.workPart,
          serialNo: selectedItem.serialNo,
          badgeNumber: selectedItem.badgeNumber,
          manufacture: selectedItem.manufacture,
          estimationMaterialsRegisteredId: this.data.estimationMaterialsRegisteredId,  
        });
        ActualQuantityComponent.allAddedSerialNumbers.add(
          selectedItem.serialNo
        );
  
        console.log('Item Added:', selectedItem);
        this.updateAvailableSerialNumbers();
      }
    }
  }
  
  removeData(index: number) {
    const removedItem = this.addedData.splice(index, 1)[0];
    ActualQuantityComponent.allAddedSerialNumbers.delete(removedItem.serialNo);
    this.updateAvailableSerialNumbers();
  }

  onApply() {
    const updatedData = this.addedData.map(item => ({
      ...item,
      estimationMaterialsRegisteredId: this.data.estimationMaterialsRegisteredId
    }));
  
    this.dialogRef.close({
      data: updatedData,
      estimationMaterialsRegisteredId: this.data.estimationMaterialsRegisteredId
    });
  }
  
}
