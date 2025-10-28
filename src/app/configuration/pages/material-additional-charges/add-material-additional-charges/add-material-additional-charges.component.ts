import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-add-material-additional-charges',
  templateUrl: './add-material-additional-charges.component.html',
  styleUrls: ['./add-material-additional-charges.component.scss'],
})
export class AddMaterialAdditionalChargesComponent implements OnInit {
  selectedExecutionMethod: string;
  notificationRef: any;
  materialIDName = [];
  chargeTypes = [];
  materialAddlCharges = [];
  materialAdditionalForm: FormGroup;
  error: string;
  additionalData: any[] = [];

  constructor(
    private configureService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any
  ) {
    dialogRef.disableClose = true;
    this.materialIDName = getAllData.field1;
    console.log(' this.materialIDName====', this.materialIDName);

    this.chargeTypes = getAllData.field2;

    console.log(' this.chargeTypes====', this.chargeTypes);

    this.additionalData = getAllData.field4;
  }
  populateChargeSequence(event: MatSelectChange) {
    const selectedChargeId = event.value;
    const selectedCharge = this.additionalData.find(
      (charge) => charge.additionalChargesName === selectedChargeId
    );
    if (selectedCharge) {
      this.materialAdditionalObj.additionalChargesMasterId =
        selectedCharge.additionalChargesMasterId;
      console.log('Selected Charge:', selectedCharge.additionalChargesName);
      this.materialAdditionalForm.patchValue({
        chargesSequence: selectedCharge.chargesSequenceOrder,
      });
    }
  }

  ngOnInit(): void {
    console.log('comp');
    this.resetForm();
  }
  resetForm() {
    this.materialAdditionalForm = new FormGroup({
      woExecutionMethod: new FormControl('', [Validators.required]),
      additionalCharge: new FormControl('', [Validators.required]),
      chargesSequence: new FormControl('', [Validators.required]),
      valueCalculatedLabour: new FormControl('', [Validators.required]),
      valueCalculatedTotalLabour: new FormControl('', [Validators.required]),
      chargeType: new FormControl('', [Validators.required]),
      chargeTypeValue: new FormControl('', [Validators.required]),
      valueCalculatedMaterial: new FormControl('', [Validators.required]),
      displayDefault: new FormControl('', [Validators.required]),
    });
  }
  handleChargeTypeChange(chargeType: string) {
    if (chargeType === 'PERCENTAGE') {
      this.materialAdditionalForm
        .get('woExecutionMethod')
        .setValidators([Validators.required]);
      this.materialAdditionalForm
        .get('chargeType')
        .setValidators([Validators.required]);
      this.materialAdditionalForm
        .get('additionalCharge')
        .setValidators([Validators.required]);
      this.materialAdditionalForm
        .get('chargesSequence')
        .setValidators([Validators.required]);
      this.materialAdditionalForm
        .get('valueCalculatedMaterial')
        .setValidators([Validators.required]);
      this.materialAdditionalForm
        .get('valueCalculatedLabour')
        .setValidators([Validators.required]);
      this.materialAdditionalForm
        .get('displayDefault')
        .setValidators([Validators.required]);
      this.materialAdditionalForm
        .get('valueCalculatedTotalLabour')
        .setValidators([Validators.required]);
      this.materialAdditionalForm
        .get('chargeTypeValue')
        .setValidators([Validators.required]);
    } else {
      this.materialAdditionalForm
        .get('valueCalculatedLabour')
        .clearValidators();
      this.materialAdditionalForm
        .get('valueCalculatedTotalLabour')
        .clearValidators();
      this.materialAdditionalForm
        .get('valueCalculatedMaterial')
        .clearValidators();
      this.materialAdditionalForm.get('chargeTypeValue').clearValidators();

      this.materialAdditionalForm
        .get('valueCalculatedLabour')
        .updateValueAndValidity();
      this.materialAdditionalForm
        .get('valueCalculatedTotalLabour')
        .updateValueAndValidity();
      this.materialAdditionalForm
        .get('valueCalculatedMaterial')
        .updateValueAndValidity();
      this.materialAdditionalForm
        .get('chargeTypeValue')
        .updateValueAndValidity();
    }
    this.materialAdditionalForm.updateValueAndValidity();
  }
  materialAdditionalObj = {
    additionalChargesMasterId: '',
    woExecutionMethodId: '',
    additionalChargeName: '',
    chargeType: '',
    chargeTypeValue: '',
    chargesSequenceOrder: '',
    valueCalculatedByMaterial: '',
    valueCalculatedByLabour: '',
    displayByDefault: '',
    valueCalculatedByTotalLabour: '',
  };

  onadditionalchargeAdd() {
    this.materialAdditionalForm.markAllAsTouched();
    if (this.isValidForm()) {
      if (
        this.materialAdditionalObj.chargesSequenceOrder &&
        this.materialAdditionalObj.additionalChargeName
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

        this.configureService
          .getMaterialAdditionalChargesSaveData(
            filters,
            this.materialAdditionalObj
          )
          .then((response) => {
            console.log(
              ' reponse messageText mat type  ' + response.messageText
            );
            console.log(' reponse mat type  ' + response);
            if (Response) {
              this.Service.sendUpdate('Material additional Charges Updated');
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
      } else {
        alert('Please fill in all the required fields.');
      }
    }
  }

  onValueCalculatedByLabourChange() {
    if (this.materialAdditionalObj.valueCalculatedByLabour === '0') {
      this.materialAdditionalObj.valueCalculatedByTotalLabour = '0';
    }
  }
  isValidForm(): boolean {
    this.materialAdditionalForm.markAllAsTouched();
    console.log('Form Valid?', this.materialAdditionalForm.valid);
    let hasError = false;
    Object.keys(this.materialAdditionalForm.controls).forEach((key) => {
      const control = this.materialAdditionalForm.get(key);
      if (control && (control.invalid || control.untouched)) {
        console.log('Invalid Control:', key);
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
