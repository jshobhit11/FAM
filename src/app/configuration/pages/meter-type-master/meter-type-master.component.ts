import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { materialTypeparams } from 'src/app/models/configuration.model';
import { AddMeterTypeMasterComponent } from './add-meter-type-master/add-meter-type-master.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { UpdateMeterTypeMasterComponent } from './update-meter-type-master/update-meter-type-master.component';
export interface MeterInfo {
  meterType: string;
  materialCode: string;
}

const MeterInfo_DATA: MeterInfo[] = [];

@Component({
  selector: 'app-meter-type-master',
  templateUrl: './meter-type-master.component.html',
  styleUrls: ['./meter-type-master.component.scss']
})
export class MeterTypeMasterComponent implements OnInit {

  // dataSource = new MatTableDataSource<MeterInfo>(MeterInfo_DATA);
  subscriptionName: Subscription;

  materialData: any;
  constructor( public dialog: MatDialog,
    private materialtype: ConfigurationService,
    private Service: CommonService) { 

      this.subscriptionName = this.Service.getUpdate().subscribe((message) => {

        console.log('meter type data', message['text']);
        if (message['text'] == 'Meter Type Updated') {
          this.ngOnInit();
        }
      });


    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource(MeterInfo_DATA);
    async ngOnInit() {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filters: materialTypeparams = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.materialData = await this.materialtype.getMeterTypeMasterGetAllData(filters);
        console.log('Meter Type Master Data from service', this.materialData);
        this.dataSource = new MatTableDataSource(this.materialData);
        this.dataSource.paginator = this.paginator;
        console.log('Meter type all data', this.dataSource);
  }
  displayedColumns: string[] = [
    'slno',
    'meterType',
    'materialCode',
    'action',
  ];

  ngAfterViewInit() {
    this.paginator=this.paginator
    
  }

 applyFilter(filterValue: any) {
    console.log('filtervalue', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMaterialTypeDialog() {
    this.dialog.open(AddMeterTypeMasterComponent, {
      width: '100%',
      disableClose: true,
      data : {
        field1 :  this.materialData,
      }
    });
  }

  openUpdateMaterialTypeDialog(material: any) {
    this.dialog.open(UpdateMeterTypeMasterComponent, {
      width: '100%',
      
      disableClose: true,
      data : {
        field1 :   this.materialData,
        field2 : material,
      }
    });
  }
}

