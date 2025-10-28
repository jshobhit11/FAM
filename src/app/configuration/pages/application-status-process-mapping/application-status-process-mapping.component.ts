import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddApplicationStatusProcessMappingComponent } from './add-application-status-process-mapping/add-application-status-process-mapping.component';
import { UpdateApplicationStatusProcessMappingComponent } from './update-application-status-process-mapping/update-application-status-process-mapping.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  applicationStatusId: number;
  processTypeMasterId: number;
  typeWiseSequence: number;
  displayFlag: number;
}
const Application_DATA: MateName[] = [];
@Component({
  selector: 'app-application-status-process-mapping',
  templateUrl: './application-status-process-mapping.component.html',
  styleUrls: ['./application-status-process-mapping.component.scss'],
})
export class ApplicationStatusProcessMappingComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(Application_DATA);
  subscriptionName: any;
  applicationStatusData: any[] = [];
  applicationData: any = {};
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
      console.log('Application Mapping data', message['text']);
      if (message['text'] == 'Application Mapping Updated') {
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
      .getappStatusProMapGetAllData(filters)
      .then((data) => {
        console.log(
          'Application Status Process Mapping Master Data from service',
          data
        );
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Application Process Mapping all data', this.dataSource);
      });

    this.applicationData =
      await this.configurationService.getApplicationStatusAllData(filters);
    console.log(
      'Application Status Master Data from service',
      this.applicationData
    );
    this.applicationStatusData = this.applicationData.map(
      (applicationStatus) => ({
        applicatoinStatusId: applicationStatus.applicatoinStatusId,
        statusName: applicationStatus.statusName,
      })
    );

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
    'applicationStatusId',
    'processTypeMasterId',
    'typeWiseSequence',
    'displayFlag',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddApplicationStatusProcessMappingMasterItemDialog() {
    this.dialog.open(AddApplicationStatusProcessMappingComponent, {
      width: '100%',
      data: {
        field1: this.applicationData,
        field2: this.processData,
      },
    });
  }
  openUpdateApplicationStatusProcessMappingMasterItemDialog(
    applicationStatusProcessMappingId: any
  ) {
    this.dialog.open(UpdateApplicationStatusProcessMappingComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.applicationData,
        field2: this.processData,
        field4: applicationStatusProcessMappingId,
      },
    });
  }
}
