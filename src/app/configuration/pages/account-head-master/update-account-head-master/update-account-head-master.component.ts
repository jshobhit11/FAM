import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-update-account-head-master',
  templateUrl: './update-account-head-master.component.html',
  styleUrls: ['./update-account-head-master.component.scss'],
})
export class UpdateAccountHeadMasterComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  subscriptionName: any;
  accountHead: any[];
  accountSubMainCode: any[];
  notificationRef: any;
  getData: any = {};
  filterData: any;
  accountSubMainCodeString: string;
  getTargetData = [];
  getTempData = [];
  commentMap = new Map<string, number[]>();
  selectedItem: any;

  accountMainData: any = {};
  accountSubMainData: any = {};
  accountHeadMasterId: any[] = [];
  originalAccountMainSubMainData = [];
  initialAccountMainHeadCode: string;

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateAccountHeadMasterComponent>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any
  ) {
    dialogRef.disableClose = true;
    this.accountMainData = getAllData.field1;
    this.accountSubMainData = getAllData.field2;
    this.accountHeadMasterId = getAllData.field3;
    this.originalAccountMainSubMainData = getAllData.field2;
    this.initialAccountMainHeadCode = getAllData.field1[0]?.accountHeadMainCode;
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const accountHeadMasterId = sessionStorage.getItem('account-Id');
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      accountHeadMasterId,
    };
    filters.accountHeadMasterId = this.getAllData.field3;
    console.log('filters.accountHeadMasterId', filters.accountHeadMasterId);

    this.filterData = { ...filters };
    this.getData = await this.configurationService.getAccountHeadMasterDataById(
      filters
    );
    console.log(' account head get data by id', this.getData);
    this.selectAccountMainHead(this.getAllData.accountMainHeadCode);
  }

  onAccountHeadUpdate() {
    const updateBody = {
      accountMainHeadCode: this.getData.accountMainHeadCode,
      accountHeadDescription: this.getData.accountHeadDescription,
      accountMainHeadDescription: this.getData.accountMainHeadDescription,
      accountSubmainHeadCode: this.getData.accountSubmainHeadCode,
      accountHeadCode: this.getData.accountHeadCode,
      accountSubmainHeadDescription: this.getData.accountSubmainHeadDescription,
    };

    let result = this.configurationService
      .getAccountHeadUpdate(this.filterData, updateBody)
      .then((response) => {
        console.log(' reponse messageText mat type  ' + response.messageText);
        console.log(' reponse mat type  ' + response);
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

  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }

  selectAccountMainHead(accountmain: string) {
    console.log('accountmain', accountmain);

    let selectedAccountMain = this.accountMainData.find(
      (item) => item.accountHeadMainCode == accountmain
    );
    this.accountSubMainData = this.originalAccountMainSubMainData.filter(
      (item) =>
        item.amAccountHeadMainMasterId ==
        selectedAccountMain.amAccountHeadMainMasterId
    );

    if (accountmain !== this.initialAccountMainHeadCode) {
      this.getData.accountSubmainHeadCode = null;
    }
  }

  isFormValid(): boolean {
    return (
      !!this.getData.accountMainHeadCode &&
      !!this.getData.accountSubmainHeadCode &&
      this.getData.accountSubmainHeadCode.length >= 1 &&
      !!this.getData.accountHeadCode &&
      this.getData.accountHeadCode.length >= 2 &&
      !!this.getData.accountHeadDescription &&
      this.getData.accountHeadDescription.length >= 2
    );
  }
}
