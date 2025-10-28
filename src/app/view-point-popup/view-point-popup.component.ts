import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-view-point-popup',
  templateUrl: './view-point-popup.component.html',
  styleUrls: ['./view-point-popup.component.scss']
})
export class ViewPointPopupComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ViewPointPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log('Received data:', this.data);
    if (this.data.substationName) {
      this.data.substationName = this.data.substationName.replace(/\)$/, '');
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

