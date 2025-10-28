import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-account-meter-replacemant',
  templateUrl: './single-account-meter-replacemant.component.html',
  styleUrls: ['./single-account-meter-replacemant.component.scss']
})
export class SingleAccountMeterReplacemantComponent implements OnInit {
  data: any;
  type: any;
  error: 0;
  oldAccountMappingData: any[] = [];
  newAccountMappingData: any[] = [];
  oldMeterData: any[] = [];
  newMeterData: any[] = [];
  meterData: any[] = [];
  isFaReceived: any;
  private oldAccountIds = new Set<0>();
  private newAccountIds = new Set<0>();
  applicationTypeCode: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private workService: WorkOrderService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar ,
    private location: Location
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
  
      try {
        this.data = await this.dashboardService.meterReplacementReport(filter);
        console.log('API Response:', this.data);
  
        if (this.data && this.data.wmMeterRegistersLogDTOList) {
          // Iterate through wmMeterRegistersLogDTOList to separate old and new meter data
          this.data.wmMeterRegistersLogDTOList.forEach(item => {
            if (item.meterFlag === "O") {
              this.oldMeterData.push(item);
            } else if (item.meterFlag === "N") {
              this.newMeterData.push(item);
            }
          });
  
          this.oldAccountMappingData = this.data.wmMeterRegistersLogDTOList.filter(item => item.meterFlag === "O").slice(0, 1);
          this.newAccountMappingData = this.data.wmAccountMeterMappingDTOList;
  
        } else {
          console.log('No data found or data structure is incorrect.');
        }
      } catch (error) {
        console.error('Error fetching meter replacement report:', error);
      }
    });
  }
  
  Back(){
  this.location.back();
}
  }