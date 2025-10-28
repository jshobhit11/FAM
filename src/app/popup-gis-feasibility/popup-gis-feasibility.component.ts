import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-popup-gis-feasibility',
  templateUrl: './popup-gis-feasibility.component.html',
  styleUrls: ['./popup-gis-feasibility.component.scss'],
})
export class PopupGisFeasibilityComponent implements OnInit {
  safeUrl: SafeResourceUrl;
  constructor(
    @Inject(MAT_DIALOG_DATA) public url: string,
    private sanitizer: DomSanitizer,
    private dialogRef1: MatDialogRef<PopupGisFeasibilityComponent>
  ) {}

  ngOnInit(): void {
    console.log('PopupGisFeasibilityComponent===', this.url);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  onClose(): void {
    this.dialogRef1.close();
  }
}
