import { Component} from '@angular/core';
import { GatePassAcknowledgementService } from 'src/app/services/gate-pass-acknowledgement.service';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '../../document.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewDocPopupComponent } from './view-doc-popup/view-doc-popup.component';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent {
  private subscriptionName: Subscription;
  serviceRegistrationId: number;
  apiUrl = environment.baseURL;
  uploadForm: FormGroup;
  documentData: any[] = [];
  snackBar: any;
  constructor( 
    public dialog: MatDialog,
    private documentService: DocumentService,  
    private Service: CommonService,
    private http: HttpClient, 
    private gatePassAcknowledgementService: GatePassAcknowledgementService
    ) {
      this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
        //message contains the data sent from service
        console.log('Document_Uploaded===', message['text']);
        if (message['text'] == 'Document_Uploded') {
    
          this.ngOnInit();
        }
      });
     }
    async ngOnInit() {
      this.serviceRegistrationId = this.documentService.getServiceRegistrationId();
      console.log("service Registarion Id===",this.serviceRegistrationId)
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const serviceRegistrationsId = this.serviceRegistrationId;
      const filterParams={
        apiKey,serviceKey,userRole,userCode,userName,serviceRegistrationsId
      }
      this.documentData = await this.gatePassAcknowledgementService.getDataByServiceRegistrationsId(filterParams);
    } 
    decodeURIComponent(encodedURI: string): string {
      return decodeURIComponent(encodedURI);
    }   
  onDownloadPDF(documentId: number) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    this.http.get(
      `${this.apiUrl}/api/documentUpload/getDocumentFileByDocumentId?apiKey=${apiKey}&serviceKey=${serviceKey}&userRole=${userRole}&userName=${userName}&userCode=${userCode}&documentId=${documentId}`,
      { responseType: 'blob' }
    ).subscribe(
      (response: Blob) => {
        const blobURL = window.URL.createObjectURL(response);
        
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = 'document.pdf'; 

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        window.URL.revokeObjectURL(blobURL);
      },
      (error) => {
        console.error('Error downloading PDF:', error);
      }
    );
  }
  navigateBack() {
    this.documentService.navigateBack();
  }
  uploadDoc(){
    this.dialog.open(ViewDocPopupComponent, {
      
      width: '100%',
      data: {serviceRegistrationId : this.serviceRegistrationId }
    });
  }
}

