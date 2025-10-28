import { Component, Input, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
const rateContractForm = new FormGroup({
  vendMaster: new FormControl('', [Validators.required]),
  vendName: new FormControl('', [Validators.required]),
  rCode: new FormControl('', [Validators.required]),
  exeMethod: new FormControl('', [Validators.required]),
  rWorkDesc: new FormControl('', [Validators.required]),
  cosigne: new FormControl('', [Validators.required]),
  discom: new FormControl('', [Validators.required]),
  rcValidity: new FormControl('', [Validators.required]),
});
import * as _ from 'lodash';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});
@Component({
  selector: 'app-add-rate-contract-master',
  templateUrl: './add-rate-contract-master.component.html',
  styleUrls: ['./add-rate-contract-master.component.scss'],
})
export class AddRateContractMasterComponent implements OnInit {
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selected: any;
  label: string[] = [];
  id: any[] = [];
  notificationRef: any;
  vendorTypes: any;
  uniqueVendorData: any[] = [];
  selectedVendorId: number;
  vendorData: any[] = [];
  vendorId: number;
  applicableAreas: any[] = [];
  rateContractForm: FormGroup = rateContractForm;
  DiscomData: any[] = [];
  error: string;
  selectedDiscom: number;
  contractTypeObj = {
    applicableAreas: '',
    vendorId: '',
    rcVendorName: '',
    rcCode: '',
    rcValidity: '',
    executionMethod: '',
    rcWorkDescription: '',
    consignee: '',
    discom: '',
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
    this.vendorData = getAllData.field1;
    this.nodes = getAllData.field3;
    this.DiscomData = getAllData.field4;
  }

  resetForm() {
    this.rateContractForm = new FormGroup({
      vendMaster: new FormControl('', [Validators.required]),
      vendName: new FormControl('', [Validators.required]),
      rCode: new FormControl('', [Validators.required]),
      exeMethod: new FormControl('', [Validators.required]),
      rWorkDesc: new FormControl('', [Validators.required]),
      cosigne: new FormControl('', [Validators.required]),
      discom: new FormControl('', [Validators.required]),
      rcValidity: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filters: any = { apiKey, serviceKey, userRole, userName, userCode };
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      officeMasterId: '1',
    };
    this.resetForm();
  }

  addRcContractType() {
    this.rateContractForm.markAllAsTouched();
    if (this.isValidForm()) {
      this.contractTypeObj.applicableAreas = Number(this.id[0]).toString();
      const vendorIdNumber = parseInt(this.contractTypeObj.vendorId, 10);

      if (
        Number(this.contractTypeObj.applicableAreas) &&
        this.contractTypeObj.rcCode
      ) {
        const updatedContractTypeObj = {
          ...this.contractTypeObj,
          vendorId: Number(vendorIdNumber),
          applicableAreas: Number(this.id[0]),
          discom: Number(this.rateContractForm.get('discom').value),
        };
        const rcValidityDate = new Date(updatedContractTypeObj.rcValidity);
        const year = rcValidityDate.getFullYear();
        const month = (rcValidityDate.getMonth() + 1)
          .toString()
          .padStart(2, '0');
        const day = rcValidityDate.getDate().toString().padStart(2, '0');
        updatedContractTypeObj.rcValidity = `${year}-${month}-${day}`;
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

        this.configurationService
          .getSaveData(filters, updatedContractTypeObj)
          .then((response) => {
            console.log(
              ' reponse messageText mat type  ' + response.messageText);
            console.log(' reponse mat type  ' + response);
            if (response) {
              // this.Service.sendUpdate('Rate Contract  Updated');
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
                  this.Service.sendUpdate('Rate Contractor Master Updated');
                })
                .catch((error) => {
                  console.error('Error closing dialog:', error);
                });
            }
          });
      }
    }
  }
  nodeSelect(node: any) {
    this.label = [node.label];
    this.id = [node.officeMasterId];
  }

  nodeUnselect() {
    this.reset();
  }
  reset() {
    this.rows = this.data;
    this.treeControl.setValue(this.nodes);
  }

  getSelectedVendorName(selectedVendorId: number): string {
    if (selectedVendorId != null)
      this.contractTypeObj.vendorId = selectedVendorId.toString();
    const selectedVendor = this.vendorData.find(
      (vendor) => vendor.vendorId === selectedVendorId
    );
    this.contractTypeObj.rcVendorName = selectedVendor
      ? selectedVendor.vendorOrganizationName
      : '';
    return selectedVendor ? selectedVendor.vendorOrganizationName : '';
  }
  isValidForm(): boolean {
    this.rateContractForm.markAllAsTouched();
    console.log('Form Valid?', this.rateContractForm.valid);
    let hasError = false;
    Object.keys(this.rateContractForm.controls).forEach((key) => {
      const control = this.rateContractForm.get(key);

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
