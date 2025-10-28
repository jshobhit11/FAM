import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-connection-nature-master',
  templateUrl: './update-connection-nature-master.component.html',
  styleUrls: ['./update-connection-nature-master.component.scss'],
})
export class UpdateConnectionNatureMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  categoryMasterIds: any[] = [];
  connectionNatureId = [];
  categoryMasterData: any[] = [];
  connectionNatureForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateConnectionNatureMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.categoryMasterData = getAllData.field1;
    this.connectionNatureId = getAllData.field2;

    this.connectionNatureForm = new FormGroup({
      connectionNatureName: new FormControl('', [Validators.required]),
      connectionNatureCode: new FormControl('', [Validators.required]),
      categoryMasterId: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const connectionNatureId = sessionStorage.getItem('estimate-Id');
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      connectionNatureId,
    };
    filters.connectionNatureId = this.getAllData.field2;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getConnectionNatureDataById(
      filters
    );
    console.log(' connectionNatureId get data by id', this.getData);

    this.connectionNatureForm.patchValue({
      connectionNatureName: this.getData.connectionNatureName,
      connectionNatureCode: this.getData.connectionNatureCode,
      categoryMasterId: Number(this.getData.categoryMasterId),
    });
  }

  onConnectionNatureUpdate() {
    this.connectionNatureForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        connectionNatureName:
          this.connectionNatureForm.value.connectionNatureName,
        connectionNatureCode:
          this.connectionNatureForm.value.connectionNatureCode,
        categoryMasterId: this.connectionNatureForm.value.categoryMasterId,
      };

      let result =
        this.configurationService.getConnectionNatureMasterUpdateData(
          this.filterData,
          updateBody
        ).then((response) => {
          console.log(" reponse messageText mat type  "+response.messageText);
          console.log(" reponse mat type  "+response);
          if(Response) {
          this.Service.sendUpdate('Connection Nature Updated');
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
    this.connectionNatureForm.markAllAsTouched();
    console.log('Form Valid?', this.connectionNatureForm.valid);
    let hasError = false;
    Object.keys(this.connectionNatureForm.controls).forEach((key) => {
      const control = this.connectionNatureForm.get(key);
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
