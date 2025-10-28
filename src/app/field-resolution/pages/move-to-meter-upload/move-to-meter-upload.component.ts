import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
import { FieldActivityService } from 'src/app/services/field-activity.service';
import { MatDialog } from '@angular/material/dialog';

interface SaveData {
  messageType: string;
  messageText: string;
}

@Component({
  selector: 'app-move-to-meter-upload',
  templateUrl: './move-to-meter-upload.component.html',
  styleUrls: ['./move-to-meter-upload.component.scss'],
})
export class MoveToMeterUploadComponent implements OnInit {
  data: any = null;
  accountId: string = '';
  saveData: SaveData | null = null;
  selectedExecutionType: string = ''; // Selected dropdown value
  options: number[] = [];
  selectedOption: number | null = null;
  isTableVisible: boolean = false;

  constructor(
    private fieldactivityService: FieldActivityService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
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

      // if (!this.accountId || isNaN(Number(this.accountId))) {
      //   alert('Please enter a valid numeric Work Order Number');
      //   return;
      // }
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const discom = this.selectedOption;
      const detailsFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        workorderNo: this.accountId,
        discom,
      };
      const response =
        await this.fieldactivityService.getDataByWorkorderNoForWithoutLineExtToMtrUpload(
          detailsFilter
        );

      if (response && response.data && response.data.length > 0) {
        this.data = response.data[0];
      } else {
        this.data = null;
        this.snackBar.open(
          'No details found for the provided Work Order Number.',
          'OK',
          {
            duration: 3000,
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
      }
    } catch (error) {
      console.error('Error fetching details:', error);
      this.snackBar.open(
        'Failed to fetch details. Please try again later.',
        'OK',
        {
          duration: 3000,
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
    }
  }

  openSaveDialog(action: string): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.moveToMeterUploadWithoutLineExt();
      }
    });
  }

  async moveToMeterUploadWithoutLineExt() {
    try {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const wmWorkorderRegisteredId = this.data?.wmWorkorderRegisteredId;
      const serviceRegistrationsId = this.data?.serviceRegistrationsId;
      const detailsFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        wmWorkorderRegisteredId,
        serviceRegistrationsId,
      };
      this.saveData = await this.fieldactivityService.withoutLineExt(
        detailsFilter
      );
      this.showSnackBar(this.saveData);
    } catch (error) {
      console.error(
        'Error in afterWorkOrderMoveToMeterUploadSelfExecution:',
        error
      );
      this.snackBar.open('Failed to process the request.', 'OK', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: ['snackbar-failure'],
      });
    }
  }

  private showSnackBar(saveData: SaveData | null) {
    const messageType = saveData?.messageType;
    const messageText = saveData?.messageText;

    if (messageType === 'SUCCESS') {
      this.snackBar.open(messageText, 'OK', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: ['snackbar-success'],
      });
    } else if (messageType === 'FAILURE') {
      this.snackBar.open(messageText, 'OK', {
        duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: ['snackbar-failure'],
      });
    }
  }
}
