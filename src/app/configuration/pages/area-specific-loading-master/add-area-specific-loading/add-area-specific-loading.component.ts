import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-add-area-specific-loading',
  templateUrl: './add-area-specific-loading.component.html',
  styleUrls: ['./add-area-specific-loading.component.scss'],
})
export class AddAreaSpecificLoadingComponent implements OnInit {
  notificationRef: any;
  error: any = '';
  areaSpecificForm: FormGroup;

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
  }

  ngOnInit(): void {
    console.log('comp');
    this.areaSpecificForm = this.formBuilder.group({
      chargesCategory: ['', [Validators.required]],
      chargesPercentage: ['', [Validators.required, Validators.pattern(/^(\d{1,2}(\.\d{1,2})?|100)$/)]],
    });
  }

  areaSpecificLoaderObj = {
    chargesCategory: '',
    chargesPercentage: '',
  };

  onAreaSpecificLoader() {
    Object.keys(this.areaSpecificForm.controls).forEach((key) => {
      this.areaSpecificForm.get(key)?.markAsTouched();
    });
    if (this.areaSpecificForm.valid) {
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
        chargesCategory: this.areaSpecificForm.value.chargesCategory,
        chargesPercentage: this.areaSpecificForm.value.chargesPercentage,
      };

      this.configurationService.getAreaSpecificLoaderSaveData(filters, reqBody);
      this.Service.sendUpdate('Area specific loader updated');
      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }
      this.notificationRef = this.snackBar.open(
        'Area Specific Loader Master Added Successfully',
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
    if (
      this.areaSpecificForm.get('chargesCategory').invalid ||
      this.areaSpecificForm.get('chargesPercentage').invalid
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
