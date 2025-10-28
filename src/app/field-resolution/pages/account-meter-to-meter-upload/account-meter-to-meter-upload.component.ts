import { Component, OnInit } from '@angular/core';
import { FieldActivityService } from 'src/app/services/field-activity.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
interface SaveData {
  messageType: string;
  messageText: string;
}

@Component({
  selector: 'app-account-meter-to-meter-upload',
  templateUrl: './account-meter-to-meter-upload.component.html',
  styleUrls: ['./account-meter-to-meter-upload.component.scss']
})
export class AccountMeterToMeterUploadComponent implements OnInit {
  data: any = null;
  accountId: string = ''; 
  saveData: SaveData | null = null; 
  options: number[] = [];
  selectedOption: number | null = null;
  errorMessage: string;
  isButtonDisabled: boolean = false;
  constructor(
    private fieldactivityService: FieldActivityService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private loader:LoaderService
  ) {}

  ngOnInit(): void {
    this.generateOptions();
  }
  generateOptions(): void {
    this.options = Array.from({ length: 5 }, (_, i) => i + 1); 
  }
  async getDetails() {
    try {
      this.accountId = this.accountId?.trim();

      // if (!this.accountId || isNaN(Number(this.accountId))) {
      //   alert('Please enter a valid Work Order Number');
      //   return;
      // }
      
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const discom =this.selectedOption
      const detailsFilter: any = { apiKey,serviceKey,userRole,userName,userCode,referenceNumber:'null',discom,workorderNo:this.accountId};
      const response = await this.fieldactivityService.getDataByWorkorderNoToMoveBackToMeterUpload(detailsFilter);

      if (response && response.data && response.data.length > 0) {
        this.data = response.data[0];
      } else {
        this.data = null;
        this.snackBar.open('No details found for the provided Work Order Number.', 'OK', {
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
        this.revertToMeterUpload();
      }
    });
  }
  async revertToMeterUpload() {
    if (this.isButtonDisabled) {
      return;
    }
    this.isButtonDisabled = true;
    this.loader.show('Returning to Meter Upload...');
    try {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const detailsFilter: any = {apiKey,serviceKey,userRole,userName,userCode,wmWorkorderRegisteredId:this.data?.wmWorkorderRegisteredId};
      this.saveData = await this.fieldactivityService.moveBackToMeterUpload(detailsFilter);
      const messageType = this.saveData?.messageType;
      const messageText = this.saveData?.messageText;
      this.loader.hide();
      if (messageType == 'SUCCESS') {
        const MatSnackBar= this.snackBar.open(messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
          panelClass: ['snackbar-success'],
        });MatSnackBar.onAction().subscribe(() => {
          MatSnackBar.dismiss();
          this.isButtonDisabled = false;
          this.router.navigate(['/field-resolution']); 
        });
      } else if (messageType == 'Failure') {
        const MatSnackBar= this.snackBar.open(messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
          panelClass: ['snackbar-failure'],
        });MatSnackBar.onAction().subscribe(() => {
          MatSnackBar.dismiss();
          this.isButtonDisabled = false;
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
