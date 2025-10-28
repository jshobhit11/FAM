import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as dayjs from 'dayjs';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { MaterialInspectionService } from '../../services/material-inspection.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
const materialInspectionForm = new FormGroup({
  Date: new FormControl('', [Validators.required]),
  file: new FormControl('', []),
  Remarks: new FormControl('', [Validators.required]), 
});
@Component({
  selector: 'app-material-inspection',
  templateUrl: './material-inspection.component.html',
  styleUrls: ['./material-inspection.component.scss'],
})
export class MaterialInspectionComponent implements OnInit {
  error: string;
  constructor(
    private materialInspectionService: MaterialInspectionService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  payload: any = {};
  materialInspectionForm: FormGroup = materialInspectionForm;
  checkdatav: any = [
    { name: 'AE', value: 'AE', ischecked: true },
    { name: 'AEE', value: 'AEE', ischecked: false },
    { name: 'EE', value: 'EE', ischecked: false },
    { name: 'SE', value: 'SE', ischecked: false },
    { name: 'CE', value: 'CE', ischecked: false },
  ];

  selectedCheckboxes: any = [];
  workorderRegisteredId: any;
  data: any = {};
  type: any;
  isLoading: boolean = false;
  ngOnInit() {
    this.payload.Date = dayjs().format('YYYY-MM-DD');
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const workorderRegisteredId = params['workOrderRegisteredId'];
      this.type = params['type'];
      this.workorderRegisteredId = workorderRegisteredId;
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

      this.data = await this.dashboardService.getPermitWorkGetDataById(filter);
      console.log(this.data);
    });
    this.resetForm();
  }
  resetForm() {
    this.materialInspectionForm = new FormGroup({
      Date: new FormControl('', [Validators.required]),
      file: new FormControl('', []),
      Remarks:new FormControl('',[Validators.required])
    });
  }
  openConfirmationpopupDialog() {
     this.materialInspectionForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onMaterialInspection();
      }
    });
  }
  }
  isValidForm(): boolean {
    this.materialInspectionForm.markAllAsTouched();
    console.log('Form Valid?', this.materialInspectionForm.valid);
    let hasError = false;
    Object.keys(this.materialInspectionForm.controls).forEach((key) => {
      const control = this.materialInspectionForm.get(key);
  
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
  changeFn(event) {
    console.log(
      'in changeFn event ',
      event,
      ' event.target.value ',
      event.target.value
    );

    this.checkdatav = this.checkdatav.map((item) => {
      if (item.value == event.target.value) {
        return {
          ...item,
          ischecked: !item.ischecked,
        };
      } else {
        return item;
      }
    });
    console.log('after this.checkdata ', this.checkdatav);
  }

  onMaterialInspection() {
    if (Object.keys(this.payload).length === 0) {
      this.snackBar
        .open('Date, Insptected By and Remarks are mandatory fields', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
        });
      return;
    }

    if (!this.payload.Remarks) {
      this.snackBar
        .open('Remarks is mandatory', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
        });
      return;
    }
    if (!this.payload.Date) {
      this.snackBar
        .open('Date is mandatory', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
        });
      return;
    }

    if (
      Object.values(this.checkdatav).every(
        (obj: any) => obj.ischecked === false
      )
    ) {
      this.snackBar
        .open('Inspected By is mandatory', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
        });
      return;
    }
    console.log('Payload ===>', this.payload);

    const [
      inspectedByAe,
      inspectedByAee,
      inspectedByEe,
      inspectedBySe,
      inspectedByCe,
    ] = this.checkdatav;
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    this.isLoading = true;
    console.log({
      materialInspectionLogId: 0,
      wmWorkorderRegisteredId: this.workorderRegisteredId,
      inspectedByAe: inspectedByAe.ischecked ? 1 : 0,
      inspectedByAee: inspectedByAee.ischecked ? 1 : 0,
      inspectedByEe: inspectedByEe.ischecked ? 1 : 0,
      inspectedBySe: inspectedBySe.ischecked ? 1 : 0,
      inspectedByCe: inspectedByCe.ischecked ? 1 : 0,
      inspectionDate: dayjs(this.payload.Date).format('YYYY-MM-DD'),
      remarks: this.payload.Remarks,
    });
    this.materialInspectionService
      .saveMaterialInspectionData(
        {
          apiKey,
          serviceKey,
          userCode,
          userName,
          userRole,
          serviceRegistrationsId:
            this.data.wmWorkorderRegistered.serviceRegistrationsId,
        },
        {
          materialInspectionLogId: 0,
          wmWorkorderRegisteredId: this.workorderRegisteredId,
          inspectedByAe: inspectedByAe.ischecked ? 1 : 0,
          inspectedByAee: inspectedByAee.ischecked ? 1 : 0,
          inspectedByEe: inspectedByEe.ischecked ? 1 : 0,
          inspectedBySe: inspectedBySe.ischecked ? 1 : 0,
          inspectedByCe: inspectedByCe.ischecked ? 1 : 0,
          inspectionDate: dayjs(this.payload.Date).format('YYYY-MM-DD'),
          remarks: this.payload.Remarks,
        }
      )
      
      .then((res) => {
        console.log(res);
          const snackBarRef = this.snackBar
          .open('Material Inspection Done', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          snackBarRef.onAction()
          .subscribe(() => {
            this.snackBar.dismiss();
            this.router.navigate(['/main/work-order-summary'], {
              queryParams: {
                statusCode: 14,
                label: 'MATERIAL INSPECTION',
                type: 'list',
              },
            });
            this.isLoading = false;
          });
      })
      .catch((err) => console.log(err));
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
