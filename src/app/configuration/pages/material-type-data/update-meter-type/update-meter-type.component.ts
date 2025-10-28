import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-meter-type',
  templateUrl: './update-meter-type.component.html',
  styleUrls: ['./update-meter-type.component.scss'],
})
export class UpdateMeterTypeComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  dataSource: any;
  materialTypeForm: FormGroup;
  error: string;
  constructor(
    private materialTypeService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public materialId: any,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateMeterTypeComponent>
  ) {
    dialogRef.disableClose = true;
    this.materialTypeForm = new FormGroup({
      materialTypeName: new FormControl('', [Validators.required]),
      materialTypeCode: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
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
      materialTypeMasterId: this.materialId,
    };
    // filters.materialTypeMasterId = this.materialId;
    // this.filterData = { ...filters };
    this.getData = await this.materialTypeService.getupdateMaterialInfo_DATA(
      filters
    );
    this.materialTypeForm.patchValue({
      materialTypeName: this.getData.materialTypeName,
      materialTypeCode: this.getData.materialTypeCode,
    });
    console.log(' update material type get data by id', this.getData);
  } catch (error) {
    console.error('Error loading material type data', error);
  }
}
  async onUpdate() {
    this.materialTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        materialTypeName: this.materialTypeForm.value.materialTypeName,
        materialTypeCode: this.materialTypeForm.value.materialTypeCode,
      };
      try {
        const response =
          await this.materialTypeService.getUpdateMaterialTypeData(
            this.getData,
            updateBody
          );
        console.log('update data', response);
        this.dataSource = new MatTableDataSource(response);

        if (this.notificationRef) {
          this.notificationRef.dismiss();
          this.notificationRef = null;
        }

        this.notificationRef = this.snackBar.open(
          'Material Type Updated Successfully',
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
            this.Service.sendUpdate('Material Type Updated');
          });
      } catch (error) {
        console.error('Error updating material type name', error);
        alert('An error occurred while updating material type name.');
      }
    }
  }
  isValidForm(): boolean {
    this.materialTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.materialTypeForm.valid);
    let hasError = false;
    Object.keys(this.materialTypeForm.controls).forEach((key) => {
      const control = this.materialTypeForm.get(key);
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
