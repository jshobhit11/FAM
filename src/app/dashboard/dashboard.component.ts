
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  estimateProcess: any[] = [];
  dndProcess: any[] = [];
  cscProcess: any[] = [];
  workOrderProcess: any[] = [];
  erwProcess: any[] = [];
  imwProcess: any[] = [];
  bmrProcess: any[] = [];

  estimateHeading: string = '';
  cscHeading: string = '';
  dndHeading: string = '';
  workorderHeading: string = '';
  erwHeading: string = '';
  imwHeading: string = '';
  bmrHeading: string = '';

  imagePath: string = 'assets/icons/dashboard.svg';
  imagePath2: string = 'assets/est_process.png';
  imagePath3: string = 'assets/wo_process_icon.png';

  estimatesImagesPath: string[] = [
    'assets/dashboard/estimate-process/site-inspection.png',
    'assets/dashboard/estimate-process/estimation.png',
    'assets/dashboard/estimate-process/power-sanction-approval.png',
    'assets/dashboard/estimate-process/awaiting-for-payments.png',
    'assets/dashboard/estimate-process/estimation-approval.png',
    'assets/dashboard/estimate-process/service-line-estimate-approval.png',
    'assets/dashboard/estimate-process/service-line-estimate.png',
    'assets/dashboard/estimate-process/waiting-for-workorder-generation.png',
  ];

  workImagesPath: string[] = [
    'assets/dashboard/work-order-process/work-order-creation.png',
    'assets/dashboard/work-order-process/work-order-approval.png',
    'assets/dashboard/work-order-process/work-award-request.png',
    'assets/dashboard/work-order-process/work-order-approval.png',
    'assets/dashboard/work-order-process/work-permit.png',
    'assets/dashboard/work-order-process/line-clearance.png',
    'assets/dashboard/work-order-process/assign-crew.png',
    'assets/dashboard/work-order-process/material-inspection.png',
    'assets/dashboard/work-order-process/work-execution.png',
    'assets/dashboard/work-order-process/meter.png',
    'assets/dashboard/work-order-process/meter-replicator-validator.png',
    'assets/dashboard/work-order-process/account-id-and-meters-mapping.png',
    'assets/dashboard/estimate-process/awaiting-for-payments.png',
  ];

  constructor(private dashboardService: DashboardService, private router: Router) { }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const filters: any = { apiKey, serviceKey, userRole, userName, userCode, officeCode };
    const pfilter: any = { apiKey, serviceKey, userRole, userName, userCode };

    this.dashboardService.getAllProcessTypeMasterData(pfilter).then((processData) => {
      this.estimateHeading = processData.find((v: any) => v.processTypeName == 'NSC').processTypeHeader;
      this.cscHeading = processData.find((v: any) => v.processTypeName == 'CSC').processTypeHeader;
      this.dndHeading = processData.find((v: any) => v.processTypeName == 'DND').processTypeHeader;
      this.erwHeading = processData.find((v: any) => v.processTypeName == 'EAM_ERW').processTypeHeader;
      this.imwHeading = processData.find((v: any) => v.processTypeName == 'EAM_IMW').processTypeHeader;
      this.bmrHeading = processData.find((v: any) => v.processTypeName == 'EAM_BMR').processTypeHeader;
      this.workorderHeading = processData.find((v: any) => v.processTypeName == 'WORKORDER').processTypeHeader;
    });

    this.dashboardService.getDashboardCounts(pfilter).then((dashboardData) => {
      this.estimateProcess = dashboardData.filter((v: any) => v.processTypeName == 'NSC' &&
        (v.statusCode != '2' &&
          v.statusCode != '4' &&
          v.statusCode != '6'));
      this.cscProcess = dashboardData.filter((v: any) => v.processTypeName == 'CSC' &&
        (v.statusCode != '2'));
      this.dndProcess = dashboardData.filter((v: any) => v.processTypeName == 'DND' &&
        (v.statusCode != '2'));
      this.erwProcess = dashboardData.filter((v: any) => v.processTypeName == 'EAM_ERW' &&
        (v.statusCode != '2'));
      this.imwProcess = dashboardData.filter((v: any) => v.processTypeName == 'EAM_IMW' &&
        (v.statusCode != '2'));
      this.bmrProcess = dashboardData.filter((v: any) => v.processTypeName == 'EAM_BMR' &&
        (v.statusCode != '2'));
    });

    this.dashboardService.getWorkOrderDashboard(filters).then((v: any[]) => {
      const wo = v.filter((v: any) => v.statusCode == 8 || v.statusCode == 9 || v.statusCode == 12 || v.statusCode == 22).sort((a: any, b: any) => {
        return Number(a.typeWiseSequence) - Number(b.typeWiseSequence);
      });
      this.workOrderProcess = wo;
    });

    // this.dashboardService.getDashboard(filters).then((v) => {
    //   this.estimateProcess = v;
    // });
    // this.dashboardService.getcscCountData(filters).then((v) => {
    //   this.cscProcess = v;
    // });
    // this.dashboardService.getdndCountData(filters).then((v) => {
    //   this.dndProcess = v;
    // });
    // this.dashboardService.getERWCountData(pfilter).then((v) => {
    //   this.erwProcess = v;
    // });
    // this.dashboardService.getIMWCountData(pfilter).then((v) => {
    //   this.imwProcess = v;
    // });
    // this.dashboardService.getBMRCountData(pfilter).then((v) => {
    //   this.bmrProcess = v;
    // });
  }

  navigation(workOrder: any, type: any) {
    console.log(workOrder);
    if (workOrder.statusCode == '8') {
      this.router.navigate(['/main/work-order-creation'], {
        queryParams: {
          statusCode: workOrder.statusCode,
          label: workOrder.labelName,
          type,
          processTypeName: workOrder.processTypeName,
        },
      });
    } else if (workOrder.statusCode == '9') {
      this.router.navigate(['/main/work-order-pending'], {
        queryParams: {
          statusCode: workOrder.statusCode,
          label: workOrder.labelName,
          type,
          processTypeName: workOrder.processTypeName,
        },
      });
    } else {
      // this.dashboardService.tempWorkOrder = workOrder;
      this.router.navigate(['/main/work-order-summary'], {
        queryParams: {
          statusCode: workOrder.statusCode,
          label: workOrder.labelName,
          type,
          processTypeName: workOrder.processTypeName,
        },
      });
    }

  }
}
