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
import { materialTypeparams } from 'src/app/models/configuration.model';
import { AddMeterTypeComponent } from './add-meter-type/add-meter-type.component';
import { UpdateMeterTypeComponent } from './update-meter-type/update-meter-type.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
export interface MaterialInfo {
  materialTypeName: string;
  materialTypeCode: string;
}
const MaterialInfo_DATA: MaterialInfo[] = [];
@Component({
  selector: 'app-material-type-data',
  templateUrl: './material-type-data.component.html',
  styleUrls: ['./material-type-data.component.scss'],
})
export class MaterialTypeDataComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subscriptionName: Subscription;
  constructor(
    public dialog: MatDialog,
    private materialtype: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('mater type data', message['text']);
      if (message['text'] == 'Material Type Updated') {
        this.ngOnInit();
      }
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(MaterialInfo_DATA);
  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filters: materialTypeparams = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };
    this.materialtype.getMaterialTypeData(filters).then((data) => {
      console.log('Material Type Master Data from service', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Material type all data', this.dataSource);
    });
    console.log(this.dataSource);
  }
  displayedColumns: string[] = [
    'slno',
    'materialTypeName',
    'materialTypeCode',
    'action',
  ];

  ngAfterViewInit() {
    console.log('dataSource', this.dataSource);
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: any) {
    console.log('filtervalue', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMaterialTypeDialog() {
    this.dialog.open(AddMeterTypeComponent, {
      width: '100%',
      disableClose: true,
    });
  }

  openUpdateMaterialTypeDialog(materialTypeMasterId: any) {
    console.log(materialTypeMasterId);
    this.dialog.open(UpdateMeterTypeComponent, {
      width: '100%',
      data: materialTypeMasterId,
      disableClose: true,
    });
  }
}
