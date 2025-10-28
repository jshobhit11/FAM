import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MobileUtils } from '../lib/mobile-utils';

@Component({
  selector: 'app-view-feasibility-point-popup',
  templateUrl: './view-feasibility-point-popup.component.html',
  styleUrls: ['./view-feasibility-point-popup.component.scss'],
})
export class ViewFeasibilityPointPopupComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ViewFeasibilityPointPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('Received data done by naga:', this.data.documentId);
  }
  onClose(): void {
    this.dialogRef.close();
  }

  downloadPDF(documentId: number) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = 'ROLE_AEE';
    const userName = 'AEE_E1PILLANA_GARDEN';
    const userCode = 'EAE12EMT65';
    this.http
      .get(
        `${environment.baseURL}/api/documentUpload/getDocumentFileByDocumentId?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&documentId=${documentId}`,
        { observe: 'response', responseType: 'blob' }
      )
      .subscribe(
        (response) => {
          const blob = new Blob([response.body], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = 'Work_Report.pdf';
          document.body.appendChild(link);
          if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
          document.body.removeChild(link);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  downloadImage(documentId: number) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = 'ROLE_AEE';
    const userName = 'AEE_E1PILLANA_GARDEN';
    const userCode = 'EAE12EMT65';

    this.http
      .get(
        `${environment.baseURL}/api/documentUpload/getDocumentFileByDocumentId?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&documentId=${documentId}`,
        { observe: 'response', responseType: 'blob' }
      )
      .subscribe(
        (response) => {
          const blob = new Blob([response.body], { type: 'image/png' }); // Ensure correct type for PNG image
          const fileURL = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = fileURL;
          link.download = 'Image_Report.png'; // Set download filename with correct extension
          document.body.appendChild(link);
          if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
          document.body.removeChild(link);
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
