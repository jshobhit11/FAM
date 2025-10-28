import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddAssetCategoryMasterComponent } from './add-asset-category-master/add-asset-category-master.component';
import { UpdateAssetCategoryMasterComponent } from './update-asset-category-master/update-asset-category-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface assestInfo {
  assetCategoryName: string;
  assetCategoryCode: string;
}
const AssetInfo_DATA: assestInfo[] = [];
@Component({
  selector: 'app-asset-category-master',
  templateUrl: './asset-category-master.component.html',
  styleUrls: ['./asset-category-master.component.scss'],
})
export class AssetCategoryMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(AssetInfo_DATA);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Asset Category data', message['text']);
      if (message['text'] == 'Asset Category Updated') {
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
      .getAssetCategoryGetAllData(filters)
      .then((data) => {
        console.log('Asset Category Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Asset Category Master all data', this.dataSource);
      });
  }

  displayedColumns: string[] = [
    'slno',
    'assetCategoryName',
    'assetCategoryCode',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddAssetCategoryDialog() {
    this.dialog.open(AddAssetCategoryMasterComponent, {
      width: '100%',
    });
  }

  openUpdateAssetCategoryDialog(amAssetCategoryMasterId: any) {
    this.dialog.open(UpdateAssetCategoryMasterComponent, {
      width: '100%',
      data: amAssetCategoryMasterId,
      disableClose: true,
    });
  }
}
