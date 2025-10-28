import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DivisionalBudgetHeadService } from 'src/app/services/divisional-budget-head.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

interface AccountHeadOption {
  accountHeadMasterId: number;
  displayText: string;
}

@Component({
  selector: 'app-add-work-order-series-master',
  templateUrl: './add-work-order-series-master.component.html',
  styleUrls: ['./add-work-order-series-master.component.scss'],
})
export class AddWorkOrderSeriesMasterComponent implements OnInit {
  treeForm = new FormGroup({
    selectedNodes: new FormControl('', []),
  });
  public rows: any | null = null;
  public data: any[] = [];
  nodes: any[] = [];
  parent: any;
  selected: any;
  label: string[] = [];
  id: any[] = [];
  notificationRef: any;
  financialData = [];
  accountHeadoptions: AccountHeadOption[] = [];
  accountData: any;
  alphabets: string[] = [];
  workOrderSeriesForm: FormGroup;
  error: string;
  treeControl: FormControl;
  filterControl = new FormControl('');
  filteredAccountHeadOptions: Observable<AccountHeadOption[]>;
  lineTypeStatus: Boolean = false;
  workOrdSeriesObj = {
    officeId: '',
    accountHeadMasterId: '',
    financialYear: '',
    alphabetSequence: '',
    startNumber: '',
    endNumber: '',
    // lineType: '',
  };

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    private budgetentryservice: DivisionalBudgetHeadService,
    @Inject(MAT_DIALOG_DATA) private getAllData: any,
    private formBuilder: FormBuilder
  ) {
    dialogRef.disableClose = true;
    this.parent = getAllData.field1;
    console.log("this parent",this.parent);
    this.financialData = getAllData.field3;
    this.treeControl = new FormControl();
    this.treeForm = this.formBuilder.group({
      selectedNodes: new FormControl('', []),
    });
    this.workOrderSeriesForm = this.formBuilder.group({
      accountHeadMasterId: ['', [Validators.required]],
      financialYear: ['', [Validators.required]],
      alphabetSequence: ['', [Validators.required]],
      startNumber: ['', [Validators.required]],
      endNumber: ['', [Validators.required]],
      // lineType: ['',],
      parentOfficeId:['',],
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

    this.accountData = await this.budgetentryservice.getDivisionAccountHeadData(
      filters
    );

    this.accountHeadoptions = this.accountData.map((data: any) => ({
      accountHeadMasterId: data.accountHeadMasterId,
      displayText: `${data.accountHeadCode} - ${data.accountHeadDescription}`,
    }));

    this.filteredAccountHeadOptions = this.filterControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: any): AccountHeadOption[] {
    // Handle both string and object values for filtering
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.displayText.toLowerCase();

    return this.accountHeadoptions.filter(option =>
      option.displayText.toLowerCase().includes(filterValue)
    );
  }

  displayAccountHeadOption(option: AccountHeadOption): string {
    return option ? option.displayText : '';
  }

  onAccountHeadOptionSelected(option: AccountHeadOption) {
    this.workOrderSeriesForm.get('accountHeadMasterId').setValue(option.accountHeadMasterId);
    // if(option.displayText.includes("14.400")){
    //   this.lineTypeStatus = true;
    // }
  }

  onAddWorkOrdSeriesMaster() {
    Object.keys(this.workOrderSeriesForm.controls).forEach((key) => {
      this.workOrderSeriesForm.get(key)?.markAsTouched();
    });

    this.workOrdSeriesObj.officeId = this.workOrderSeriesForm.get('parentOfficeId').value;
    this.workOrdSeriesObj.accountHeadMasterId = this.workOrderSeriesForm.get('accountHeadMasterId').value;

    if (
      Number(this.workOrdSeriesObj.officeId) &&
      this.workOrdSeriesObj.accountHeadMasterId
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

      this.configurationService.getWorkOrdSeriesSaveData(
        filters,
        this.workOrdSeriesObj
      ).then((response) => {
        if (response) {
          this.Service.sendUpdate('Work order series');
          if (this.notificationRef) {
            this.notificationRef.dismiss();
            this.notificationRef = null;
          }
          this.notificationRef = this.snackBar.open(response.messageText, 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
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
    if (
      this.workOrderSeriesForm.get('accountHeadMasterId').invalid ||
      this.workOrderSeriesForm.get('financialYear').invalid ||
      this.workOrderSeriesForm.get('alphabetSequence').invalid ||
      this.workOrderSeriesForm.get('startNumber').invalid ||
      this.workOrderSeriesForm.get('endNumber').invalid
    ) {
      this.error = 'Please fill out this Field.';
      return false;
    } else {
      this.error = '';
      return true;
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

  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
}
