import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddAreaSpecificLoadingComponent } from './add-area-specific-loading/add-area-specific-loading.component';
import { UpdateAreaSpecificLoadingComponent } from './update-area-specific-loading/update-area-specific-loading.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface ApplicationInfo {
  chargesCategory: string;
  chargesPercentage: number;
}
const ApplicationInfo_DATA: ApplicationInfo[] = [];
@Component({
  selector: 'app-area-specific-loading-master',
  templateUrl: './area-specific-loading-master.component.html',
  styleUrls: ['./area-specific-loading-master.component.scss'],
})
export class AreaSpecificLoadingMasterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(ApplicationInfo_DATA);
  subscriptionName: any;

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Application Type data', message['text']);
      if (message['text'] == 'Area specific loader updated') {
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
      .getAreaSpecificLoaderGetAllData(filters)
      .then((data) => {
        console.log('Area Specific Loader Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Area Specific Loader Master all data', this.dataSource);
      });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'chargesCategory',
    'chargesPercentage',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddAreaSpecificLoaderDialog() {
    this.dialog.open(AddAreaSpecificLoadingComponent, {
      width: '100%',
      data: {},
    });
  }

  openUpdateAreaSpecificLoaderDialog(areaSpecificLoadingChargesMasterId: any) {
    this.dialog.open(UpdateAreaSpecificLoadingComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: areaSpecificLoadingChargesMasterId,
      },
    });
  }
}
