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
  selector: 'app-change-dop-category',
  templateUrl: './change-dop-category.component.html',
  styleUrls: ['./change-dop-category.component.scss']
})
export class ChangeDopCategoryComponent implements OnInit {
  data: any = null;
  accountId: string = '';
  saveData: SaveData | null = null;
  options: number[] = [];
  selectedOption: number | null = null;
  errorMessage: string;
  isButtonDisabled: boolean = false;
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

      if (!this.accountId || isNaN(Number(this.accountId))) {
        alert('Please enter a valid numeric Work Order Number');
        return;
      }
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
        await this.fieldactivityService.getDataByWorkorderNoToUpdateWorkCategoryToSCN(
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
        this.changeDopCategory();
      }
    });
  }
  async changeDopCategory() {
    try {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const wmWorkorderRegisteredId = this.data?.wmWorkorderRegisteredId;
      const detailsFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        wmWorkorderRegisteredId,
      };
      this.saveData = await this.fieldactivityService.whenSelfExecutionWorks(
        detailsFilter
      );
      const messageType = this.saveData?.messageType;
      const messageText = this.saveData?.messageText;

      if (messageType === 'SUCCESS') {
        this.snackBar
          .open(messageText, 'OK', {
            duration: 3000,
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            panelClass: ['snackbar-success'],
          })
          .onAction()
          .subscribe(() => {});
      } else if (messageType === 'FAILURE') {
        this.snackBar
          .open(messageText, 'OK', {
            duration: 3000,
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            panelClass: ['snackbar-failure'],
          })
          .onAction()
          .subscribe(() => {});
      }
    } catch (error) {
      console.error('Error in returnToSiteInspection:', error);
      this.snackBar
        .open('Failed to process the request.', 'OK', {
          duration: 3000,
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          panelClass: ['snackbar-failure'],
        })
        .onAction()
        .subscribe(() => {});
    }
  }
}
