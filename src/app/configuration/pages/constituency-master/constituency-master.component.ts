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
import { AddConstituenctMasterComponent } from './add-constituenct-master/add-constituenct-master.component';
import { UpdateConstituenctMasterComponent } from './update-constituenct-master/update-constituenct-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
export interface MateName {
  constituencyType: string;
  constituencyName: string;
  constituencyCode: number;
  districtId: string;
}

const ConstituencyMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-constituency-master',
  templateUrl: './constituency-master.component.html',
  styleUrls: ['./constituency-master.component.scss'],
})
export class ConstituencyMasterComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private subscriptionName: Subscription;
  dataSource = new MatTableDataSource(ConstituencyMaster_DATA);
  constituencyTypes = ['ASSEMBLY', 'PARLIAMENT'];
  districtTypeData: any[] = [];
  districtData: any = {};

  constructor(
    public dialog: MatDialog,
    private constituencyMasterService: ConfigurationService,
    private Service: CommonService,
    private configurationService: ConfigurationService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Constitueny Master Updated', message['text']);
      if (message['text'] == 'Constitueny Master Updated') {
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
    this.constituencyMasterService
      .getconstituencyMasterAllData(filters)
      .then((data) => {
        console.log('Constituency Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('constituency master all data', this.dataSource);
      });

    this.districtData = await this.configurationService.getdistrictMasterData(
      filters
    );
    console.log('District Master Data from service', this.districtData);
    const uniqueValues = {};
    this.districtTypeData = this.districtData
      .map((districtType) => ({
        districtId: districtType.districtId.toString(),
        districtName: districtType.districtName,
      }))
      .filter((districtType) => {
        const isUnique = !uniqueValues[districtType.districtId];
        if (isUnique) {
          uniqueValues[districtType.districtId] = true;
        }
        return isUnique;
      });
  }

  displayedColumns: string[] = [
    'slno',
    'constituencyType',
    'constituencyName',
    'constituencyCode',
    'districtId',
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

  openAddConstituencyMasterItemDialog() {
    this.dialog.open(AddConstituenctMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.constituencyTypes,
        field4: this.districtData,
      },
    });
  }

  openUpdateConstituencylMasterItemDialog(constituencyId: number) {
    this.dialog.open(UpdateConstituenctMasterComponent, {
      width: '100%',
      data: {
        field1: this.constituencyTypes,
        field3: constituencyId,
        field4: this.districtData,
      },
    });
  }

  onConstituencyType(constituencyType) {
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
      constituencyType,
    };
    this.constituencyMasterService
      .getconstituencyMasterGetDataByConstituencyType(filters)
      .then((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('constituency master all data', this.dataSource);
      });
  }
}
