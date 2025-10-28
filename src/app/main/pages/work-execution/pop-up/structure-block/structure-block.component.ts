import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkExecutionComponent } from '../../work-execution.component';
import { WorkExecutionService } from '../../../../../services/work-execution.service';

@Component({
  selector: 'app-structure-block',
  templateUrl: './structure-block.component.html',
  styleUrls: ['./structure-block.component.scss'],
})
export class StructureBlockComponent implements OnInit {
  totalQuantity: number = 0;
  tempCount: number = 0;
  tableData: any[] = [];
  totalQuantityCount: number = 0;
  selectedItem: number;
  assetizedQuantity: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WorkExecutionComponent>,
    private workExecutionService: WorkExecutionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Initialize the table data
    this.tableData = this.data.materialPopupData.length
      ? this.data.materialPopupData // Use saved data if it exists
      : [
          {
            sno: 1,
            materialCode: this.data.materialCode,
            part: this.data.workPart,
            structure: '3-Structure',
            assetizedQuantity: 0,
            totalQuantity: 0,
            isDTStructure: '1',
          },
          {
            sno: 2,
            materialCode: this.data.materialCode,
            part: this.data.workPart,
            structure: '2-Structure',
            assetizedQuantity: 0,
            totalQuantity: 0,
            isDTStructure: '0',
          },
          {
            sno: 3,
            materialCode: this.data.materialCode,
            part: this.data.workPart,
            structure: '1-Structure',
            assetizedQuantity: 0,
            totalQuantity: 0,
            isDTStructure: '0',
          },
        ];

    // Set total quantity and temp count
    this.totalQuantityCount = Number(this.data.actualQuantity);
    this.totalQuantity = this.data.actualQuantity;
    this.tempCount = this.totalQuantity;

    // Map data to include material code and part dynamically
    this.tableData = this.tableData.map((table: any) => ({
      ...table,
      materialCode: this.data.materialCode,
      part: this.data.workPart,
      estimationMaterialsRegisteredId: this.data.estimationMaterialsRegisteredId,
    }));
  }

  submit() {
    console.log(this.tableData);
  }

  // calculateTotalQuantityCount(assetizedQuantity: number, i: number, s: string) {
  //   const quantityMultiplier = {
  //     '3-Structure': 3,
  //     '2-Structure': 2,
  //     '1-Structure': 1,
  //   }[s];

  //   if (quantityMultiplier !== undefined) {
  //     if (assetizedQuantity == null || assetizedQuantity === undefined) {
  //       this.tableData[i].totalQuantity = this.tableData[i].assetizedQuantity * quantityMultiplier;
  //       this.totalQuantityCount = this.tempCount;
  //       return;
  //     } else if (s === '1-Structure' && (quantityMultiplier * assetizedQuantity) <= this.totalQuantityCount) {
  //       this.totalQuantityCount = quantityMultiplier * assetizedQuantity;
  //       this.tableData[i].totalQuantity = assetizedQuantity * quantityMultiplier;

  //       const sum = this.tableData.reduce(
  //         (isum, item) => isum + parseInt(item.totalQuantity, 10),
  //         0
  //       );

  //       if (sum <= this.tempCount) {
  //         this.totalQuantityCount = this.tempCount - sum;
  //       }
  //     } else if ((assetizedQuantity * quantityMultiplier) <= this.totalQuantityCount) {
  //       this.totalQuantityCount -= assetizedQuantity * quantityMultiplier;
  //       this.tableData[i].totalQuantity = assetizedQuantity * quantityMultiplier;

  //       const sum = this.tableData.reduce(
  //         (isum, item) => isum + parseInt(item.totalQuantity, 10),
  //         0
  //       );

  //       if (sum <= this.tempCount) {
  //         this.totalQuantityCount = this.tempCount - sum;
  //       }
  //     } else {
  //       this.snackBar.open(
  //         'Actual Quantity Should equal to Total Quantity Count so Balance is 0',
  //         'OK'
  //       );
  //       this.tableData[i].totalQuantity = this.tableData[i].assetizedQuantity * quantityMultiplier;

  //       const sum = this.tableData.reduce(
  //         (isum, item) => isum + parseInt(item.totalQuantity, 10),
  //         0
  //       );
  //       if (sum !== this.tempCount) {
  //         this.totalQuantityCount = this.tempCount;
  //       }
  //     }
  //   }

  //   if (this.totalQuantityCount < 0) {
  //     this.snackBar.open(
  //       'Actual Quantity Should equal to Total Quantity Count so Balance is 0',
  //       'OK'
  //     );
  //     this.tableData[i].totalQuantity = 0;
  //     this.tableData[i].assetizedQuantity = 0;
  //   }
  // }
  calculateTotalQuantityCount(event: any, i: number, s: string) {
    const quantityMultiplier = {
      '3-Structure': 3,
      '2-Structure': 2,
      '1-Structure': 1,
    }[s];
  
    if (quantityMultiplier !== undefined) {
      const assetizedQuantity = parseFloat(event.target.value);
  
      if (isNaN(assetizedQuantity) || assetizedQuantity === 0) {
        this.tableData[i].totalQuantity = 0;
        this.totalQuantityCount = this.tempCount;
        return;
      }
      const totalQuantity = assetizedQuantity * quantityMultiplier;
  
      if (totalQuantity <= this.totalQuantityCount) {

        this.totalQuantityCount -= totalQuantity;
        this.tableData[i].totalQuantity = totalQuantity;
        const sum = this.tableData.reduce(
          (isum, item) => isum + parseInt(item.totalQuantity, 10),
          0
        );

        if (sum <= this.tempCount) {
          this.totalQuantityCount = this.tempCount - sum;
        }
      } else {
        this.snackBar.open(
          'Entered quantity exceeds the available balance.',
          'OK'
        );

        this.tableData[i].totalQuantity = 0;
        this.tableData[i].assetizedQuantity = 0;
        this.totalQuantityCount = this.tempCount;
      }
    }
    if (this.totalQuantityCount < 0) {
      this.snackBar.open(
        'Actual Quantity Should equal to Total Quantity Count so Balance is 0',
        'OK'
      );
      this.tableData[i].totalQuantity = 0;
      this.tableData[i].assetizedQuantity = 0;
    }
  }
  
  
  fetchIndexByStructure(structure: string): number {
    return this.tableData.findIndex(item => item.structure === structure);
  }

  updateUIValues(selectedStructure: string): void {
    const selectedItem = this.tableData.find(item => item.structure === selectedStructure);
    const index = this.fetchIndexByStructure(selectedStructure);

    if (selectedItem) {
      selectedItem.assetizedQuantity = 0;
      selectedItem.totalQuantity = 0;
      this.tableData[index] = { ...this.tableData[index], ...selectedItem };
    }
  }

  onApply() {
    this.dialogRef.close({
      data: this.tableData,                      
      materialMasterId: this.data.materialsMasterId,
      totalQuantityCount: this.totalQuantityCount,
      materialCode: this.data.materialCode,  
      part: this.data.workPart,             
    });
  }
}
