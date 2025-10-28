import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { LoaderService } from '../services/loader.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  rows: any | null = null;
  data: any[] = [];
  estimatesList: any[] = [];
  statusCode: string = '';
  routeName: string = '';
  processTypeName: string = '';
  officeCode: any;
  loading: boolean = true;
  cols: any[] = [];
  filterFields: string[] = [];

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService,private loader: LoaderService,) {}

 async ngOnInit() {
  this.loader.show('Loading Data');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeCode = sessionStorage.getItem('office-id');
      this.officeCode = officeCode;
      const statusCode = params.get('statusCode');
      const processTypeName = params.get('processTypeName');
      this.processTypeName = processTypeName;
      this.statusCode = statusCode;
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, officeCode, statusCode, processTypeName };
      const estimateData = await this.dashboardService.getDashboardList(filter);
      estimateData.forEach((v: any) => {
        const pendingDays = this.getPendingDays (v.registeredOn);
        this.data.push({
          estimationNo: v.estimationNo,
          referenceNumber: v.referenceNumber,
          accountId: v.accountId,
         category: v.categoryName != "null" ? `${v.categoryName} / ${v.phase}` : '',
          appliedLoad: (v.totalContractedLoad !== "0") 
          ? (v.loadUnit === "null")
              ? `${v.totalContractedLoad} -`
              : (v.totalContractedLoad !== "0" ? `${v.totalContractedLoad} ${v.loadUnit}` : '')
          : '',
          consumerDetails: `${v.applicantName} ${v.address}`,
          officeName: v.officeName,
          statusName: v.statusName,
          applicationTypeName: v.applicationTypeName,
          connectionTypeName:  v.connectionTypeName !== "null" ? v.connectionTypeName : '', 
          // registeredOn:`${v.registeredOn} (${pendingDays} days)`,
          registeredOn: this.formatDate(v.registeredOn) + ` (${pendingDays} days)`,
          estimationRegisteredId:v.estimationRegisteredId,
          serviceRegistrationsId: v.serviceRegistrationsId,
          status: 'Status',
          applicationTypeCode:v.applicationTypeCode,
          meterRequiredFlag:v.meterRequiredFlag,
          statusCode:this.statusCode,
          registeredOnDate: new Date(v.registeredOn.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2')),
         
        });
      });
     // Sort data by registeredOn in ascending order
     this.data.sort((a, b) => b.registeredOnDate.getTime() - a.registeredOnDate.getTime());
      this.rows = this.data;
      this.routeLink(statusCode, processTypeName);
      if (processTypeName == 'EAM_IMW') {
        this.cols = [
          // { key: 'referenceNumber', title: 'Reference No.', route: `/estimates/${this.routeName}` },
          { key: 'referenceNumber', title: 'Case ID', route: `/estimates/improvement-estimation-approval` },
          { key: 'officeName', title: 'Office Name' },
          { key: 'statusName', title: 'Status' },
          { key: 'applicationTypeName', title: 'Application Type' },
          { key: 'connectionTypeName', title: 'Connection Type' },
          { key: 'registeredOn', title: 'Registered On' },
          { key: 'icon', title: 'View', route: `/main/full-details` },
        ];
      } else if (processTypeName == 'EAM_BMR' || processTypeName == 'EAM_ERW') {
        this.cols = [
          { key: 'estimationNo', title: 'Estimation No.', route: `${this.routeName}` },
          { key: 'officeName', title: 'Office Name' },
          { key: 'statusName', title: 'Status' },
          { key: 'applicationTypeName', title: 'Application Type' },
          { key: 'connectionTypeName', title: 'Connection Type' },
          { key: 'registeredOn', title: 'Registered On' },
          { key: 'icon', title: 'View', route: `/main/full-details` },
        ];
      } else {
        this.cols = [
          // { key: 'referenceNumber', title: 'Reference Number', route: `/main/${this.routeName}/${statusCode}/${processTypeName}` },
          // { key: 'accountId', title: 'Account ID', route: `/main/${this.routeName}/${statusCode}/${processTypeName}` },
          { key: 'referenceNumber', title: 'Case ID', route: this.routeName !== 'awaiting-payment' ? `/main/${this.routeName}/${statusCode}/${processTypeName}` : null },
          { key: 'accountId', title: 'Account ID', route: this.routeName !== 'awaiting-payment' ? `/main/${this.routeName}/${statusCode}/${processTypeName}` : null },
          { key: 'category', title: 'Category / Phase' },
          { key: 'appliedLoad', title: 'Applied Load' },
          { key: 'consumerDetails', title: 'Consumer Details' },
          { key: 'officeName', title: 'Office' },
          { key: 'statusName', title: 'Status' },
          { key: 'applicationTypeName', title: 'Application Type' },
          { key: 'connectionTypeName', title: 'Connection Type' },
          { key: 'registeredOn', title: 'Registered On' },
          { key: 'icon', title: 'View', route: `/main/full-details` },
        ];
      }
      this.filterFields = this.cols.map((v) => v.key);
      this.loader.hide();
    });
  }
  
    getPendingDays(registeredOn: string): number {
      try {
        const registeredDate = new Date(registeredOn.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2'));
        
        if (isNaN(registeredDate.getTime())) {
            console.error('Invalid date:', registeredOn);
            return 0;
        }
        const currentDate = new Date();
        const differenceInTime = currentDate.getTime() - registeredDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        
        return differenceInDays;
    } catch (error) {
        console.error('Error in getPendingDays:', error);
        return 0;
    }
}

formatDate(dateString: string): string {
  const date = new Date(dateString.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2'));
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

routeLink(statusCode: string, processTypeName: string) {
    switch (statusCode) {
      case '1':
        if (processTypeName == 'NSC') {
          this.routeName = `siteInspection`;
          break;
        }
        if (processTypeName == 'CSC' || processTypeName == 'DND') {
          this.routeName = 'cscSiteInspection';
          break;
        }
      case '2':
        if (processTypeName == 'EAM_IMW') {
          this.routeName = 'improvement-estimation';
          break;
        }
        else{
        this.routeName = 'estimate-forms';
        }
    
        break;
      case '3':
        if (processTypeName == 'EAM_IMW') {
          this.routeName = 'improvement-estimation-approval';
          break;
        }else{
          this.routeName = 'estimation-approval';
        }
        break;
      case '4':
        this.routeName = 'awaiting-payment';
        break;
      case '5':
        if (processTypeName == 'NSC') {
          this.routeName = `estimation-sanction`;
          break;
        }
        if (processTypeName == 'CSC') {
          this.routeName = 'other-estimation-approval';
          break;
        }
        if (processTypeName == 'DND') {
          this.routeName = 'other-estimation-approval';
          break;
        }
       if(processTypeName == 'EAM_BMR') {
          this.routeName = 'bmr-estimation-approval';
          break;   
      }
      case '6':
        this.routeName = 'service-line-estimate';
        break;
      case '7':
        this.routeName = 'service-line-estimate-approval';
        break;
      case '43':
        this.routeName = 'estimate-sanction';
      // case '41':
      //   this.routeName = 'cscSiteInspection';
      //   break;
      default:
        this.routeName = '';
        break;
    }
  }
}
