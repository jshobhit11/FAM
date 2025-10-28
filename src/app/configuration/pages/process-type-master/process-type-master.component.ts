import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddProcessTypeMasterComponent } from './add-process-type-master/add-process-type-master.component';
import { UpdateProcessTypeMasterComponent } from './update-process-type-master/update-process-type-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  processTypeName: string;
  processTypeHeader: string;
  processDisplayOrder: number;
}
const ProcessMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-process-type-master',
  templateUrl: './process-type-master.component.html',
  styleUrls: ['./process-type-master.component.scss'],
})
export class ProcessTypeMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(ProcessMaster_DATA);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Process Type data', message['text']);
      if (message['text'] == 'Process Type Updated') {
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
    this.configurationService.getprocessTypeGetAllData(filters).then((data) => {
      console.log('Process Type Master Data from service', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Process Type Master all data', this.dataSource);
    });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'processTypeName',
    'processTypeHeader',
    'processDisplayOrder',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddProcessTypeMasterItemDialog() {
    this.dialog.open(AddProcessTypeMasterComponent, {
      width: '100%',
    });
  }

  openUpdateProcessMasterItemDialog(processTypeMasterId: any) {
    this.dialog.open(UpdateProcessTypeMasterComponent, {
      width: '100%',
      data: processTypeMasterId,
      disableClose: true,
    });
  }
}
