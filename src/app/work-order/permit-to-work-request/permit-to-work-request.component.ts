import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import * as dayjs from 'dayjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
const permitToWorkForm = new FormGroup({
  dateOfPermitWork: new FormControl('', [Validators.required]),
  permitWorkNumber: new FormControl('', [Validators.required]),
  file: new FormControl('', []), 
  remarks: new FormControl('',[Validators.required])
});

@Component({
  selector: 'app-permit-to-work-request',
  templateUrl: './permit-to-work-request.component.html',
  styleUrls: ['./permit-to-work-request.component.scss'],
})
export class PermitToWorkRequestComponent implements OnInit {
  @Input() data: any;
  filter: any;
  permitWorkNumber: string;
  dateOfPermitWork: string;
  remarks: string;
  type: any;
  permitToWorkForm: FormGroup = permitToWorkForm;
  error: string;
  isLoading: boolean = false;
  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.permitWorkNumber = '';
    this.dateOfPermitWork = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    this.remarks = '';

    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const workorderRegisteredId = params['estimateNo'];
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
      this.filter = filter;
      this.data = await this.dashboardService.getPermitWorkGetDataById(filter);
      console.log(this.data);
      this.permitWorkNumber = this.data?.wmWorkorderRegistered?.permitWorkNumber;
    });
    this.resetForm();
  }
  resetForm() {
    this.permitToWorkForm = new FormGroup({
      dateOfPermitWork: new FormControl('', [Validators.required]),
      permitWorkNumber: new FormControl('', [Validators.required]),
      file:new FormControl('',[]),
      remarks:new FormControl('',[Validators.required])
    });
  }
  async onSubmitPermitWork() {
    if (!this.permitWorkNumber || !this.dateOfPermitWork || !this.remarks) {
      alert('Please fill in all the required fields');
      return;
    }
    const payload = {
      wmWorkorderRegisteredId:
        this.data?.wmWorkorderRegistered?.wmWorkorderRegisteredId,
      permitWorkNumber: this.permitWorkNumber,
      dateOfPermitWork: this.dateOfPermitWork,
      remarks: this.remarks,
    };
    this.filter = {
      ...this.filter,
      serviceRegistrationsId:
        this.data?.wmWorkorderRegistered?.serviceRegistrationsId,
    };
    this.isLoading = true;
    const data = await this.dashboardService.getPermitWorkSaveData(
      this.filter,
      payload
    );
    console.log('permit data', data, this.data);
    const snackBarRef= this.snackBar.open('Permit Work Done successfully', 'OK', {
        // duration: 3000,
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      })
      snackBarRef.onAction().subscribe(() => {
        this.snackBar.dismiss();
        this.permitWorkNumber = '';
        this.dateOfPermitWork = '';
        this.remarks = '';
        this.dashboardService.tempWorkOrder;
        this.router.navigate(['/main/work-order-summary'], {
          queryParams: {
            statusCode: 10,
            label: 'PERMIT TO WORK REQUEST',
            processTypeName: 'WORKORDER',
            type: this.type,
          },
        });
        this.dashboardService.tempWorkOrder = {};
        this.isLoading = false;
      });
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement) {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const maxHeight = 3 * lineHeight;
    const exceededMaxLines = textarea.scrollHeight > maxHeight;

    if (exceededMaxLines) {
      textarea.style.overflowY = 'scroll';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }

  openConfirmationpopupDialog() {
   this.permitToWorkForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onSubmitPermitWork();
      }
    });
  }
  }
  isValidForm(): boolean {
    this.permitToWorkForm.markAllAsTouched();
    console.log('Form Valid?', this.permitToWorkForm.valid);
    let hasError = false;
    Object.keys(this.permitToWorkForm.controls).forEach((key) => {
      const control = this.permitToWorkForm.get(key);
  
      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });
  
    if (hasError) {
      this.error = 'Please Fill Out Mandatory Fields';
      return false;
    } else {
      this.error = '';
      return true;
    }
  }

  navigate(label, code) {
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
