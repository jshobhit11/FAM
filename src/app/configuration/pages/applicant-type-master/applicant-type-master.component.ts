import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddApplicantTypeMasterComponent } from './add-applicant-type-master/add-applicant-type-master.component';
import { UpdateApplicantTypeMasterComponent } from './update-applicant-type-master/update-applicant-type-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface ApplicantInfo {
  applicantTypeName: string;
  applicantTypeCode: number;
}
const ApplicantInfo_DATA: ApplicantInfo[] = [];
@Component({
  selector: 'app-applicant-type-master',
  templateUrl: './applicant-type-master.component.html',
  styleUrls: ['./applicant-type-master.component.scss'],
})
export class ApplicantTypeMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(ApplicantInfo_DATA);
  subscriptionName: any;

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Applicant Type data', message['text']);
      if (message['text'] == 'Applicant Type Updated') {
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
      .getApplicantTypeMasterAllData(filters)
      .then((data) => {
        console.log('Applicant Type Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Applicant Type Master all data', this.dataSource);
      });
  }

  displayedColumns: string[] = [
    'slno',
    'applicantTypeName',
    'applicantTypeCode',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddApplicantTypeDialog() {
    this.dialog.open(AddApplicantTypeMasterComponent, {
      width: '100%',
    });
  }

  openUpdateApplicantTypeDialog(applicantId: any) {
    this.dialog.open(UpdateApplicantTypeMasterComponent, {
      width: '100%',
      data: applicantId,
      disableClose: true,
    });
  }
}
