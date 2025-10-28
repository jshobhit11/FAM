import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});

@Component({
  selector: 'app-update-special-locality-allowance-master',
  templateUrl: './update-special-locality-allowance-master.component.html',
  styleUrls: ['./update-special-locality-allowance-master.component.scss'],
})
export class UpdateSpecialLocalityAllowanceMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  specialLocalityAllowanceMasterId = [];
  districtData: any[] = [];
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selectedOfficeNode: any;
  label: string[] = [];
  id: any[] = [];
  officeName: string;
  specialLocalityForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateSpecialLocalityAllowanceMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.specialLocalityAllowanceMasterId = getAllData.field2;
    this.nodes = getAllData.field3;
    this.districtData = getAllData.field4;

    this.specialLocalityForm = new FormGroup({
      district: new FormControl('', [Validators.required]),
      percentage: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
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

    filters.specialLocalityAllowanceMasterId = this.getAllData.field2;
    this.filterData = { ...filters };

    this.configurationService
      .getSpecialLocalityGetById(filters)
      .then((data: any) => {
        this.getData = data;
        console.log('Special Locality Allowance get data by id', this.getData);

        const preSelectedOfficeMasterId = this.getData.officeId;
        const preSelectedNode = this.findNodeById(
          this.nodes,
          preSelectedOfficeMasterId
        );
        this.selectedOfficeNode = preSelectedNode;

        this.specialLocalityForm.patchValue({
          district: Number(this.getData.districtId),
          percentage: this.getData.percentageValue,
        });
        console.log('specialLocalityForm===', this.specialLocalityForm.value);
      })
      .catch((error: any) => {
        console.error(
          'Error retrieving Special Locality Allowance data:',
          error
        );
      });
  }

  onSpecialLocalityUpdate(): void {
    this.specialLocalityForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        officeId: this.selectedOfficeNode.officeMasterId,
        districtId: this.specialLocalityForm.value.district,
        percentageValue: this.specialLocalityForm.value.percentage,
      };
      console.log('filterData', this.filterData);

      this.configurationService
        .getSpecialLocalityUpdate(this.filterData, updateBody)
        .then(() => {
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }

          this.notificationRef = this.snackBar.open(
            'Special Locality Allowance Updated Successfully',
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
              this.Service.sendUpdate(
                'Special Locality Allowance Master Updated'
              );
            });
        })
        .catch((error: any) => {
          console.error('Error updating Special Locality Allowance:', error);
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

  onCloseNotification(): void {
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
