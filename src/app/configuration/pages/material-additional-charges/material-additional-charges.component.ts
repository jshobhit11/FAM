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
import { AddMaterialAdditionalChargesComponent } from './add-material-additional-charges/add-material-additional-charges.component';
import { UpdateMaterialAdditionalChargesComponent } from './update-material-additional-charges/update-material-additional-charges.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
export interface MateName {
  woExecutionMethodId: string;
  additionalChargeName: string;
  chargeType: number;
  chargeTypeValue: number;
  chargesSequenceOrder: number;
  valueCalculatedByMaterial: number;
  valueCalculatedByLabour: number;
  displayByDefault: number;
  valueCalculatedByTotalLabour: number;
}

const MaterialMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-material-additional-charges',
  templateUrl: './material-additional-charges.component.html',
  styleUrls: ['./material-additional-charges.component.scss'],
})
export class MaterialAdditionalChargesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private subscriptionName: Subscription;
  dataSource = new MatTableDataSource(MaterialMaster_DATA);
  materialIDName: any[] = [];
  chargeTypes = ['PERCENTAGE', 'FLAT'];
  materialAdllCharges: any[] = [];
  additionalData: any = {};
  additionalTypeData: any[] = [];
  constructor(
    public dialog: MatDialog,
    private MaterialAdditionalChargesService: ConfigurationService,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
   
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
     
      console.log('Material additional Charges Updated', message['text']);
      if (message['text'] == 'Material additional Charges Updated') {
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
    this.materialAdllCharges =
      await this.MaterialAdditionalChargesService.getMaterialAdditionalChargesAllData(
        filters
      );
    this.dataSource = new MatTableDataSource(this.materialAdllCharges);
    this.dataSource.paginator = this.paginator;
    console.log('additional charges', this.dataSource);

    {
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
      this.MaterialAdditionalChargesService.getWorkExecutionGetAllData(
        filters
      ).then((data) => {
        console.log('Work Execution Data from service', data);
        this.materialIDName = data.map((exeData) => ({
          executionMethodIds: exeData.woExecutionMethodId,
          executionMethodName: exeData.woExecutionMethodName,
        }));
      });

      this.additionalData = await this.configurationService.getAdditionalChargesGetAllData(
        filters
      );
      console.log('Additional Charges Master Data from service', this.additionalData);
      this.additionalTypeData = this.additionalData.map((additionalType) => ({
        additionalChargesMasterId: additionalType.additionalChargesMasterId,
        additionalChargesName: additionalType.additionalChargesName,
      }));
    }
  }
  displayedColumns: string[] = [
    'slno',
    'woExecutionMethodId',
    'additionalChargeName',
    'chargeType',
    'chargeTypeValue',
    'chargesSequenceOrder',
    'valueCalculatedByMaterial',
    'valueCalculatedByLabour',
    'displayByDefault',
    'valueCalculatedByTotalLabour',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMaterialAdditionalChargesDialog() {
    this.dialog.open(AddMaterialAdditionalChargesComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.materialIDName,
        field2: this.chargeTypes,
        field3: this.materialAdllCharges,
        field4: this.additionalData,
      },
    });
  }

  openUpdateMaterialAdditionalChargesDialog(
    estimationAddiotionalChargesMasterId: any,
    item: any
  ) {
    console.log(
      'estimationAddiotionalChargesMasterId',
      estimationAddiotionalChargesMasterId
    );
    this.dialog.open(UpdateMaterialAdditionalChargesComponent, {
      width: '100%',
      data: {
        field1: this.materialIDName,
        field2: this.chargeTypes,
        field3: estimationAddiotionalChargesMasterId,
        field8: item,
        field9:this.additionalData
      },
    });
  }

  onAdditionalChargesType(selectedExecutionMethod) {
    console.log('selectedExecutionMethod', selectedExecutionMethod);
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
      woExecutionMethodId: selectedExecutionMethod.executionMethodIds,
    };
    this.MaterialAdditionalChargesService.getmaterialAddtionalChargeswoExecutionMethodId(
      filters
    ).then((data) => {
      let tempData =
        data && data?.length > 0
          ? data.map((item) => {
              item['woExecutionMethodName'] =
                selectedExecutionMethod.executionMethodName;
              return item;
            })
          : [];
      this.dataSource = new MatTableDataSource(tempData);
      this.dataSource.paginator = this.paginator;
      console.log('additional charges woExecutionMethodId', this.dataSource);
    });
  }
  convertToNumber(value: string): number {
    return parseInt(value, 10); 
  }
}
