import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-multiple-account-meter-mapping',
  templateUrl: './multiple-account-meter-mapping.component.html',
  styleUrls: ['./multiple-account-meter-mapping.component.scss']
})
export class MultipleAccountMeterMappingComponent implements OnInit {
  type: any;
  data: any;
  fileContent: any[][] = [];
  finalContent: any[][] = [];
  workDescription: string = '';
  workorderNo: string = '';
  applicationTypeCode: any;
  isFaReceived: any;
  showErrorTemplate: boolean = false;
  workorderRegisteredId: any;
  serviceRegistrationsId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private workService: WorkOrderService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const serviceRegistrationsId = params['serviceRegistrationId'];
      // const workorderRegisteredId = params['workOrderRegisteredId'];
      // this.workorderRegisteredId = workorderRegisteredId;
      this.type = params['type'];
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        serviceRegistrationsId,
      };
      this.data = await this.dashboardService.accountMeterMappingReportMC(filter);
      this.finalContent = this.data;
      // this.isFaReceived = this.data[0].isFaReceived;
      // this.serviceRegistrationsId = this.data[0].serviceRegistrationsId;
      
    });
  }
  Back(){
    this.location.back();
  }
}

