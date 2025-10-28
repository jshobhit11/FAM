import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-material-master-item',
  templateUrl: './update-material-master-item.component.html',
  styleUrls: ['./update-material-master-item.component.scss'],
})
export class UpdateMaterialMasterItemComponent implements OnInit {
  getData: any = {};
  filterData: any;
  mlTypes = [];
  srMaterialsMasterId = [];
  materialData: any[] = [];
  materialUnitData: any[] = [];
  notificationRef: any;
  materialMasterForm: FormGroup;
  error: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateMaterialMasterItemComponent>
  ) {
    dialogRef.disableClose = true;
    this.mlTypes = getAllData.field1;
    this.materialUnitData = getAllData.field2;
    this.srMaterialsMasterId = getAllData.field3;
    this.materialData = this.getAllData.field4;

    this.materialMasterForm = new FormGroup({
      mlType: new FormControl('', [Validators.required]),
      mlUnit: new FormControl('', [Validators.required]),
      materialTypeMasterId: new FormControl('', [Validators.required]),
      mlCode: new FormControl('', [Validators.required]),
      mlName: new FormControl('', [Validators.required]),
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
    filters.srMaterialsMasterId = this.getAllData.field3;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getSrmaterialMasterById(
      this.filterData
    );
    console.log(' Material Master get data by id', this.getData);

    this.getData.materialTypeMasterId = Number(
      this.getData.materialTypeMasterId
    );
    this.materialMasterForm.patchValue({
      mlType: this.getData.mlType,
      mlUnit: this.getData.mlUnit,
      materialTypeMasterId: this.getData.materialTypeMasterId,
      mlCode: this.getData.mlCode,
      mlName: this.getData.mlName,
    });
  }
  onMaterialMaster() {
    this.materialMasterForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        mlType: this.materialMasterForm.value.mlType,
        mlUnit: this.materialMasterForm.value.mlUnit,
        materialTypeMasterId:
          this.materialMasterForm.value.materialTypeMasterId,
        mlCode: this.materialMasterForm.value.mlCode,
        mlName: this.materialMasterForm.value.mlName,
      };
      this.configurationService.getSrmaterialMasterUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
          this.Service.sendUpdate('Material Master Updated');
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }
            this.notificationRef = this.snackBar.open(response.messageText,
            'OK',
            {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            }
          );
          this.notificationRef.afterDismissed().toPromise().then(() => {
            this.dialogRef.close();
            }).catch((error) => {
            console.error('Error closing dialog:', error);
            });
          }
        });
    }
  }

  isValidForm(): boolean {
    this.materialMasterForm.markAllAsTouched();
    console.log('Form Valid?', this.materialMasterForm.valid);
    let hasError = false;
    Object.keys(this.materialMasterForm.controls).forEach((key) => {
      const control = this.materialMasterForm.get(key);
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
}
