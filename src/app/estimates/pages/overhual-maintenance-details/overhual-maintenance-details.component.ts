import { Component, OnInit ,ViewChild} from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-overhual-maintenance-details',
  templateUrl: './overhual-maintenance-details.component.html',
  styleUrls: ['./overhual-maintenance-details.component.scss']
})
export class OverhualMaintenanceDetailsComponent implements OnInit {
  checklist: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['sNo', 'checkList'];
  dataSource: MatTableDataSource<any>;
  data:any[]=[];
  mmMaintenanceSchedulerTaskId: string = '';
  maintenanceSchedulerMasterId: string ='';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private maintenanceService:MaintenanceService
             ) { }

             ngOnInit() {
              this.route.queryParams.subscribe(async (params) => {
                this.mmMaintenanceSchedulerTaskId = params.mmMaintenanceSchedulerTaskId;
                const apiKey = sessionStorage.getItem('api-key');
                const serviceKey = sessionStorage.getItem('service-key');
                const userRole = sessionStorage.getItem('user-role');
                const userName = sessionStorage.getItem('user-name');
                const userCode = sessionStorage.getItem('user-code');
                const filter: any = {apiKey,serviceKey,userRole,userName,userCode, mmMaintenanceSchedulerTaskId: this.mmMaintenanceSchedulerTaskId,};
                  this.data = await this.maintenanceService.getDetailsByMaintenancSechedulerId(filter);
                  this.maintenanceSchedulerMasterId = this.data[0]?.mmMaintenanceSchedulerMasterId
                const filters:any = {apiKey,serviceKey,userRole,userName,userCode, mmMaintenanceSchedulerMasterId: this.maintenanceSchedulerMasterId,}
                this.checklist =await this.maintenanceService.getDetailsByMaintenancSechedulerMasterId(filters);
                this.dataSource = new MatTableDataSource<any>(this.checklist);
                this.dataSource.paginator = this.paginator;
              });
            }
            rowIndex(row: any): number {
              return this.dataSource.data.indexOf(row) + 1;
            }
       goBack(){
        this.router.navigate(['/estimates/overhual-maintenance-list'])
     }
}
