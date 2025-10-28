import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddConnectionNatureMasterComponent } from './add-connection-nature-master/add-connection-nature-master.component';
import { UpdateConnectionNatureMasterComponent } from './update-connection-nature-master/update-connection-nature-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface ConnectionNatureName {
  connectionNatureId: number;
  connectionNatureName: string;
  connectionNatureCode: string;
  categoryMasterId: number;
}
const ConnectionNature_DATA: ConnectionNatureName[] = [];
@Component({
  selector: 'app-connection-nature-master',
  templateUrl: './connection-nature-master.component.html',
  styleUrls: ['./connection-nature-master.component.scss'],
})
export class ConnectionNatureMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(ConnectionNature_DATA);
  subscriptionName: any;
  data: any[] = [];
  connectionNatureMaster: any[] = [];
  categoryMasterId: any[] = [];
  categoryName: any[] = [];
  categoryData: any[] = [];
  categoryMasterData: any = {};

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.service.getUpdate().subscribe((message) => {
      // message contains the data sent from service
      console.log('Connection nature master data', message['text']);
      if (message['text'] == 'Connection Nature Updated') {
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

    this.connectionNatureMaster =
      await this.configurationService.getConnectionNatureMasterAllData(filters);
    console.log(
      'Connection Nature Master Data from server',
      this.connectionNatureMaster
    );
    this.dataSource = new MatTableDataSource(this.connectionNatureMaster);
    this.dataSource.paginator = this.paginator;

    this.categoryMasterData =
      await this.configurationService.getMainCategoryData(filters);
    this.categoryData = this.categoryMasterData.map((asset) => ({
      categoryMasterId: asset.categoryMasterId,
      categoryName: asset.categoryName,
      categoryCode: asset.categoryCode,
    }));
  }

  displayedColumns: string[] = [
    'slno',
    'connectionNatureName',
    'connectionNatureCode',
    'categoryMasterId',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    console.log('filterValue', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddConnectionNatureMasterItemDialog() {
    this.dialog.open(AddConnectionNatureMasterComponent, {
      width: '100%',
      data: {
        field1: this.categoryMasterData,
      },
    });
  }
  openUpdateConnectionNatureMasterItemDialog(connectionNatureId: any) {
    this.dialog.open(UpdateConnectionNatureMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.categoryMasterData,
        field2: connectionNatureId,
      },
    });
  }
  async onConnectionNatureType(categoryMasterId: any) {
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
      categoryMasterId,
    };

    await this.configurationService
      .getconnectionNatureDatabyCategoryId(filters)
      .then((data) => {
        console.log(' data of particular id', data);
        let categoryInfo = this.categoryMasterId.filter(
          (item) => item.categoryMasterId == categoryMasterId
        );
        console.log('categoryInfo', categoryInfo);
        let tempData: any = [];
        if (data && data.length > 0) {
          tempData = data.map((item) => {
            item.categoryName = categoryInfo[0].categoryName;
            return item;
          });
        }
        this.dataSource = new MatTableDataSource(tempData);
        this.dataSource.paginator = this.paginator;
      });
  }
}
