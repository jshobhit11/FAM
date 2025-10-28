import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddNetworkExtensionTypeMasterComponent } from './add-network-extension-type-master/add-network-extension-type-master.component';
import { UpdateNetworkExtensionTypeMasterComponent } from './update-network-extension-type-master/update-network-extension-type-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';

export interface MateName {
  networkExtensionType: string;
  networkExtensionCode: string;
}

const NetworkExtensionMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-network-extension-type-master',
  templateUrl: './network-extension-type-master.component.html',
  styleUrls: ['./network-extension-type-master.component.scss'],
})
export class NetworkExtensionTypeMasterComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(NetworkExtensionMaster_DATA);
  subscriptionName: Subscription;
  constructor(
    public dialog: MatDialog,
    private configurtionService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Network Extension Type data', message['text']);
      if (message['text'] == 'Network Extension Type Updated') {
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
    this.configurtionService
      .getNetworkExtensionTypeAllData(filters)
      .then((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Network Extension Type all data', this.dataSource);
      });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'networkExtensionType',
    'networkExtensionCode',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddNetworkExtensionTypeDialog() {
    this.dialog.open(AddNetworkExtensionTypeMasterComponent, {
      width: '100%',
      disableClose: true,
    });
  }

  UpdateNetworkExtensionTypeMasterComponent(networkId: any) {
    this.dialog.open(UpdateNetworkExtensionTypeMasterComponent, {
      width: '100%',
      data: networkId,
      disableClose: true,
    });
  }
}
