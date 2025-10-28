import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import * as _ from 'lodash';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-add-employee-master',
  templateUrl: './add-employee-master.component.html',
  styleUrls: ['./add-employee-master.component.scss'],
})
export class AddEmployeeMasterComponent implements OnInit {
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selected: any;
  label: string[] = [];
  id: any[] = [];
  employeeForm: FormGroup;
  notificationRef: any;
  designationData: any[] = [];
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
    this.nodes = getAllData.field1;
    this.designationData = getAllData.field2;
  }

  ngOnInit(): void {
    console.log('comp');
    this.employeeForm = this.formBuilder.group({
      employeeCode: ['', [Validators.required]],
      designationId: ['', [Validators.required]],
      employeeName: ['', [Validators.required]],
      officeId: ['', [Validators.required]],
      employeeAddress: ['', [Validators.required]],
      mobileNo: ['', [Validators.required]],
      email: ['', [Validators.required]],
    });
  }

  empMasterObj = {
    employeeCode: '',
    designationId: '',
    employeeName: '',
    officeId: '',
    employeeAddress: '',
    mobileNo: '',
    email: '',
  };

  onAddEmpMaster() {
    Object.keys(this.employeeForm.controls).forEach((key) => {
      this.employeeForm.get(key)?.markAsTouched();
    });
    this.empMasterObj.officeId = Number(this.id[0]).toString();
    if (Number(this.empMasterObj.officeId) && this.empMasterObj.employeeName) {
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
        .getEmpMasterSaveData(filters, this.empMasterObj)
        .then((response) => {
          console.log(' reponse messageText mat type  ' + response.messageText);
          console.log(' reponse mat type  ' + response);
          if (response) {
            this.Service.sendUpdate('Employee Master Updated');
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
      this.employeeForm.get('employeeCode').invalid ||
      this.employeeForm.get('designationId').invalid ||
      this.employeeForm.get('employeeName').invalid ||
      this.employeeForm.get('officeId').invalid ||
      this.employeeForm.get('employeeAddress').invalid ||
      this.employeeForm.get('mobileNo').invalid ||
      this.employeeForm.get('email').invalid
    ) {
      this.error = 'Please fill out this Field.';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
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
}
