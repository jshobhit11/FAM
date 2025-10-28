import { Component, OnInit } from '@angular/core';

import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-overhual-maintenance-list',
  templateUrl: './overhual-maintenance-list.component.html',
  styleUrls: ['./overhual-maintenance-list.component.scss']
})
export class OverhualMaintenanceListComponent implements OnInit {
  maintenanceList: any[] = [];
  filterFields: string[] = [];
  cols: any[] = [];
  constructor(private maintenanceService:MaintenanceService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode};
    this.maintenanceList = await this.maintenanceService.getDetailsForOverhualType(filter);
    console.log(this.maintenanceList);
    this.maintenanceList.forEach(item => {
      item.frequencyWithType = `${item.frequency} - ${item.frequencyType}`;
    });
    this.cols = [
     
      { key: 'taskNo', title: 'Task No', route: `/estimates/` },
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
