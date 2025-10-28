import { Component, OnInit } from '@angular/core';
import { EstimationRegisteredService } from 'src/app/services/estimationRegistered';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-revised-estimation-creation-list',
  templateUrl: './revised-estimation-creation-list.component.html',
  styleUrls: ['./revised-estimation-creation-list.component.scss'],
})
export class RevisedEstimationCreationListComponent implements OnInit {
  estimatesList: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];
  serviceRegistrationId: string = '';
  constructor(private estimationRegistered: EstimationRegisteredService, private loader :LoaderService) {}

  async ngOnInit() {
    this.serviceRegistrationId = sessionStorage.getItem('service-registrations-id');
    this.loader.show('Data Loading...');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const revisedFilter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.estimatesList = await this.estimationRegistered.revisedEstimatesList(revisedFilter);
    this.estimatesList.sort((a, b) => {
      const dateA = new Date(a.registeredOn.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2'));
      const dateB = new Date(b.registeredOn.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2'));
      return dateB.getTime() - dateA.getTime();  
    });
    
    const now = new Date();
    this.estimatesList = this.estimatesList.map(estimate => {
      const registeredDate = new Date(estimate.registeredOn.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2'));
      const pendingDays = Math.floor((now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));
       const formattedRegisteredOn = `${estimate.registeredOn .split(' ')[0]} (${pendingDays} days) `;
     
      return { ...estimate, registeredOn: formattedRegisteredOn };
    });
    console.log(this.estimatesList);
    this.cols = [
      { key: 'referenceNumber', title: 'Case ID',route: `/estimates/revised-estimation` },
      { key: 'estimationNo', title: 'Estimation No.', route: `/estimates/revised-estimation` },
      { key: 'officeName', title: 'Office Name' },
      { key: 'statusName', title: 'Status Pending For' },
      { key: 'registeredSource', title: 'Registered Source' },
      { key: 'registeredOn', title: 'Registered On' },
      { key: 'icon', title: 'Status', route: `/main/full-details` },
    ];
    this.filterFields = this.cols.map((v) => v.key);
    this.loader.hide();
  }
}
