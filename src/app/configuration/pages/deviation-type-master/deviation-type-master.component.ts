import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddDeviationTypeMasterComponent } from './add-deviation-type-master/add-deviation-type-master.component';
import { UpdateDeviationTypeMasterComponent } from './update-deviation-type-master/update-deviation-type-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  devaitionType: string;
}
const DeviationMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-deviation-type-master',
  templateUrl: './deviation-type-master.component.html',
  styleUrls: ['./deviation-type-master.component.scss'],
})
export class DeviationTypeMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(DeviationMaster_DATA);
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
      if (message['text'] == 'Deviation Type Updated') {
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
      .getDeviationTypeMasterAllData(filters)
      .then((data) => {
        console.log('Deviation Type Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Deviation Type Master all data', this.dataSource);
      });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = ['slno', 'devaitionType', 'action'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDeviationTypeMasterItemDialog() {
    this.dialog.open(AddDeviationTypeMasterComponent, {
      width: '100%',
    });
  }

  openUpdateDeviationMasterItemDialog(deviationTypeMasterId: any) {
    this.dialog.open(UpdateDeviationTypeMasterComponent, {
      width: '100%',
      data: deviationTypeMasterId,
      disableClose: true,
    });
  }
}
