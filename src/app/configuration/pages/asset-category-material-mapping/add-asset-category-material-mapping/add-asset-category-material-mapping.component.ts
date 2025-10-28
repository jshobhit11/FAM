import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-asset-category-material-mapping',
  templateUrl: './add-asset-category-material-mapping.component.html',
  styleUrls: ['./add-asset-category-material-mapping.component.scss'],
})
export class AddAssetCategoryMaterialMappingComponent implements OnInit {
  notificationRef: any;
  assetCatMatForm: FormGroup;
  error: string;
  assetCategoryData: any[] = [];
  materialsLabourData: any[] = [];
  filteredMaterials: Observable<any[]>;

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private service: CommonService,
    @Inject(MAT_DIALOG_DATA) private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.assetCategoryData = getAllData.field1;
    this.materialsLabourData = getAllData.field2;
  }

  ngOnInit(): void {
    this.assetCatMatForm = this.formBuilder.group({
      amAssetCategoryMasterId: ['', Validators.required],
      materialsLabourMasterId: ['', Validators.required],
    });

    this.filteredMaterials = this.assetCatMatForm.get('materialsLabourMasterId').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.mlName),
      map(name => name ? this.filterMaterials(name) : this.materialsLabourData.slice())
    );
  }

  filterMaterials(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.materialsLabourData.filter(material => material.mlName.toLowerCase().includes(filterValue));
  }

  displayMaterialOption(material?: any): string | undefined {
    return material ? `${material.mlCode} - ${material.mlName}` : undefined;
  }

  onAddAssetCatMaterialType() {
    this.assetCatMatForm.markAllAsTouched();
    if (this.assetCatMatForm.valid) {
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

      const reqBody = {
        amAssetCategoryMasterId: this.assetCatMatForm.value.amAssetCategoryMasterId,
        materialsLabourMasterId: this.assetCatMatForm.value.materialsLabourMasterId.srMaterialsMasterId,
      };
      
      this.configurationService.getAssetCatMaterialSaveData(filters, reqBody);

      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }

      this.notificationRef = this.snackBar.open(
        'Asset Category Material Added Successfully',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );

      this.notificationRef.afterDismissed().toPromise().then(() => {
        this.dialogRef.close();
        this.service.sendUpdate('Asset Category Material Mapping Updated');
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
    if (
      this.assetCatMatForm.get('amAssetCategoryMasterId').invalid ||
      this.assetCatMatForm.get('materialsLabourMasterId').invalid
    ) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
