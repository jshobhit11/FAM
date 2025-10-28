import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-connection-nature-master',
  templateUrl: './add-connection-nature-master.component.html',
  styleUrls: ['./add-connection-nature-master.component.scss'],
})
export class AddConnectionNatureMasterComponent implements OnInit {
  notificationRef: any;
  categoryMasterIds: any[] = [];
  categoryMasterData: any[] = [];
  connectionNatureForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.categoryMasterData = getAllData.field1;
  }

  ngOnInit(): void {
    console.log('comp');
    this.connectionNatureForm = this.formBuilder.group({
      connectionNatureName: ['', Validators.required],
      connectionNatureCode: ['', Validators.required],
      categoryMasterId: ['', Validators.required],
    });
  }

  onAddConnectionType() {
    Object.keys(this.connectionNatureForm.controls).forEach((key) => {
      this.connectionNatureForm.get(key)?.markAsTouched();
    });
    if (this.connectionNatureForm.valid) {
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
        connectionNatureName:
          this.connectionNatureForm.value.connectionNatureName,
        connectionNatureCode:
          this.connectionNatureForm.value.connectionNatureCode,
        categoryMasterId: this.connectionNatureForm.value.categoryMasterId,
      };
      this.configurationService
        .getConnectionNatureMasterSaveData(filters, reqBody)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (Response) {
            this.Service.sendUpdate('Connection Nature Updated');
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

  isValidForm(): boolean {
    if (
      this.connectionNatureForm.get('connectionNatureName').invalid ||
      this.connectionNatureForm.get('connectionNatureCode').invalid ||
      this.connectionNatureForm.get('categoryMasterId')
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
