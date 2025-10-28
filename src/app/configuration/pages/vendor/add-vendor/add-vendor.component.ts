import { Component, Inject } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import * as _ from 'lodash';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent {
  vendorRef: any;
  officeId: any;
  filterData: any;
  getData = [];
  officeIds = [];
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selected: any;
  label: string[] = [];
  id: any[] = [];
  vendorForm: FormGroup;
  error: string;
  DiscomData: any[] = [];
  notificationRef: any;
  constructor(
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.nodes = getAllData.field3;
    this.DiscomData = getAllData.field2;
    this.vendorForm = this.formBuilder.group({
      vendorRegistrationNo: ['', [Validators.required]],
      vendorRegistrationDate: ['', [Validators.required]],
      vendorRegistrationValidUpto: ['', [Validators.required]],
      vendorOrganizationName: ['', [Validators.required]],
      vendorCode: ['', [Validators.required]],
      vendorType: ['', [Validators.required]],
      vendorLicenseNumber: ['', [Validators.required]],
      vendorContactDetails: ['', [Validators.required]],
      vendorWebsite: ['', [Validators.required]],
      vendorAddress: ['', [Validators.required]],
      vendorEmailId: ['', [Validators.required]],
      contactPersonName: ['', [Validators.required]],
      contactPhoneNo: ['', [Validators.required]],
      contactPersonAddress: ['', [Validators.required]],
      contactPersonEmailId: ['', [Validators.required]],
      noofworksAllocated: ['', [Validators.required]],
      officeId: ['', [Validators.required]],
      emdAmount: ['', [Validators.required]],
      emdReceiptNo: ['', [Validators.required]],
      emdReceiptDate: ['', [Validators.required]],
      emdEligibilityPercentage: ['', [Validators.required]],
      discom: ['', [Validators.required]],
    });
  }

  vendorObj = {
    vendorRegistrationNo: '',
    vendorRegistrationDate: '',
    vendorRegistrationValidUpto: '',
    vendorOrganizationName: '',
    vendorCode: '',
    vendorType: '',
    vendorLicenseNumber: '',
    vendorContactDetails: '',
    vendorWebsite: '',
    vendorAddress: '',
    vendorEmailId: '',
    contactPersonName: '',
    contactPhoneNo: '',
    contactPersonAddress: '',
    contactPersonEmailId: '',
    noofworksAllocated: '',
    officeId: '',
    emdAmount: '',
    emdReceiptNo: '',
    emdReceiptDate: '',
    emdEligibilityPercentage: '',
    discom: '',
  };

  addVendor() {
    Object.keys(this.vendorForm.controls).forEach((key) => {
      this.vendorForm.get(key)?.markAsTouched();
    });
    this.vendorObj.officeId = Number(this.id[0]).toString();
    if (
      Number(this.vendorObj.officeId) &&
      this.vendorObj.vendorRegistrationNo &&
      this.vendorObj.vendorOrganizationName &&
      this.vendorObj.vendorRegistrationDate &&
      this.vendorObj.vendorRegistrationValidUpto
    ) {
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
        .getSaveDataVendor(filters, this.vendorObj)
        .then((response) => {
          if (response) {
            this.Service.sendUpdate('Vendor updated');
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

  async onSelect() {
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
    filters.officeId = this.officeId;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getVendorByOfficeId(filters);

    for (let i = 0; i < this.getData.length; i++) {
      console.log('Vendor get data by officeId', this.getData[i]);
      this.vendorObj.vendorLicenseNumber = this.getData[i].vendorLicenseNumber;
      this.vendorObj.contactPersonAddress =
        this.getData[i].contactPersonAddress;
      this.vendorObj.contactPersonEmailId =
        this.getData[i].contactPersonEmailId;
      this.vendorObj.contactPersonName = this.getData[i].contactPersonName;
      this.vendorObj.contactPhoneNo = this.getData[i].contactPhoneNo;
      this.vendorObj.noofworksAllocated = this.getData[i].noofworksAllocated;
      this.vendorObj.vendorAddress = this.getData[i].vendorAddress;
      this.vendorObj.vendorCode = this.getData[i].vendorCode;
      this.vendorObj.vendorContactDetails =
        this.getData[i].vendorContactDetails;
      this.vendorObj.vendorEmailId = this.getData[i].vendorEmailId;
      this.vendorObj.vendorLicenseNumber = this.getData[i].vendorLicenseNumber;
      this.vendorObj.vendorOrganizationName =
        this.getData[i].vendorOrganizationName;
      this.vendorObj.vendorRegistrationDate =
        this.getData[i].vendorRegistrationDate;
      this.vendorObj.vendorRegistrationNo =
        this.getData[i].vendorRegistrationNo;
      this.vendorObj.vendorRegistrationValidUpto =
        this.getData[i].vendorRegistrationValidUpto;
      this.vendorObj.vendorType = this.getData[i].vendorType;
      this.vendorObj.vendorWebsite = this.getData[i].vendorWebsite;
      this.vendorObj.emdAmount = this.getData[i].emdAmount;
      this.vendorObj.emdReceiptNo = this.getData[i].emdReceiptNo;
      this.vendorObj.emdReceiptDate = this.getData[i].emdReceiptDate;
      this.vendorObj.emdEligibilityPercentage =
        this.getData[i].emdEligibilityPercentage;
      this.vendorObj.discom = this.vendorForm.get('discom').value;
    }
  }
  isValidForm(): boolean {
    if (
      this.vendorForm.get('vendorRegistrationNo').invalid ||
      this.vendorForm.get('vendorRegistrationDate').invalid ||
      this.vendorForm.get('vendorRegistrationValidUpto').invalid ||
      this.vendorForm.get('vendorOrganizationName').invalid ||
      this.vendorForm.get('vendorCode').invalid ||
      this.vendorForm.get('vendorType').invalid ||
      this.vendorForm.get('vendorLicenseNumber').invalid ||
      this.vendorForm.get('vendorContactDetails').invalid ||
      this.vendorForm.get('vendorWebsite').invalid ||
      this.vendorForm.get('vendorAddress').invalid ||
      this.vendorForm.get('vendorEmailId').invalid ||
      this.vendorForm.get('contactPersonName').invalid ||
      this.vendorForm.get('contactPhoneNo').invalid ||
      this.vendorForm.get('contactPersonAddress').invalid ||
      this.vendorForm.get('contactPersonEmailId').invalid ||
      this.vendorForm.get('noofworksAllocated').invalid ||
      this.vendorForm.get('officeId').invalid ||
      this.vendorForm.get('emdAmount').invalid ||
      this.vendorForm.get('emdReceiptNo').invalid ||
      this.vendorForm.get('emdReceiptDate').invalid ||
      this.vendorForm.get('emdEligibilityPercentage').invalid
    ) {
      this.error = 'Please fill out this Field.';
      console.log(this.error);

      return false;
    } else {
      this.error = '';
      return true;
    }
  }
}
