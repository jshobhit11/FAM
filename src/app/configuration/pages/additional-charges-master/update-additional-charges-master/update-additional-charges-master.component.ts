import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-additional-charges-master',
  templateUrl: './update-additional-charges-master.component.html',
  styleUrls: ['./update-additional-charges-master.component.scss'],
})
export class UpdateAdditionalChargesMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  dataSource: any;
  error: string;
  additionalChargesForm: FormGroup;

  constructor(
    private additionalChargesMasterService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public additionalChargesMasterId: any,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateAdditionalChargesMasterComponent>
  ) {
    this.additionalChargesForm = new FormGroup({
      additionalChargesName: new FormControl('', [Validators.required]),
      additionalChargesCode: new FormControl('', [Validators.required]),
      chargesSequenceOrder: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
      ]),
    });
  }

  async ngOnInit() {
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
      additionalChargesMasterId: this.additionalChargesMasterId,
    };
    this.filterData = { ...filters };
    this.getData =
      await this.additionalChargesMasterService.getAdditionalChargesDataByID(
        this.filterData
      );
    console.log('Update Addition Charges get data by id', this.getData);
    this.additionalChargesForm.patchValue({
      additionalChargesName: this.getData.additionalChargesName,
      additionalChargesCode: this.getData.additionalChargesCode,
      chargesSequenceOrder: this.getData.chargesSequenceOrder,
    });
  }

  async onUpdate() {
    if (!this.isValidForm()) {
      return;
    }

    const updateBody = {
      additionalChargesName:
        this.additionalChargesForm.value.additionalChargesName,
      additionalChargesCode:
        this.additionalChargesForm.value.additionalChargesCode,
      chargesSequenceOrder:
        this.additionalChargesForm.value.chargesSequenceOrder,
    };

    console.log('updateBodyupdateBodyupdateBody====', updateBody);

    try {
      const response =
        await this.additionalChargesMasterService.updateAdditionalChargesDATA(
          this.filterData,
          updateBody
        );
      this.Service.sendUpdate('Additional Charges Master Updated');
      if (response) {
        this.Service.sendUpdate('Additional Charges Updated');
        if (this.notificationRef) {
          this.notificationRef.dismiss();
          this.notificationRef = null;
        }
        this.notificationRef = this.snackBar.open(response.messageText, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
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
    } catch (error) {
      console.error('Error updating additional charges:', error);
    }
  }

  isValidForm(): boolean {
    this.additionalChargesForm.markAllAsTouched();
    const isValid = this.additionalChargesForm.valid;
    if (!isValid) {
      this.error = 'Please Fill Out Mandatory Fields';
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
