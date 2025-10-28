import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LineClearanceService } from 'src/app/services/line-clearance.service';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { LoaderService } from 'src/app/services/loader.service';
const lineClearanceForm = new FormGroup({
  shutdownStartDate: new FormControl('', [Validators.required]),
  shutdownEndDate: new FormControl('', [Validators.required]),
  remarks: new FormControl('', [Validators.required]), 
});
@Component({
  selector: 'app-line-clearance',
  templateUrl: './line-clearance.component.html',
  styleUrls: ['./line-clearance.component.scss'],
})
export class LineClearanceComponent implements OnInit {
  error: string;
  constructor(
    private route: ActivatedRoute,
    private lineClearanceService: LineClearanceService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    // private loader: LoaderService,
  ) {}

  accountId: any;
  workorderNo: any;
  data: any = {};
  type: any;
  lineClearanceForm: FormGroup = lineClearanceForm;
  isLoading: boolean = false;
  async ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.workorderNo = params['workorderNo'];
      this.type = params['type'];
      if (this.workorderNo != 'null') {
        const data = await this.lineClearanceService.getLineClearanceData({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          workorderRegisteredId: this.workorderNo,
        });
        this.data = {
          serviceRegistrationsId:
            data.wmWorkorderRegistered.serviceRegistrationsId,
          workorderNo: data.wmWorkorderRegistered.workorderNo,
          estimationNo: data.wmWorkorderRegistered.estimationNo,
          workExecutionMethod: data.wmWorkorderRegistered.workExecutionMethod,
          workorderEndDate: data.wmWorkorderRegistered.workorderEndDate,
          workDescription: data.wmWorkorderRegistered.workDescription,
        };
      } else {
        alert('Work Order Registered Id not found!');
      }
    });
    this.resetForm();
  }
  resetForm() {
    this.lineClearanceForm = new FormGroup({
      shutdownStartDate: new FormControl('', [Validators.required]),
      shutdownEndDate: new FormControl('', [Validators.required]),
      remarks:new FormControl('',[Validators.required])
    });
  }

  async submitLineClearance() {
    // console.log("data ofline clearence",{
    //   apiKey: sessionStorage.getItem('api-key'),
    //   serviceKey: sessionStorage.getItem('service-key'),
    //   userRole: sessionStorage.getItem('user-role'),
    //   userName: sessionStorage.getItem('user-name'),
    //   userCode: sessionStorage.getItem('user-code'),
    //   serviceRegistrationsId: this.data.serviceRegistrationsId,
    // },
    // {
    //   wmLineClearanceId: 0,
    //   wmWorkorderRegisteredId: this.workorderNo,
    //   shutdownStartDatetime: this.data.shutdownStartDate,
    //   shutdownEndDatetime: this.data.shutdownEndDate,
    //   expectedRestorationTime: '2023-05-16T08:29:41.655Z',
    //   actualRestorationTime: '2023-05-16T08:29:41.655Z',
    //   remarks: this.data.remarks,
    //   lineClearanceConfirmedBy: 0,
    //   insertedBy: 0,
    //   insertedDate: '2023-05-16T08:29:41.655Z',
    //   modifiedBy: 0,
    //   modifiedDate: '2023-05-16T08:29:41.655Z',
    //   sessionIpAddress: 'string',
    //   activeStatus: 0,
    //   uniqueCondition: 'string',
    // });
    // return;
     this.isLoading = true;
    //  this.loader.show(' Line clearance is submitting...');
      const submit = await this.lineClearanceService.saveLineClearanceData(
        {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          serviceRegistrationsId: this.data.serviceRegistrationsId,
        },
        {
          wmLineClearanceId: 0,
          wmWorkorderRegisteredId: this.workorderNo,
          shutdownStartDatetime: this.data.shutdownStartDate,
          shutdownEndDatetime: this.data.shutdownEndDate,
          expectedRestorationTime: '2023-05-16T08:29:41.655Z',
          actualRestorationTime: '2023-05-16T08:29:41.655Z',
          remarks: this.data.remarks,
          lineClearanceConfirmedBy: 0,
          insertedBy: 0,
          insertedDate: '2023-05-16T08:29:41.655Z',
          modifiedBy: 0,
          modifiedDate: '2023-05-16T08:29:41.655Z',
          sessionIpAddress: 'string',
          activeStatus: 0,
          uniqueCondition: 'string',
        }
      );
      if (submit.messageType == 'SUCCESS') {
        // this.loader.hide();
        const snackBarRef = this.snackBar.open('Line Clearance Done successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          snackBarRef.onAction().subscribe(() => {
            this.snackBar.dismiss();
            this.router.navigate(['/main/work-order-summary'], {
              queryParams: {
                statusCode: 11,
                label: 'LINE CLEARANCE',
              },
            });
            this.data = {};
            this.isLoading = false;
           });
         }
      }

  openConfirmationpopupDialog() {
    this.lineClearanceForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if ( result === 'yes') {
        this.submitLineClearance();
      }
    });
  }
}
  isValidForm(): boolean {
    this.lineClearanceForm.markAllAsTouched();
    console.log('Form Valid?', this.lineClearanceForm.valid);
    let hasError = false;
    Object.keys(this.lineClearanceForm.controls).forEach((key) => {
      const control = this.lineClearanceForm.get(key);
  
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
