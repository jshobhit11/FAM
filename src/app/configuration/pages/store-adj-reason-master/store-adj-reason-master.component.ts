import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddStoreAdjReasonMasterComponent } from './add-store-adj-reason-master/add-store-adj-reason-master.component';
import { UpdateStoreAdjReasonMasterComponent } from './update-store-adj-reason-master/update-store-adj-reason-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  adjustmentReason: string;
  descriptions: string;
}

const StoreReason_DATA: MateName[] = [];
@Component({
  selector: 'app-store-adj-reason-master',
  templateUrl: './store-adj-reason-master.component.html',
  styleUrls: ['./store-adj-reason-master.component.scss'],
})
export class StoreAdjReasonMasterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(StoreReason_DATA);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Store Adj Reason data', message['text']);
      if (message['text'] == 'Store Adj Reason data') {
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
    this.configurationService.getStoreReasonGetAllData(filters).then((data) => {
      console.log('Store Adjust Reason Master Data from service', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Store Adjust Reason Master all data', this.dataSource);
    });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'adjustmentReason',
    'descriptions',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddStoreAdjReasonMasterComponent() {
    this.dialog.open(AddStoreAdjReasonMasterComponent, {
      width: '100%',
    });
  }

  openUpdateStoreAdjReasonMasterComponent(storeAdjReasonMasterId: any) {
    this.dialog.open(UpdateStoreAdjReasonMasterComponent, {
      width: '100%',
      data: storeAdjReasonMasterId,
      disableClose: true,
    });
  }
}
