import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AddRateContractMasterComponent } from './add-rate-contract-master/add-rate-contract-master.component';
import { UpdateRateContractMasterComponent } from './update-rate-contract-master/update-rate-contract-master.component';
import { CommonService } from 'src/app/services/common.service';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
export interface RateContractName {
  rcCode: string;
  vendorId: string;  
  rcVendorName: string;
  rcWorkDescription: number;
  rcValidity: number;
  executionMethod: string;
  discomName: string;
}
const RateContract_DATAs: RateContractName[] = [];
@Component({
  selector: 'app-rate-contract-master',
  templateUrl: './rate-contract-master.component.html',
  styleUrls: ['./rate-contract-master.component.scss'],
})
export class RateContractMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterValue: string;
  dataSource = new MatTableDataSource<RateContractName>(RateContract_DATAs);
  subscriptionName: any;
  officeId: string;
  vendorData: any[] = [];
  discomofficeData: any[] = [];
  treeControl = new FormControl('', []);
  @Input() loading: boolean = true;
  nodes: any[] = [];
  DiscomData: any[] = [];
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private storeOfficeService: StoreOfficeService,
    private loader: LoaderService
  ) {
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      console.log('Rate Contractor Master data', message['text']);
      if (message['text'] == 'Rate Contractor Master Updated') {
        this.ngOnInit();
      }
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const discom = sessionStorage.getItem('discom');
    const officeId = sessionStorage.getItem('office-id');
    this.officeId =officeId;
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };
    this.configurationService.getAllContractData(filters).then((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('RC contract', this.dataSource);

      this.configurationService.getAllDiscomData(filters).then((data) => {
        this.DiscomData = data.map((discomData) => ({
          discomCode: discomData.discomCode,
          discomName: discomData.discomName,
          
        }));
      });
      this.configurationService.getAllDataVendor(filters).then((data) => {
        console.log('data', data);
        this.vendorData = data.map((vendorData) => ({
          vendorId: vendorData.vendorMasterId,
          vendorOrganizationName: vendorData.vendorOrganizationName,
        }));
      });
    });

    const discomOffiefilter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      discom,
    };
    this.configurationService.getOfficeIdByDiscomCode(discomOffiefilter).then(async (data) => {
          if (data && data.length > 0) {
          this.loader.show('Loading Data');
          const filter: any = {
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            officeMasterId:this.officeId,
          };
    
    const officeData =
      (await this.storeOfficeService.getOfficeMasterByOfficeMasterId(
        filter
      )) as Array<any>;
      const parent = officeData.find((v: any) => v.officeMasterId === this.officeId);
      const data1 = officeData.map((v) => {
          const newObject = { ...v };
          if (newObject.hasOwnProperty('officeName')) {
              newObject['label'] = `${newObject['officeCode']} - ${newObject['officeName']}`;
              delete newObject['officeName'];
          }
          if (newObject['officeCode'] === 'onefilter') {
              return null; 
          }
          newObject.icon = 'pi pi-file';
          return newObject;
      }).filter((v) => v !== null); 
      
      this.officeHierarchy(data1, parent.parentId);
      
    this.treeControl.setValue(this.nodes);
    this.loader.hide();
    this.loading = false;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter) => {
      return data.rcVendorName.trim().toLowerCase().includes(filter);
    };
    }
    });
  }//end of ngOnInIt

  displayedColumns: string[] = [
    'slno',
    'rcCode',
    'rcVendorName',
    'rcWorkDescription',
    'rcValidity',
    'executionMethod',
    'discom',
    'action',
  ];

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
  }

  ngAfterViewInit() {
    this.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openUpdateRateContractMasterItemDialog(rateContractMasterId: any) {
    this.dialog.open(UpdateRateContractMasterComponent, {
      width: '100%',
      data: {
        field1: this.vendorData,
        field2: rateContractMasterId,
        field3: this.nodes,
        field4: this.DiscomData,
      },
    });
  }

  openAddRateContractMasterItemDialog() {
    this.dialog.open(AddRateContractMasterComponent, {
      width: '100%',
      data: {
        field1: this.vendorData,
        field3: this.nodes,
        field4: this.DiscomData,
      },
    });
  }
}
