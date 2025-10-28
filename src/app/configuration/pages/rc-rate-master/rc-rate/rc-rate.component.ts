import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RcDataSharedService } from 'src/app/services/rc-data-shared.service';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface RcRates {
  rateType: string;
  rcVendorName: string;
  rcCode: string;
  rateContractMasterId: string;
}

@Component({
  selector: 'app-rc-rate',
  templateUrl: './rc-rate.component.html',
  styleUrls: ['./rc-rate.component.scss'],
})
export class RcRateComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterValue: any;
  dataSource = new MatTableDataSource<RcRates>();
  selectedRateType: string = 'All';
  displayedColumns: string[] = [
    'slno',
    'rateType',
    'rcVendorName',
    'rcCode',
    'action',
    'export',
  ];

  constructor(
    private router: Router,
    private rcratesservices: ConfigurationService,
    private rcDataSharedService: RcDataSharedService,
    private Service: CommonService
  ) {}

  async ngOnInit() {
    await this.filterDataByRateType(this.selectedRateType);
  }

  async filterDataByRateType(rateType: string) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };

    const data = await this.rcratesservices.getRcRatesData(filters);
    const filteredData =
      rateType === 'All'
        ? []
        : data.filter(
            (item) => item.rateType.toLowerCase() === rateType.toLowerCase()
          );

    this.dataSource.data = filteredData;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
  }

  onAddRcRate(): void {
    this.router.navigate(['/configuration/add-rc-master']);
  }

  openUpdateRcRateMaster() {
    this.router.navigate(['/configuration/upadate-rc-master']);
  }
  async exportToExcel(rateContractMasterId: string) {
    if (this.selectedRateType === 'SR') {
      await this.exportData('SR');
    } else if (this.selectedRateType === 'RC') {
      await this.exportData('RC', rateContractMasterId);
    }
  }

  async exportData(rateType: string, rateContractMasterId?: string) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');

    const filterParams: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      rateType,
    };

    if (rateContractMasterId) {
      filterParams.rateContractMasterId = rateContractMasterId;
    }
    try {
      const response = await this.rcratesservices.getExcelsheetData(
        filterParams
      );
      const blob = await response.blob();
      this.saveAsExcelFile(blob, 'rc_rates');
    } catch (error) {}
  }
  saveAsExcelFile(blob: Blob, fileName: string): void {
    saveAs(blob, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }
}
