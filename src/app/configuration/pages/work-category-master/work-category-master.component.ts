import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddWorkCategoryMasterComponent } from './add-work-category-master/add-work-category-master.component';
import { UpdateWorkCategoryMasterComponent } from './update-work-category-master/update-work-category-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
export interface MateName {
  workCategoryName: string;
  workCategoryCode: string;
  budgetType: string;
  budgetCheckFlag: string;
}

const WorkCategoryMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-work-category-master',
  templateUrl: './work-category-master.component.html',
  styleUrls: ['./work-category-master.component.scss'],
})
export class WorkCategoryMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(WorkCategoryMaster_DATA);
  subscriptionName: any;
  bugdetTypes = ['CAPITAL', 'REVENUE', 'R&M'];
  bugdetCheckFlags = [0, 1];

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Work Category Master data', message['text']);
      if (message['text'] == 'Work Category Master Updated') {
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
      .getWorkCategoryGetAllData(filters)
      .then((data) => {
        console.log('Work Category Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Work Categroy Master all data', this.dataSource);
      });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = [
    'slno',
    'workCategoryName',
    'workCategoryCode',
    'budgetType',
    'budgetCheckFlag',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddWorkCategoryMasterItemDialog() {
    this.dialog.open(AddWorkCategoryMasterComponent, {
      width: '100%',
      data: {
        field1: this.bugdetTypes,
        field2: this.bugdetCheckFlags,
      },
    });
  }

  openUpdateWorkCategoryMasterItemDialog(workCategoryMaster: any) {
    this.dialog.open(UpdateWorkCategoryMasterComponent, {
      width: '100%',
      data: {
        field1: this.bugdetTypes,
        field2: this.bugdetCheckFlags,
        field3: workCategoryMaster,
      },
    });
  }
}
