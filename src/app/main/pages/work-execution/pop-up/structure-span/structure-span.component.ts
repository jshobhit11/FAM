import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-structure-span',
  templateUrl: './structure-span.component.html',
  styleUrls: ['./structure-span.component.scss'],
})
export class StructureSpanComponent implements OnInit {
  numberOfSpans: number = 0;
  tableData: any[] = [];
  totalQ: number = 0;
  totalQuantityCount: number = 0;
  materialCode: string;
  workPart: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<StructureSpanComponent>
  ) {
    this.materialCode = data.materialCode;
    this.workPart = data.workPart;
  }

  ngOnInit() {

    this.totalQ = this.data.actualQuantity || 0;
    this.totalQuantityCount = this.totalQ;

    if (this.data.spanData && Array.isArray(this.data.spanData.data) && this.data.spanData.data.length > 0) {
      this.tableData = this.data.spanData.data;
      this.numberOfSpans = this.tableData.length;
    } else {
      this.generateTableData();
    }
  }

  generateTableData() {
    if (this.numberOfSpans <= 0) {
      this.tableData = [];
      return;
    }
  
    if (this.numberOfSpans > this.tableData.length) {
      for (let i = this.tableData.length + 1; i <= this.numberOfSpans; i++) {
        this.tableData.push({
          span: `span${i}`,
          length: 0,
          isBusbar: '0',
          estimationMaterialsRegisteredId: this.data.estimationMaterialsRegisteredId,
          materialCode: this.materialCode,
        });
      }
    } else if (this.numberOfSpans < this.tableData.length) {
      this.tableData = this.tableData.slice(0, this.numberOfSpans);
    }

    const totalLength = this.getTotalLength();
    this.totalQuantityCount = parseFloat((this.totalQ - totalLength).toFixed(6));
  }
  
  getTotalLength(): number {
    return this.tableData.reduce((total, span) => total + parseFloat(span.length || 0), 0);
  }
  

  onLengthChange(length = 0, i: number) {
    const originalLength = this.tableData[i].length;
    this.tableData[i].length = length;

    const totalLength = this.getTotalLength();
    if (totalLength > this.totalQ) {
      alert('Total span length cannot exceed the actual quantity.');
      this.tableData[i].length = originalLength;
      return;
    }

    this.totalQuantityCount = parseFloat((this.totalQ - totalLength).toFixed(2));

    if (totalLength === this.totalQ) {
      this.tableData = this.tableData.slice(0, i + 1);
      this.numberOfSpans = this.tableData.length;
    }
  }

  addSpan() {
    if (this.getTotalLength() < this.totalQ) {
      this.tableData.push({
        span: `span${this.tableData.length + 1}`,
        length: 0,
        isBusbar: '0',
        estimationMaterialsRegisteredId: this.data.estimationMaterialsRegisteredId,
        materialCode: this.materialCode,
      });
      this.numberOfSpans = this.tableData.length;
    } else {
      alert('Cannot add more spans as the total length has been met.');
    }
  }

  onApply() {
    const totalLength = this.getTotalLength();
    const tolerance = 1e-6; 
  
    if (Math.abs(totalLength - this.totalQ) > tolerance) {
      alert('Total span length must exactly match the actual quantity.');
      return;
    }
  
    this.dialogRef.close({
      data: this.tableData,
      materialMasterId: this.data.materialsMasterId,
      totalQ: this.totalQuantityCount,
      numberOfSpans: this.numberOfSpans,
      materialCode: this.materialCode,
      workPart: this.workPart,
    });
  }
  
}
