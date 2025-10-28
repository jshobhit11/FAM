import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddAccountHeadMainMasterComponent } from './add-account-head-main-master/add-account-head-main-master.component';
import { UpdateAccountHeadMainMasterComponent } from './update-account-head-main-master/update-account-head-main-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
export interface AccountHeadMainInfo {
  accountHeadMainName: string;
  accountHeadMainCode: string;
}
const AccountHeadMainInfo_DATA: AccountHeadMainInfo[] = [];
@Component({
  selector: 'app-account-head-main-master',
  templateUrl: './account-head-main-master.component.html',
  styleUrls: ['./account-head-main-master.component.scss'],
})
export class AccountHeadMainMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(AccountHeadMainInfo_DATA);
  subscriptionName: any;

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Account Head Main Master data', message['text']);
      if (message['text'] == 'Account Head Main Master Updated') {
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
    this.configurationService.getAccHeadMainGetAllData(filters).then((data) => {
      console.log('Account Head Main Master Data from service', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Account Head Main Master all data', this.dataSource);
    });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'accountHeadMainName',
    'accountHeadMainCode',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddAccountHeadMainTypeDialog() {
    this.dialog.open(AddAccountHeadMainMasterComponent, {
      width: '100%',
    });
  }

  openUpdateAccountHeadMainTypeDialog(amAccountHeadMainMasterId: any) {
    this.dialog.open(UpdateAccountHeadMainMasterComponent, {
      width: '100%',
      data: amAccountHeadMainMasterId,
      disableClose: true,
    });
  }
}
