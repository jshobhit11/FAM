import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-asset-category-material-mapping',
  templateUrl: './update-asset-category-material-mapping.component.html',
  styleUrls: ['./update-asset-category-material-mapping.component.scss'],
})
export class UpdateAssetCategoryMaterialMappingComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  assetCategoryData: any[] = [];
  materialsLabourData: any[] = [];
  amAssetCategoryMaterialMasterId = [];
  // srMaterialsMasterId = [];
  assetCatMaterialData = [];
  assestCategoryForm: FormGroup;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateAssetCategoryMaterialMappingComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.assetCategoryData = getAllData.field1;
    this.materialsLabourData = getAllData.field2;
    this.amAssetCategoryMaterialMasterId = getAllData.field3;
    this.assetCatMaterialData = getAllData.field4;
    this.assestCategoryForm = new FormGroup({
      AssetCategoryMasterId: new FormControl('', [Validators.required]),
      materialsLabourMasterId: new FormControl('', [Validators.required]),
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

    filters.amAssetCategoryMaterialMasterId = this.getAllData.field3;
    this.filterData = { ...filters };
    this.getData =
      await this.configurationService.getAssetCatMaterialMasterDataById(
        filters
      );
      console.log(this.getData); 
      console.log('materialsLabourData:', this.materialsLabourData);

      if (this.getData.materialsLabourMasterId != null) {
        const materialExists = this.materialsLabourData.some(
          (item) => Number(item.srMaterialsMasterId) === this.getData.amAssetCategoryMaterialMasterId
        );
      
        if (materialExists) {
          const material = this.materialsLabourData.find(
            (item) => Number(item.srMaterialsMasterId) === this.getData.amAssetCategoryMaterialMasterId
          );
          console.log('Material Code:', material?.mlCode);
          console.log('Material Name:', material?.mlName);

      const combinedValue = material ? `${material.mlCode}-${material.mlName}` : null;

      this.assestCategoryForm.patchValue({
        // amAssetCategoryMaterialMasterId:
        // this.getData.amAssetCategoryMaterialMasterId,
        AssetCategoryMasterId: this.getData.amAssetCategoryMasterId,
        materialsLabourMasterId: combinedValue,
      });

      this.assestCategoryForm.get('materialsLabourMasterId').setValue(material ? `${material.mlCode}-${material.mlName}` : '');

    }
    console.log('After patch:', this.assestCategoryForm.value);
  }
 }

  onAssetCatMatUpdate() {
    console.log('this.assestCategoryForm.value.AssetCategoryMasterId===',this.assestCategoryForm.value.AssetCategoryMasterId);
    
    this.assestCategoryForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        amAssetCategoryMaterialMasterId:
          Number(this.getAllData.field3),
        amAssetCategoryMasterId:
          this.assestCategoryForm.value.AssetCategoryMasterId,
          materialsLabourMasterId: 
          this.getMatLabMasterId(this.assestCategoryForm.value.materialsLabourMasterId),        
      };

      this.configurationService
        .getAssetCatMaterialUpdateData(this.filterData, updateBody)
        .then((result) => {
          console.log(result);
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }
          this.notificationRef = this.snackBar.open(
            'Asset Category Material Updated Successfully',
            'OK',
            {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            }
          );
          this.notificationRef
            .afterDismissed()
            .toPromise()
            .then(() => {
              this.dialogRef.close();
              this.Service.sendUpdate(
                'Asset Category Material Mapping Updated'
              );
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
  isValidForm(): boolean {
    this.assestCategoryForm.markAllAsTouched();
    console.log('Form Valid?', this.assestCategoryForm.valid);
    let hasError = false;
    Object.keys(this.assestCategoryForm.controls).forEach((key) => {
      const control = this.assestCategoryForm.get(key);
      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });
    if (hasError) {
      return false;
    } else {
      return true;
    }
  }

  getMatLabMasterId(mlCodeName: any){
    const mlCode = mlCodeName.split('-');

    console.log('mlCode======',mlCode[0]);

    const material = this.materialsLabourData.find((item) => Number(item.mlCode) === Number(mlCode[0].trim()));
    console.log('srMaterialsMasterId', material.srMaterialsMasterId);
    
    console.log('materialTypeMasterId======',material.materialTypeMasterId);

    const catMatData = this.assetCatMaterialData.find((item) =>  Number(material.materialTypeMasterId) === Number(item.amAssetCategoryMaterialMasterId) );

    console.log('catMatData.amAssetCategoryMaterialMasterId', this.amAssetCategoryMaterialMasterId);
    console.log('catMatData.srMaterialsMasterId', catMatData.materialTypeMasterId);
    
    console.log('catMatData.materialsLabourMasterId======',catMatData.materialsLabourMasterId);

    return catMatData ? Number(catMatData.materialsLabourMasterId) : 0;
  }
}
