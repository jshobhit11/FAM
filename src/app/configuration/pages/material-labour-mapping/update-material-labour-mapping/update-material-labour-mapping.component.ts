import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-material-labour-mapping',
  templateUrl: './update-material-labour-mapping.component.html',
  styleUrls: ['./update-material-labour-mapping.component.scss'],
})
export class UpdateMaterialLabourMappingComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  materialsLabourMappingId = [];
  materialData: any[] = [];
  materialMasterData: any[] = [];
  labourMasterData: any[] = [];
  materialLabourForm: FormGroup;
  error: string;
  materialLabourMasterData: any[] = [];
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateMaterialLabourMappingComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.materialData = getAllData.field1;
    this.labourMasterData = getAllData.field2;
    this.materialsLabourMappingId = getAllData.field4;

    this.materialLabourForm = new FormGroup({
      materialTypeMasterId: new FormControl('', [Validators.required]),
      materialMasterId: new FormControl('', [Validators.required]),
      labourMasterId: new FormControl('', [Validators.required]),
      labourByDefault: new FormControl('', [Validators.required]),
    });
  }
  materialTypeObj = {
    materialMasterId: '',
    labourMasterId: '',
    materialTypeMasterId: '',
    labourByDefault: '',
  };
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
    filters.materialsLabourMappingId = this.materialsLabourMappingId;
    this.filterData = { ...filters };
    this.getData =
      await this.configurationService.getMaterialLabourMappingGetDataById(
        filters
      );
    console.log(' Material Labour Mapping get data by id', this.getData);

    this.materialLabourForm.patchValue({
      materialTypeMasterId: this.getData.materialTypeMasterId,
      materialMasterId:this.getData.materialMasterId.toString(),
      labourMasterId: this.getData.labourMasterId.toString(),
      labourByDefault: this.getData.labourByDefault,
    });
    console.log('materialLabourForm', this.materialLabourForm.value);
    await this.getMaterialLabour();
  }
  async getMaterialLabour(){
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
  
    const uniqueValues = {};
    const materialFilters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      materialTypeMasterId: this.getData.materialTypeMasterId,
    };
    this.materialLabourMasterData =
      await this.configurationService.getSrMaterialDatabyMaterialTypeMasterId(
        materialFilters
      );
      this.materialMasterData= this.materialLabourMasterData.filter(item => item.mlType === "MATERIAL");
      this.labourMasterData= this.materialLabourMasterData.filter(item => item.mlType == "LABOR");
      console.log("Material data master***",this.materialMasterData);

      console.log("this.labourMasterData data master***",this.labourMasterData);

  } 
  onMaterialLabourUpdate(): void {
    this.materialLabourForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        materialMasterId: this.materialLabourForm.value.materialMasterId,
        labourMasterId: this.materialLabourForm.value.labourMasterId,
        materialTypeMasterId: this.materialLabourForm.value.materialTypeMasterId,
        labourByDefault: this.materialLabourForm.value.labourByDefault,
      };
      this.configurationService
        .getMaterialLabourMappingUpdateData(
          this.filterData, 
          updateBody).then((response) => {
            console.log(" reponse messageText mat type  "+response.messageText);
            console.log(" reponse mat type  "+response);
            if(Response) {
            this.Service.sendUpdate('Material Labour Mapping Updated');
              if (this.notificationRef) {
                this.notificationRef.dismiss();
                this.notificationRef = null;
              }
              this.notificationRef = this.snackBar.open(response.messageText,
                'OK',
              {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              });
              this.notificationRef
              .afterDismissed()
              .toPromise()
              .then(() => {
                this.dialogRef.close();
              }).catch((error) => {
                console.error('Error closing dialog:', error);
              });
            } 
          });
    }
  }
  
  isValidForm(): boolean {
    this.materialLabourForm.markAllAsTouched();
    console.log('Form Valid?', this.materialLabourForm.valid);
    let hasError = false;
    Object.keys(this.materialLabourForm.controls).forEach((key) => {
      const control = this.materialLabourForm.get(key);
      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });
    if (hasError) {
      this.error = 'Please Fill Out Mandatory Fields';
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
