import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddWorkscopeDescriptionMasterComponent } from './add-workscope-description-master/add-workscope-description-master.component';
import { UpdateWorkscopeDescriptionMasterComponent } from './update-workscope-description-master/update-workscope-description-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  workscopeDescription: string;
  workscopeDescCode: string;
  workTypeApplicable: string;
  estimateType: string;
}
const WorkscopeDescriptionMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-workscope-description-master',
  templateUrl: './workscope-description-master.component.html',
  styleUrls: ['./workscope-description-master.component.scss'],
})
export class WorkscopeDescriptionMasterComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(WorkscopeDescriptionMaster_DATA);
  subscriptionName: any;
  workTypeApplicables = ['LT', 'HT', 'BOTH'];
  applicationTypeData: any[] = [];
  estimateData: any = {};
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Workscope Des Type data', message['text']);
      if (message['text'] == 'Workscope Des Type Updated') {
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
      .getWorkscopeDesMasterAllData(filters)
      .then((data) => {
        console.log('Workscope Description Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Workscope Description Master all data', this.dataSource);
      });

    this.estimateData =
      await this.configurationService.getEstimateTypeMasterAllData(filters);
    this.applicationTypeData = this.estimateData.map((estimateMaster) => ({
      estimateTypeMasterId: estimateMaster.estimateTypeMasterId,
      estimateTypeName: estimateMaster.estimateTypeName,
    }));
  }

  displayedColumns: string[] = [
    'slno',
    'workscopeDescription',
    'workscopeDescCode',
    'workTypeApplicable',
    'estimateType',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddWorkscopeDescriptionMasterDialog() {
    this.dialog.open(AddWorkscopeDescriptionMasterComponent, {
      width: '100%',
      data: {
        field1: this.workTypeApplicables,
        field3: this.estimateData,
      },
    });
  }

  openUpdateWorkscopeDescriptionMasterDialog(workscopeDescMasterId: any) {
    this.dialog.open(UpdateWorkscopeDescriptionMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.workTypeApplicables,
        field2: workscopeDescMasterId,
        field3: this.estimateData,
      },
    });
  }
}
