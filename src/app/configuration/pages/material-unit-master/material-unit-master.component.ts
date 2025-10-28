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
import { AddMaterialUnitComponent } from './add-material-unit/add-material-unit.component';
import { UpdateMaterialUnitComponent } from './update-material-unit/update-material-unit.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
export interface ElemName {
  materialUnit: string;
}
const ELEM_DATA: ElemName[] = [];
@Component({
  selector: 'app-material-unit-master',
  templateUrl: './material-unit-master.component.html',
  styleUrls: ['./material-unit-master.component.scss'],
})
export class MaterialUnitMasterComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subscriptionName: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(ELEM_DATA);
  constructor(
    public dialog: MatDialog,
    private materialUnitMasterService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('material unit update', message['text']);
      if (message['text'] == 'Material Unit Updated') {
        this.ngOnInit();
      }
    });
  }

  materialUnitMasterData: any;
  getDataById: any;
  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      officeCode,
    };
    this.materialUnitMasterData =
      await this.materialUnitMasterService.getMaterialUnitMaster(filters);
    console.log(
      'Material Unit Master Data from service',
      this.materialUnitMasterData
    );
    this.dataSource = new MatTableDataSource(this.materialUnitMasterData);
    console.log('materil unit get all data', this.dataSource);
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['slno', 'materialUnit', 'action'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMaterialUnitDialog() {
    this.dialog.open(AddMaterialUnitComponent, {
      width: '100%',
      disableClose: true,
    });
  }

  openUpdateMaterialUnitDialog(materialUnitMasterId: number) {
    this.dialog.open(UpdateMaterialUnitComponent, {
      width: '100%',
      data: materialUnitMasterId,
    });
  }
}
