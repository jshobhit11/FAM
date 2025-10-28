import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UploadMaterialService } from 'src/app/services/upload-material.service';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
export interface FieldReportData {
  serviceRequestNo: number;
  attributeSequenceNo: number;
  attributeDesc: string;
  attributeValue: string;
}

const ELEMENT_DATA: FieldReportData[] = [];

@Component({
  selector: 'app-field-report',
  templateUrl: './field-report.component.html',
  styleUrls: ['./field-report.component.scss'],
})
export class FieldReportComponent implements OnInit {
  serviceRegistrationId: string;
  returnUrl: string | null = null;
  displayedColumns: string[] = [
    'serviceRequestNo',
    'attributeSequenceNo',
    'attributeDesc',
    'attributeValue',
  ];
  dataSource = new MatTableDataSource<FieldReportData>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  fieldReportData: any[] = [];

  constructor(
    private uploadMaterialService: UploadMaterialService,
    private route: ActivatedRoute,
    private router: Router,
    private loader:LoaderService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      this.loader.show('Data Loading');
      console.log('Query Params:', params);
      this.serviceRegistrationId = params['serviceRegistrationId'];
      console.log('Service Registration ID:', this.serviceRegistrationId);
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeCode = sessionStorage.getItem('office-id');
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeCode,
        serviceRegistrationsId: this.serviceRegistrationId,
      };

      this.fieldReportData = await this.uploadMaterialService.getFieldReport(
        filters
      );
      this.dataSource = new MatTableDataSource(this.fieldReportData);
      this.loader.hide();
    });
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/main/full-details';
  }
  closeReport() {
    this.router.navigateByUrl(this.returnUrl);
  }
}
