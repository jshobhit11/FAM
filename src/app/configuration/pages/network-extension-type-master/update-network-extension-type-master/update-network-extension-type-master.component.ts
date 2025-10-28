import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-network-extension-type-master',
  templateUrl: './update-network-extension-type-master.component.html',
  styleUrls: ['./update-network-extension-type-master.component.scss'],
})
export class UpdateNetworkExtensionTypeMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  networkExtensionTypeForm: FormGroup;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public NetworkExtensionId: any,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateNetworkExtensionTypeMasterComponent>
  ) {
    dialogRef.disableClose = true;
    this.networkExtensionTypeForm = new FormGroup({
      networkExtensionTypeName: new FormControl('', [Validators.required]),
      networkExtensionTypeCode: new FormControl('', [Validators.required]),
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
    filters.networkId = this.NetworkExtensionId;
    this.filterData = { ...filters };
    this.getData =
      await this.configurationService.getNetworkExtensionTypeDataById(filters);
    console.log('Network Extension type get data by id', this.getData);
    this.networkExtensionTypeForm.patchValue({
      networkExtensionTypeName: this.getData.networkExtensionTypeName,
      networkExtensionTypeCode: this.getData.networkExtensionTypeCode,
    });
  }

  onNetworkType() {
    this.networkExtensionTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        networkExtensionTypeName:
          this.networkExtensionTypeForm.value.networkExtensionTypeName,
        networkExtensionTypeCode:
          this.networkExtensionTypeForm.value.networkExtensionTypeCode,
      };
      let result = this.configurationService.getNetworkExtensionTypeUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
        this.Service.sendUpdate('Network Extension Type Updated');
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
    this.networkExtensionTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.networkExtensionTypeForm.valid);
    let hasError = false;
    Object.keys(this.networkExtensionTypeForm.controls).forEach((key) => {
      const control = this.networkExtensionTypeForm.get(key);
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
