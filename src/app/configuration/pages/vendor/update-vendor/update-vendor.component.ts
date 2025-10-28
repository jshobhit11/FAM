import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});
@Component({
  selector: 'app-update-vendor',
  templateUrl: './update-vendor.component.html',
  styleUrls: ['./update-vendor.component.scss'],
})
export class UpdateVendorComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  officeId: string;
  officeIds = [];
  vendorMasterId = [];
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selectedOfficeNode: any;
  label: string[] = [];
  id: any[] = [];
  officeName: string;
  vendorForm: FormGroup;
  DiscomData: any[] = [];
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateVendorComponent>
  ) {
    dialogRef.disableClose = true;
    this.vendorMasterId = this.getAllData.field1;
    this.nodes = getAllData.field3;
    this.DiscomData = getAllData.field2;

    this.vendorForm = new FormGroup({
      vendorMasterId: new FormControl('', [Validators.required]),
      vendorRegistrationNo: new FormControl('', [Validators.required]),
      vendorRegistrationDate: new FormControl('', [Validators.required]),
      vendorRegistrationValidUpto: new FormControl('', [Validators.required]),
      vendorOrganizationName: new FormControl('', [Validators.required]),
      vendorCode: new FormControl('', [Validators.required]),
      vendorType: new FormControl('', [Validators.required]),
      vendorLicenseNumber: new FormControl('', [Validators.required]),
      vendorContactDetails: new FormControl('', [Validators.required]),
      vendorWebsite: new FormControl('', [Validators.required]),
      vendorAddress: new FormControl('', [Validators.required]),
      vendorEmailId: new FormControl('', [Validators.required]),
      contactPersonName: new FormControl('', [Validators.required]),
      contactPhoneNo: new FormControl('', [Validators.required]),
      contactPersonAddress: new FormControl('', [Validators.required]),
      contactPersonEmailId: new FormControl('', [Validators.required]),
      noofworksAllocated: new FormControl('', [Validators.required]),
      emdAmount: new FormControl('', [Validators.required]),
      emdReceiptNo: new FormControl('', [Validators.required]),
      emdReceiptDate: new FormControl('', [Validators.required]),
      emdEligibilityPercentage: new FormControl('', [Validators.required]),
      discom: new FormControl('', [Validators.required]),
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
    filters.vendorMasterId = this.getAllData.field1;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getVendorData(filters);
    console.log('Vendor get data by id', this.getData);

    this.getData.officeId = Number(this.getData.officeId);

    const preSelectedOfficeMasterId = this.getData.officeId;

    const preSelectedNode = this.findNodeById(
      this.nodes,
      preSelectedOfficeMasterId
    );
    this.selectedOfficeNode = preSelectedNode;

    this.vendorForm.patchValue({
      vendorMasterId: this.getData.vendorMasterId,
      vendorRegistrationNo: this.getData.vendorRegistrationNo,
      vendorRegistrationDate: this.getData.vendorRegistrationDate,
      vendorRegistrationValidUpto: this.getData.vendorRegistrationValidUpto,
      vendorOrganizationName: this.getData.vendorOrganizationName,
      vendorCode: this.getData.vendorCode,
      vendorType: this.getData.vendorType,
      vendorLicenseNumber: this.getData.vendorLicenseNumber,
      vendorContactDetails: this.getData.vendorContactDetails,
      vendorWebsite: this.getData.vendorWebsite,
      vendorAddress: this.getData.vendorAddress,
      vendorEmailId: this.getData.vendorEmailId,
      contactPersonName: this.getData.contactPersonName,
      contactPhoneNo: this.getData.contactPhoneNo,
      contactPersonAddress: this.getData.contactPersonAddress,
      contactPersonEmailId: this.getData.contactPersonEmailId,
      noofworksAllocated: this.getData.noofworksAllocated,
      officeId: this.selectedOfficeNode.preSelectedOfficeMasterId,
      emdAmount: this.getData.emdAmount,
      emdReceiptNo: this.getData.emdReceiptNo,
      emdReceiptDate: this.getData.emdReceiptDate,
      emdEligibilityPercentage: this.getData.emdEligibilityPercentage,
      discom: this.getData.discom.toString(),
    });
  }

  onUpdate() {
    this.vendorForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        vendorMasterId: this.getData.vendorMasterId,
        vendorRegistrationNo: this.vendorForm.value.vendorRegistrationNo,
        vendorRegistrationDate: this.vendorForm.value.vendorRegistrationDate,
        vendorRegistrationValidUpto:
          this.vendorForm.value.vendorRegistrationValidUpto,
        vendorOrganizationName: this.vendorForm.value.vendorOrganizationName,
        vendorCode: this.vendorForm.value.vendorCode,
        vendorType: this.vendorForm.value.vendorType,
        vendorLicenseNumber: this.vendorForm.value.vendorLicenseNumber,
        vendorContactDetails: this.vendorForm.value.vendorContactDetails,
        vendorWebsite: this.vendorForm.value.vendorWebsite,
        vendorAddress: this.vendorForm.value.vendorAddress,
        vendorEmailId: this.vendorForm.value.vendorEmailId,
        contactPersonName: this.vendorForm.value.contactPersonName,
        contactPhoneNo: this.vendorForm.value.contactPhoneNo,
        contactPersonAddress: this.vendorForm.value.contactPersonAddress,
        contactPersonEmailId: this.vendorForm.value.contactPersonEmailId,
        noofworksAllocated: this.vendorForm.value.noofworksAllocated,
        officeId: this.selectedOfficeNode.officeMasterId,
        emdAmount: this.vendorForm.value.emdAmount,
        emdReceiptNo: this.vendorForm.value.emdReceiptNo,
        emdReceiptDate: this.vendorForm.value.emdReceiptDate,
        emdEligibilityPercentage:
          this.vendorForm.value.emdEligibilityPercentage,
        discom: this.vendorForm.value.discom,
      };

      let result = this.configurationService.getVendorUpdateData(
        this.filterData,
        updateBody
      ).
      then((response) => {
      if (response) {
        this.Service.sendUpdate('Vendor updated');
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
    this.vendorForm.markAllAsTouched();
    console.log('Form Valid?', this.vendorForm.valid);
    let hasError = false;

    Object.keys(this.vendorForm.controls).forEach((key) => {
      const control = this.vendorForm.get(key);

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

  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
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
}
