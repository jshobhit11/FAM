import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { LoaderService } from '../services/loader.service';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});

@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html',
  styleUrls: ['./sub-list.component.scss'],
})
export class SubListComponent implements OnInit {
  treeForm: FormGroup = treeForm;
  rows: any | null = null;
  data: any[] = [];
  estimatesList: any[] = [];
  statusCode: string = '';
  routeName: string = '';
  processTypeName: string = '';
  officeCode: any;
  loading: boolean = true;
  selectedAccounts: any[] = [];
  cols: any[] = [];
  @ViewChild('dt') table: Table;
  filterFields: string[] = [];
  label: string[] = [];
  constructor(private route: ActivatedRoute, private dashboardService: DashboardService,private loader: LoaderService,) {}

  async ngOnInit() {
    this.loader.show('Loading Data');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    this.officeCode = officeCode;
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const statusCode = params.get('statusCode');
      const processTypeName = params.get('processTypeName');
      this.processTypeName = processTypeName;
      this.statusCode = statusCode;
      this.routeLink(statusCode);
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, officeCode, statusCode, processTypeName };
      const estimateData = await this.dashboardService.getDashboardSubList(filter);
      estimateData.forEach((v: any) => {
        this.data.push({
          referenceNumber:v.referenceNumber,
          accountId: v.accountId,
          category: `${v.categoryName} / ${v.phase}`,
          appliedLoad: `${v.totalContractedLoad} ${v.loadUnit}`,
          consumerDetails: `${v.applicantName} ${v.address}`,
          officeName: v.officeName,
          pendingAtDesignation:v.pendingAtDesignation,
          applicationTypeName: v.applicationTypeName,
          connectionTypeName:v.connectionTypeName,
          registeredOn: v.registeredOn,
        });
      });
      this.rows = this.data;
      this.cols = [
        { key: 'referenceNumber', title: 'Case ID'},
        { key: 'accountId', title: 'Account ID'},
        { key: 'category', title: 'Category / Phase' },
        { key: 'appliedLoad', title: 'Applied Load' },
        { key: 'consumerDetails', title: 'Consumer Details' },
        { key: 'officeName', title: 'Office' },
        { key: 'pendingAtDesignation', title: 'Designation' },
        { key: 'applicationTypeName',title: 'Application Type'},
        { key: 'connectionTypeName',title: 'Connection Type'},
        { key: 'registeredOn', title: 'Registered On' },
      ];
      this.filterFields = this.cols.map((v) => v.key);
      this.loader.hide();
    });
  }
// route: `/main/${this.routeName}/${statusCode}/${processTypeName}`
  routeLink(statusCode: string) {
    switch (statusCode) {
      case '1':
        this.routeName = 'siteInspection';
        break;
      case '2':
        this.routeName = 'estimate-forms';
        break;
      case '3':
        this.routeName = 'estimation-approval';
        break;
      case '4':
        this.routeName = 'awaiting-payment';
        break;
      case '5':
        this.routeName = 'estimation-approval';
        break;
      case '7':
        this.routeName = 'service-line-estimate-approval';
        break;
      default:
        this.routeName = '';
        break;
    }
  }
}
