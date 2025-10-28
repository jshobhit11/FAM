import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { EstimationRegisteredService } from '../services/estimationRegistered';
import { EstimateService } from '../services/estimate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { ConfigurationService } from '../services/configuration.service';
import { PopUpComponent } from './pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lr-le-meter-power-approval',
  templateUrl: './lr-le-meter-power-approval.component.html',
  styleUrls: ['./lr-le-meter-power-approval.component.scss']
})
export class LrLeMeterPowerApprovalComponent implements OnInit {
  accountId: any;
  data: any = {};
  isChecked: boolean;
  isAE: boolean = false;
  isAEE: boolean = false;
  toggleTable = true;
  forwardControl = new FormControl();
  returnControl = new FormControl();
  globalArray: any[] = [];
  regularArray: any[] = [];
  creditArray: any[] = [];
  grandTotal: number = 0;
  labourDetails: any = [];
  budgetData: any = [];
  divisionalBudgetData: any = {};
  forwardData: any = {};
  statusCode: any;
  history: any;
  isBudgetDetails: boolean = true;
  selectedValue: any;
  displayAuthorities: boolean = false;
  isApproved: boolean = false;
  displayText: any = null;
  typeAuthority: any = null;
  creditAccountHeadData: any[] = [];
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  designationList: any[] = [];
  lowAuthority: any[] = [];
  highAuthority: any[] = [];
  higherAuthorityData: any;
  workCategoryName: string = '';
  workCategoryCode: string = '';
  processTypeName: string = '';
  budgetControl = new FormControl('', []);
  estimateTypeMasterData: any[] = [];
  isDivisionalBudgetSCValid: boolean = true;
  isDivisionalBudgetTLValid: boolean = true;
  isLoading: boolean = false;
  serviceRegistrationsId: string;

  constructor(
    private route: ActivatedRoute,
    private estimationReport: EstimationRegisteredService,
    private estimateService: EstimateService,
    private router: Router,
    private snackbar: MatSnackBar,
    private configurationService: ConfigurationService,
    private dialog: MatDialog
  ) {}

  toggleDisplayTableIf() {
    this.toggleTable = !this.toggleTable;
  }

