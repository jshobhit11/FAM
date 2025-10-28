import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddFinancialYearMasterComponent } from './add-financial-year-master/add-financial-year-master.component';
import { UpdateFinancialYearMasterComponent } from './update-financial-year-master/update-financial-year-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  financialYear: string;
  financialYearStartDate: string;
  financialYearEndDate: string;
  displayFlag: number;
}
const FinancialYear_DATA: MateName[] = [];
@Component({
  selector: 'app-financial-year-master',
  templateUrl: './financial-year-master.component.html',
  styleUrls: ['./financial-year-master.component.scss'],
})
export class FinancialYearMasterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(FinancialYear_DATA);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Financial Year data', message['text']);
      if (message['text'] == 'Financial Year Updated') {
        this.ngOnInit();
      }
    });
  }

  async ngOnInit() {
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
    this.configurationService
      .getfinanacialYearGetAllData(filters)
      .then((data) => {
        console.log('Financial Year Master data from server', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Financial Year Master all data', this.dataSource);
      });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'financialYear',
    'financialYearStartDate',
    'financialYearEndDate',
    'displayFlag',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddFinancialYearMasterDialog() {
    this.dialog.open(AddFinancialYearMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {},
    });
  }

  UpdateFinancialYearMasterComponent(financialYearMasterId: any) {
    this.dialog.open(UpdateFinancialYearMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field3: financialYearMasterId,
      },
    });
  }
}
