import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddConnectionTypeMasterComponent } from './add-connection-type-master/add-connection-type-master.component';
import { UpdateConnectionTypeMasterComponent } from './update-connection-type-master/update-connection-type-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface ConnectionInfo {
  connectionTypeName: string;
  connectionTypeCode: string;
}

const Connection_DATA: ConnectionInfo[] = [];
@Component({
  selector: 'app-connection-type-master',
  templateUrl: './connection-type-master.component.html',
  styleUrls: ['./connection-type-master.component.scss'],
})
export class ConnectionTypeMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(Connection_DATA);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Deviation Type data', message['text']);
      if (message['text'] == 'Connection Type Updated') {
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
      .getConnectionTypeMasterAllData(filters)
      .then((data) => {
        console.log('Connection Type Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Connection Master all data', this.dataSource);
      });
  }

  displayedColumns: string[] = [
    'slno',
    'connectionTypeName',
    'connectionTypeCode',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddConnectionTypeDialog() {
    this.dialog.open(AddConnectionTypeMasterComponent, {
      width: '100%',
    });
  }

  openUpdateConnectionTypeDialog(connectionTypeId: any) {
    this.dialog.open(UpdateConnectionTypeMasterComponent, {
      width: '100%',
      data: connectionTypeId,
      disableClose: true,
    });
  }
}
