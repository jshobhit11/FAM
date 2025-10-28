import { Component, OnInit,Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-role-resource-mapping-master',
  templateUrl: './add-role-resource-mapping-master.component.html',
  styleUrls: ['./add-role-resource-mapping-master.component.scss']
})
export class AddRoleResourceMappingMasterComponent implements OnInit {
  notificationRef: any;
  roleTypeForm: FormGroup;
  error: string;
  roleMaterials: any;
  designationMasterData: any;
  designationMasterFilterData: any;
  constructor(
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
  ) { 
    dialogRef.disableClose = true; 
    this.roleMaterials = getAllData.field1;
    console.log('roleMaterials======',this.roleMaterials);
  }

  async ngOnInit(): Promise<void> {
    this.roleTypeForm = this.formBuilder.group({
      roleId: ['', Validators.required],
      resourceName: ['', Validators.required],
      resourceDiscription: ['', Validators.required],
    });


    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filters = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };
    this.designationMasterData = await this.configurationService.getDesignationMasterGetAllData(filters);
     
      this.designationMasterFilterData = this.designationMasterData.map(item => ({
        designationMasterId: item.designationMasterId,
        designationName: item.designationName
    }));

    console.log('Designation Master Get All data', this.designationMasterFilterData);

  }
  materialObj = {
    roleId: '',
    resourceName: '',
    resourceDiscription:'',
  };

  onAddRoleResource() {
    Object.keys(this.roleTypeForm.controls).forEach((key) => {
      this.roleTypeForm.get(key)?.markAsTouched();
    });
    if (this.roleTypeForm.valid) {
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
        roleId: this.roleTypeForm.value.roleId,
        resourceName: this.roleTypeForm.value.resourceName,
        resourceDiscription: this.roleTypeForm.value.resourceDiscription,
      };

      this.configurationService
        .getRoleResourceTypeSaveData(filters, reqBody)
        .then((response) => {
          this.roleMaterials = response.data;
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Role Type Updated');
            if (this.notificationRef) {
              this.notificationRef.dismiss();
              this.notificationRef = null;
            }
            this.notificationRef = this.snackBar.open(
              response.messageText,
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
              })
              .catch((error) => {
                console.error('Error closing dialog:', error);
              });
          }
        });
    }
  }

  isValidForm(): boolean {
    if (
      this.roleTypeForm.get('role').invalid ||
      this.roleTypeForm.get('resourceName').invalid ||
      this.roleTypeForm.get('resourceDescription').invalid
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


