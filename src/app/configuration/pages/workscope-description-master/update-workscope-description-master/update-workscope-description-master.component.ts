import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-workscope-description-master',
  templateUrl: './update-workscope-description-master.component.html',
  styleUrls: ['./update-workscope-description-master.component.scss'],
})
export class UpdateWorkscopeDescriptionMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  workTypeApplicables = [];
  estimateData: any[] = [];
  workscopeDescMasterId = [];
  workScopeTypeForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateWorkscopeDescriptionMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.workTypeApplicables = getAllData.field1;
    this.estimateData = getAllData.field3;
    this.workscopeDescMasterId = getAllData.field2;

    this.workScopeTypeForm = new FormGroup({
      workscopeDescription: new FormControl('', [Validators.required]),
      workscopeDescCode: new FormControl('', [Validators.required]),
      workTypeApplicable: new FormControl('', [Validators.required]),
      estimateType: new FormControl('', [Validators.required]),
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
    filters.workscopeDescMasterId = this.getAllData.field2;
    console.log('filters.workscopeDescMasterId', filters.workscopeDescMasterId);
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getWorkscopeDesMasterGetById(
      filters
    );
    console.log(' workscope get data by id', this.getData);
    this.workScopeTypeForm.patchValue({
      workscopeDescription: this.getData.workscopeDescription,
      workscopeDescCode: this.getData.workscopeDescCode,
      workTypeApplicable: this.getData.workTypeApplicable,
      estimateType: this.getData.estimateType,
    });
  }
  onWorkscopeUpdate() {
    this.workScopeTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        workscopeDescription: this.workScopeTypeForm.value.workscopeDescription,
        workscopeDescCode: this.workScopeTypeForm.value.workscopeDescCode,
        workTypeApplicable: this.workScopeTypeForm.value.workTypeApplicable,
        estimateType: this.workScopeTypeForm.value.estimateType,
      };
      let result = this.configurationService.getWorkscopeDesMasterUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
        this.Service.sendUpdate('Workscope Des Type Updated');
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

  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
  isValidForm(): boolean {
    this.workScopeTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.workScopeTypeForm.valid);
    let hasError = false;
    Object.keys(this.workScopeTypeForm.controls).forEach((key) => {
      const control = this.workScopeTypeForm.get(key);
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
