import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddApplicationStatusMasterComponent } from './add-application-status-master/add-application-status-master.component';
import { UpdateApplicationStatusMasterComponent } from './update-application-status-master/update-application-status-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
export interface ApplicationStatusInfo {
  statusName: string;
  statusCode: number;
  processType: string;
  typeWiseSequence: string;
  displayType: string;
}
const ApplicationStatusInfo_DATA: ApplicationStatusInfo[] = [];
@Component({
  selector: 'app-application-status-master',
  templateUrl: './application-status-master.component.html',
  styleUrls: ['./application-status-master.component.scss'],
})
export class ApplicationStatusMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(ApplicationStatusInfo_DATA);
  subscriptionName: any;
  processData: any = {};
  processTypeData: any[] = [];

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Application Status Type data', message['text']);
      if (message['text'] == 'Application Status Type Updated') {
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
      .getApplicationStatusAllData(filters)
      .then((data) => {
        console.log('Application Status Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Application Status Master all data', this.dataSource);
      });

    this.processData = await this.configurationService.getprocessTypeGetAllData(
      filters
    );
    console.log('Process Type Master Data from service', this.processData);
    this.processTypeData = this.processData.map((processType) => ({
      processTypeMasterId: processType.processTypeMasterId,
      processTypeName: processType.processTypeName,
    }));
  }

  displayedColumns: string[] = [
    'slno',
    'statusName',
    'statusCode',
    'processType',
    'typeWiseSequence',
    'displayType',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddApplicationStatusMasterDialog() {
    this.dialog.open(AddApplicationStatusMasterComponent, {
      width: '100%',
      data: {
        field1: this.processData,
      },
    });
  }

  openUpdateApplicationStatusMasterDialog(applicatoinStatusId: any) {
    this.dialog.open(UpdateApplicationStatusMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.processData,
        field2: applicatoinStatusId,
      },
    });
  }
}
