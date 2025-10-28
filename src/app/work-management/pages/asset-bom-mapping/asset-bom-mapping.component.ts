import { Component, OnInit } from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetService } from 'src/app/services/asset.service';
import { SuspensePopupComponent } from '../suspense-popup/suspense-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-asset-bom-mapping',
  templateUrl: './asset-bom-mapping.component.html',
  styleUrls: ['./asset-bom-mapping.component.scss'],
})
export class AssetBomMappingComponent implements OnInit {
  assetOptions = ['Asset 1', 'Asset 2', 'Asset 3'];
  materialOptions = ['Material 1', 'Material 2', 'Material 3'];
  quantityOptions = ['1', '2', '3'];
  assetValue: string = '';
  materialValue: string = '';
  actualQuantityValue: string = '0';
  mappedQuantityValue: string = '0';
  remainingQty: any = 0;
  showTable: boolean = false;
  fullDetails: any;
  tableData: {
    assetId: string;
    material: string;
    actualQuantity: string;
    mappedQuantity: string;
  }[] = [];
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private assetService: AssetService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  assetList: any = [];
  wmWorkorderRegisteredId: any;
  assetListIds: any = [];
  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.wmWorkorderRegisteredId = params['workorderRegisteredId'];
      this.fullDetails = params['fullDetails'] == 'true' ? true : false;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
  
      this.assetList = await this.assetService.getAssetBomListByWorkOrderRegisteredId({
        apiKey,
        serviceKey,
        userCode,
        userName,
        userRole,
        wmWorkorderRegisteredId: this.wmWorkorderRegisteredId,
      });
  
      this.assetList.workorderEstimationLogAndMaterialsLabourData =
        this.assetList.workorderEstimationLogAndMaterialsLabourData.filter(
          (asset) => asset.actualQuantity !== "0"
        );
  
      this.assetList.amAssetRegisterLogAndMaterialsLabourData = 
        this.assetList.amAssetRegisterLogAndMaterialsLabourData.filter(
          (asset) => asset.actualQuantity !== 0
        );
  
      this.assetListIds = 
        this.assetList.amAssetRegisterLogAndMaterialsLabourData.map(
          (asset) => asset.assetId
        );
      this.assetListIds = [...new Set(this.assetListIds)];
  
