import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-material-unit',
  templateUrl: './update-material-unit.component.html',
  styleUrls: ['./update-material-unit.component.scss'],
})
export class UpdateMaterialUnitComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  materialUnitForm: FormGroup;
  error: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public materialUnitId: any,
    private materialUnitMasterService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateMaterialUnitComponent>
  ) {
    dialogRef.disableClose = true;
    this.materialUnitForm = new FormGroup({
      materialUnit: new FormControl('', [Validators.required]),
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
    filters.materialUnitMasterId = this.materialUnitId;
    this.filterData = { ...filters };
    this.getData =
      await this.materialUnitMasterService.getMaterialUnitMasterById(filters);

    this.materialUnitForm.patchValue({
      materialUnit: this.getData.materialUnit,
    });
    console.log('update material unit get data by id', this.getData);
  }

  onMaterialUnitUpdate() {
    this.materialUnitForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        materialUnit: this.materialUnitForm.value.materialUnit,
      };
      this.materialUnitMasterService.getupdateMaterialUnitById(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
          this.Service.sendUpdate('Material Unit Updated');
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }
            this.notificationRef = this.snackBar.open(response.messageText,
            'OK',
            {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            }
          );
          this.notificationRef.afterDismissed().toPromise().then(() => {
            this.dialogRef.close();
            }).catch((error) => {
            console.error('Error closing dialog:', error);
            });
          }
        });
    }
  }

  isValidForm(): boolean {
    this.materialUnitForm.markAllAsTouched();
    console.log('Form Valid?', this.materialUnitForm.valid);
    let hasError = false;
    Object.keys(this.materialUnitForm.controls).forEach((key) => {
      const control = this.materialUnitForm.get(key);
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
