import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-preventive-maintenance-list',
  templateUrl: './preventive-maintenance-list.component.html',
  styleUrls: ['./preventive-maintenance-list.component.scss']
})
export class PreventiveMaintenanceListComponent implements OnInit {
  PreventiveList: any[] = [];
  filterFields: string[] = [];
  cols: any[] = [];
  constructor(private maintenanceService: MaintenanceService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    this.PreventiveList = await this.maintenanceService.getDetailsForPreventiveType(filter);
    console.log(this.PreventiveList);
    this.PreventiveList.forEach(item => {
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
