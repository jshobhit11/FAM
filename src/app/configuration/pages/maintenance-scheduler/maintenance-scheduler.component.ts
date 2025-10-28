import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AddMaintenanceComponent } from './add-maintenance/add-maintenance.component';
import { UpdateMaintenanceComponent } from './update-maintenance/update-maintenance.component';

export interface Maintenance {
  slno: number;
  assetType: string;
  maintenanceType: string;
  frequency: string;
  equipment:string;
  remarks:string;
  responsibleOfficer:string;
  jobNotifyDay:string;
}

const Maintenance_Scheduler_DATA: Maintenance[] = [];
@Component({
  selector: 'app-maintenance-scheduler',
  templateUrl: './maintenance-scheduler.component.html',
  styleUrls: ['./maintenance-scheduler.component.scss']
})
export class MaintenanceSchedulerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(Maintenance_Scheduler_DATA);
  pageIndex: number = 0;
  pageSize: number = 5;
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
       this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
        console.log('Maintenance Scheduler data', message['text']);
        if (message['text'] == 'Maintenance Scheduler Updated') {
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
      .getMaintenaceSchudulerGetAllData(filters)
      .then((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Maintenance Master all data', this.dataSource);
      });

    console.log(this.dataSource);
  }
  displayedColumns: string[] = [
    'slno',
    'assetType',
    'maintenanceType',
    'frequency',
    'equipment',
    'remarks',
    'responsibleOfficer',
    'jobNotifyDay',
    'action',
  ];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getSerialNumber(index: number): number {
    return index + 1 + this.paginator.pageIndex * this.paginator.pageSize;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openAddMaintenanceDialog() {
    this.dialog.open(AddMaintenanceComponent, {
      width: '100%',
    });
  }

  openUpdateMaintenanceDialog(mmMaintenanceSchedulerMasterId: any) {
    this.dialog.open(UpdateMaintenanceComponent, {
      width: '100%',
      data:  {
        field1 : mmMaintenanceSchedulerMasterId
      },
    });
  }
  
}
