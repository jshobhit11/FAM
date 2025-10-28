import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddMaterialLabourMappingComponent } from './add-material-labour-mapping/add-material-labour-mapping.component';
import { UpdateMaterialLabourMappingComponent } from './update-material-labour-mapping/update-material-labour-mapping.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
export interface MateName {
  materialsLabourMappingId: string;
  materialMasterId: string;
  labourMasterId: string;
  materialTypeMasterId: string;
  materialCode: string;
  labourCode: string;
  labourByDefault: number;
}
const MaterialMaster_DATA: MateName[] = [];
@Component({
  selector: 'app-material-labour-mapping',
  templateUrl: './material-labour-mapping.component.html',
  styleUrls: ['./material-labour-mapping.component.scss'],
})
export class MaterialLabourMappingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(MaterialMaster_DATA);
  filterData: any[] = [];
  actualData: any[] = [];
  subscriptionName: any;
  materialType: any[] = [];
  filteredTableData: any;
  initialTableData: any[] = [];
  materialTypeData: any[] = [];
  materialData: any[] = [];
  materialMasterTypeData: any[] = [];
  materialMasterData: any[] = [];
  labourMasterTypeData: any[] = [];
  labourMasterData: any[] = [];
  materialTypeMasterId: any;

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      console.log('Material Labour Mapping data', message['text']);
      if (message['text'] == 'Material Labour Mapping Updated') {
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
    this.configurationService
      .getMaterialLabourMappingGetAllData(filters)
      .then((data) => {
        this.actualData = data;
        this.filterData = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        console.log('Material Labour Mapping Master all data', this.filterData);
      });

    //Material_Type_master---materialTypeMasterId
    this.materialData = await this.configurationService.getMaterialTypeData(
      filters
    );
    console.log('this.materialData', this.materialData);
    const uniqueValues = {};
    this.materialTypeData = this.materialData
      .map((materialType) => ({
        materialTypeMasterId: materialType.materialTypeMasterId,
        materialTypeName: materialType.materialTypeName,
      }))
      .filter((materialType) => {
        const isUnique = !uniqueValues[materialType.materialTypeMasterId];
        if (isUnique) {
          uniqueValues[materialType.materialTypeMasterId] = true;
        }
        return isUnique;
      });
  }
  displayedColumns: string[] = [
    'slno',
    'materialTypeMasterId',
    'materialCode',
    'materialMasterId',
    'labourCode',
    'labourMasterId',
    'labourByDefault',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddMaterialLabourMappingDialog() {
    this.dialog.open(AddMaterialLabourMappingComponent, {
      width: '100%',
      data: {
        field1: this.materialData,
      },
    });
  }

  openUpdateMaterialLabourMappingDialog(materialsLabourMappingId: any) {
    this.dialog.open(UpdateMaterialLabourMappingComponent, {
      width: '100%',
      data: {
        field1: this.materialData,
        field2: this.filterData,
        field3: this.labourMasterData,
        field4: materialsLabourMappingId,
      },
    });
  }

  onMaterialTypeChange(materialTypeMasterId: any) {
    this.actualData = this.actualData.filter(
      (item) => item.materialTypeMasterId === String(materialTypeMasterId)
    );
    this.dataSource = new MatTableDataSource(this.actualData);
    this.dataSource.paginator = this.paginator;
    this.actualData = this.filterData;
  }
}
