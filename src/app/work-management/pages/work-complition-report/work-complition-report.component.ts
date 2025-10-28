import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WorkExecutionMaterialComponent } from 'src/app/main/pages/work-execution/work-execution-material/work-execution-material.component';
import { WorkCompletionService } from 'src/app/services/work-completion.service';
import { OptimizedPopupComponent } from 'src/app/shared/components/optimized-popup/optimized-popup.component';
@Component({
  selector: 'app-work-complition-report',
  templateUrl: './work-complition-report.component.html',
  styleUrls: ['./work-complition-report.component.scss'],
})
export class WorkComplitionReportComponent implements OnInit {
  data: any = {};
  workOrderRegisteredId: string = '';
  remarks: string = '';
  aeRemarks: any;
  aeeRemarks: string = '';
  aoRemarks: string = '';
  userRole: string = '';
  workExecutionMethodId: any;
  workExecutionMethod: string = '';
  remarksEntered: boolean = false;
  isNewConWorkorderClosed: boolean = false;
  isNetworkExtension:any;
  isGisNetworkDone: any;
  applicationTypeCode: any;
  
  constructor(
    private route: ActivatedRoute,
    private workCompletionService: WorkCompletionService,
    private snackbar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
  ) {}

  async ngOnInit() {
    const role = sessionStorage.getItem('user-role');
    this.userRole = role.split('_')[1];
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.workOrderRegisteredId = params['workorderRegisteredId'];
      const filter: any = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        wmWorkorderRegisteredId: this.workOrderRegisteredId,
      };
      console.log('workorderRegisteredId: ', this.workOrderRegisteredId);
      this.data = await this.workCompletionService.getWorkCompletionDataByWorkOrderRegisteredId(filter);
      if (this.data.workorderRegistered && this.data.workorderRegistered.length) {
        this.workExecutionMethodId = this.data.workorderRegistered[0].woExecutionMethodId;
        this.workExecutionMethod = this.data.workorderRegistered[0].workExecutionMethod;
      }
      if (this.data.serviceRegistered && this.data.serviceRegistered.length) {
      this.isNetworkExtension=this.data?.serviceRegistered[0]?.isNetworkExtension;
      this.isGisNetworkDone=this.data?.serviceRegistered[0]?.isGisNetworkDone;
      }
      if (this.data.workorderRegistered && this.data.workorderRegistered.length){
        this.applicationTypeCode = this.data?.workorderRegistered[0]?.applicationTypeCode;
      }
      /* set isNewConWorkorderClosed */
      if(this.data.workorderRegistered.isNewConWorkorderClosed) {
        if(this.data.workorderRegistered.isNewConWorkorderClosed == 1) {
          this.isNewConWorkorderClosed = true;
        } else {
          this.isNewConWorkorderClosed = false;
        }
      }

      console.log(this.data);

      if (this.data.wmWorkorderCompletionVerifiedLog.length) {
        const ae = this.data.wmWorkorderCompletionVerifiedLog.find((v: any) => v.verifiedDesignationCode === 'AE');
        const aee = this.data.wmWorkorderCompletionVerifiedLog.find((v: any) => v.verifiedDesignationCode === 'AEE');
        const ao = this.data.wmWorkorderCompletionVerifiedLog.find((v: any) => v.verifiedDesignationCode === 'AO');
        if (ae) {
          this.aeRemarks = ae.verifiedRemarks;
        }
        if (aee) {
          this.aeeRemarks = aee.verifiedRemarks;
        }
        if (ao) {
          this.aoRemarks = ao.verifiedRemarks;
        }
      }
    });
  }
  checkRemarks() {
    this.remarksEntered = !!this.remarks.trim();
  }
  isExtensionPending(): boolean {
    if(this.applicationTypeCode=='IMW'){
      return this.isNetworkExtension =='1' && this.isGisNetworkDone == '0';
    }
  }
  async submit() {
    const role = sessionStorage.getItem('user-role').split('_')[1];
    if (role === 'AO') {
      if (this.data.billSubmissionLogResponseList.length === 0 && this.data.workorderRegistered[0].isWorkAwardRequired == '1') {
        this.snackbar.open('Bills are not submitted, Please submit the Bills.', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return;
      }
    }

    if (this.userRole == 'AE' && !this.remarks) {
      this.snackbar.open('AE Remarks is mandatory', 'OK');
      return;
    }
    if (this.userRole == 'AEE' && !this.remarks) {
      this.snackbar.open('AEE Remarks is mandatory', 'OK');
      return;
    }
    if (this.userRole == 'EE' && !this.remarks) {
      this.snackbar.open('EE Remarks is mandatory', 'OK');
      return;
    }
    const filter: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      serviceRegistrationsId: this.data.workorderRegistered[0].serviceRegistrationsId,
      wmWorkorderRegisteredId: this.workOrderRegisteredId,
    };
    const params: any = {
      wmWorkorderRegisteredId: this.workOrderRegisteredId,
      verifiedRemarks: this.remarks,
    };
    const res = await this.workCompletionService.saveWorkCompletionData(filter, params);
    if (res) {
       this.snackbar.open('Work Completion Done', 'OK',{
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.router.navigate(['/work-management/download-work-completion-report'], {
        queryParams: { workOrderRegisteredId: this.workOrderRegisteredId },
      });
    }
  }
  getSubmitButtonText(): string {
    switch (this.userRole) {
      case 'AE':
        return 'Submit';
      case 'AEE':
      case 'AO':
        return 'Accepted';
      default:
        return 'Submit'; 
    }
  }
  
  getConfirmationMessage(): string {
    return this.userRole === 'AE' ? 
      'Are you sure you want to submit?' : 
      'Are you sure you want to accept?';
  }
  
  openConfirmationpopupDialog(msg: any) {
    const dialogRef = this.dialog.open(OptimizedPopupComponent, {
      data: {
        message: msg,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.submit();
      }
    });
  }

  openWorkExecutionMaterialDialog(workOrderRegisteredId, workOrderNo) {
    const dialogRef = this.dialog.open(WorkExecutionMaterialComponent, {
      data: {
        workOrderRegisteredId,
        workOrderNo,
      },
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((v) => {});
  }
}
