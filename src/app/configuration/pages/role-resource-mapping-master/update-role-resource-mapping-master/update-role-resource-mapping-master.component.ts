import { Component, OnInit,Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-update-role-resource-mapping-master',
  templateUrl: './update-role-resource-mapping-master.component.html',
  styleUrls: ['./update-role-resource-mapping-master.component.scss']
})
export class UpdateRoleResourceMappingMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  dataSource: any;
  roleTypeForm: FormGroup;
  error: string;
  resourceId:any;
  designationMasterFilterData:any;
  designationMasterData: any;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public getAllData: any,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateRoleResourceMappingMasterComponent>
  ) { 
    dialogRef.disableClose = true;
    this.resourceId = getAllData.field2;
    
    this.roleTypeForm = new FormGroup({
      roleId: new FormControl('', [Validators.required]),
      resourceName: new FormControl('', [Validators.required]),
      resourceDiscription: new FormControl('', [Validators.required]),
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
    filters.roleResourceMasterId = this.resourceId.roleResourceMasterId;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.UpdateRoleResourceMappingMasterComponent(
      this.filterData, this.roleTypeForm.value 
    );

    this.designationMasterData = await this.configurationService.getDesignationMasterGetAllData(filters);
     
    this.designationMasterFilterData = this.designationMasterData.map(item => ({
      designationMasterId: Number(item.designationMasterId),
      designationName: item.designationName
  }));

  console.log('Designation Master Get All data', this.designationMasterFilterData);
    this.roleTypeForm.patchValue({
      roleId: this.getData.roleId,
      resourceName: this.getData.resourceName,
      resourceDiscription: this.getData.resourceDiscription,
    });
    console.log(' update role resource type get data by id', this.getData);
  }
  async onUpdateRoleResource() {
    this.roleTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        roleId: this.roleTypeForm.value.roleId,
        resourceName: this.roleTypeForm.value.resourceName,
        resourceDiscription: this.roleTypeForm.value.resourceDiscription,
      };

     try {
        const response =
          await this.configurationService.getUpdateRoleResourceTypeData(
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
          'Role Resource Updated Successfully',
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
            this.Service.sendUpdate('Role resource Type Updated');
          });
      } catch (error) {
        console.error('Error updating role resource type name', error);
        alert('An error occurred while updating role resource type name.');
      }
    }
  }
  isValidForm(): boolean {
    this.roleTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.roleTypeForm.valid);
    let hasError = false;
    Object.keys(this.roleTypeForm.controls).forEach((key) => {
      const control = this.roleTypeForm.get(key);
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
