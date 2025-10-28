import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-premises-doc-upload',
  templateUrl: './premises-doc-upload.component.html',
  // styleUrls: ['./premises-doc-upload.component.css']
})
export class PremisesDocUploadComponent {
  selectedFile: File | null = null;
  uploadSuccess = false;
  uploadError: string | null = null;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadSuccess = false;
    this.uploadError = null;
  }

  onUpload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('apiKey', 'ss01Agh0639');
    formData.append('serviceKey', 'ss01gbtr');

    formData.append('userCode', 'A45123ET2');

    formData.append('userName', 'AE_FRAZERTOWN');

    formData.append('userRole', 'ROLE_AE');
    formData.append('documentName', this.selectedFile.name);

    formData.append('documentTypeId', 161 as any);
    formData.append('documentReferenceNumber', 'est4594848048');

    formData.append('serviceRegisterationsId', 7727249 as any);
    formData.append('processName', 'Estimation%20Forms');



    // Example backend API endpoint
    const apiUrl = 'http://localhost:8080/api/documentUpload/storeDocumentFile';

    this.http.post(apiUrl, formData).subscribe({
      next: (response) => {
        this.uploadSuccess = true;
        console.log('Upload successful:', response);
      },
      error: (err) => {
        this.uploadError = 'File upload failed!';
        console.error('Upload error:', err);
      }
    });
  }
}