  async ngOnInit() {
    this.forwardControl.setValue('');
    this.returnControl.setValue('');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.route.queryParamMap.subscribe(queryParams => {
        this.serviceRegistrationsId = queryParams.get('serviceRegistrationsId');
      });
      const serviceRegistrationsId =params.get('serviceRegistrationsId');
      this.serviceRegistrationsId=serviceRegistrationsId;
      const accountId = params.get('accountId');
      const applicationStatusCode = params.get('statusCode');
      const processTypeName = params.get('processTypeName');
      this.processTypeName = processTypeName;
      this.accountId = accountId;
      this.statusCode = applicationStatusCode;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      if (userRole === 'ROLE_AE') {
        this.isBudgetDetails = false;
      }
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        accountId,
        applicationStatusCode,
      };
      const ServiceFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        serviceRegistrationsId:this.serviceRegistrationsId,
        applicationStatusCode,
      };
      const accountHeadFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.data = await this.estimationReport.getDetailsForEstimationReportByServiceId(
        ServiceFilter
      );
      this.estimateTypeMasterData =
        await this.estimateService.getEstimateTypeMasterData(filter);
      this.configurationService
        .getAccountHeadMasterAllData(accountHeadFilter)
        .then((v) => (this.creditAccountHeadData = v));
      const {
        designationMasterDTOList,
        higherAuthorityData,
      } = this.data;

      if (higherAuthorityData && Object.keys(higherAuthorityData).length) {
        this.higherAuthorityData = higherAuthorityData;
        this.displayText = `Approval Authority : ${higherAuthorityData.designationCode} - ${higherAuthorityData.designationName}`;
        const roleUser = sessionStorage.getItem('user-role');
        const role = roleUser.split('_');
        if (higherAuthorityData.designationCode === role[1]) {
          this.isApproved = true;
        }
      } else {
        this.snackbar.open(
          'DOP for Approval Authority is not configured. Please Configure the DOP',
          'OK',
          {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
      }

      if (designationMasterDTOList && designationMasterDTOList.length) {
        this.lowAuthority = designationMasterDTOList.filter(
          (v: any) => v.level === 'LOW'
        );
        this.highAuthority = designationMasterDTOList.filter(
          (v: any) => v.level === 'HIGH'
        );
        this.designationList = designationMasterDTOList;
      }
 
      this.forwardData.forwardBy = `${
        this.data?.serviceRegistration?.designationShortCode
      } - ${sessionStorage.getItem('user-name')}`;
      this.forwardData.forwardDate = new Date().toISOString().substring(0, 10);
      if (this.data?.serviceRegistration?.designationShortCode === 'AE') {
        this.isAE = true;
      }
      if (this.data?.serviceRegistration?.designationShortCode === 'AEE') {
        this.isAEE = true;
      }
    });
    console.log('this.budgetdata', this.budgetData);
  }

  openApproveDialog(): void {
   const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action: 'approve' }
    });
    dialogRef.afterClosed().subscribe(result => {
       if (result === 'yes') {
        this.approve();
      }
    });
  }
  
  openForwardDialog(): void {
     const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action: 'forward' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.forward();
      }
    });
  }
  
  openReturnDialog(): void {
     const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action: 'return' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.return();
      }
    });
  }
  

  async forward() {
    if (this.forwardControl.value) {
      if (this.forwardData && this.forwardData.Remarks) {
        const apiKey = sessionStorage.getItem('api-key');
        const serviceKey = sessionStorage.getItem('service-key');
        const userRole = sessionStorage.getItem('user-role');
        const userName = sessionStorage.getItem('user-name');
        const userCode = sessionStorage.getItem('user-code');
        const  filter = {
            forwardingTo: this.forwardControl.value,
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            serviceRegistrationId:
              this.data.serviceRegistration.serviceRegistrationId,
            forwardRemarks: this.forwardData.Remarks,
          };
          this.isLoading = true;
        const data = await this.estimateService.forwardloadPowerSanction(filter);
        this.forwardData = {};
        if (data.messageType == 'SUCCESS') {
          const snackBarRef = this.snackbar
            .open('Power Sanction Forwarded Successfully', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            })
            snackBarRef.onAction().subscribe(() => {
              this.navigate();
              this.isLoading = false;
            });
        } else if (data.messageType === 'FAILURE') {
          const snackFailBar = this.snackbar.open(
            data.messageText,
              'ok',
              {
                  verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              }
          );
          
          snackFailBar.onAction().subscribe(() => {
              this.snackbar.dismiss();
              this.isLoading = false;
          });
      } else {
        this.snackbar.open('Please enter remarks', 'OK');
      }
    } else {
      this.snackbar.open('Please select Forwarded To', 'OK');
    }
  }
  }

  async return() {
      const data = await this.estimateService.returnPowerSanction({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      serviceRegistrationId:
        this.data.serviceRegistration.serviceRegistrationId,
      returningTo :this.returnControl.value, 
      returnRemarks: this.forwardData.Remarks,
    });
    this.forwardData = {};
    if (data.messageType == 'SUCCESS') {
      this.snackbar
        .open('Power Sanction Returned Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.navigate();
        });
    }
  }

  async approve() {
    if (this.forwardData && this.forwardData.Remarks) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const  filter = {
          // forwardingTo: this.forwardControl.value,
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          approvedRemarks: this.forwardData.Remarks,
          serviceRegistrationId:
            Number(this.data.serviceRegistration.serviceRegistrationId),
        };
        this.isLoading = true;
        const data = await this.estimateService.approvalLoadPowerSanction(filter);
        this.forwardData = {};
        if (data.messageType == 'SUCCESS') {
       
        const snackBarRef = this.snackbar.open('Power Sanction Approved Successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          snackBarRef.onAction()
          .subscribe(() => {
            this.navigate();
            this.isLoading = false;
          });
      } else if (data.messageType === 'FAILURE') {
        const snackFailBar = this.snackbar.open(
          data.messageText,
            'ok',
            {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            }
        );
        
        snackFailBar.onAction().subscribe(() => {
            this.snackbar.dismiss();
            this.isLoading = false;
        });
    } else {
      this.snackbar.open('Please enter remarks', 'OK');
    }
  }
  }
  radioType(type: string) {
    const userRole = sessionStorage.getItem('user-role');
    const role = userRole.split('_')[1];
  
    if (type === 'forward') {
      this.forwardData.forwardTo = (role === this.higherAuthorityData.designationCode)
        ? this.lowAuthority.filter(item => item.flow == 'forward')
        : this.designationList.filter(item => item.flow == 'forward');
      
      this.forwardControl.setValue('');
    } else if (type === 'return') {
      this.forwardData.forwardTo = (role === this.higherAuthorityData.designationCode)
        ? this.lowAuthority.filter(item => item.flow == 'return')
        : this.designationList.filter(item => item.flow == 'return');
      
      this.returnControl.setValue(''); 
    }
  }
  
  printPageArea(areaID: any) {
    var printContent = document.getElementById(areaID).innerHTML;
    var originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  }

  navigate() {
    console.log(this.statusCode);
    this.router.navigate([
      `/main/home/${this.statusCode}/${this.processTypeName}`,
    ]);
  }
}
