import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Subject } from 'rxjs';
import { WorkOrderService } from 'src/app/services/work-order.service';
@Component({
  selector: 'app-work-order-summary',
  templateUrl: './work-order-summary.component.html',
  styleUrls: ['./work-order-summary.component.scss'],
})
export class WorkOrderSummaryComponent implements OnInit {
  public stringSubject = new Subject<string>();
  estimatesList: any[] = [];
  statusCode: string = '';
  routeName: string = '';
  labelName: string = '';
  connectionTypeCode: string = '';
  type: any = '';
  cols: any[] = [];
  filterFields: string[] = [];
  message = 'Hola Mundo!';

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private workservice: WorkOrderService
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
      this.connectionTypeCode = params['connectionTypeCode'];
      const processTypeName = params['processTypeName'];
      console.log('labelName', this.labelName);
      console.log('type', this.type);
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeCode,
        statusCode: this.statusCode,
        processTypeName,
        connectionTypeCode: this.connectionTypeCode,
      };

      if (this.type === 'list') {
        this.estimatesList = await this.dashboardService.getDashboardList(
          filter
        );
      } else if (this.type === 'sublist') {
        this.estimatesList = await this.dashboardService.getDashboardSubList(
          filter
        );
      }
      // sorting data in ascending order
      // Sort data in descending order by registered date
      this.estimatesList.sort((a, b) => {
        const dateA = new Date(
          a.registeredOn.replace(
            /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/,
            '$1T$2'
          )
        );
        const dateB = new Date(
          b.registeredOn.replace(
            /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/,
            '$1T$2'
          )
        );
        return dateB.getTime() - dateA.getTime();
      });

      //pending days
      this.estimatesList.forEach((item) => {
        const registeredDate = new Date(
          item.registeredOn.replace(
            /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/,
            '$1T$2'
          )
        );
        const currentDate = new Date();
        const diffTime = Math.abs(
          currentDate.getTime() - registeredDate.getTime()
        );
        const pendingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        //  item.registeredOn = `${item.registeredOn} (${pendingDays} Days)`;

        item.registeredOn = `${
          item.registeredOn.split(' ')[0]
        } (${pendingDays} Days)`;
      });

      // for single connection
      const connectionTypeCode = this.estimatesList[0]?.connectionTypeCode;
      console.log('connectionTypeCode: ', connectionTypeCode);
      this.routeLink(this.statusCode, connectionTypeCode);

      this.workservice.passWorkDescription(
        this.estimatesList[0]?.workDescription
      );
      this.workservice.passWorkorderNo(this.estimatesList[0]?.workorderNo);

      console.log(this.estimatesList);

      this.cols = [
        { key: 'workorderNo', title: 'Work Order No.', route: this.routeName },
        { key: 'workorderDate', title: 'Work Order Date' },
        { key: 'officeName', title: 'Office Name' },
        { key: 'statusName', title: 'Status Pending For' },
        { key: 'applicationTypeName', title: 'Application Type' },
        { key: 'registeredOn', title: 'Registered On' },
        { key: 'icon', title: 'Status', route: `/main/full-details` },
      ];

      this.filterFields = this.cols.map((v) => v.key);
    });
  }
  routeLink(statusCode: string, connectionTypeCode: string) {
    switch (statusCode) {
      case '10':
        this.routeName = '/main/permit-to-work-request';
        break;
      case '11':
        this.routeName = '/main/line-clearance';
        break;
      case '12':
        this.routeName = '/main/work-award';
        break;
      case '13':
        this.routeName = '/main/assign-crew-form';
        break;
      case '14':
        this.routeName = '/main/material-inspection';
        break;
      case '15':
        this.routeName = '/main/meter-uploads';
        break;
      case '16':
        this.routeName = '/main/work-execution';
        break;
      case '17':
        if (connectionTypeCode === 'MC' || connectionTypeCode === 'MC-MSB') {
          this.routeName = '/main/account-id-meter-mapping';
        } else {
          this.routeName = '/main/account-id-meter-mapping-sc';
        }
        break;
      case '22':
        this.routeName = '/main/create-work-award-request';
        break;

      case '23':
        if (connectionTypeCode === 'BMR') {
          this.routeName = '/main/meter-replacement';
        } else {
          this.routeName = '/main/meter-replacement-sc';
        }
      case '24':
        this.routeName = '/main/meter-validate-and-replicate';
        break;
      default:
        this.routeName = '';
        break;
    }
  }
}
