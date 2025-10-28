import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WorkOrderService } from 'src/app/services/work-order.service';
import { ConfirmationPopupComponent } from 'src/app/shared/components/confirmation-popup/confirmation-popup.component';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-meter-replicate-and-validate',
  templateUrl: './meter-replicate-and-validate.component.html',
  styleUrls: ['./meter-replicate-and-validate.component.scss'],
})
export class MeterReplicateAndValidateComponent implements OnInit {
  type: any = 'list';
  workDescription: string = '';
  workorderNo: string = '';
  SaveData: {} = {};
  data: any;
  accountMappingData: any[] = [];
  validateMeterData: any[] = [];
  meterReplicated: boolean = false;
  validateMeterDisplayed: boolean = false;
  private fieldActivityId: string | null = null;
  isMtrProcurmentDone: number | null = null  ;
  errorMessage: string | null = null; 
  errorMessage1 = "Meter details not found, please upload meter";
  meterDetailsNotFound = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private workService: WorkOrderService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const workorderRegisteredId = params['workOrderRegisteredId'];
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
        workorderRegisteredId,
      };

      this.data = await this.dashboardService.getPermitWorkGetDataById(filter);
      this.workorderNo = this.data?.wmWorkorderRegistered?.workorderNo;
      this.isMtrProcurmentDone = this.data?.wmWorkorderRegistered?.isMtrProcurmentDone;
      if (this.isMtrProcurmentDone !== 1) {
        this.errorMessage = 'Procurement letter is not generated, please initiate the procurement letter';
        return;
      }

      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        workorderNo: this.workorderNo,
      };
      const response = await this.dashboardService.getAccountMeterData(filters);
      if (Array.isArray(response)) {
        this.accountMappingData = response;
      } else if (response) {
        this.accountMappingData = [response];
      } else {
        this.accountMappingData = [];
      }

      const hasNullValues = this.accountMappingData.some(
        (item) => !item.badgeNumber || !item.accountId
      );

      if (hasNullValues || this.accountMappingData.length === 0) {
        this.meterDetailsNotFound = true;
        this.snackbar.open(
          'Meter details not found, please upload meter',
          'OK',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
      } else {
        this.accountMappingData.forEach((item) => {
          item.selectedDate = item.selectedDate || '';
        });
      }
    });
  }
  async ReplicateMeter() {
    if (this.meterDetailsNotFound) return;
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const badgeNumber = this.accountMappingData[0]?.badgeNumber;
    const filterData: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      badgeNumber,
    };
    try {
      const response = await this.dashboardService.getMeterReplicateData(
        filterData
      );
      if (response && response.input.fieldActivityID) {
        console.log('replicate data', response);
        this.meterReplicated = true;
        this.fieldActivityId = response.input.fieldActivityID;
        console.log('fieldActivityId', this.fieldActivityId);
        this.snackbar.open('Meter replicated successfully!', 'OK', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      
        });
      } else {
        console.error('Failed to replicate meter:', response);
        this.snackbar.open(
          'Failed to replicate meter. Please try again.',
          'OK',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
      }
    } catch (error) {
      console.error('Error fetching Replicate meter data:', error);
      this.snackbar.open(
        'Error replicating meter. Please try again.',
        'Close',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
    }
  }
  async ValidateMeter() {

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const accountId = this.accountMappingData[0]?.accountId;
    const badgeNumber = this.accountMappingData[0]?.badgeNumber;
    const serviceRegistrationsId=this.data.wmWorkorderRegistered.serviceRegistrationsId;
    const fieldActivityId= this.fieldActivityId
   // const fieldActivityId = 2785403969;
    const filtersData: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      accountId,
      badgeNumber,
      fieldActivityId,
      serviceRegistrationsId
    };

    try {
      const response = await this.dashboardService.getMeterValidateData(
        filtersData
      );
      if (response) {
        this.validateMeterData = response;
        console.log('validateMeterData', this.validateMeterData);
        this.validateMeterDisplayed = true;

      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error fetching validate meter data:', error);
    }
  }
  navigate(label: any, code: any) {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        type: this.type,
        label: label,
        statusCode: code,
        processTypeName: 'WORKORDER',
      },
    });
  }
}
