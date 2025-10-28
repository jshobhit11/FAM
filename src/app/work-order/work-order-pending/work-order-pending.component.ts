import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-work-order-pending',
  templateUrl: './work-order-pending.component.html',
  styleUrls: ['./work-order-pending.component.scss'],
})
export class WorkOrderPendingComponent implements OnInit {
  estimatesList: any[] = [];
  statusCode: string = '';
  routeName: string = '';
  labelName: string = '';
  type: any;
  cols: any[] = [];
  filterFields: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.statusCode = params['statusCode'];
      this.labelName = params['label'];
      this.type = params['type'];
      const processTypeName = params['processTypeName'];
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeCode,
        statusCode: this.statusCode,
        processTypeName,
      };
      this.estimatesList = await this.dashboardService.getDashboardList(filter);

      if (this.type == 'list') {
        this.estimatesList = await this.dashboardService.getDashboardList(
          filter
        );
      }
      if (this.type == 'sublist') {
        this.estimatesList = await this.dashboardService.getDashboardSubList(
          filter
        );
      }
      this.routeLink();

      this.cols = [
        {
          key: 'estimationNo',
          title: 'Estimation No.',
          route: '/main/work-order-approval',
        },
        { key: 'estimationDate', title: 'Estimation Date' },
        { key: 'officeName', title: 'Office Name' },
        { key: 'statusName', title: 'Status Pending For' },
        { key: 'applicationTypeName', title: 'Application Type' },
        { key: 'connectionTypeName', title: 'Connection Type' },
        { key: 'registeredOn', title: 'Registered On' },
      ];
      this.filterFields = this.cols.map((v) => v.key);
    });
  }

  routeLink() {
    switch (this.statusCode) {
      case '1':
        this.routeName = 'siteInspection';
        break;
      case '2':
        this.routeName = 'estimate-forms';
        break;
      case '3':
        this.routeName = 'estimation-approval';
        break;
      default:
        this.routeName = '';
        break;
    }
  }

  navigation(estimate) {
    this.router.navigate(['/main/work-order-approval'], {
      queryParams: {
        estimationRegisteredId: estimate.estimationRegisteredId,
        workorderRegisteredId: estimate.workorderRegisteredId,
        type: this.type,
      },
    });
  }
}
