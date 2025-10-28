import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DivisionalBudgetHeadService } from 'src/app/services/divisional-budget-head.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});

interface AccountHeadOption {
  accountHeadMasterId: number;
  displayText: string;
}
@Component({
  selector: 'app-update-work-order-series-master',
  templateUrl: './update-work-order-series-master.component.html',
  styleUrls: ['./update-work-order-series-master.component.scss'],
})
export class UpdateWorkOrderSeriesMasterComponent implements OnInit {
  getData: any = {};
  filterData: any;
  notificationRef: any;
  financialData = [];
  workOrderSeriesMasterId = [];
  accountHeadoptions: AccountHeadOption[] = [];
  accountData: any;
  alphabets: string[] = [];
  getOfficeId: string = '';
  officeMasterId: any;
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  selectedOfficeNode: any;
  label: string[] = [];
  id: any[] = [];
  officeName: string;
  filterControl = new FormControl('');
  filteredAccountHeadOptions: Observable<AccountHeadOption[]>;
  workOrderSeriesForm: FormGroup;
  lineTypeStatus: Boolean = false;
  parent: any;
  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateWorkOrderSeriesMasterComponent>,
    private Service: CommonService,
    private budgetentryservice: DivisionalBudgetHeadService
  ) {
    dialogRef.disableClose = true;
    this.nodes = getAllData.field1;
    this.parent = getAllData.field1;
    this.financialData = getAllData.field3;
    this.workOrderSeriesMasterId = getAllData.field5;
    this.workOrderSeriesForm = new FormGroup({
      accountHeadMasterId: new FormControl('', [Validators.required]),
      financialYear: new FormControl('', [Validators.required]),
      alphabetSequence: new FormControl('', [Validators.required]),
      startNumber: new FormControl('', [Validators.required]),
      endNumber: new FormControl('', [Validators.required]),
      lineType: new FormControl('', []),
      parentOfficeId:new FormControl('', []),
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

    this.alphabets = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );

    filters.workOrderSeriesMaster = this.getAllData.field5;
    this.filterData = { ...filters };
    this.getData = await this.configurationService.getWorkOrdSeriesGetById(
      filters
    );
    console.log(' work order series master get data by id', this.getData);
    this.getOfficeId = `${this.getData.officeId}`;
    this.accountData = await this.budgetentryservice.getDivisionAccountHeadData(
      filters
    );
    this.accountHeadoptions = this.accountData.map((data: any) => ({
      accountHeadMasterId: data.accountHeadMasterId,
      displayText: `${data.accountHeadCode} - ${data.accountHeadDescription}`,
    }));

    const preSelectedOfficeMasterId = this.parent[0].officeMasterId;

    const preSelectedNode = this.findNodeById(
      this.nodes,
      preSelectedOfficeMasterId
    );
    this.selectedOfficeNode = preSelectedNode;
    this.workOrderSeriesForm.patchValue({
      accountHeadMasterId: this.getData.accountHeadMasterId,
      financialYear: this.getData.financialYear,
      alphabetSequence: this.getData.alphabetSequence,
      startNumber: this.getData.startNumber,
      endNumber: this.getData.endNumber,
      lineType: this.getData.lineType,
      parentOfficeId: preSelectedOfficeMasterId,
    });
    this.onAccountHeadOptionSelected(this.getData.accountHeadMasterId);
  }

  displayAccountHeadOption(option: AccountHeadOption): string {
    return option ? option.displayText : '';
  }

  onAccountHeadOptionSelected(option: AccountHeadOption) {
    var result = this.accountHeadoptions.filter(option =>
      option.accountHeadMasterId === this.getData.accountHeadMasterId
    ).map(option => option.displayText);;

    // const containsValue = result.some(item => item.includes("14.400"));

    // if (containsValue) {
    //   this.lineTypeStatus = true;
    // }
  }

  onWorkOrdSeriesUpdate() {
    this.workOrderSeriesForm.markAllAsTouched();
    if (this.isValidForm()) {
      const updateBody = {
        officeId:this.workOrderSeriesForm.get('parentOfficeId').value,
        accountHeadmasterId: this.workOrderSeriesForm.value.accountHeadMasterId,
        financialYear: this.workOrderSeriesForm.value.financialYear,
        alphabetSequence: this.workOrderSeriesForm.value.alphabetSequence,
        startNumber: this.workOrderSeriesForm.value.startNumber,
        endNumber: this.workOrderSeriesForm.value.endNumber,
        lineType: this.workOrderSeriesForm.value.lineType,
      };

      let result = this.configurationService.getWorkOrdSeriesUpdateData(
        this.filterData,
        updateBody
      ).then((response) => {
        console.log(" reponse messageText mat type  " + response.messageText);
        console.log(" reponse mat type  " + response);
      
        if (response) {
          this.Service.sendUpdate('Work order series');
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
    this.workOrderSeriesForm.markAllAsTouched();
    console.log('Form Valid?', this.workOrderSeriesForm.valid);
    let hasError = false;

    Object.keys(this.workOrderSeriesForm.controls).forEach((key) => {
      const control = this.workOrderSeriesForm.get(key);

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
    if (node && node.label) {
      this.label = node.label;
      this.id = [node.officeMasterId];
      console.log('node===' + this.label + '===' + this.id);
    }
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
