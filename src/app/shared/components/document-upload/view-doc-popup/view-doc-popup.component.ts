import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UploadMaterialService } from 'src/app/services/upload-material.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-view-doc-popup',
  templateUrl: './view-doc-popup.component.html',
  styleUrls: ['./view-doc-popup.component.scss']
})
export class ViewDocPopupComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  notificationRef: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private uploadMaterialService: UploadMaterialService,
    private snackbar: MatSnackBar,
    private Service: CommonService,
    private dialogRef: MatDialogRef<ViewDocPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.uploadForm = this.fb.group({
      uploadfiletype: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('Received parameter:', this.data.serviceRegistrationId);

  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    if (file) {
      this.uploadForm.patchValue({
        file: file
      });
    }
  }
  showData: any = {};
  showtable: boolean = false;
  onUpload(): void {
    // Mark all fields as touched to display errors
    this.uploadForm.markAllAsTouched();
    
    // Retrieve form values
    const file = this.uploadForm.get('file').value;
    const processName = this.uploadForm.get('uploadfiletype').value;
  
    // Ensure the form is valid before proceeding
    if (this.uploadForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('multipartFile', file);
      
      // Upload document using the provided service
      this.uploadMaterialService.docUpload(
        sessionStorage.getItem('api-key'),
        sessionStorage.getItem('service-key'),
        sessionStorage.getItem('user-code'),
        sessionStorage.getItem('user-name'),
        sessionStorage.getItem('user-role'),
        this.selectedFile.name,
        this.data.serviceRegistrationId, 
        this.data.serviceRegistrationId, // Ensure correct usage of serviceRegistrationId
        processName,  // Dynamically use processName based on user input
        this.selectedFile // The file selected by the user
      )
      .then((response) => {
        if(Response) {
         
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }
            this.notificationRef = this.snackbar.open(response.messageText,
            'OK',
            {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            }
          );
          this.notificationRef.afterDismissed().toPromise().then(() => {
            this.Service.sendUpdate('Document_Uploaded');
            this.dialogRef.close();
            }).catch((error) => {
            console.error('Error closing dialog:', error);
            });
          }
  })
}}
  

  onClose(): void {
    this.dialogRef.close();
  }

  navigateBack(): void {
    this.router.navigate(['./main/document-upload'], {
      queryParams: {
        statusCode: 15,
        label: 'DOCUMENT UPLOAD',
        type: 'list',
      },
    });
  }
}
