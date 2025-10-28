import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddAssetCategoryMaterialMappingComponent } from './add-asset-category-material-mapping/add-asset-category-material-mapping.component';
import { UpdateAssetCategoryMaterialMappingComponent } from './update-asset-category-material-mapping/update-asset-category-material-mapping.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
export interface AssetCategoryMaterialMappingInfo {
  amAssetCategoryMasterId: string;
  materialsLabourMasterId: string;
}
const AssetCategoryMaterialMapping_DATA: AssetCategoryMaterialMappingInfo[] =
  [];
@Component({
  selector: 'app-asset-category-material-mapping',
  templateUrl: './asset-category-material-mapping.component.html',
  styleUrls: ['./asset-category-material-mapping.component.scss'],
})
export class AssetCategoryMaterialMappingComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(AssetCategoryMaterialMapping_DATA);
  subscriptionName: any;
  assetData: any[] = [];
  assetCategoryData: any = {};
  materialsData: any[] = [];
  materialsLabourData: any = {};
  assetCatMateialData: any = {};

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Asset Category Material Mapping data', message['text']);
      if (message['text'] == 'Asset Category Material Mapping Updated') {
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
    this.assetCatMateialData = await this.configurationService
      .getAssetCatMaterialAllData(filters);

      this.dataSource = new MatTableDataSource(this.assetCatMateialData);
        this.dataSource.paginator = this.paginator;

        console.log(
          'Asset Category Material Mapping all data',
          this.assetCatMateialData );
  
    this.assetCategoryData =
      await this.configurationService.getAssetCategoryGetAllData(filters);
    this.assetData = this.assetCategoryData.map((asset) => ({
      amAssetCategoryMasterId: asset.amAssetCategoryMasterId,
      assetCategoryName: asset.assetCategoryName,
    }));

    this.materialsLabourData =
      await this.configurationService.getSrMaterialMasterAllData(filters);
    this.materialsData = this.materialsLabourData.map((materials) => ({
      srMaterialsMasterId: materials.srMaterialsMasterId,
      mlName: materials.mlName,
      mlCode: materials.mlCode,
    }));
  }

  displayedColumns: string[] = [
    'slno',
    'amAssetCategoryMasterId',
    'materialsLabourMasterId',
    'action',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddAssetCategoryMaterialMappingTypeDialog() {
    this.dialog.open(AddAssetCategoryMaterialMappingComponent, {
      width: '100%',
      data: {
        field1: this.assetCategoryData,
        field2: this.materialsLabourData,
      },
    });
  }

  openUpdateAssetCategoryMaterialMappingTypeDialog(
    amAssetCategoryMaterialMasterId: any
  ) {
    this.dialog.open(UpdateAssetCategoryMaterialMappingComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.assetCategoryData,
        field2: this.materialsLabourData,
        field3: amAssetCategoryMaterialMasterId,
        field4: this.assetCatMateialData,
      },
    });
  }
}
