import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-deviation-type-master',
  templateUrl: './update-deviation-type-master.component.html',
  styleUrls: ['./update-deviation-type-master.component.scss'],
})
export class UpdateDeviationTypeMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  deviationTypeForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public deviationTypeMasterId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateDeviationTypeMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.deviationTypeForm = new FormGroup({
      deviationType: new FormControl('', [Validators.required]),
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
    filters.deviationTypeMasterId = this.deviationTypeMasterId;
    this.filterData = { ...filters };
    this.getData =
      await this.configurationService.getDeviationTypeMasterDataById(filters);
    console.log(' Deviation get data by id', this.getData);
    this.deviationTypeForm.patchValue({
      deviationType: this.getData.deviationType,
    });
  }

  onDeviationUpdate() {
    this.deviationTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        deviationType: this.deviationTypeForm.value.deviationType,
      };
      let result = this.configurationService.getDeviationTypeMasterUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
        this.Service.sendUpdate('Deviation Type Updated');
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
    this.deviationTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.deviationTypeForm.valid);
    let hasError = false;
    Object.keys(this.deviationTypeForm.controls).forEach((key) => {
      const control = this.deviationTypeForm.get(key);
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
