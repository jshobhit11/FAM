import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-update-employee-master',
  templateUrl: './update-employee-master.component.html',
  styleUrls: ['./update-employee-master.component.scss'],
})
export class UpdateEmployeeMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  employeeMasterId = [];
  designationData: any[] = [];
  selectedIds: any;
  selectedDesignationId: any;
  selectedOfficeId: any;
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selectedOfficeNode: any;
  label: string[] = [];
  id: any[] = [];
  officeName: string;
  employeeForm: FormGroup;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateEmployeeMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.nodes = getAllData.field1;
    this.designationData = getAllData.field2;
    this.employeeMasterId = getAllData.field3;
    this.selectedIds = getAllData.field4;

    this.selectedDesignationId = this.selectedIds.designationId;
    this.selectedOfficeId = this.selectedIds.officeId;
    this.employeeForm = new FormGroup({
      employeeMasterId: new FormControl('', [Validators.required]),
      employeeName: new FormControl('', [Validators.required]),
      employeeCode: new FormControl('', [Validators.required]),
      designationId: new FormControl('', [Validators.required]),
      employeeAddress: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
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
    filters.employeeMasterId = this.getAllData.field3;
    console.log('filters.employeeMasterId', filters.employeeMasterId);
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getEmpMasterGetDataById(
      filters
    );
    console.log(' Employee Master get data by id', this.getData);

    const preSelectedOfficeMasterId = this.getData.officeId;
    const preSelectedNode = this.findNodeById(
      this.nodes,
      preSelectedOfficeMasterId
    );
    this.selectedOfficeNode = preSelectedNode;
    this.employeeForm.patchValue({
      employeeMasterId: this.getData.employeeMasterId,
      employeeName: this.getData.employeeName,
      employeeCode: this.getData.employeeCode,
      designationId: this.selectedDesignationId,
      officeId: this.selectedOfficeNode.officeMasterId,
      employeeAddress: this.getData.employeeAddress,
      mobileNo: this.getData.mobileNo,
      email: this.getData.email,
    });
  }

  onEmpMasterUpdate() {
    this.employeeForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        employeeMasterId: this.getData.employeeMasterId,
        employeeName: this.employeeForm.value.employeeName,
        employeeCode: this.employeeForm.value.employeeCode,
        designationId: this.selectedDesignationId,
        officeId: this.selectedOfficeNode.officeMasterId,
        employeeAddress: this.employeeForm.value.employeeAddress,
        mobileNo: this.employeeForm.value.mobileNo,
        email: this.employeeForm.value.email,
      };

      let result = this.configurationService.getEmpMasterUpdateData(
        this.filterData,
        updateBody
      );
      console.log(result);
      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }
      this.notificationRef = this.snackBar.open(
        'Employee Master Updated Successfully',
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
          this.Service.sendUpdate('Employee Master Updated');
        });
    }
  }
  isValidForm(): boolean {
    this.employeeForm.markAllAsTouched();
    console.log('Form Valid?', this.employeeForm.valid);
    let hasError = false;
    Object.keys(this.employeeForm.controls).forEach((key) => {
      const control = this.employeeForm.get(key);
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
  selectedDesignationMaster(designationId) {
    console.log('designationId', designationId);
    this.selectedDesignationId = designationId;
  }
  selectedOfficeMaster(officeId) {
    console.log('officeId', officeId);
    this.selectedOfficeId = officeId;
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
