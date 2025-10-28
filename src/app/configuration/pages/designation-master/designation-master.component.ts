import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddDesignationMasterComponent } from './add-designation-master/add-designation-master.component';
import { UpdateDesignationMasterComponent } from './update-designation-master/update-designation-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
export interface designationInfo {
  designationName: string;
  designationCode: string;
  reportingDesigName: string;
  officeTypeName: string;
}
const DesignationInfo_DATA: designationInfo[] = [];
@Component({
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss'],
})
export class DesignationMasterComponent implements OnInit, AfterViewInit {
  getAllData: any[] = [];
  designationData: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(DesignationInfo_DATA);
  reportingDesigNames = [];
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Designation Master Updated', message['text']);
      if (message['text'] == 'Designation Master Updated') {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
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
      .getDesignationMasterGetAllData(filters)
      .then((data) => {
        this.designationData = data.map((designation) => ({
          reportingId: designation.designationMasterId, // Assuming the property holding reportingId is 'designationMasterId'
          desgName: designation.designationName, // Assuming the property holding desgName is 'designationName'
        }));
        this.getAllData = data;
        const allreportingDesigName = data.map((item) => item.designationName);
        const uniqueReportingDesigName = Array.from(
          new Set(allreportingDesigName)
        );
        this.reportingDesigNames = uniqueReportingDesigName;

        console.log('Designation Master Data getting for the server', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Designation Master all data', this.dataSource);
      });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'designationName',
    'designationCode',
    'reporDesignationId',
    'officeTypeName',
    'action',
  ];

  ngAfterViewInit() {
    this.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddDesignationMasterDialog() {
    this.dialog.open(AddDesignationMasterComponent, {
      width: '100%',
      data: {
        field1: this.designationData,
      },
    });
  }

  openUpdateDesignationMasterDialog(designationMasterId: any, item: any) {
    this.dialog.open(UpdateDesignationMasterComponent, {
      width: '100%',
      data: {
        field1: this.designationData,
        field2: designationMasterId,
        field3: this.getAllData,
        field5: item,
      },
    });
  }
}
