import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-constituenct-master',
  templateUrl: './add-constituenct-master.component.html',
  styleUrls: ['./add-constituenct-master.component.scss'],
})
export class AddConstituenctMasterComponent implements OnInit {
  notificationRef: any;
  constituencyTypes = [];
  myForm: FormGroup;
  selectedDistValue: string;
  districtData: any[] = [];
  constituencyTypeForm: FormGroup;
  error: any = '';
  constructor(
    private configureService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.constituencyTypes = getAllData.field1;
    this.districtData = getAllData.field4;
  }

  ngOnInit(): void {
    console.log('comp');
    this.constituencyTypeForm = this.formBuilder.group({
      constituencyType: ['', [Validators.required]],
      districtId: ['', [Validators.required]],
      constituencyName: ['', [Validators.required]],
      constituencyCode: ['', [Validators.required]],
    });
  }

  constituenctObj = {
    constituencyType: '',
    constituencyName: '',
    constituencyCode: '',
    districtId: '',
  };

  onConstituenctAdd() {
    Object.keys(this.constituencyTypeForm.controls).forEach((key) => {
      this.constituencyTypeForm.get(key)?.markAsTouched();
    });
    if (this.constituencyTypeForm.valid) {
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

      const reqBody = {
        constituencyType: this.constituencyTypeForm.value.constituencyType,
        districtId: this.constituencyTypeForm.value.districtId,
        constituencyName: this.constituencyTypeForm.value.constituencyName,
        constituencyCode: this.constituencyTypeForm.value.constituencyCode,
      };

      this.configureService
        .getconstituencyMasterSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Constitueny Master Updated');
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
            this.Service.sendUpdate('Constituent Master Updated');
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
    }
  }

  onDistrictSelected(selectedId: string) {
    this.selectedDistValue = selectedId;
  }

  isValidForm(): boolean {
    if (
      this.constituencyTypeForm.get('constituencyType').invalid ||
      this.constituencyTypeForm.get('districtId').invalid
    ) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
