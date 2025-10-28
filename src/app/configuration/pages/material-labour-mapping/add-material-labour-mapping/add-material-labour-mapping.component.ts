import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
const materialLabourForm = new FormGroup({
  materialTypeMasterId: new FormControl('', [Validators.required]),
  materialMasterId: new FormControl('', [Validators.required]),
  labourMasterId: new FormControl('', [Validators.required]),
  labourByDefault: new FormControl('', [Validators.required]),
});

@Component({
  selector: 'app-add-material-labour-mapping',
  templateUrl: './add-material-labour-mapping.component.html',
  styleUrls: ['./add-material-labour-mapping.component.scss'],
})
export class AddMaterialLabourMappingComponent implements OnInit {
  notificationRef: any;
  materialData: any[] = [];
  materialMasterData: any[] = [];
  labourMasterData: any[] = [];
  materialLabourForm: FormGroup = materialLabourForm;
  error: string;
  materialLabourMasterData: any[] = [];

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any
  ) {
    dialogRef.disableClose = true;
    this.materialData = getAllData.field1;
  }
  ngOnInit(): void {
    console.log('comp');
    this.resetForm();
  }
  resetForm() {
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

  async getMaterialLabour() {
    //Materials_Labour_master-----materialMasterID
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');

    //const materialMlType = 'MATERIAL';
    const uniqueValues = {};
    const materialFilters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      materialTypeMasterId: this.materialTypeObj.materialTypeMasterId,
    };
    this.materialLabourMasterData =
      await this.configurationService.getSrMaterialDatabyMaterialTypeMasterId(
        materialFilters
      );
    this.materialMasterData = this.materialLabourMasterData.filter(
      (item) => item.mlType === 'MATERIAL'
    );
    this.labourMasterData = this.materialLabourMasterData.filter(
      (item) => item.mlType == 'LABOR'
    );
    console.log('Material data master***', this.materialMasterData);
    console.log('this.labourMasterData data master***', this.labourMasterData);
  }

  onAddMaterialLabour() {
    this.materialLabourForm.markAllAsTouched();
    if (this.isValidForm()) {
      if (
        this.materialTypeObj.materialTypeMasterId &&
        this.materialTypeObj.labourMasterId &&
        this.materialTypeObj.materialMasterId &&
        this.materialTypeObj.labourByDefault
      ) {
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

        this.configurationService
          .getMaterialLabourMappingSaveData(filters, this.materialTypeObj)
          .then((response) => {
            console.log(
              ' reponse messageText mat type  ' + response.messageText
            );
            console.log(' reponse mat type  ' + response);
            if (Response) {
              this.Service.sendUpdate('Material Labour Mapping Updated');
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
