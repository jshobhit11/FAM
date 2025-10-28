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
  selector: 'app-work-order-creation-aet',
  templateUrl: './work-order-creation-aet.component.html',
  styleUrls: ['./work-order-creation-aet.component.scss']
})
export class WorkOrderCreationAetComponent implements OnInit {
  data: any = null;
  accountId: string = ''; 
  saveData: SaveData | null = null; 
  selectedOption: number | null = null;
  options: number[] = [];
  isButtonDisabled: boolean = false;
  designationOptions: Array<{ label: string; value: number }> = [];
  selectedDesignationChange: number | null = null;
  isTableVisible: boolean = true;
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
  toggleTableVisibility(): void {
    this.isTableVisible = !this.isTableVisible;
  }
  async getDetails() {
    try {
      this.accountId = this.accountId?.trim();

      if (!this.accountId || isNaN(Number(this.accountId))) {
        alert('Please enter a valid Case Id.');
        return;
      }
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const discom =this.selectedOption
      const detailsFilter: any = { apiKey,serviceKey,userRole,userName,userCode,referenceNumber:this.accountId,discom};
      const response = await this.fieldactivityService.getWrongAssignOfWorkorderCreation(detailsFilter);

      if (response && response.data && response.data.length > 0) {
        this.data = response.data[0];
        this.updateDesignationOptions();
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
  updateDesignationOptions() {
    if (this.data?.designation == 'AETDO') {
      this.designationOptions = [
        { label: 'AETDO To AET', value: 112},
      ];
    } else if (this.data?.designation == 'AET') {
      this.designationOptions = [
        { label: 'AET To AETDO', value: 111 },
      ];
    }
  }

  onDesignationChange(event: any) {
    this.data.designationId = event.value; 
  }
  openSaveDialog(action: string): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.chnageInApprovalAuthority();
      }
    });
  }
  async chnageInApprovalAuthority() {
    if (this.isButtonDisabled) {
      return;
    }
    this.isButtonDisabled = true;
    this.loader.show('Updating Approval Authority...');
    try {

      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const detailsFilter: any = {apiKey,serviceKey,userRole,userName,userCode,wmWorkorderRegisteredId:this.data?.wmWorkorderRegisteredId,serviceRegistrationsId:this.data?.serviceRegistrationsId,designationId:this.data?.designationId};
      this.saveData = await this.fieldactivityService.updateDesignation(detailsFilter);
      const messageType = this.saveData?.messageType;
      const messageText = this.saveData?.messageText;
      this.loader.hide();
      if (messageType === 'SUCCESS') {
      const MatSnackBar=  this.snackBar.open(messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
          panelClass: ['snackbar-success'],
        });MatSnackBar.onAction().subscribe(() => {
          MatSnackBar.dismiss();
          this.isButtonDisabled = false;
          this.router.navigate(['/field-resolution']); 
        });
      } else if (messageType === 'FAILURE') {
        this.snackBar.open(messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
          panelClass: ['snackbar-failure'],
        }).onAction().subscribe(() => {
          this.isButtonDisabled = false;
        });
      }
      this.loader.hide();
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
