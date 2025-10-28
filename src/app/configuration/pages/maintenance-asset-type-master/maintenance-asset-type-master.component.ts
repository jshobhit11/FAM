import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddMaintenanceAssetTypeComponent } from './add-maintenance-asset-type/add-maintenance-asset-type.component';
import { UpdateMaintenanceAssetTypeComponent } from './update-maintenance-asset-type/update-maintenance-asset-type.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  assetType: string;
}
const AssetTypeMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-maintenance-asset-type-master',
  templateUrl: './maintenance-asset-type-master.component.html',
  styleUrls: ['./maintenance-asset-type-master.component.scss'],
})
export class MaintenanceAssetTypeMasterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(AssetTypeMaster_DATA);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Asset Type data', message['text']);
      if (message['text'] == 'Asset Type Updated') {
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
    this.configurationService.getAssetTypeGetAllData(filters).then((data) => {
      console.log('Asset Type Master data from server', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Asset Type Master all data', this.dataSource);
    });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = ['slno', 'assetType', 'action'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMaintenanceAssetTypeDialog() {
    this.dialog.open(AddMaintenanceAssetTypeComponent, {
      width: '100%',
      disableClose: true,
    });
  }

  UpdateMaintenanceAssetTypeDialog(mmMaintenanceAssetTypeMasterId: any) {
    console.log(mmMaintenanceAssetTypeMasterId);
    this.dialog.open(UpdateMaintenanceAssetTypeComponent, {
      width: '100%',
      data: mmMaintenanceAssetTypeMasterId,
      disableClose: true,
    });
  }
}
