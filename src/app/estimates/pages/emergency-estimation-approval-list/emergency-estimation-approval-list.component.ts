import { Component, OnInit } from '@angular/core';
import { EstimationRegisteredService } from 'src/app/services/estimationRegistered';

@Component({
  selector: 'app-emergency-estimation-approval-list',
  templateUrl: './emergency-estimation-approval-list.component.html',
  styleUrls: ['./emergency-estimation-approval-list.component.scss'],
})
export class EmergencyEstimationApprovalListComponent implements OnInit {
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
    this.estimatesList = await this.estimationRegistered.getEmergencyEstimationApprovalList(filter);

    this.estimatesList.sort((a, b) => {
      const dateA = new Date(a.registeredOn.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2'));
      const dateB = new Date(b.registeredOn.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2'));
      return dateB.getTime() - dateA.getTime();  
    });    
    const now = new Date();
    this.estimatesList = this.estimatesList.map(estimate => {
      const registeredDate = new Date(estimate.registeredOn.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2'));
      const pendingDays = Math.floor((now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));
       const formattedRegisteredOn = `${estimate.registeredOn.split(' ')[0]} (${pendingDays} days)`;
      return { ...estimate, registeredOn: formattedRegisteredOn };
    });
    this.cols = [
      { key: 'referenceNumber', title: 'Case ID', route: `/estimates/emergency-estimation-approval` },
      { key: 'estimationNo', title: 'Estimation No.', route: `/estimates/emergency-estimation-approval` },
      { key: 'officeName', title: 'Office Name' },
      { key: 'statusName', title: 'Status Pending For' },
      { key: 'registeredSource', title: 'Registered Source' },
      { key: 'registeredOn', title: 'Registered On' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
  }
}
