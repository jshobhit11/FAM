import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddDelegationPowerMasterComponent } from './add-delegation-power-master/add-delegation-power-master.component';
import { UpdateDelegationPowerMasterComponent } from './update-delegation-power-master/update-delegation-power-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface DelegationName {
  delegationOfPowerMasterId: string;
  typeOfPower: string;
  categoryCode: string;
  minLoadAmount: string;
  maxLoadAmount: string;
  unit: string;
  designationMasterId: string;
  workExecutionMethod: string;
  workCategoryMasterId: string;
}
const DelegationMaster_DATAs: DelegationName[] = [];
@Component({
  selector: 'app-delegation-power-master',
  templateUrl: './delegation-power-master.component.html',
  styleUrls: ['./delegation-power-master.component.scss'],
})
export class DelegationPowerMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(DelegationMaster_DATAs);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Delegation Power Master data', message['text']);
      if (message['text'] == 'Delegation Power Master Updated') {
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
      .getDelegationPowerMasterGetAll(filters)
      .then((data) => {
        console.log('Delegation Power Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Delegation Power Master all data', this.dataSource);
      });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'typeOfPower',
    'workCategoryMasterId',
    'categoryCode',
    'minLoadAmount',
    'maxLoadAmount',
    'unit',
    'designationMasterId',
    'workExecutionMethod',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDelegationMasterItemDialog() {
    this.dialog.open(AddDelegationPowerMasterComponent, {
      width: '100%',
    });
  }

  openUpdateDelegationMasterItemDialog(delegationOfPowerMasterId: any) {
    this.dialog.open(UpdateDelegationPowerMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: delegationOfPowerMasterId,
      },
    });
  }
}
