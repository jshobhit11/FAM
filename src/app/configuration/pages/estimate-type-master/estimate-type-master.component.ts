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
import { AddEstimateTypeMasterComponent } from './add-estimate-type-master/add-estimate-type-master.component';
import { UpdateEstimateTypeMasterComponent } from './update-estimate-type-master/update-estimate-type-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  estimateType: string;
  estimateTypeCode: string;
}
const EstimateMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-estimate-type-master',
  templateUrl: './estimate-type-master.component.html',
  styleUrls: ['./estimate-type-master.component.scss'],
})
export class EstimateTypeMasterComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(EstimateMaster_DATA);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Estiamte Type data', message['text']);
      if (message['text'] == 'Estiamte Type Updated') {
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
      .getEstimateTypeMasterAllData(filters)
      .then((data) => {
        console.log('Estimate Type Master data from server', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Estimates Master all data', this.dataSource);
      });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'estimateType',
    'estimateTypeCode',
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

  openAddEstimateTypeDialog() {
    this.dialog.open(AddEstimateTypeMasterComponent, {
      width: '100%',
      disableClose: true,
    });
  }

  UpdateEstimateTypeMasterComponent(estimateTypeMasterId: any) {
    console.log(estimateTypeMasterId);
    this.dialog.open(UpdateEstimateTypeMasterComponent, {
      width: '100%',
      data: estimateTypeMasterId,
      disableClose: true,
    });
  }
}
