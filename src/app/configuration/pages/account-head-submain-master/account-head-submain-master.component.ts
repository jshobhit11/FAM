import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddAccountHeadSubmainMasterComponent } from './add-account-head-submain-master/add-account-head-submain-master.component';
import { UpdateAccountHeadSubmainMasterComponent } from './update-account-head-submain-master/update-account-head-submain-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
export interface AccountHeadSubmainInfo {
  accountHeadSubmainName: string;
  accountHeadSubmainCode: string;
  amAccountHeadMainMasterId: string;
}
const AccountHeadSubmainInfo_DATA: AccountHeadSubmainInfo[] = [];
@Component({
  selector: 'app-account-head-submain-master',
  templateUrl: './account-head-submain-master.component.html',
  styleUrls: ['./account-head-submain-master.component.scss'],
})
export class AccountHeadSubmainMasterComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(AccountHeadSubmainInfo_DATA);
  subscriptionName: any;
  accountMainData: any[] = [];
  accountHeadMainData: any = {};

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Account Head Submain master data', message['text']);
      if (message['text'] == 'Account Head Submain Master Updated') {
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
    this.configurationService.getAccHeadSubmainAllData(filters).then((data) => {
      console.log('Account Head Submain Master Data from service', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Account Head Submain Master all data', this.dataSource);
    });

    this.accountHeadMainData =
      await this.configurationService.getAccHeadMainGetAllData(filters);
    this.accountMainData = this.accountHeadMainData.map((accountMain) => ({
      amAccountHeadMainMasterId: accountMain.amAccountHeadMainMasterId,
      accountHeadMainName: accountMain.accountHeadMainName,
      accountHeadMainCode: accountMain.accountHeadMainCode,
    }));
  }

  displayedColumns: string[] = [
    'slno',
    'accountHeadSubmainName',
    'accountHeadSubmainCode',
    'amAccountHeadMainMasterId',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddAccountHeadSubmainTypeDialog() {
    this.dialog.open(AddAccountHeadSubmainMasterComponent, {
      width: '100%',
      data: {
        field1: this.accountHeadMainData,
      },
    });
  }

  openUpdateAccountHeadSubmainTypeDialog(amAccountHeadSubmainMasterId: any) {
    this.dialog.open(UpdateAccountHeadSubmainMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.accountHeadMainData,
        field2: amAccountHeadSubmainMasterId,
      },
    });
  }
}
