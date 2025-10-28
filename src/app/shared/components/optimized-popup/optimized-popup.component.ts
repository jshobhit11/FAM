import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-optimized-popup',
  templateUrl: './optimized-popup.component.html',
  styleUrls: ['./optimized-popup.component.scss'],
})
export class OptimizedPopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OptimizedPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  ngOnInit(): void {}

  close(result: string): void {
    this.dialogRef.close(result);
  }
}
