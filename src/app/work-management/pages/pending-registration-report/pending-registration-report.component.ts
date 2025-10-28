import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { PrimeNGConfig, TreeNode } from 'primeng/api';
import { DateRangeValidatorDirective } from 'src/app/shared/date-range-validator.directive';
import * as _ from 'lodash';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { LoaderService } from 'src/app/services/loader.service';
const treeForm = new FormGroup({
  selectedNodes: new FormControl('', []),
});
@Component({
  selector: 'app-pending-registration-report',
  templateUrl: './pending-registration-report.component.html',
  styleUrls: ['./pending-registration-report.component.scss'],
})
export class PendingRegistrationReportComponent implements OnInit {
  formGroup: FormGroup;
  selected: TreeNode;
  treeForm: FormGroup = treeForm;
  officeCode: any;
  nodes: any[] = [];
  label: string[] = [];
  public rows: any | null = null;
  public data: any[] = [];
  id: any[] = [];
  @Input() loading: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private storeOfficeService: StoreOfficeService,
    private loader: LoaderService,
  ) {
    this.formGroup = this.formBuilder.group({
      officeId: new FormControl(null),
      fromDate: new FormControl(null),
      toDate: new FormControl(null),
    });
  }

  async ngOnInit() {
    this.loader.show('Loading Data');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    this.officeCode = officeCode;
    const officeFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeMasterId: officeCode };
    const officeData = await this.storeOfficeService.getOfficeMasterByOfficeMasterId(officeFilter);
    this.officeHierarchy(officeData);
    this.treeForm.get('selectedNodes').setValue(this.nodes);
    console.log('office data', this.nodes);
    this.primengConfig.ripple = true;
    this.loader.hide(); 
  }

  pdfType: string = 'pdf';
  onRadioChange(val) {
    console.log(val);
    this.pdfType = val;
  }

  async generatePendingRegistrationReport() {
    if (this.isValidForm()) {
      this.getPdf().subscribe((data: any) => {
        const blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Pending Registration Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
      });
    }
  }

  error: any = '';
  isValidForm(): boolean {
    if (this.formGroup.get('officeId').invalid || this.formGroup.get('fromDate').invalid || this.formGroup.get('toDate').invalid) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);

      return false;
    } else {
      this.error = '';
      return true;
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());
    const milliseconds = this.padZero(date.getMilliseconds());

    return `${year}-${month}-${day} `;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId = this.id;
    const fromDate = this.formatDate(this.formGroup.value.fromDate);
    const toDate = this.formatDate(this.formGroup.value.toDate);
    return this.http.get(
      `${environment.baseURL}/api/pendingRegistration/generatePendingRegistrationReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&officeId=${officeId}&fromDate=${fromDate}&toDate=${toDate}`,
      { observe: 'response', responseType: 'blob' },
    );
  }

  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = this.officeCode;
    const fromDate = this.formatDate(this.formGroup.value.fromDate);
    const toDate = this.formatDate(this.formGroup.value.toDate);
    return this.http.get(
      `${environment.baseURL}/api/pendingRegistration/generatePendingRegistrationReportXLS?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&officeId=${officeCode}&fromDate=${fromDate}&toDate=${toDate}`,
      { observe: 'response', responseType: 'blob' },
    );
  }

  downloadExcelFile() {
    this.getExcelFile().subscribe((fileData: any) => {
      const blob: any = new Blob([fileData.body], {
        type: fileData.type,
      });
      let link = document.createElement('a');
      if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Pending Registration Report.xlsx`);
        document.body.appendChild(link);
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
        document.body.removeChild(link);
      }
    });
  }

  nodeSelect(node: any) {
    this.label = [node.label];
    this.id = [node.id];
    this.parseNestedObject(node);
    let row = [];
    this.rows = [];
    this.label.forEach((l) => {
      const rowData = this.data.filter((v: any) => v.office.toLowerCase().indexOf(l.toLowerCase()) > -1);
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

  nodeUnselect() {
    this.reset();
  }

  reset() {
    this.rows = this.data;
    this.treeForm.get('selectedNodes').setValue(this.nodes);
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
            id: c.officeMasterId,
            icon: 'pi pi-file',
          });
        });
      }
      child.push({
        label: v.officeName,
        id: v.officeMasterId,
        icon: 'pi pi-file',
        children: sub,
      });
    });
    this.nodes = [
      {
        label: parent.officeName,
        id: parent.officeMasterId,
        icon: 'pi pi-folder',
        children: child,
        expanded: true,
      },
    ];
    console.log('NODES', this.nodes);
  }
  getFormattedCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
