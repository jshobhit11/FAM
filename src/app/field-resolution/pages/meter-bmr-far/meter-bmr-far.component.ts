import { Component, OnInit } from '@angular/core';
import { FieldActivityService } from 'src/app/services/field-activity.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';

interface SaveData {
  messageType: string;
  messageText: string;
}
@Component({
  selector: 'app-meter-bmr-far',
  templateUrl: './meter-bmr-far.component.html',
  styleUrls: ['./meter-bmr-far.component.scss']
})
export class MeterBmrFarComponent implements OnInit {
  data: any = null;
  accountId: string = ''; 
  saveData: SaveData | null = null; 
  selectedOption: number | null = null;
  options: number[] = [];
  isButtonDisabled: boolean = false;
  isTableVisible: boolean = true;
  selectedRecord: any = null;
  apiUrl =environment.baseURL;
  blob: any;
  constructor(
    private fieldactivityService: FieldActivityService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private loader:LoaderService
  ) {}

  ngOnInit(): void {
    this.generateOptions();
  }
  generateOptions(): void {
    this.options = Array.from({ length: 5 }, (_, i) => i + 1); 
  }
  toggleTableVisibility(): void {
    this.isTableVisible = !this.isTableVisible;
  }
  async getDetails() {
    try {
      this.accountId = this.accountId?.trim();

      if (!this.accountId || isNaN(Number(this.accountId))) {
        alert('Please enter a valid Work Order No.');
        return;
      }
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const discom =this.selectedOption
      const detailsFilter: any = { apiKey,serviceKey,userRole,userName,userCode,referenceNumber:this.accountId,discom};
      const response = await this.fieldactivityService.getDataToGenerateMeterFileForBmr(detailsFilter);

      if (response && response.data && response.data.length > 0) {
        this.data = response.data;
      } else {
        this.data = null;
        this.snackBar.open('No Data Found With The Given Criteria..', 'OK', {
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

  openSaveDialog(record: any, action: string): void {
    this.selectedRecord = record;
  
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action, record }, 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.updateStatus();
      }
    });
  }
  
  async downloadBmrFile(record: any) {
    this.getPdf(record).subscribe((data: any) => {
      const blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `Bmr_File.pdf`;
      if (typeof cordova !== 'undefined') {
        MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob);
      } else {
        link.click();
      }
    });
  }
  

  getPdf(record: any) {  
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    
    return this.http.get(
      `${this.apiUrl}/api/bmrReport/generateBmrAccountMeterMappingReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&srJobsId=${record.srJobsId}&serviceRegistrationsId=${record.serviceRegistrationsId}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
  
  selectRecord(record: any): void {
    this.selectedRecord = record; 
    this.updateStatus();
  }
  
  async updateStatus() {
    if (this.isButtonDisabled || !this.selectedRecord) {
      return;
    }
    this.isButtonDisabled = true;
    this.loader.show('Updating...');
  
    try {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
  
      const detailsFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        srJobsId: this.selectedRecord.srJobsId,
        serviceRegistrationsId: this.selectedRecord.serviceRegistrationsId
      };
  
      this.saveData = await this.fieldactivityService.deactiveUploadedBmrMeterFile(detailsFilter);
      const messageType = this.saveData?.messageType;
      const messageText = this.saveData?.messageText;
      this.loader.hide();
  
      if (messageType === 'SUCCESS') {
        const MatSnackBar = this.snackBar.open(messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          panelClass: ['snackbar-success'],
        });
        MatSnackBar.onAction().subscribe(() => {
          MatSnackBar.dismiss();
          this.isButtonDisabled = false;
          this.router.navigate(['/field-resolution']);
        });
      } else {
        this.snackBar.open(messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          panelClass: ['snackbar-failure'],
        }).onAction().subscribe(() => {
          this.isButtonDisabled = false;
        });
      }
    } catch (error) {
      this.snackBar.open('Failed to process the request.', 'OK', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: ['snackbar-failure'],
      }).onAction().subscribe(() => {
        this.isButtonDisabled = false;
      });
    }
  }
  

}
