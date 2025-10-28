import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
// import * as XLSX from 'xlsx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
const meterChangeDetailsReport = new FormGroup({
  file: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-multiple-account-meter-replacemant',
  templateUrl: './multiple-account-meter-replacemant.component.html',
  styleUrls: ['./multiple-account-meter-replacemant.component.scss']
})
export class MultipleAccountMeterReplacemantComponent implements OnInit {
  fileContent: any[][] = [];
  data: any[] = [];
  type: any;
  details: any;
  meterChangeDetailsReport: FormGroup = meterChangeDetailsReport;
  error: string;
  fileSizeError: boolean = false;
  wmWorkorderRegistrationId:string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const serviceRegistrationsId = params['serviceRegistrationId'];
      // const workorderRegisteredId = params['workOrderRegisteredId'];
      this.type = params['type'];
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, serviceRegistrationsId };
      this.data = await this.dashboardService.meterReplacementReportMC(filter);
      this.fileContent = this.data;
      // this.wmWorkorderRegistrationId=this.data[0]?.wmWorkorderRegisteredId;
      // console.log('wmWorkorderRegistered',this.wmWorkorderRegistrationId)
    });
  }
  Back(){
    this.location.back();
  }
  
}
