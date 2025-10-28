import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetEntryService } from 'src/app/services/budget-entry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { Table } from 'primeng/table';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-config-budget-approval',
  templateUrl: './config-budget-approval.component.html',
  styleUrls: ['./config-budget-approval.component.scss']
})
export class ConfigBudgetApprovalComponent implements OnInit {
  clearControl = new FormControl('', []);
  treeControl = new FormControl('', []);
  selectedAccounts: any[] = [];
  rows: any | null = null;
  data: any[] = [];
  tableData: any[] = [];
  cols: any[] = [];
  filterFields: any[] = [];
  isApproveSelected: boolean = false;
  isRejectSelected: boolean = false;
  showSuccess: boolean = false;
  showError: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  selectedTransactionType: any = '';
  selectedBudgetYearType: any = '';
  selectedBudgetStatus: any = '';
  allRecordsSelected: boolean = false;
  isApproveDisabled: boolean = false;
  isRejectDisabled: boolean = false;
  anyCheckboxSelected: boolean = false;
  isSaving: boolean = false;
  isApproveClicked: boolean = false;
  isRejectClicked: boolean = false;
  // loading: boolean = true;
  officeCode: string = '';
  label: string[] = [];
  nodes: any[] = [];
  isOffice: boolean = false;
  @Input() loading: boolean = true;
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private budgetentryservice: BudgetEntryService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private storeOfficeService: StoreOfficeService,
    private loader: LoaderService,
  ) {}

  async ngOnInit() {
    this.loader.show('Loading Data');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    this.officeCode = sessionStorage.getItem('office-id');
    // const officeCode='130002';
    const filters: any = { apiKey, serviceKey, userRole, userName, userCode };
    const oFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeMasterId: this.officeCode };
    const officeData = await this.storeOfficeService.getOfficeMasterByOfficeMasterId(oFilter);
    this.officeHierarchy(officeData);
    this.treeControl.setValue(this.nodes);
    this.budgetentryservice.getbudgetapprovalGetAllData(filters).then((tableData) => {
      const data = tableData
        .filter((record) => record.budgetStatus !== 'A' && record.budgetStatus !== 'R')
        .map((record) => ({
          ...record,
          isSelected: false,
          budgetDetailsId: record.budgetDetailsId,
          budgetYearType: record.budgetYearType,
          transactionType: record.transactionType,
          budgetStatus: record.budgetStatus,
        }));
      this.tableData = data;
      if (data.length > 0) {
        this.selectedBudgetYearType = data[0].budgetYearType;
        this.selectedBudgetStatus = data[0].budgetStatus;
      }
    });
    this.cols = [
      { key: 'referenceNo', value: 'Request No.', route: '/configuration/config-budget-approval-details' },
      { key: 'amount', value: 'Amount' },
      { key: 'allocatedBudgetDate', value: 'Date' },
      { key: 'omNumber', value: 'OM No.' },
      { key: 'remarks', value: 'Remarks' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
    this.loading = false;
    this.loader.hide(); 
  }

  officeHierarchy(officeData: any[]) {
    const parent = officeData.find((w) => w.officeMasterId === this.officeCode);
    let child = [];
    const pData = officeData.filter((w) => w.parentId === parent.officeMasterId);
    pData.forEach((v) => {
      const cData = officeData.filter((w) => w.parentId === v.officeMasterId);
      let sub = [];
      if (cData.length) {
        cData.forEach((c) => {
          sub.push({
            label: c.officeName,
            icon: 'pi pi-file',
          });
        });
      }
      child.push({
        label: v.officeName,
        icon: 'pi pi-file',
        children: sub,
      });
    });
    this.nodes = [
      {
        label: parent.officeName,
        icon: 'pi pi-folder',
        children: child,
        expanded: true,
      },
    ];
    console.log('NODES', this.nodes);
  }

  onApproveClicked() {
    if (this.isSaving) {
      return;
    }

    const selectedBudgetDetails = this.selectedAccounts;
    // const selectedIds = selectedBudgetDetails.map((data) => data.budgetDetailsId);
    this.tableData = this.tableData.filter((data) => !data.isSelected);
    console.log("on recerod check box selected",this.selectedAccounts);
    if (selectedBudgetDetails.length === 0) {
      return;
    }

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');

    // const selectedRecord = selectedBudgetDetails[0];
    const budgetStatus = 'A';
    const payload = selectedBudgetDetails.map((data) => {
      return {
        budgetDetailsId: data.budgetDetailsId,
        transactionType: data.transactionType,
        budgetYearType: data.budgetYearType,
      };
    });

    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      budgetStatus,
    };
    this.isSaving = true;
    this.budgetentryservice
      .UpdateAprroveData(filters, payload)
      .then((response) => {
        console.log('API Response:', response);

        if (response.messageType === 'SUCCESS') {
          console.log('Success Message:', response.messageText);
          document.body.style.pointerEvents = 'none';
          const snackBarRef = this.snackBar.open('Data approved successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            panelClass: ['disable-pointer-events'],
          });
          snackBarRef.onAction().subscribe(() => {
            this.ngZone.run(() => {
              this.changeDetectorRef.detectChanges();
              document.body.style.pointerEvents = 'auto';
              window.location.reload();
            });
          });
          this.isApproveClicked = true;
          this.showSuccessMessage('Data approved successfully');
        } else {
          console.log('Approval Failed');
          this.showErrorMessage('Approval Failed.');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
        this.showErrorMessage('Approval Failed.');
      })
      .finally(() => {
        this.isSaving = false;
      });
  }

  onRejectClicked() {
    if (this.isSaving) {
      return;
    }

    const selectedBudgetDetails = this.selectedAccounts;
    // const selectedIds = selectedBudgetDetails.map((data) => data.budgetDetailsId);
    this.tableData = this.tableData.filter((data) => !data.isSelected);
    if (selectedBudgetDetails.length === 0) {
      return;
    }

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    // const selectedRecord = selectedBudgetDetails[0];

    const budgetStatus = 'R';
    const payload = selectedBudgetDetails.map((data) => {
      return {
        budgetDetailsId: data.budgetDetailsId,
        transactionType: data.transactionType,
        budgetYearType: data.budgetYearType,
      };
    });
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      budgetStatus,
    };

    this.isSaving = true;

    this.budgetentryservice
      .UpdateAprroveData(filters, payload)
      .then((response) => {
        console.log('API Response:', response);

        if (response.messageType === 'SUCCESS') {
          console.log('Success Message:', response.messageText);
          document.body.style.pointerEvents = 'none';
          const snackBarRef = this.snackBar.open('Data successfully rejected', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            panelClass: ['disable-pointer-events'],
          });
          snackBarRef.onAction().subscribe(() => {
            this.ngZone.run(() => {
              this.changeDetectorRef.detectChanges();
              document.body.style.pointerEvents = 'auto';
              window.location.reload();
            });
          });
          this.isRejectClicked = true;
          this.showSuccessMessage('Data successfully rejected');
        } else {
          console.log('Rejection Failed');
          this.showErrorMessage('Rejection Failed.');
        }
      })
      .catch((error) => {
        console.log('Error:', error);
        this.showErrorMessage('Rejection Failed.');
      })
      .finally(() => {
        this.isSaving = false;
      });
  }

  onRecordCheckboxClicked(index: number, checked: boolean) {
    this.tableData[index].isSelected = checked;
    this.updateAllRecordsSelected();
    this.anyCheckboxSelected = this.tableData.some((data) => data.isSelected);
   
  }

  onRecordClicked(requestNo: string) {
    const selectedRecord = this.tableData.find((record) => record.referenceNo === requestNo);
    if (selectedRecord) {
      this.router.navigate(['/work-management/budget-approval-details'], {
        queryParams: { data: JSON.stringify(selectedRecord) },
      });
    }
  }

  selectAllCheckboxClicked(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.tableData.forEach((data) => (data.isSelected = isChecked));
  }

  updateAllRecordsSelected() {
    this.allRecordsSelected = this.tableData.every((data) => data.isSelected);
  }

  updateButtonState() {
    if (this.selectedTransactionType === 'A') {
      this.isApproveDisabled = false;
      this.isRejectDisabled = true;
    } else if (this.selectedTransactionType === 'R') {
      this.isApproveDisabled = true;
      this.isRejectDisabled = false;
    } else {
      this.isApproveDisabled = false;
      this.isRejectDisabled = false;
    }
  }

  showSuccessMessage(message: string) {
    this.showSuccess = true;
    this.showError = false;
    this.successMessage = message;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  showErrorMessage(message: string) {
    this.showError = true;
    this.showSuccess = false;
    this.errorMessage = message;
    setTimeout(() => {
      this.showError = false;
    }, 3000);
  }

  onApproveRadioSelected() {
    this.isApproveSelected = true;
    this.isRejectSelected = false;
    this.anyCheckboxSelected = false;
  }

  onRejectRadioSelected() {
    this.isApproveSelected = false;
    this.isRejectSelected = true;
    this.anyCheckboxSelected = false;
  }

  exportPdf() {
    console.log('ROWS', this.rows, this.data);
    const doc = new jsPDF();
    var arr = [];
    if (this.selectedAccounts.length) {
      for (let i = 0; i < this.selectedAccounts.length; i++) {
        const element = Object.values(this.selectedAccounts[i]);
        arr.push(element);
      }
    } else {
      for (let i = 0; i < this.rows.length; i++) {
        const element = Object.values(this.rows[i]);
        arr.push(element);
      }
    }
    autoTable(doc, {
      head: [this.cols],
      body: arr,
    });
    doc.save('data.pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.selectedAccounts.length ? this.selectedAccounts : this.rows);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'data');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  reset() {
    this.rows = this.data;
    this.treeControl.setValue(this.nodes);
  }

  clear(table: Table) {
    this.clearControl.patchValue('', { emitEvent: false });
    table.clear();
  }

  nodeSelect(node: any) {
    console.log(node.label);
    this.label = [node.label];
    this.parseNestedObject(node);
    let row = [];
    this.rows = [];
    this.label.forEach((l) => {
      let rowData: any[] = [];
      const exists = this.data.some((item) => item.hasOwnProperty('officeName'));
      if (exists) {
        rowData = this.data.filter((v: any) => v.officeName.toLowerCase().indexOf(l.toLowerCase()) > -1);
      } else {
        rowData = this.data.filter((v: any) => v.office.toLowerCase().indexOf(l.toLowerCase()) > -1);
      }
      if (rowData.length) {
        row.push(rowData);
      }
    });
    this.rows = _.flatten(row);
  }

  parseNestedObject(item: any) {
    let origItem = { ...item };
    for (let key in item) {
      delete item['parent'];
      if (_.isPlainObject(item[key])) {
        if (origItem[key].label) {
          this.label.push(origItem[key].label);
        }
        this.parseNestedObject(item[key]);
      } else if (Array.isArray(item[key])) {
        this.parseNestedObject(item[key]);
      }
    }
  }
}
