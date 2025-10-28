import { Component, OnInit } from '@angular/core';
import { EstimationRegisteredService } from 'src/app/services/estimationRegistered';

@Component({
  selector: 'app-revised-estimation-approval-list',
  templateUrl: './revised-estimation-approval-list.component.html',
  styleUrls: ['./revised-estimation-approval-list.component.scss'],
})
export class RevisedEstimationApprovalListComponent implements OnInit {
  estimatesList: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];
  constructor(private estimationRegistered: EstimationRegisteredService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.estimatesList = await this.estimationRegistered.revisedEstimatesApprovalList(filter);
    console.log(this.estimatesList);
    this.cols = [
      { key: 'referenceNumber', title: 'Case ID',route: `/estimates/revised-estimation-approval` },
      { key: 'estimationNo', title: 'Estimation No.', route: `/estimates/revised-estimation-approval` },
      { key: 'officeName', title: 'Office Name' },
      { key: 'statusName', title: 'Status Pending For' },
      { key: 'registeredSource', title: 'Registered Source' },
      { key: 'registeredOn', title: 'Registered On' },
      { key: 'icon', title: 'Status', route: '/main/full-details' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
  }
}
