import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-connection-type-master',
  templateUrl: './update-connection-type-master.component.html',
  styleUrls: ['./update-connection-type-master.component.scss'],
})
export class UpdateConnectionTypeMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  connectionTypeForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public connectionTypeId: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateConnectionTypeMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.connectionTypeForm = new FormGroup({
      connectionTypeName: new FormControl('', [Validators.required]),
      connectionTypeCode: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const connectionTypeId = sessionStorage.getItem('estimate-Id');
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      connectionTypeId,
    };
    filters.connectionTypeId = this.connectionTypeId;
    console.log('filters.connectionTypeId', filters.connectionTypeId);
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getConnectionTypeDataById(
      filters
    );
    console.log(' connection Type get data by id', this.getData);

    this.connectionTypeForm.patchValue({
      connectionTypeName: this.getData.connectionTypeName,
      connectionTypeCode: this.getData.connectionTypeCode,
    });
  }

  onConnectionUpdate() {
    this.connectionTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        connectionTypeName: this.connectionTypeForm.value.connectionTypeName,
        connectionTypeCode: this.connectionTypeForm.value.connectionTypeCode,
      };

      let result = this.configurationService.getConnectionTypeMasterUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
        this.Service.sendUpdate('Connection Type Updated');
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
    this.connectionTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.connectionTypeForm.valid);
    let hasError = false;
    Object.keys(this.connectionTypeForm.controls).forEach((key) => {
      const control = this.connectionTypeForm.get(key);
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
