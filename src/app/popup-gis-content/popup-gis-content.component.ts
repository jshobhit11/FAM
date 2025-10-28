import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-popup-gis-content',
  templateUrl: './popup-gis-content.component.html',
  styleUrls: ['./popup-gis-content.component.scss']
})
export class PopupGisContentComponent implements OnInit {
  safeUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public url: string,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PopupGisContentComponent>
  ) {}

  ngOnInit(): void {
    console.log("PopupGisContentComponent===", this.url);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
