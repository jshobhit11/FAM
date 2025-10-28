import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateWorkExecutionMethodMasterComponent } from './update-work-execution-method/update-work-execution-method.component';
import { AddWorkExecutionMethodMasterComponent } from './add-work-execution-method/add-work-execution-method.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
export interface WorkExecutionMethodInfo {
  WorkExecutionMethodName: string;
  WorkExecutionMethodCode: string;
}
const WorkExecutionMethod_DATA: WorkExecutionMethodInfo[] = [];
@Component({
  selector: 'app-work-execution-method',
  templateUrl: './work-execution-method.component.html',
  styleUrls: ['./work-execution-method.component.scss'],
})
export class WorkExecutionMethodMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(WorkExecutionMethod_DATA);
  subscriptionName: any;
  constructor(public dialog: MatDialog, private configurationService: ConfigurationService, private Service: CommonService) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Work Execution Method data', message['text']);
      if (message['text'] == 'Work Execution Method Updated') {
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
    this.configurationService.getWorkExecutionGetAllData(filters).then((data) => {
      console.log('Work Execution Data from service', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Connection Master all data', this.dataSource);
    });
    console.log(this.dataSource);
  }

  displayedColumns: string[] = ['slno', 'WorkExecutionMethodName', 'WorkExecutionMethodCode', 'action'];

  ngAfterViewInit() {
    this.paginator = this.paginator;
  }

  applyFilter(filterValue: any) {
    console.log('filtervalue', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddWorkExecutionMethodDialog() {
    this.dialog.open(AddWorkExecutionMethodMasterComponent, {
      width: '100%',
    });
  }

  openUpdateWorkExecutionMethodDialog(woExecutionMethodId: any) {
    this.dialog.open(UpdateWorkExecutionMethodMasterComponent, {
      width: '100%',
      data: woExecutionMethodId,
      disableClose: true,
    });
  }
}
