import { Component, OnInit } from '@angular/core';
import { FieldActivityService } from 'src/app/services/field-activity.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
interface SaveData {
  messageType: string;
  messageText: string;
}
@Component({
  selector: 'app-back-account-meter-mapping',
  templateUrl: './back-account-meter-mapping.component.html',
  styleUrls: ['./back-account-meter-mapping.component.scss']
})
export class BackAccountMeterMappingComponent implements OnInit {
  data: any = null;
  accountId: string = ''; 
  saveData: SaveData | null = null;
  constructor(
    private fieldactivityService: FieldActivityService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {}

  async getDetails() {
    try {
      this.accountId = this.accountId?.trim();

      if (!this.accountId || isNaN(Number(this.accountId))) {
        alert('Please enter a valid numeric Case ID');
        return;
      }
      const detailsFilter: any = { referenceNumber: this.accountId};
      const response = await this.fieldactivityService.getFieldDataByAccountId(detailsFilter);

      if (response && response.data && response.data.length > 0) {
        this.data = response.data[0];
      } else {
        this.data = null;
        this.snackBar.open('No details found for the provided Case ID.', 'OK', {
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
       this.putBackToAccountMeterMapping();
      }
    });
  }
  async putBackToAccountMeterMapping(){
    try {
      const caseId = this.data?.referenceNumber;
      const discom = this.data?.discom;
      const userKey = 'null'; 
      const flag1 = 'null';

      const detailsFilter: any = { 
        caseId,
        discom,
        userKey,
        flag1
      };
      this.saveData = await this.fieldactivityService.afterPowerSanctionApproval(detailsFilter);
      const messageType = this.saveData?.messageType;
      const messageText = this.saveData?.messageText;

      if (messageType === 'SUCCESS') {
        this.snackBar.open(messageText, 'OK', {
          duration: 3000,
          verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
          panelClass: ['snackbar-success'],
        }).onAction().subscribe(() => {

        });
      } else if (messageType === 'FAILURE') {
        this.snackBar.open(messageText, 'OK', {
          duration: 3000,
          verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
          panelClass: ['snackbar-failure'],
        }).onAction().subscribe(() => {
        });
      }
    } catch (error) {
      console.error('Error in returnToSiteInspection:', error);
      this.snackBar.open('Failed to process the request.', 'OK', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
        panelClass: ['snackbar-failure'],
      }).onAction().subscribe(() => {
      });
    }
  }
}
