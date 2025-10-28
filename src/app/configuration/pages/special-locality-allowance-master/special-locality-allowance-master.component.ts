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
import { AddSpecialLocalityAllowanceMasterComponent } from './add-special-locality-allowance-master/add-special-locality-allowance-master.component';
import { UpdateSpecialLocalityAllowanceMasterComponent } from './update-special-locality-allowance-master/update-special-locality-allowance-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';

export interface SpecialLocalityAllowanceInfo {
  officeId: string;
  districtId: string;
  percentageValue: string;
}
const SpecialLocalityAllowancInfo_DATA: SpecialLocalityAllowanceInfo[] = [];
@Component({
  selector: 'app-special-locality-allowance-master',
  templateUrl: './special-locality-allowance-master.component.html',
  styleUrls: ['./special-locality-allowance-master.component.scss'],
})
export class SpecialLocalityAllowanceMasterComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(SpecialLocalityAllowancInfo_DATA);
  subscriptionName: any;
  districtTypeData: any[] = [];
  districtData: any = {};
  treeControl = new FormControl('', []);
  @Input() loading: boolean = true;
  nodes: any[] = [];

  displayedColumns: string[] = [
    'slno',
    'officeId',
    'districtId',
    'percentageValue',
    'action',
  ];

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
      console.log('Special Locality Allowance Master data', message['text']);
      if (message['text'] == 'Special Locality Allowance Master Updated') {
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
    const filters: any = { apiKey, serviceKey, userRole, userName, userCode };
    try {
      const data = await this.configurationService.getSpecialLocalityGetAllData(
        filters
      );
      this.districtData = await this.configurationService.getdistrictMasterData(
        filters
      );
      const uniqueValues = {};
      this.districtTypeData = this.districtData
        .map((districtType) => ({
          districtId: districtType.districtId.toString(),
          districtName: districtType.districtName,
        }))
        .filter((districtType) => {
          const isUnique = !uniqueValues[districtType.districtId];

          if (isUnique) {
            uniqueValues[districtType.districtId] = true;
          }
          return isUnique;
        });

      this.loader.show('Loading Data');
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeMasterId: '1',
      };
      const officeData =
        (await this.storeOfficeService.getOfficeMasterByOfficeMasterId(
          filter
        )) as Array<any>;
      const parent = officeData.find((v: any) => v.officeMasterId === '1');
      const data1 = officeData.map((v) => {
        const newObject = { ...v };
        if (newObject.hasOwnProperty('officeName')) {
          newObject['label'] = newObject['officeName'];
          delete newObject['officeName'];
        }
        delete newObject['officeCode'];
        newObject.icon = 'pi pi-file';
        return newObject;
      });
      this.officeHierarchy(data1, parent.parentId);
      this.treeControl.setValue(this.nodes);
      this.loader.hide();
      this.loading = false;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log(
        'Special Locality Allowance Master all data',
        this.dataSource
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddSpecialLocalityAllowanceTypeDialog() {
    this.dialog.open(AddSpecialLocalityAllowanceMasterComponent, {
      width: '100%',
      data: {
        field3: this.nodes,
        field4: this.districtData,
      },
    });
  }

  openUpdateSpecialLocalityAllowanceTypeDialog(
    specialLocalityAllowanceMasterId: any,
    item: any
  ) {
    this.dialog.open(UpdateSpecialLocalityAllowanceMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field2: specialLocalityAllowanceMasterId,
        field3: this.nodes,
        field4: this.districtData,
      },
    });
  }
}
