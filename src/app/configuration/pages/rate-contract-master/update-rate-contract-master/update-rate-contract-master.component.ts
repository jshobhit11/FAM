import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});
@Component({
  selector: 'app-update-rate-contract-master',
  templateUrl: './update-rate-contract-master.component.html',
  styleUrls: ['./update-rate-contract-master.component.scss'],
})
export class UpdateRateContractMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  executionMethodOptions: string[] = [];
  notificationRef: any;
  vendorData: any[] = [];
  rateContractMasterId: any[] = [];
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selectedOfficeNode: any;
  label: string[] = [];
  id: any[] = [];
  officeName: string;
  rateContractForm: FormGroup;
  error: string;
  DiscomData: any[] = [];

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    public getAllData: any,
    private snackBar: MatSnackBar,
    private Service: CommonService,
    private dialogRef: MatDialogRef<UpdateRateContractMasterComponent>
  ) {
    dialogRef.disableClose = true;
    this.vendorData = getAllData.field1;
    this.rateContractMasterId = getAllData.field2;
    this.nodes = getAllData.field3;
    this.DiscomData = getAllData.field4;

    this.rateContractForm = new FormGroup({
      vendorId: new FormControl('', [Validators.required]),
      rcVendorName: new FormControl('', [Validators.required]),
      rcCode: new FormControl('', [Validators.required]),
      rcValidity: new FormControl('', [Validators.required]),
      executionMethod: new FormControl('', [Validators.required]),
      rcWorkDescription: new FormControl('', [Validators.required]),
      consignee: new FormControl('', [Validators.required]),
      discom: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const rateContractMasterId = sessionStorage.getItem(
      'rateContractor-masterId'
    );
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      rateContractMasterId,
    };
    filters.rateContractMasterId = this.rateContractMasterId;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getDataById(filters);
    console.log('rate contract master id ', this.getData);
    this.getData.districtId = Number(this.getData.districtId);
    const preSelectedOfficeMasterId = this.getData.applicableAreas;
    const preSelectedNode = this.findNodeById(
      this.nodes,
      preSelectedOfficeMasterId
    );

    this.rateContractForm.patchValue({
      vendorId: this.getData.vendorId.toString(),
      rcVendorName: this.getData.rcVendorName,
      rcCode: this.getData.rcCode,
      rcValidity: this.getData.rcValidity,
      executionMethod: this.getData.executionMethod,
      rcWorkDescription: this.getData.rcWorkDescription,
      consignee: this.getData.consignee,
      discom: this.getData.discom.toString(),
    });
    console.log('specialLocalityForm', this.rateContractForm.value);
    this.selectedOfficeNode = preSelectedNode;
  }

  async onRateContractUpdate() {
    const updateBody = {
      vendorId: this.rateContractForm.value.vendorId,
      rcCode: this.rateContractForm.value.rcCode,
      rcVendorName: this.rateContractForm.value.rcVendorName,
      rcValidity: this.rateContractForm.value.rcValidity,
      rcWorkDescription: this.rateContractForm.value.rcWorkDescription,
      executionMethod: this.rateContractForm.value.executionMethod,
      applicableAreas: this.selectedOfficeNode.officeMasterId,
      consignee: this.rateContractForm.value.consignee,
      discom: this.rateContractForm.value.discom,
    };
    try {
      let result = await this.configurationService.getUpdateData(
        this.filterData,
        updateBody
      ).then((response)=>{
        if(response){
          // this.Service.sendUpdate('Rate Contractor Master Updated');
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
        }
      })
      this.notificationRef
        .afterDismissed()
        .toPromise()
        .then(() => {
          this.dialogRef.close();
          this.Service.sendUpdate('Rate Contractor Master Updated');
        });
    } catch (error) {
      console.error('Error updating data:', error);
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

  onCloseNotification(): void {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }

  getSelectedVendorName(selectedVendorId: number): string {
    if (selectedVendorId != null)
      this.getData.vendorId = selectedVendorId.toString();
    const selectedVendor = this.vendorData.find(
      (vendor) => vendor.vendorId === selectedVendorId
    );
    this.getData.rcVendorName = selectedVendor
      ? selectedVendor.vendorOrganizationName
      : '';
    return selectedVendor ? selectedVendor.vendorOrganizationName : '';
  }

  findNodeById(data: any[], targetId: number): any {
    for (const node of data) {
      if (node.officeMasterId == targetId) {
        return node;
      }

      if (node.children && node.children.length > 0) {
        const childNode = this.findNodeById(node.children, targetId);
        if (childNode) {
          return childNode;
        }
      }
    }
    return null;
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