      this.assetList.workorderEstimationLogAndMaterialsLabourData =
        this.assetList.workorderEstimationLogAndMaterialsLabourData.map((asset) => {
          return { ...asset, mappedQuantity: 0, remainingQty: 0 };
        });
    });
  }
  

  get availableMaterialOptions(): string[] {
    const selectedMaterials = this.tableData.map((row) => row.material);
    return this.materialOptions.filter(
      (material) => !selectedMaterials.includes(material)
    );
  }

  addRow() {
    if (
      this.assetValue &&
      this.materialValue &&
      this.actualQuantityValue &&
      this.mappedQuantityValue
    ) {
      // Check if there's already a record with both assetValue and materialValue
      const duplicateRecord = this.assetList.amAssetRegisterLogAndMaterialsLabourData.find(
        (asset: any) =>
          asset.assetId == this.assetValue && asset.material == this.materialValue
      );

       // If duplicate record found, show snackbar and reset materialValue
      if (duplicateRecord) {
        this.snackBar.open(
          'This material is already added for this asset.',
          'OK'
        );
        this.materialValue = null; // Reset the materialValue
        this.clearSelections();
        return; // Exit the function as we don't want to proceed further
      }

      // if(Number(this.mappedQuantityValue)>Number(this.remainingQty)){
      //   this.snackBar.open(
      //     'Mapped Quantity should not greater than Remaining Quantity.',
      //     'OK'
      //   );
      //   this.mappedQuantityValue = '';
      //   return;
      // }

      const assetValueIndex =
        this.assetList.amAssetRegisterLogAndMaterialsLabourData.findIndex(
          (asset: any) => asset.assetId == this.assetValue
        );

      const idx =
        this.assetList.workorderEstimationLogAndMaterialsLabourData.find(
          (asset) => asset.materialsLabourMasterId == this.materialMasterId
        );
      const assetValue =
        this.assetList.amAssetRegisterLogAndMaterialsLabourData.find(
          (assett) => assett.assetId == this.assetValue
        );
      if (idx.remainingQty == 0) {
        this.assetList.workorderEstimationLogAndMaterialsLabourData =
          this.assetList.workorderEstimationLogAndMaterialsLabourData.filter(
            (asset) => asset.materialsLabourMasterId != this.materialMasterId
          );
      }

      this.assetList.amAssetRegisterLogAndMaterialsLabourData.splice(
        assetValueIndex + 1,
        0,
        {
          assetId: this.assetValue,
          material: this.materialValue,
          actualQuantity: this.actualQuantityValue,
          mappedQuantity: this.mappedQuantityValue,
          assetRegisterLogId: assetValue.assetRegisterLogId,
          materialMasterId: assetValue.materialMasterId,
          mlCode: assetValue.mlCode,
          mlName: idx.mlName,
          quantity: 'null',
          // "materialsLabourMasterId": null,
          // "wmWorkorderRegisteredId": null,
          // "assetType": null,
        }
      );

      if (this.actualQuantityValue === this.mappedQuantityValue) {
        console.log('95');

        this.assetList.workorderEstimationLogAndMaterialsLabourData =
          this.assetList.workorderEstimationLogAndMaterialsLabourData.filter(
            (asset) => asset.materialsLabourMasterId != this.materialMasterId
          );
      }
      console.log(this.assetList.amAssetRegisterLogAndMaterialsLabourData);

      this.clearSelections();
      this.showTable = true;
    }
  }

  onMaterialChange(value) {
    const data =
      this.assetList.workorderEstimationLogAndMaterialsLabourData.find(
        (asset) => asset.materialsLabourMasterId == value
      );
    this.actualQuantityValue = Number(data.actualQuantity).toFixed();
    this.remainingQty = data.remainingQty;
    this.materialMasterId = value;
  }

  materialMasterId: any;
  onMappedQuantity(e) {
      const duplicateRecord = this.assetList.amAssetRegisterLogAndMaterialsLabourData.find(
        (asset: any) =>
          asset.assetId == this.assetValue && asset.material == this.materialValue
      );
      if (duplicateRecord) {
        this.snackBar.open(
          'This material is already added for this asset.',
          'OK'
        );
        this.materialValue = null; 
        this.clearSelections();
        return; 
      }
    if (e > this.actualQuantityValue) {
      this.snackBar.open(
        'Mapped Quantity should be less than actual quantity',
        'OK'
      );
      this.mappedQuantityValue = '';
      this.clearSelections();
      return;
    }
    if (e > 0) {
      const data =
        this.assetList.workorderEstimationLogAndMaterialsLabourData.find(
          (asset) => asset.materialsLabourMasterId == this.materialMasterId
        );

      const idx =
        this.assetList.workorderEstimationLogAndMaterialsLabourData.findIndex(
          (asset) => asset.materialsLabourMasterId == this.materialMasterId
        );
      const actualQty: any = Number(data.actualQuantity).toFixed();
      console.log(actualQty);

      if (data.remainingQty == 0) {        
        this.remainingQty = actualQty - Number(e);

        if(this.remainingQty < 0){
          this.snackBar.open(
            'Mapped Quantity exceeds the Remaining quantity. Please adjust.',
            'OK'
          );
          this.mappedQuantityValue = ''; // Reset the mapped quantity
          this.clearSelections(); // Optionally clear other selections
          return; // Exit the function
        }
      } else {
        this.remainingQty = this.remainingQty - Number(e);

        if(this.remainingQty < 0){
          this.snackBar.open(
            'Mapped Quantity exceeds the Remaining quantity. Please adjust.',
            'OK'
          );
          this.mappedQuantityValue = ''; // Reset the mapped quantity
          this.clearSelections(); // Optionally clear other selections
          return; // Exit the function
        }
      }

      this.assetList.workorderEstimationLogAndMaterialsLabourData[
        idx
      ].remainingQty = this.remainingQty;
    }
  }

  deleteRow(index: number): void {
    this.tableData.splice(index, 1);
    if (this.tableData.length === 0) {
      this.showTable = false;
    }
  }

  private clearSelections() {
    this.assetValue = '';
    this.materialValue = '';
    this.actualQuantityValue = '0';
    this.mappedQuantityValue = '0';
    this.remainingQty = 0;
  }
  openConfirmationDialog() {
   const dialogRef = this.dialog.open(SuspensePopupComponent, {
       width: 'auto',
       data: { type: 'submit' },
    });

    dialogRef.afterClosed().subscribe((result) => {
     if (result === 'yes') {
        this.saveAssetBOMMapping();
      }
    });
  }
  j: any = 0;
  async saveAssetBOMMapping() {
    if (this.assetList.workorderEstimationLogAndMaterialsLabourData.length === 0) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      
      const promises = this.assetList.amAssetRegisterLogAndMaterialsLabourData.map(assetData => {
        return this.assetService.saveAssetBomData({
          apiKey,
          serviceKey,
          userCode,
          userName,
          userRole,
          serviceRegistrationsId: this.assetList.workorderRegistered.serviceRegistrationsId,
          wmWorkorderRegisteredId: this.assetList.workorderRegistered.wmWorkorderRegisteredId,
        }, [
          {
            amAssetBomLogId: 0,
            wmWorkorderRegisteredId: this.wmWorkorderRegisteredId,
            amAssetRegisterLogId: assetData.assetRegisterLogId,
            assetId: assetData.assetId,
            materialMasterId: assetData.materialMasterId,
            quantity: assetData.quantity,
          },
        ]);
      });
  
      try {
        this.isLoading = true;
        const results = await Promise.all(promises);
        console.log(results);
        const snackBarRef = this.snackBar.open('Asset BOM Mapping Saved successfully', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' })
        snackBarRef.onAction().subscribe(() => {
            this.snackBar.dismiss();
            this.router.navigate(['/work-management/asset-bom-report']);
            this.isLoading=false;
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      this.snackBar.open('All the Non-Asset Materials are not mapped. Please mapped the Materials.', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' });
    }
  }
  
}
