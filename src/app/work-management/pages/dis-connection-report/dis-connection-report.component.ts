import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DivisionalBudgetHeadService } from '../../../services/divisional-budget-head.service';
import { environment } from '../../../../environments/environment';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MobileUtils } from 'src/app/lib/mobile-utils';

const treeForm = new FormGroup({
  selectedNodes: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-dis-connection-report',
  templateUrl: './dis-connection-report.component.html',
  styleUrls: ['./dis-connection-report.component.scss']
})
export class DisConnectionReportComponent implements OnInit {
  formGroup: FormGroup;
  selectedWorkOrderNumber: string;
  nodes: any[] = [];
  selected: any; 
  DiscomData: any[] = [];
  public data: any[] = [];
  label: string[] = [];
  id: any[] = [];
  public rows: any | null = null;
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  officeId: string;
  @Input() loading: boolean = true;
  workOrders: any[] = [
    { number: 1, financialYear: '2023-24', divisionOffice: 'Division1' },
  ];
  
  selectedWorkOrder: any;
  corporateOptions:any = [{name:'CorporateName'}];
  zoneOptions:any= [{name:'ZoneName'}];
  circleOptions:any= ['CircleName'];
  divisionOptions: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private divisionalbudgetheadservice: DivisionalBudgetHeadService,
    private storeOfficeService: StoreOfficeService,
    private configurationService: ConfigurationService,
    private loader: LoaderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const discom = sessionStorage.getItem('discom');
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode
    };

    this.formGroup = this.formBuilder.group({  
      fromDate: [],
      toDate: [],
    });

    this.route.paramMap.subscribe(async (route: ParamMap) => {
      this.corporateOptions= await this.divisionalbudgetheadservice.getCircleOptions(filters);
    });
    const discomOffiefilter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      discom,
    };
    this.configurationService
      .getOfficeIdByDiscomCode(discomOffiefilter)
      .then(async (data) => {
        if (data && data.length > 0) {
          this.officeId = data[0].officeMasterId;
          this.loader.show('Loading Data');
          const filter: any = {
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            officeMasterId: this.officeId,
          };

          const officeData =
            (await this.storeOfficeService.getOfficeMasterByOfficeMasterId(
              filter
            )) as Array<any>;
          const parent = officeData.find(
            (v: any) => v.officeMasterId === this.officeId
          );
          const data1 = officeData
            .map((v) => {
              const newObject = { ...v };
              if (newObject.hasOwnProperty('officeName')) {
                newObject[
                  'label'
                ] = `${newObject['officeCode']} - ${newObject['officeName']}`;
                delete newObject['officeName'];
              }
              if (newObject['officeCode'] === 'onefilter') {
                return null;
              }
              newObject.icon = 'pi pi-file';
              return newObject;
            })
            .filter((v) => v !== null);

            this.officeHierarchy(data1, parent.parentId);

            this.treeControl.setValue(this.nodes);
            this.loader.hide();
            this.loading = false;
        }
      });
  }
  officeHierarchy(data1: any[], parentId: any) {
    const idMapping = data1.reduce((acc, el, i) => {
      acc[el.officeMasterId] = i;
      return acc;
    }, {});
    let root: any;
    data1.forEach((v) => {
      if (v.parentId == parentId) {
        root = v;
        return;
      }
      const parent = data1[idMapping[v.parentId]];
      if (!parent) {
        return;
      }
      parent.children = [...(parent.children || []), v];
    });
    this.nodes = [
      {
        label: root.label,
        icon: 'pi pi-folder',
        children: root.children,
        expanded: true,
      },
    ];
    console.log(this.nodes);
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

  handleWorkOrderSelection() {
    const selectedWorkOrderNumber = this.selectedWorkOrderNumber;
    this.selectedWorkOrder = this.workOrders.find(
      (order) => order.number.toString() === selectedWorkOrderNumber
    );
  }

  pdfType: string = 'pdf';
  onRadioChange(val) {
    console.log(val);
    this.pdfType = val;
  }

  async generateBudgetAbstractReport() {
    // Object.keys(this.formGroup.controls).forEach((key) => {
    //   this.formGroup.get(key)?.markAsTouched();
    // });
    // if (this.isValidForm()) {
    this.getPdf().subscribe(
      (response: any) => {
        if (response.ok) {
          const blob = new Blob([response.body], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = 'Disconnection-Report.pdf';
          if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
          this.snackBar.open('Report downloaded successfully', 'Close', {
            duration: 3000,
          });
        } else {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const messageText = e.target.result;
            this.snackBar.open(`Failed to generate report: ${messageText}`, 'Close', {
              duration: 5000,
            });
          };
          reader.readAsText(response.body);
        }
      },
      (error) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const messageText = e.target.result;
          this.snackBar.open(`${messageText}`, 'Close', {
            duration: 5000,
          });
        };
        reader.readAsText(error.error);
      }
    );
    // }
  }
  error: any = '';
  isValidForm(): boolean {
    if (
      this.formGroup.get('toDate').invalid ||
      this.formGroup.get('fromDate').invalid
    ) {
      this.error = 'Please Fill Out Mandatory Fields';
      console.log(this.error);
      return false;
    } else {
      this.error = '';
      return true;
    }
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId =this.id[0];
    const fromDate=this.formGroup.get('fromDate').value;
    const toDate=this.formGroup.get('toDate').value;
    return this.http.get(
      `${environment.baseURL}/api/disconnectionReport/generateStatementDisconnectionReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&officeId=${officeId}&fromDate=${fromDate}&toDate=${toDate}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId =this.id[0];
    const fromDate=this.formGroup.get('fromDate').value;
    const toDate=this.formGroup.get('toDate').value;
    return this.http.get(
      `${environment.baseURL}/api/disconnectionReport/generateStatementDisconnectionReportXLS?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&officeId=${officeId}&fromDate=${fromDate}&toDate=${toDate}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
  getFormattedCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  downloadExcelFile() {
    if (this.isValidForm()) {
      this.getExcelFile().subscribe((fileData: any) => {
        if (fileData.body.size > 0) {
          const blob: any = new Blob([fileData.body], {
            type: fileData.type,
          });
          let link = document.createElement('a');
          if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `Disconnection-Report.xlsx`);
            document.body.appendChild(link);
            if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
            document.body.removeChild(link);
          }
        } else {
          this.snackBar.open('Data not found!', 'Close', {
            duration: 5000,
          });
        }
      });
    }
  }
}

  
