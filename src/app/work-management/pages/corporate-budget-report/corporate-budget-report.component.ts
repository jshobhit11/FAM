import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators , FormControl} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DivisionalBudgetHeadService } from '../../../services/divisional-budget-head.service';
import { environment } from '../../../../environments/environment';
import * as _ from 'lodash';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MobileUtils } from 'src/app/lib/mobile-utils';

const treeForm = new FormGroup({
  selectedNodes: new FormControl('', [Validators.required]),
});
@Component({
  selector: 'app-corporate-budget-report',
  templateUrl: './corporate-budget-report.component.html',
  styleUrls: ['./corporate-budget-report.component.scss'],
})
export class CorporateBudgetReportComponent implements OnInit {
  formGroup: FormGroup;
  selectedWorkOrderNumber: string;
  label: string[] = [];
  id: any[] = [];
  public rows: any | null = null;
  treeControl = new FormControl('', []);
  treeForm: FormGroup = treeForm;
  public data: any[] = [];
  nodes: any[] = [];
  selected: any; 
  DiscomData: any[] = [];
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
    private loader: LoaderService
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
      // corporate: ['', [Validators.required]],
      // zone: ['', [Validators.required]],
      // circle: ['', [Validators.required]],
      // division: ['', [Validators.required]],
      financialYear: ['', [Validators.required]],
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
      this.getPdf().subscribe((data: any) => {
        const blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Corporate Budget Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
      });
    //  }
  }

  error: any = '';
  isValidForm(): boolean {
    if (
      this.formGroup.get('financialYear').invalid
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
    const officeId =sessionStorage.getItem('office-id');;
    const financialYear=this.formGroup.get('financialYear').value;

    return this.http.get(
      `${environment.baseURL}/api/divisionalBudget/generateCorporateBudgetAbstractReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&officeId=${officeId}&financialYear=${financialYear}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId =sessionStorage.getItem('office-id');;
    const financialYear=this.formGroup.get('financialYear').value;

    return this.http.get(
      `${environment.baseURL}/api/divisionalBudget/generateCorporateBudgetAbstractReportXLS?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&officeId=${officeId}&financialYear=${financialYear}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  downloadExcelFile() {
    if (this.isValidForm()) {
      this.getExcelFile().subscribe((fileData: any) => {
        const blob: any = new Blob([fileData.body], {
          type: fileData.type,
        });
        let link = document.createElement('a');
        if (link.download !== undefined) {
          let url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `Corporate Budget Report.xlsx`);
          document.body.appendChild(link);
          if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
          document.body.removeChild(link);
        }
      });
    }
  }



}
