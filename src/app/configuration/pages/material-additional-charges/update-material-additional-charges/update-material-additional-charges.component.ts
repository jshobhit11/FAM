import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-material-additional-charges',
  templateUrl: './update-material-additional-charges.component.html',
  styleUrls: ['./update-material-additional-charges.component.scss'],
})
export class UpdateMaterialAdditionalChargesComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: MatSnackBarRef<any>;
  materialIDName = [];
  chargeTypes = [];
  uniquevalueCalculatedByMaterial = ['1', '0'];
  uniquevalueCalculatedByLabour = ['1', '0'];
  uniquedisplayByDefault = ['1', '0'];
  uniquevalueCalculatedByTotalLabour = ['1', '0'];
  estimationAdditionalChargesId = [];
  selectedExeMethod: any;
  selectedExeMethodId: any;
  materialAdditionalForm: FormGroup;
  error: string;
  additionalData:any[]=[]
  constructor(
    private UpdateMaterialAdditionalService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateMaterialAdditionalChargesComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.materialIDName = getAllData.field1;
    this.chargeTypes = getAllData.field2;
    this.estimationAdditionalChargesId = getAllData.field3;
    this.selectedExeMethod = getAllData.field8;
    this.additionalData =getAllData.field9;
    this.selectedExeMethodId = Number(
      this.selectedExeMethod.woExecutionMethodId
    );
    this.materialAdditionalForm = new FormGroup({
      woExecutionMethodId: new FormControl('', [Validators.required]),
      additionalChargeName: new FormControl('', [Validators.required]),
      chargeType: new FormControl('', [Validators.required]),
      chargeTypeValue: new FormControl('', [Validators.required]),
      chargesSequenceOrder: new FormControl('', [Validators.required]),
      valueCalculatedByMaterial: new FormControl('', [Validators.required]),
      valueCalculatedByLabour: new FormControl('', [Validators.required]),
      displayByDefault: new FormControl('', [Validators.required]),
      valueCalculatedByTotalLabour: new FormControl('', [Validators.required]),
      estimationAdditionalChargesId: new FormControl('',[Validators.required]),
      additionalChargesMasterId:new FormControl('',[Validators.required]),
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const estimationAdditionalChargesId = sessionStorage.getItem(
      'estimation-additional-charges-Id'
    );
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      estimationAdditionalChargesId,
    };
    filters.estimationAdditionalChargesId = this.getAllData.field3;
    this.filterData = { ...filters };
    this.getData =
      await this.UpdateMaterialAdditionalService.getMaterialAdditionalChargesById(
        this.filterData
      );
    console.log('materialAdditionalForm', this.materialAdditionalForm.value);
    console.log(
      'estimationAddiotionalChargesMasterId get data by id',
      this.getData
    );
    if (this.getData.valueCalculatedByTotalLabour === 'null')
      this.getData.valueCalculatedByTotalLabour === '0';
    this.materialAdditionalForm.patchValue({
      woExecutionMethodId: this.selectedExeMethodId,
      additionalChargeName: this.getData.additionalChargeName,
      chargeType: this.getData.chargeType,
      chargeTypeValue: this.getData.chargeTypeValue,
      chargesSequenceOrder: this.getData.chargesSequenceOrder,
      valueCalculatedByMaterial: this.getData.valueCalculatedByMaterial,
      valueCalculatedByLabour: this.getData.valueCalculatedByLabour,
      displayByDefault: this.getData.displayByDefault,
      valueCalculatedByTotalLabour: this.getData.valueCalculatedByTotalLabour,
      estimationAdditionalChargesId: parseInt(this.getData.additionalChargesMasterId),
    });
    const defaultAdditionalChargeId = parseInt(this.getData.additionalChargesMasterId);
    const defaultAdditionalCharge = this.additionalData.find(
      (charge) => charge.additionalChargesMasterId === defaultAdditionalChargeId
    );
    if (defaultAdditionalCharge) {
      this.materialAdditionalForm.patchValue({
        additionalChargesMasterId: defaultAdditionalCharge.additionalChargesMasterId,
      });
    }
    console.log('materialAdditionalForm', this.materialAdditionalForm.value);
    console.log('uniquedisplayByDefault==', this.uniquedisplayByDefault);
    console.log('additional data==', this.additionalData);
  }

  onUpdate() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const estimationAddiotionalChargesMasterId =
      this.estimationAdditionalChargesId;
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      estimationAddiotionalChargesMasterId,
    };
    this.materialAdditionalForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        woExecutionMethodId: this.selectedExeMethodId,
        additionalChargeName:
          this.materialAdditionalForm.value.additionalChargeName,
        chargeType: this.materialAdditionalForm.value.chargeType,
        chargeTypeValue: this.materialAdditionalForm.value.chargeTypeValue,
        chargesSequenceOrder:
          this.materialAdditionalForm.value.chargesSequenceOrder,
        valueCalculatedByMaterial: Number(
          this.materialAdditionalForm.value.valueCalculatedByMaterial
        ),
        valueCalculatedByLabour: Number(
          this.materialAdditionalForm.value.valueCalculatedByLabour
        ),
        displayByDefault: Number(
          this.materialAdditionalForm.value.displayByDefault
        ),
        valueCalculatedByTotalLabour: Number(
          this.materialAdditionalForm.value.valueCalculatedByTotalLabour
        ),
        additionalChargesMasterId: Number(
          this.materialAdditionalForm.value.additionalChargesMasterId
        )
      };

      console.log('updateBody==', updateBody);
      updateBody.chargeTypeValue = parseFloat(updateBody.chargeTypeValue);
      this.UpdateMaterialAdditionalService.getMaterialAdditionalChargesUpdate(
        filters,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
          this.Service.sendUpdate('Material additional Charges Updated');
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
  formatValue(value: number): string {
    return value === 0 ? 'No' : 'Yes';
  }
  
  selectedExecutionMethod(executionId) {
    console.log('executionId', executionId);
    this.selectedExeMethodId = executionId;
  }
  onValueCalculatedByLabourChange() {
    // If Value Calculated by Labour is set to "No," automatically set Value Calculated by Total Labour to "No" as well
    if (this.getData.valueCalculatedByLabour === '0') {
      this.getData.valueCalculatedByTotalLabour = '0';
    }
  }
  isValidForm(): boolean {
    this.materialAdditionalForm.markAllAsTouched();
    console.log('Form Valid?', this.materialAdditionalForm.valid);
    let hasError = false;
    Object.keys(this.materialAdditionalForm.controls).forEach((key) => {
      const control = this.materialAdditionalForm.get(key);
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
