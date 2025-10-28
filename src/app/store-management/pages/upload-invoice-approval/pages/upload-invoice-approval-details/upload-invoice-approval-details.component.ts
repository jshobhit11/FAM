import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-invoice-approval-details',
  templateUrl: './upload-invoice-approval-details.component.html',
  styleUrls: ['./upload-invoice-approval-details.component.scss'],
})
export class UploadInvoiceApprovalDetailsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('UploadInvoiceApprovalDetailsComponent');
  }
}
