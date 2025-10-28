import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-work-order-creation',
  templateUrl: './work-order-creation.component.html',
  styleUrls: ['./work-order-creation.component.scss'],
})
export class WorkOrderCreationComponent implements OnInit {
  estimatesList: any[] = [];
  statusCode: string = '';
  routeName: string = '';
  labelName: any = '';
  type: any;
  cols: any[] = [];
  filterFields: string[] = [];

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private router: Router,private loader :LoaderService) {}
 
  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.loader.show('Data Loading...')
      this.statusCode = params['statusCode'];
      this.labelName = params['label'];
      this.type = params['type'];
      const processTypeName = params['processTypeName'];
      console.log(this.statusCode, this.labelName);

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
      if (this.type == 'list') {
        this.estimatesList = await this.dashboardService.getDashboardList(filter);
      }
      if (this.type == 'sublist') {
        this.estimatesList = await this.dashboardService.getDashboardSubList(filter);
      }

      this.routeLink(this.statusCode);

      this.cols = [
        {
          key: 'estimationNo',
          title: 'Estimation No.',
          route: '/main/create-work-order-form',
        },
        { key: 'estimationDate', title: 'Estimation Date' },
        { key: 'officeName', title: 'Office Name' },
        { key: 'statusName', title: 'Status' },
        { key: 'applicationTypeName', title: 'Application Type' },
        { key: 'connectionTypeName', title: 'Connection Type' },
        { key: 'registeredOn', title: 'Registered On' },
      ];
      this.filterFields = this.cols.map((v) => v.key);
      this.loader.hide();
    });
    
  }

  routeLink(statusCode) {
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
      default:
        this.routeName = '';
        break;
    }
  }

  navigation(estimate) {
    this.router.navigate(['/main/create-work-order-form'], {
      queryParams: {
        estimationRegisteredId: estimate.estimationRegisteredId,
        estimationType: estimate.estimationType,
        type: this.type,
        workorderRegisteredId:estimate.workorderRegisteredId,
        serviceRegistrationsId:estimate.serviceRegistrationsId
      },
    });
  }
}
