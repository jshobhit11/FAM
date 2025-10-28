  import { Component, OnInit } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { ActivatedRoute, ParamMap, Router } from '@angular/router';
  import { DashboardService } from 'src/app/services/dashboard.service';
  import { WorkOrderService } from 'src/app/services/work-order.service';
  import { Location } from '@angular/common';
  import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
  import * as XLSX from 'xlsx';
  
  @Component({
    selector: 'app-single-account-meter-mapping',
    templateUrl: './single-account-meter-mapping.component.html',
    styleUrls: ['./single-account-meter-mapping.component.scss']
  })
  export class SingleAccountMeterMappingComponent implements OnInit {
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
    accountMappingData:any = [];
    validateMeterData:any = []; 
    serviceRegistrationId: string;
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private dashboardService: DashboardService,
      private workService: WorkOrderService,
      private snackbar: MatSnackBar,
      public dialog: MatDialog,
      private location: Location,
    ) {}
  
    ngOnInit() {
      this.route.queryParams.subscribe(async (params: ParamMap) => {
        const serviceRegistrationsId = params['serviceRegistrationId'];
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
        this.data = await this.dashboardService.accountMeterMappingReport(filter);
        //this.isFaReceived = this.data[0].isFaReceived;
        // this.serviceRegistrationsId = this.data[0].serviceRegistrationsId;
        this.accountMappingData = this.data.wmAccountMeterMappingDTOList;
        this.validateMeterData = this.data.wmMeterRegistersLogDTOList;
        console.log('this.accountMappingData ====', this.accountMappingData);
        console.log ('this.validateMeterData ===' , this.validateMeterData);
        
      });
    }
   
    Back() {
      // this.router.navigate(['/full-details']); // Navigate back to the previous page
      // if (this.previousUrl) {
      //   this.router.navigateByUrl(this.previousUrl);
      // } else {
      //   this.router.navigate([`/main/full-details/${this.serviceRegistrationsId}`]);
      // }
      this.location.back();
    }
  }