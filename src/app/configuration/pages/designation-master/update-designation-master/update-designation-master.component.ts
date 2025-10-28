import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-designation-master',
  templateUrl: './update-designation-master.component.html',
  styleUrls: ['./update-designation-master.component.scss'],
})
export class UpdateDesignationMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  designationTypes = [];
  reportingDesigName = [];
  designationMasterId = [];
  updateId: any;
  allData: any[] = [];
  reportingName: any;
  selectOffice: any;
  selectedOfficeTypeId: any;
  designationTypeForm: FormGroup;
  error: string;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateDesignationMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.reportingDesigName = getAllData.field1;
    this.designationMasterId = getAllData.field2;
    this.allData = getAllData.field3;
    this.selectOffice = getAllData.field5;

    this.selectedOfficeTypeId = this.selectOffice.officeTypeName;

    this.designationTypeForm = new FormGroup({
      designationName: new FormControl('', [Validators.required]),
      designationCode: new FormControl('', [Validators.required]),
      reportingDesigId: new FormControl('', [Validators.required]),
      officeType: new FormControl('', [Validators.required]),
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
    filters.designationMasterId = this.getAllData.field2;
    console.log('getalldata', this.getAllData);
    this.filterData = { ...filters };

    this.configurationService
      .DesignationMasterGetDataById(filters)
      .then((data) => {
        this.getData = data;

        for (var i = 0; i < this.allData.length; i++) {
          if (this.getAllData.field2 == this.allData[i].designationMasterId) {
            this.reportingName = this.allData[i].reportingDesigName;
          }
        }
        for (var i = 0; i < this.allData.length; i++) {
          if (this.reportingName == this.allData[i].designationName) {
            this.updateId = this.allData[i].designationMasterId;
          }
        }
        console.log('Designation Master get data by id', this.getData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    this.selectedOfficeTypeId =
      this.selectedOfficeTypeId !== 'null' ? this.selectedOfficeTypeId : null;
    await this.configurationService.getDesignationMasterGetAllData(filters);

    const associatedDesgName = this.reportingDesigName.find(
      (item) => item.reportingId === this.getData.reportingDesigId
    )?.desgName;

    const reportingIdWithDoubleQuotes = this.getData.reportingDesigId;

    const reportingIdWithoutQuotes = reportingIdWithDoubleQuotes.replace(
      /["']/g,
      ''
    );

    this.designationTypeForm.patchValue({
      designationName: this.getData.designationName,
      designationCode: this.getData.designationCode,
      reportingDesigId: reportingIdWithoutQuotes,
      officeType: this.getData.officeType,
    });
    console.log('designationTypeForm==', this.designationTypeForm.value);
  }

  onUpdateDesignationMaster() {
    this.designationTypeForm.markAllAsTouched();
    if (this.isValidForm()) {
      for (var i = 0; i < this.allData.length; i++) {
        if (this.reportingName == this.allData[i].designationName) {
          this.updateId = this.allData[i].designationMasterId;
        }
      }
      const updateBody = {
        designationMasterId: this.getAllData.field2,
        designationName: this.designationTypeForm.value.designationName,
        designationCode: this.designationTypeForm.value.designationCode,
        reportingDesigId: this.designationTypeForm.value.reportingDesigId,
        officeType: this.designationTypeForm.value.officeType,
      };

      let result = this.configurationService.getUpdateDesignationMasterData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  "+response.messageText);
        console.log(" reponse mat type  "+response);
        if(Response) {
        this.Service.sendUpdate('Designation Master Updated');
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

  selectedOfficeTypeMaster(officeId) {
    console.log('officeId', officeId);
    this.selectedOfficeTypeId = officeId;
  }
  onValueCalculatedByLabourChange() {
    if (this.getData.valueCalculatedByLabour === '0') {
      this.getData.valueCalculatedByTotalLabour = '0';
    }
  }
  isValidForm(): boolean {
    this.designationTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.designationTypeForm.valid);
    let hasError = false;
    Object.keys(this.designationTypeForm.controls).forEach((key) => {
      const control = this.designationTypeForm.get(key);
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
