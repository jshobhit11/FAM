import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

export interface accountHeadName {
  accountMainHeadCode: string;
  accountMainHeadDescription: string;
  accountSubMainHeadCode: string;
  accountSubmainHeadDescription: string;
  accountHeadCode: string;
  accountHeadDescription: string;
}
const AccountHeadMaster_DATA: accountHeadName[] = [];
@Component({
  selector: 'app-add-account-head-master',
  templateUrl: './add-account-head-master.component.html',
  styleUrls: ['./add-account-head-master.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountHeadMasterComponent implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(AccountHeadMaster_DATA);
  dataSourceTarget = new MatTableDataSource(AccountHeadMaster_DATA);
  dataSourceTemp = new MatTableDataSource(AccountHeadMaster_DATA);

  subscriptionName: any;
  accountHead: any[];
  accountSubMainCode: any[];
  accountMainData: any[] = [];
  accountSubMainData: any[] = [];
  accountSubMainCodeString: string;
  notificationRef: any;
  accountSubHeadCode: any[];
  accountHeadMainData: any = {};
  originalAccountMainSubMainData = [];
  accountHeadMasterForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.accountMainData = getAllData.field1 || [];
    this.originalAccountMainSubMainData = getAllData.field2 || [];

    console.log('this.accountMainData====',this.accountMainData+'   this.originalAccountMainSubMainData==== ',this.originalAccountMainSubMainData);
    
  }

  ngOnInit(): void {
    this.accountHeadMasterForm = this.formBuilder.group({
      accountHeadMainName: ['', [Validators.required]],
      accountHeadDescription: ['', [Validators.required]],
      accountHeadSubmainCode: ['', [Validators.required]],
      accountHeadCode: ['', [Validators.required]],
    });
  }

  isValidForm(): boolean {
    if (
      this.accountHeadMasterForm.get('accountHeadMainName').invalid ||
      this.accountHeadMasterForm.get('accountHeadDescription').invalid ||
      this.accountHeadMasterForm.get('accountHeadSubmainCode').invalid ||
      this.accountHeadMasterForm.get('accountHeadCode').invalid
    ) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
  accountHeadObj = {
    accountMainHeadCode: '',
    accountHeadDescription: '',
    accountMainHeadDescription: '',
    accountSubmainHeadCode: '',
    accountHeadCode: '',
    accountSubmainHeadDescription: '',
  };

  onAddAccountHeadMaster() {

    const foundAccountMainHead = this.accountMainData.find(
      (item) => item.accountHeadMainCode === this.accountHeadObj.accountMainHeadCode
    );
    const accountHeadMainName = foundAccountMainHead ? foundAccountMainHead.accountHeadMainName: '';
    this.accountHeadObj.accountMainHeadDescription = accountHeadMainName;


    const foundAccountSubMainHead = this.originalAccountMainSubMainData.find(
      (item) => item.accountHeadSubmainCode === this.accountHeadObj.accountSubmainHeadCode
    );
    const accountHeadSubMainName = foundAccountSubMainHead ? foundAccountSubMainHead.accountHeadSubmainName: '';
    this.accountHeadObj.accountSubmainHeadDescription = accountHeadSubMainName;
    
    Object.keys(this.accountHeadMasterForm.controls).forEach((key) => {
      this.accountHeadMasterForm.get(key)?.markAsTouched();
    });

    if (!this.accountHeadMasterForm.invalid && this.accountHeadObj) {
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

      this.configurationService.getAccountHeadMasterSaveData(
        filters,
        this.accountHeadObj
      ).then((response) => {
        if (response) {
          this.Service.sendUpdate('Account Head Master Updated');
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }
            this.notificationRef = this.snackBar.open(
              response.messageText,
              'OK',
              {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              }
            );
            this.notificationRef
              .afterDismissed()
              .toPromise()
              .then(() => {
                this.dialogRef.close();
              })
              .catch((error) => {
                console.error('Error closing dialog:', error);
              });
          }
        });
    }
  }

  selectAccountMainHead(amAccountHeadMainMasterCode) {

    console.log('amAccountHeadMainMasterCode===',amAccountHeadMainMasterCode.toString());
    
    const foundAccountMainHead = this.accountMainData.find(
      (item) => item.accountHeadMainCode === amAccountHeadMainMasterCode.toString()
    );
    const amAccountHeadMainMasterId = foundAccountMainHead ? foundAccountMainHead.amAccountHeadMainMasterId: '';


    this.accountSubMainData = [...this.originalAccountMainSubMainData.filter(item => 
      item.amAccountHeadMainMasterId == amAccountHeadMainMasterId)];
      
  }
 
  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
}
