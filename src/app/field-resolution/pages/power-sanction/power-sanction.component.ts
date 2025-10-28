import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
import { FieldActivityService } from 'src/app/services/field-activity.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
interface SaveData {
  messageType: string;
  messageText: string;
}
@Component({
  selector: 'app-power-sanction',
  templateUrl: './power-sanction.component.html',
  styleUrls: ['./power-sanction.component.scss'],
})
export class PowerSanctionComponent implements OnInit {
  form: FormGroup;
  showDetails = false;
  selectedHeading = '';
  data: any = null;
  accountId: string = '';
  saveData: SaveData | null = null;
  showCtChange = false;
  options: number[] = [];
  selectedOption: number | null = null;
  errorMessage: string;
  isButtonDisabled: boolean = false;
  isTableVisible: boolean = true;
  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fieldactivityService: FieldActivityService,
    private router: Router,
    private loader:LoaderService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({ 
      meterRequiredflag: [null],
      lineExtension: [null],
      meterChange: [null],
      ctChange: [null],
      plinthArea: [null],
      height: [null],
    });

    this.form.get('meterRequiredflag')?.valueChanges.subscribe((value) => {
      this.showCtChange = value == 'no';
    });
    this.generateOptions();
  }
  toggleTableVisibility(): void {
    this.isTableVisible = !this.isTableVisible;
  }
  generateOptions(): void {
    this.options = Array.from({ length: 5 }, (_, i) => i + 1); 
  }
  onMeterChange(): void {
      const meterChangeValue = this.form.get('meterRequiredflag')?.value;
      this.showCtChange = meterChangeValue === 'no';
  }
  async getDetails() {
    try {
      this.accountId = this.accountId?.trim();
  
      if (!this.accountId || isNaN(Number(this.accountId))) {
        alert('Please enter a valid numeric Account ID');
        return;
      }
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const discom =this.selectedOption
      const detailsFilter: any = {apiKey,serviceKey,userRole,userName,userCode, referenceNumber: this.accountId, discom};
      const response = await this.fieldactivityService.getDataByCaseIdForAfterPowerSanction(detailsFilter);
  
      if (response && response.data && response.data.length > 0) {
        this.data = response.data[0];
        
        this.form.patchValue({
          lineExtension: this.data.isNetworkExtension,
          meterRequiredflag : this.data.meterRequiredFlag,
          ctChange: (this.data.applicationTypeCode == 'LE' || this.data.applicationTypeCode == 'LR') 
          ? (this.data.isCtChangeReq) 
          : null,
          gisNetworkDone:this.data.isGisNetworkDone,
          // meterChange : this.data.isMeterChange  == 'true' ? 'yes' : 'no',
          plinthArea: this.data.buildupAreaSize,
          height: this.data.buildingHeight,
        });
      } else {
        this.data = null;
        this.snackBar.open('No details found for the provided Account ID.', 'OK', {
          duration: 3000,
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      this.snackBar.open('Failed to fetch details. Please try again later.', 'OK', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  }
  openSaveDialog(action: string): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
       this.afterPowerSanctionApproval();
      }
    });
  }
  async afterPowerSanctionApproval() {
    try {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const serviceRegistrationsId = this.data.serviceRegistrationsId;
      const isNetworkExtension = this.form.get('lineExtension').value;
      // const meterRequiredFlag = this.form.get('meterRequiredflag').value;
      const buildupAreaSize = this.form.get('plinthArea').value;
      const buildingHeight = this.form.get('height').value;
      // const isGisNetworkDone = this.data?.isGisNetworkDone;
      // const isCtChangeReq = this.form.get('ctChange').value;

      const initialSaveFilter = { 
        apiKey,
        serviceKey,
        userName,
        userRole,
        userCode,
        serviceRegistrationsId,
        isNetworkExtension,
        // meterRequiredFlag,
        buildupAreaSize,
        buildingHeight,
        // isGisNetworkDone,
        // isCtChangeReq,
      };

      const saveFilter = Object.entries(initialSaveFilter).reduce((filtered, [key, value]) => {
        if (value !== null && value !== undefined && value !== "null") {
          filtered[key] = value;
        }
        return filtered;
      }, {} as Record<string, any>);
      

      this.saveData = await this.fieldactivityService.afterPowerSanctionApproval(saveFilter);
      const messageType = this.saveData?.messageType;
      const messageText = this.saveData?.messageText;

      if (messageType === 'SUCCESS') {
        this.snackBar.open(messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
          panelClass: ['snackbar-success'],
        }).onAction().subscribe(() => {});
      } else if (messageType === 'FAILURE') {
        this.snackBar.open(messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
          panelClass: ['snackbar-failure'],
        }).onAction().subscribe(() => {});
      }
    } catch (error) {
      console.error('Error in returnToSiteInspection:', error);
      this.snackBar.open('Failed to process the request.', 'OK', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
        panelClass: ['snackbar-failure'],
      }).onAction().subscribe(() => {});
    }
  }
  
  
}
