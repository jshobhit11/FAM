import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { additionChargesparams } from 'src/app/models/configuration.model';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { AddAdditionalChargesMasterComponent } from './add-additional-charges-master/add-additional-charges-master.component';
import { UpdateAdditionalChargesMasterComponent } from './update-additional-charges-master/update-additional-charges-master.component';
export interface AdditionalChargesInfo {
  additionalChaergesName: string;
  additionalChaergesCode: string;
  chargesSequenceOrder: number;
}
const AdditionalCharges_DATA: AdditionalChargesInfo[] = [];
@Component({
  selector: 'app-additional-charges-master',
  templateUrl: './additional-charges-master.component.html',
  styleUrls: ['./additional-charges-master.component.scss'],
})
export class AdditionalChargesMasterComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subscriptionName: Subscription;
  constructor(
    public dialog: MatDialog,
    private additionalChargeService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      if (message['text'] == 'Additional Charges Master Updated') {
        this.ngOnInit();
      }
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(AdditionalCharges_DATA);
  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filters: additionChargesparams = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };
    this.additionalChargeService
      .getAdditionalChargesData(filters)
      .then((data) => {
        console.log('Additional Charges Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);

        this.dataSource.paginator = this.paginator;
        console.log('Additional Charges Master all data', this.dataSource);
      });
    console.log(this.dataSource);
  }
  displayedColumns: string[] = [
    'slno',
    'additionalChargesName',
    'additionalChargesCode',
    'sequenceOrder',
    'action',
  ];

  ngAfterViewInit() {
    console.log('dataSource', this.dataSource);
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: any) {
    console.log('filtervalue', filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddAdditionalChargesDialog() {
    this.dialog.open(AddAdditionalChargesMasterComponent, {
      width: '100%',
      disableClose: true,
    });
  }

  openUpdateAdditionalChargesDialog(additionalChargesMasterId: any) {
    console.log(additionalChargesMasterId);
    this.dialog.open(UpdateAdditionalChargesMasterComponent, {
      width: '100%',
      data: additionalChargesMasterId,
      disableClose: true,
    });
  }
}
