import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-inspection-maintenance-list',
  templateUrl: './inspection-maintenance-list.component.html',
  styleUrls: ['./inspection-maintenance-list.component.scss']
})
export class InspectionMaintenanceListComponent implements OnInit {
  InspectionList: any[] = [];
  filterFields: string[] = [];
  cols: any[] = [];
  mmMaintenanceSchedulerTaskId: string = '';
  constructor(private maintenanceService:MaintenanceService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.InspectionList = await this.maintenanceService.getDetailsForInspectionType(filter);
    this.mmMaintenanceSchedulerTaskId = this.InspectionList[0]?.mmMaintenanceSchedulerTaskId; 
    this.InspectionList.forEach(item => {
      item.frequencyWithType = `${item.frequency} - ${item.frequencyType}`;
    });    
    console.log(this.InspectionList);
    this.cols = [
     
      { key: 'taskNo', title: 'Task No.', route: `/estimates/inspection-maintenance-list-details` },
      { key: 'assetType', title: 'Asset Type' },
      { key: 'frequencyWithType', title: 'Frequency/Frequency Type' },
      { key: 'equipment', title: 'Equipment' },
      { key: 'responsibleOffice', title: 'Office' },
      { key: 'responsibleOfficer', title: 'Officer' },
      { key: 'schedulerStartDate', title: 'Start Date' },
      { key: 'schedulerEndDate', title: 'End Date' },
      { key: 'details', title: 'Details' },
    ];

    this.filterFields = this.cols.map((v) => v.key);
  }
 
}
