import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { EstimateService } from 'src/app/services/estimate.service';
import { UpdateEstimateTemplateMasterComponent } from './update-estimate-template-master/update-estimate-template-master.component';

export interface MateName {
  estimateType: string;
}

const EstimateMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-estimate-template-master',
  templateUrl: './estimate-template-master.component.html',
  styleUrls: ['./estimate-template-master.component.scss'],
})
export class EstimateTemplateMasterComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(EstimateMaster_DATA);
  subscriptionName: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private router: Router,
    private estimateService: EstimateService,
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Estimate Template data', message['text']);
      if (message['text'] == 'Estimate Template Updated') {
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
    // const officeId = sessionStorage.getItem('office-id');
    const filters: any = { apiKey, serviceKey, userRole, userName, userCode };
    
    this.estimateService.getTemplateData(filters).then((data) => {
      if (data && data.length) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Estimation Template Master all data', this.dataSource);
      }
    });
  }

  displayedColumns: string[] = ['slno', 'estimateTemplateNo', 'estimateTemplateName', 'action'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddEstimateTemplateDialog() {
    this.router.navigate(['/configuration', 'estimate-template-master', 'create']);
  }

  openUpdateEstimateTemplateDialog(templateNumber: any) {
    this.router.navigate(['/configuration/estimate-template-master/update', templateNumber]);
  }
}
