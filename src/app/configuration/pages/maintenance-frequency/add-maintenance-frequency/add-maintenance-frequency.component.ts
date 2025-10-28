import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormBuilder, Validators, MaxValidator } from '@angular/forms';
@Component({
  selector: 'app-add-maintenance-frequency',
  templateUrl: './add-maintenance-frequency.component.html',
  styleUrls: ['./add-maintenance-frequency.component.scss']
})
export class AddMaintenanceFrequencyComponent {
  frequencyOptions: string[] = ['QUARTERLY', 'HALFEARLY', 'YEARLY']; 
  frequencyTypeOptions : string[] =['Q1','Q2','Q3','Q4','H1','H2','YR'];
  fromMonthOptions: string[] =['JAN','APR','JUL','OCT'];
  toMonthOptions: string[] = [];
  notificationRef: any;

  MaintenanceFrequencyForm: FormGroup;

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any
  ) { 
    dialogRef.disableClose = true;
    
  }
  async ngOnInit() {
    this.MaintenanceFrequencyForm = this.formBuilder.group({
      frequency: ['', Validators.required],
      frequencyType:['',Validators.required],
      fromMonth: ['', Validators.required],
      toMonth: ['', Validators.required],
    });
  }
  updateToMonthOptions(): void {
    const frequency = this.MaintenanceFrequencyForm.get('frequency').value;
    const fromMonth = this.MaintenanceFrequencyForm.get('fromMonth').value;
  
    switch (frequency) {
      case 'QUARTERLY':
        switch (fromMonth) {
          case 'JAN':
            this.toMonthOptions = ['MAR'];
            break;
          case 'APR':
            this.toMonthOptions = ['JUN'];
            break;
          case 'JUL':
            this.toMonthOptions = ['SEP'];
            break;
          case 'OCT':
            this.toMonthOptions = ['DEC'];
            break;
          default:
            this.toMonthOptions = [];
            break;
        }
        break;
      case 'HALFEARLY':
        switch (fromMonth) {
          case 'JAN':
            this.toMonthOptions = ['JUN'];
            break;
          case 'APR':
            this.toMonthOptions = ['SEP'];
            break;
          case 'JUL':
            this.toMonthOptions = ['DEC'];
            break;
          case 'OCT':
            this.toMonthOptions = ['MAR'];
            break;
          default:
            this.toMonthOptions = [];
            break;
        }
        break;
      case 'YEARLY':
        switch (fromMonth) {
          case 'JAN':
            this.toMonthOptions = ['DEC'];
            break;
          case 'APR':
            this.toMonthOptions = ['MAR'];
            break;
          case 'JUL':
            this.toMonthOptions = ['JUN'];
            break;
          case 'OCT':
            this.toMonthOptions = ['SEP'];
            break;
          default:
            this.toMonthOptions = [];
            break;
        }
        break;
      default:
        this.toMonthOptions = [];
        break;
    }
  
    if (!this.toMonthOptions.includes(this.MaintenanceFrequencyForm.get('toMonth').value)) {
      this.MaintenanceFrequencyForm.get('toMonth').setValue('');
    }
  }
  
  
  onAddMaintenanceFrequencyType() {
    this.markAllFieldsTouched();
    if (this.MaintenanceFrequencyForm.valid) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
  
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };
 
    const maintenanceFrequencyRecord = {
         frequency:this.MaintenanceFrequencyForm.get('frequency').value,
         frequencyType:this.MaintenanceFrequencyForm.get('frequencyType').value,
         frequencyStartMonth:this.MaintenanceFrequencyForm.get('fromMonth').value,
         frequencyEndMonth:this.MaintenanceFrequencyForm.get('toMonth').value,
    };
    this.configurationService.getsaveMaintenanceFrequencyData(filters, maintenanceFrequencyRecord)
      .then(() => {
        this.Service.sendUpdate('Maintenance Frequency Master Updated');
        this.showSuccessSnackbar();
      })
      .catch(error => {
        console.error('Error saving maintenance data:', error);
      });
    }
  }
  showSuccessSnackbar() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
    this.notificationRef = this.snackBar.open(
      'Maintenance Scheduler Data Added Successfully',
      'OK',
      {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      }
    );
    this.notificationRef.afterDismissed().toPromise().then(() => {
      this.dialogRef.close();
    });
  }
  markAllFieldsTouched() {
    Object.values(this.MaintenanceFrequencyForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
}
