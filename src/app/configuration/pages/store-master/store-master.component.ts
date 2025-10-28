import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddStoreMasterComponent } from './add-store-master/add-store-master.component';
import { UpdateStoreMasterComponent } from './update-store-master/update-store-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

export interface StoreInfo {
  storeName: string;
  storeAddress: string;
  storeCode: string;
  storeType: string;
}
const StoreInfo_DATA: StoreInfo[] = [];

@Component({
  selector: 'app-store-master',
  templateUrl: './store-master.component.html',
  styleUrls: ['./store-master.component.scss'],
})
export class StoreMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(StoreInfo_DATA);
  subscriptionName: any;
  storeTypes = ['VIRTUAL', 'REGULAR', 'VENDOR'];

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Store master data', message['text']);
      if (message['text'] == 'Store Master Updated') {
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
    this.configurationService.getStoreMasterGetAllData(filters).then((data) => {
      console.log('Store Master Data from service', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Store Master all data', this.dataSource);
    });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'storeName',
    'storeAddress',
    'storeCode',
    'storeType',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddStoreTypeDialog() {
    this.dialog.open(AddStoreMasterComponent, {
      width: '100%',
      data: {
        field1: this.storeTypes,
      },
    });
  }

  openUpdateStoreTypeDialog(storeMasterId: any) {
    this.dialog.open(UpdateStoreMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.storeTypes,
        field2: storeMasterId,
      },
    });
  }
}
