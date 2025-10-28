import { Component, OnInit } from '@angular/core';
import { UploadMaterialService } from 'src/app/services/upload-material.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-upload-invoice-approval',
  templateUrl: './upload-invoice-approval.component.html',
  styleUrls: ['./upload-invoice-approval.component.scss'],
})
export class UploadInvoiceApprovalComponent implements OnInit {
  constructor(private route: ActivatedRoute, private uploadMaterialService: UploadMaterialService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      console.log(params);
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeMasterId = sessionStorage.getItem('office-id');

      const data = await this.uploadMaterialService.getUploadMaterialApprovalDataByOfficeId({
        apiKey,
        serviceKey,
        userRole,
        userCode,
        userName,
        officeMasterId,
      });
      console.log(data);
    });
  }
}
