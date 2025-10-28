import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddApplicationTypeMasterComponent } from './add-application-type-master/add-application-type-master.component';
import { UpdateApplicationTypeMasterComponent } from './update-application-type-master/update-application-type-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface ApplicationInfo {
  applicationTypeName: string;
  applicationTypeCode: string;
  registeredSourceType: string;
}
const ApplicationInfo_DATA: ApplicationInfo[] = [];
@Component({
  selector: 'app-application-type-master',
  templateUrl: './application-type-master.component.html',
  styleUrls: ['./application-type-master.component.scss'],
})
export class ApplicationTypeMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(ApplicationInfo_DATA);
  processData: any[] = [];
  processTypeData: any = {};
  subscriptionName: any;

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Application Type data', message['text']);
      if (message['text'] == 'Application Type Updated') {
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
      .getApplicationTypeMasterAllData(filters)
      .then((data) => {
        console.log('Application Type Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Application Type Master all data', this.dataSource);
      });
    console.log(this.dataSource);

    this.processData = await this.configurationService.getprocessTypeGetAllData(
      filters
    );
    console.log('Process Type Master Data from service', this.processData);
    const uniqueValues = {};
    this.processTypeData = this.processData
      .map((applicationType) => ({
        processTypeName: applicationType.processTypeName,
      }))
      .filter((processType) => {
        const isUnique = !uniqueValues[processType.processTypeName];
        if (isUnique) {
          uniqueValues[processType.processTypeName] = true;
        }
        return isUnique;
      });
  }

  displayedColumns: string[] = [
    'slno',
    'applicationTypeName',
    'applicationTypeCode',
    'registeredSourceType',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddApplicationTypeDialog() {
    this.dialog.open(AddApplicationTypeMasterComponent, {
      width: '100%',
      data: {
        field1: this.processData,
      },
    });
  }

  openUpdateApplicationTypeDialog(applicationTypeId: any) {
    this.dialog.open(UpdateApplicationTypeMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.processData,
        field2: applicationTypeId,
      },
    });
  }
}
