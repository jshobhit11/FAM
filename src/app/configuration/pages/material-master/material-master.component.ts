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
import { AddMaterialMasterItemComponent } from './add-material-master-item/add-material-master-item.component';
import { UpdateMaterialMasterItemComponent } from './update-material-master-item/update-material-master-item.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
export interface MateName {
  materialTypeMasterId: string;
  mlType: string;
  mlCode: string;
  mlName: string;
  mlUnit: string;
  materialTypeName: string;
}
const MaterialMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-material-master',
  templateUrl: './material-master.component.html',
  styleUrls: ['./material-master.component.scss'],
})
export class MaterialMasterComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private subscriptionName: Subscription;
  mlTypes = ['MATERIAL', 'LABOR'];
  materialTypeData: any[] = [];
  materialData: any = {};
  materialUnitTypeData: any[] = [];
  materialUnitData: any = {};

  dataSource = new MatTableDataSource(MaterialMaster_DATA);
  constructor(
    public dialog: MatDialog,
    private MaterialMasterService: ConfigurationService,
    private Service: CommonService,
    private configurationService: ConfigurationService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Material Master Updated', message['text']);
      if (message['text'] == 'Material Master Updated') {
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
    this.MaterialMasterService.getSrMaterialMasterAllData(filters).then( //SR Material Data
      (data) => {
        console.log('SR Material Master Data from service', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('material labour', this.dataSource);
      }
    );
    console.log(this.dataSource);
    this.materialData = await this.configurationService.getMaterialTypeData( //Material Data
      filters
    );
    console.log('Material Type Master Data from service', this.materialData);
    const uniqueValues = {};
    this.materialTypeData = this.materialData
      .map((materialType) => ({
        materialTypeMasterId: materialType.materialTypeMasterId.toString(), // Convert to string
        materialTypeName: materialType.materialTypeName,
      }))
      .filter((materialType) => {
        const isUnique = !uniqueValues[materialType.materialTypeMasterId];

        if (isUnique) {
          uniqueValues[materialType.materialTypeMasterId] = true;
        }
        return isUnique;
      });

    this.materialUnitData =
      await this.configurationService.getMaterialUnitMaster(filters);
    console.log(
      'Material Unit Master Data from service',
      this.materialUnitData
    );
    this.materialUnitTypeData = this.materialUnitData
      .map((materialUnitMaster) => ({
        materialUnit: materialUnitMaster.materialUnit,
      }))
      .filter((materialType) => {
        const isUnique = !uniqueValues[materialType.materialUnit];
        if (isUnique) {
          uniqueValues[materialType.materialUnit] = true;
        }
        return isUnique;
      });
  }
  displayedColumns: string[] = [
    'slno',
    'materialTypeMasterId',
    'mlType',
    'mlCode',
    'mlName',
    'mlUnit',
    'action',
  ];

  getMaterialName(materialTypeMasterId: string): string | undefined {
    const material = this.materialData.find(material => material.materialTypeMasterId === parseInt(materialTypeMasterId));
    return material ? material.materialTypeName : undefined;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMaterialMasterItemDialog() {
    this.dialog.open(AddMaterialMasterItemComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.mlTypes,
        field2: this.materialUnitData,
        field4: this.materialData,
      },
    });
  }

  openUpdateMaterialMasterItemDialog(srMaterialsMasterId: any) {
    this.dialog.open(UpdateMaterialMasterItemComponent, {
      width: '100%',
      data: {
        field1: this.mlTypes,
        field2: this.materialUnitData,
        field3: srMaterialsMasterId,
        field4: this.materialData,
      },
    });
  }

  onMaterialType(mlType) {
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
      mlType,
    };
    this.MaterialMasterService.getSrmaterialMasterGetDataMlType(filters).then(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      }
    );
  }
}
