import {
  AfterViewInit,
  Component,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { UpdateVendorComponent } from './update-vendor/update-vendor.component';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';

export interface MateName {
  vendorRegistrationNo: string;
  vendorRegistrationDate: string;
  vendorRegistrationValidUpto: string;
  vendorOrganizationName: string;
  discomName: string;
}

const Vendor_DATA: MateName[] = [];
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss'],
})
export class VendorComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(Vendor_DATA);
  subscriptionName: Subscription;
  officeTypeData: any[] = [];
  treeControl = new FormControl('', []);
  @Input() loading: boolean = true;
  nodes: any[] = [];
  DiscomData: any[] = [];
  officeId: string;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService,
    private storeOfficeService: StoreOfficeService,
    private loader: LoaderService
  ) {
    // subscribe to sender component messages
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {
      //message contains the data sent from service
      console.log('Vendor updated', message['text']);
      if (message['text'] == 'Vendor updated') {
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
    this.configurationService.getAllDataVendor(filters).then((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Vendor all data', this.dataSource);

      this.configurationService.getAllDiscomData(filters).then((data1) => {
        this.DiscomData = data1.map((discomData) => ({
          discomCode: discomData.discomCode,
          discomName: discomData.discomName,
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
    };    this.configurationService.getOfficeIdByDiscomCode(discomOffiefilter).then(async (data) => {
      if (data && data.length > 0) {
      //  this.officeId = data[0].officeMasterId;
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
}
});
  }

  displayedColumns: string[] = [
    'slno',
    'vendorRegistrationNo',
    'vendorRegistrationDate',
    'vendorRegistrationValidUpto',
    'vendorOrganizationName',
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
    console.log(this.nodes);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddVendorItemDialog() {
    this.dialog.open(AddVendorComponent, {
      width: '100%',
      height:'95%',
      data: {
        field3: this.nodes,
        field2: this.DiscomData,
      },
    });
  }

  openUpdateVendorItemDialog(vendorMasterId: any) {
    this.dialog.open(UpdateVendorComponent, {
      width: '100%',
      height:'95%',
      disableClose: true,
      data: {
        field1: vendorMasterId,
        field3: this.nodes,
        field2: this.DiscomData,
      },
    });
  }
}
