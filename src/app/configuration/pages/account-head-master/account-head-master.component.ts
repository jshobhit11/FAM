import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddAccountHeadMasterComponent } from './add-account-head-master/add-account-head-master.component';
import { UpdateAccountHeadMasterComponent } from './update-account-head-master/update-account-head-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface accountHeadName {
  accountMainHeadCode: string;
  accountMainHeadName: string;
  accountSubMainHeadCode: string;
  accountSubMainHeadName: string;
  accountHeadCode: string;
  accountMainHead: string;
}
const AccountHeadMaster_DATA: accountHeadName[] = [];
@Component({
  selector: 'app-account-head-master',
  templateUrl: './account-head-master.component.html',
  styleUrls: ['./account-head-master.component.scss'],
})
export class AccountHeadMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(AccountHeadMaster_DATA);
  dataSourceTarget = new MatTableDataSource(AccountHeadMaster_DATA);
  dataSourceTemp = new MatTableDataSource(AccountHeadMaster_DATA);

  subscriptionName: any;
  accountHead = [];
  accountSubHeadCode: any[];
  accountSubMainCode: any[];
  uniqueAccountHeadOptions: string[] = [];
  commentMap = new Map<string, number[]>();

  getAllData = [];
  getTargetData = [];
  getTempData = [];

  accountMainTypeData: any[] = [];
  accountMainData: any[] = [];
  accountMainHeadDescription: any[] = [];
  accountSubMainTypeData: any[] = [];
  accountSubMainData: any[] = [];

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Account head data', message['text']);
      if (message['text'] == 'Account head Updated') {
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
    this.configurationService.getAccountHeadMasterAllData(filters).then((data) => {
        console.log('Account Head Master Data from service', data);
        this.getAllData = data;

        const columnValues = data.map((item) => item.accountMainHeadCode);
        const uniqueValues = Array.from(new Set(columnValues));
        this.accountHead = uniqueValues;

        for (let j = 0; j < this.accountHead.length; j++) {
          for (let i = 0; i < this.getAllData.length; i++) {
            if (
              this.getAllData[i].accountHeadCode == 'string' ||
              this.accountHead[i] == 'string'
            ) {
              console.log('continue');
              continue;
            }

            if (this.accountHead[j] == this.getAllData[i].accountMainHeadCode) {
              this.addDuplicate(
                this.getAllData[i].accountMainHeadCode,
                this.getAllData[i].accountSubmainHeadCode
              );
            }
          }
          const uniqueAccountHeadCodes = Array.from(
            new Set(this.getAllData.map((item) => item.accountMainHeadCode))
          );
          this.accountHead = uniqueAccountHeadCodes;
        }

        // Remove duplicate values from the arrays in the Map
        this.commentMap.forEach((values, key) => {
          this.commentMap.set(key, Array.from(new Set(values)));
        });

        const columnValuesSub = data.map((item) => item.accountSubmainHeadCode);
        const uniqueValuesSub = Array.from(new Set(columnValuesSub));
        this.accountSubHeadCode = uniqueValuesSub;


        this.getAllData.forEach((item) => {
          item.accountMainHeadDescription = item.accountMainHeadDescription || '';
          item.accountSubmainHeadDescription = item.accountSubmainHeadDescription || '';
        });
        
        this.dataSource = new MatTableDataSource(this.getAllData);
        this.dataSource.paginator = this.paginator;
        console.log('Account Head Master all data checking purpose', this.dataSource);
      });

    this.accountMainData =
      await this.configurationService.getAccHeadMainGetAllData(filters);
    this.accountMainTypeData = this.accountMainData.map(
      (accountMainMaster) => ({
        accountHeadMainCode: accountMainMaster.accountHeadMainCode,
        accountHeadMainName: accountMainMaster.accountHeadMainName,
        accountMainHeadDescription:accountMainMaster.accountMainHeadDescription,
        amAccountHeadMainMasterId: accountMainMaster.amAccountHeadMainMasterId,
      })
    );

    this.accountSubMainData =
      await this.configurationService.getAccHeadSubmainAllData(filters);
    this.accountSubMainTypeData = this.accountSubMainData.map(
      (accountSubmainMaster) => ({
        accountHeadSubmainCode: accountSubmainMaster.accountHeadSubmainCode,
        accountHeadSubmainName: accountSubmainMaster.accountHeadSubmainName,
        accountSubmainHeadDescription: accountSubmainMaster.accountSubmainHeadDescription,
        amAccountHeadMainMasterId:
          accountSubmainMaster.amAccountHeadMainMasterId,
      })
    );
  }

  displayedColumns: string[] = [
    'slno',
    'accountHeadCode',
    'accountHeadName',
    'accountMainHeadCode',
    'accountMainHeadName',
    'accountSubMainHeadCode',
    'accountSubMainHeadName',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddAccountHeadMasterItemDialog() {
    this.dialog.open(AddAccountHeadMasterComponent, {
      width: '100%',
      data: {
        field1: this.accountMainData,
        field2: this.accountSubMainData,
      },
    });
  }

  openUpdateAccountHeadMasterItemDialog(accountHeadMasterId: any) {
    this.dialog.open(UpdateAccountHeadMasterComponent, {
      width: '100%',
      data: {
        field1: this.accountMainData,
        field2: this.accountSubMainData,
        field3: accountHeadMasterId,
      },
      disableClose: true,
    });
  }

  onAccountHead(accountMainHeadCode) {
    this.accountSubMainCode = [];
    this.getTargetData = [];
    this.dataSource = null;
    for (let i = 0; i < this.getAllData.length; i++) {
      if (this.getAllData[i].accountHeadCode == 'string') {
        console.log('continue====');
        continue;
      }
      if (this.getAllData[i].accountMainHeadCode == accountMainHeadCode) {
        this.getTargetData[i] = this.getAllData[i];
      }
    }

    const columnValues = this.getTargetData.map(
      (item) => item.accountSubmainHeadCode
    );
    const uniqueValues = Array.from(new Set(columnValues));
    this.accountSubMainCode = uniqueValues.filter(this.notEmpty);

    this.getTargetData = this.getTargetData.filter(this.notEmpty);
    this.dataSource = new MatTableDataSource(this.getTargetData);
    this.dataSource.paginator = this.paginator;

    console.log('account head==getTargetData', this.getTargetData);
    console.log('this.accountSubMainCode ==', this.accountSubMainCode);
  }

  onAccountSubMainCode(accountSubMainCode) {
    this.getTempData = [];
    for (let i = 0; i < this.getTargetData.length; i++) {
      if (this.getTargetData[i].accountSubmainHeadCode == 'string') {
        console.log('continue====');
        continue;
      }
      if (this.getTargetData[i].accountSubmainHeadCode == accountSubMainCode) {
        this.getTempData[i] = this.getTargetData[i];
      }
    }
    console.log('getTempData====', this.getTempData);

    this.getTempData = this.getTempData.filter(this.notEmpty);
    this.dataSource = new MatTableDataSource(this.getTempData);
    this.dataSource.paginator = this.paginator;
  }

  notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
  }

  addDuplicate(key: string, value: number) {
    if (this.commentMap.has(key)) {
      this.commentMap.get(key)!.push(value); // Add the duplicate value to the array
    } else {
      this.commentMap.set(key, [value]); // Create a new array with the value as the first element
    }
  }
  getAccountMainHeadDescription(accountMainHeadCode: string): string {
    const account = this.getAllData.find(
      (item) => item.accountMainHeadCode === accountMainHeadCode
    );
    return account ? account.accountMainHeadDescription : '';
  }

  getAccountSubmainHeadDescription(accountSubmainHeadCode: string): string {
    const account = this.getAllData.find(
      (item) => item.accountSubmainHeadCode === accountSubmainHeadCode
    );
    return account ? account.accountSubmainHeadDescription : '';
  }
}
