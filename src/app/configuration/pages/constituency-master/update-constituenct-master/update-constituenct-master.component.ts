import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-constituenct-master',
  templateUrl: './update-constituenct-master.component.html',
  styleUrls: ['./update-constituenct-master.component.scss'],
})
export class UpdateConstituenctMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  constituencyTypes = [];
  constituencyId = [];
  districtData: any[] = [];
  constituencyTypeForm: FormGroup;
  constructor(
    private UpdateConstituenctMasterService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateConstituenctMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.constituencyTypes = this.getAllData.field1;
    this.constituencyId = this.getAllData.field3;
    this.districtData = this.getAllData.field4;

    this.constituencyTypeForm = new FormGroup({
      constituencyType: new FormControl('', [Validators.required]),
      districtId: new FormControl('', [Validators.required]),
      constituencyName: new FormControl('', [Validators.required]),
      constituencyCode: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const constituencyId = sessionStorage.getItem('constituency-Id');
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      constituencyId,
    };
    filters.constituencyId = this.getAllData.field3;
    this.filterData = { ...filters };
    this.getData =
      await this.UpdateConstituenctMasterService.getconstituencyMasterById(
        filters
      );
    console.log(' constituencyId get data by id', this.getData);
    this.getData.districtId = Number(this.getData.districtId);

    this.constituencyTypeForm.patchValue({
      constituencyType: this.getData.constituencyType,
      districtId: this.getData.districtId,
      constituencyName: this.getData.constituencyName,
      constituencyCode: this.getData.constituencyCode,
    });
  }

  onConstituentMaster() {
    this.constituencyTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        constituencyType: this.constituencyTypeForm.value.constituencyType,
        districtId: this.constituencyTypeForm.value.districtId,
        constituencyName: this.constituencyTypeForm.value.constituencyName,
        constituencyCode: this.constituencyTypeForm.value.constituencyCode,
      };

      this.UpdateConstituenctMasterService.getconstituencyMasterUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
          this.Service.sendUpdate('Constitueny Master Updated');
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }
          this.notificationRef = this.snackBar.open(response.messageText,
            'OK',
          {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
          this.Service.sendUpdate('Constituent Master Updated');
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
    this.constituencyTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.constituencyTypeForm.valid);
    let hasError = false;
    Object.keys(this.constituencyTypeForm.controls).forEach((key) => {
      const control = this.constituencyTypeForm.get(key);
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
