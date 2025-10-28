import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { UpdateMaintenanceFrequencyComponent } from './update-maintenance-frequency/update-maintenance-frequency.component';
import { AddMaintenanceFrequencyComponent } from './add-maintenance-frequency/add-maintenance-frequency.component';

export interface Maintenance {
  slno: number;
  frequency : string;
  frequencyType : string;
  frequencyStartMonth : string;
  frequencyEndMonth: string;
 }
const Maintenance_Frequency_DATA: Maintenance[] = [];

@Component({
  selector: 'app-maintenance-frequency',
  templateUrl: './maintenance-frequency.component.html',
  styleUrls: ['./maintenance-frequency.component.scss']
})

export class MaintenanceFrequencyComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  dataSource = new MatTableDataSource(Maintenance_Frequency_DATA);
  subscriptionName: any;

  constructor(public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService) { 
      this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
        console.log('Maintenance Frequency Master data', message['text']);
        if (message['text'] == 'Maintenance Frequency Master Updated') {
          this.ngOnInit();
        }
      });
    }
  

    async ngOnInit() {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.configurationService.getmaintenanceFrequencyGetAllData(filters).then((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Asset Type get all data', this.dataSource);
      });
      console.log(this.dataSource);
  
   
    }
  displayedColumns: string[] = [
    'slno',
    'frequency',
    'frequencyType',
    'frequencyStartMonth',
    'frequencyEndMonth',
    'action',
  ];

  ngAfterViewInit() {
    this.paginator=this.paginator
    
  }
  applyFilter(filterValue: any) {
    console.log("filtervalue",filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
  }
  openUpdateMaintenanceFrequency(mmMaintenanceFrequencyMasterId: any){
    this.dialog.open(UpdateMaintenanceFrequencyComponent, {
    width: '100%',
    data : mmMaintenanceFrequencyMasterId
  });
}

  openAddMaintenanceFrequency(){
    this.dialog.open(AddMaintenanceFrequencyComponent, {
      width: '100%',
  });
}
  
  }
