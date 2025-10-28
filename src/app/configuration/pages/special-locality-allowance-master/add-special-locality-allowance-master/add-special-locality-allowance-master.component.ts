import { Component, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
const specialLocalityForm = new FormGroup({
  district: new FormControl('', [Validators.required]),
  percentage: new FormControl('', [Validators.required]),
});
import * as _ from 'lodash';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});
@Component({
  selector: 'app-add-special-locality-allowance-master',
  templateUrl: './add-special-locality-allowance-master.component.html',
  styleUrls: ['./add-special-locality-allowance-master.component.scss'],
})
export class AddSpecialLocalityAllowanceMasterComponent {
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selected: any;
  label: string[] = [];
  id: any[] = [];
  notificationRef: any;
  districtData: any[] = [];
  specialLocalityForm: FormGroup = specialLocalityForm;
  error: string;
  specialLocalityObj = {
    officeId: '',
    districtId: '',
    percentageValue: '',
  };

  constructor(
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any
  ) {
    dialogRef.disableClose = true;
    this.nodes = getAllData.field3;
    this.districtData = getAllData.field4;
  }
  ngOnInit(): void {
    console.log('comp');
    this.resetForm();
  }
  resetForm() {
    this.specialLocalityForm = new FormGroup({
      district: new FormControl('', [Validators.required]),
      percentage: new FormControl('', [Validators.required]),
    });
  }

  onAddSpecialLocalityType() {
    this.specialLocalityForm.markAllAsTouched();
    console.log('form ', this.specialLocalityForm.value);
    console.log('Form2', this.treeForm.value);

    if (this.isValidForm()) {
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

      const obj = {
        districtId: this.specialLocalityForm.value.district,
        percentageValue: Number(this.specialLocalityForm.value.percentage),
        officeId: Number(this.treeForm.value.selectedNodes.officeMasterId),
      };

      this.configurationService.getSpecialLocalitySaveData(
        filters, 
        obj).then((response) => {
          console.log(" reponse messageText mat type  "+response.messageText);
          console.log(" reponse mat type  "+response);
          //return;
          if (response) {
            this.Service.sendUpdate('Special Locality Updated');
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
  
  nodeSelect(node: any) {
    this.label = [node.label];
    this.id = [node.officeMasterId];
    console.log('node===' + this.label + '===' + this.id);
  }

  nodeUnselect() {
    this.reset();
  }
  reset() {
    this.rows = this.data;
    this.treeControl.setValue(this.nodes);
  }

  isValidForm(): boolean {
    this.specialLocalityForm.markAllAsTouched();
    console.log('Form Valid?', this.specialLocalityForm.valid);
    let hasError = false;
    Object.keys(this.specialLocalityForm.controls).forEach((key) => {
      const control = this.specialLocalityForm.get(key);

      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });

    if (hasError) {
      this.error = 'Please Fill Out Mandatory Fields';
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
