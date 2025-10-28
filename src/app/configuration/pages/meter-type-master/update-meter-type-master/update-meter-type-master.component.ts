import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { UpdateMeterTypeComponent } from '../../material-type-data/update-meter-type/update-meter-type.component';

@Component({
  selector: 'app-update-meter-type-master',
  templateUrl: './update-meter-type-master.component.html',
  styleUrls: ['./update-meter-type-master.component.scss']
})
export class UpdateMeterTypeMasterComponent implements OnInit {

  getData: any = {};
  filterData: any;
  notificationRef: any;
  dataSource: any;
  meterTypeForm: FormGroup;
  error: string;
  materialData: any;
  materialId:any;
  meterMaterials: any;
  options: string[];
  filteredOptions: any;
  tempData: any;
 constructor(
    private materialTypeService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public getAllData: any,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateMeterTypeComponent>
  ) {
    dialogRef.disableClose = true;
    this.materialId = getAllData.field2;
    this.meterTypeForm = new FormGroup({
      meterType: new FormControl('', [Validators.required]),
      materialCode: new FormControl('', [Validators.required]),
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
    
    filters.meterTypeMasterId = await this.materialId.meterTypeMasterId;
    this.filterData = { ...filters };
    this.getData = await this.materialTypeService.getMeterTypeMasterById(
      this.filterData
    );
    this.meterTypeForm.patchValue({
      meterType: this.getData.meterType,
      materialCode: this.getData.materialCode,
    });
    console.log(' update material type get data by id', this.getData);

    this.materialData = await this.materialTypeService.getSRMaterialsData(filters);
    this.tempData = this.materialData;
      console.log('Meter Type Master Data from service', this.materialData);
  }
  async onUpdate() {
    this.meterTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        meterType: this.meterTypeForm.value.meterType,
        materialCode: this.meterTypeForm.value.materialCode,
      };
      try {
        const response =
          await this.materialTypeService.getUpdateMeterTypeData(
            this.filterData,
            updateBody
          );
        console.log('update data', response);
        this.dataSource = new MatTableDataSource(response);

        if (this.notificationRef) {
          this.notificationRef.dismiss();
          this.notificationRef = null;
        }

        this.notificationRef = this.snackBar.open(
          'Meter Type Updated Successfully',
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
            this.Service.sendUpdate('Meter Type Updated');
          });
      } catch (error) {
        console.error('Error updating meter type name', error);
        alert('An error occurred while updating meter type name.');
      }
    }
  }
  onInputChange(value: string) {
    if (value.trim() === '') {
      this.materialData = this.tempData; 
    } else {
      this.filteredOptions = this.materialData.filter(option =>
        option.mlCode.toLowerCase().includes(value.toLowerCase())
      );
      this.materialData = this.filteredOptions;

    }
  }
  
  isValidForm(): boolean {
    this.meterTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.meterTypeForm.valid);
    let hasError = false;
    Object.keys(this.meterTypeForm.controls).forEach((key) => {
      const control = this.meterTypeForm.get(key);
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