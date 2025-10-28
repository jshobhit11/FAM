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
import { AddWorkOrderSeriesMasterComponent } from './add-work-order-series-master/add-work-order-series-master.component';
import { UpdateWorkOrderSeriesMasterComponent } from './update-work-order-series-master/update-work-order-series-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
export interface WorkOrderSeriesInfo {
  officeId: string;
  officeName: string;
  accountHeadmasterId: string;
  accountHeadCode: string;
  financialYear: string;
  alphabetSequence: string;
  startNumber: number;
  endNumber: number;
}
const WorkOrderSeriesInfo_DATA: WorkOrderSeriesInfo[] = [];
@Component({
  selector: 'app-work-order-series-master',
  templateUrl: './work-order-series-master.component.html',
  styleUrls: ['./work-order-series-master.component.scss'],
})
export class WorkOrderSeriesMasterComponent implements OnInit {
  officeId = [];
  officeTypeData: any[] = [];
  treeControl = new FormControl('', []);
  @Input() loading: boolean = true;
  nodes: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource(WorkOrderSeriesInfo_DATA);
  DiscomData: any[] = [];
  subscriptionName: any;
  financialYearData: any[] = [];
  financialData: any = {};
  parent:any;
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
      console.log('Workscope Order Type data', message['text']);
      if (message['text'] == 'Work order series') {
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
    const filters: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };
    this.configurationService
      .getWorkOrderSeriesGetAllData(filters)
      .then((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });

    this.financialData =
      await this.configurationService.getfinanacialYearGetAllData(filters);
    const uniqueValues = {};
    this.financialYearData = this.financialData
      .map((executionType) => ({
        financialYear: executionType.financialYear,
      }))
      .filter((executionType) => {
        const isUnique = !uniqueValues[executionType.woExecutionMethodId];

        if (isUnique) {
          uniqueValues[executionType.woExecutionMethodId] = true;
        }
        return isUnique;
      });
      this.configurationService.getAllDiscomData(filters).then((data) => {
        this.DiscomData = data.map((discomData) => ({
          discomCode: discomData.discomCode,
          discomName: discomData.discomName,
          
        }));
      });
      const discomOffiefilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        discom,
      };

    this.loader.show('Loading Data');
    const sessionOfficeId = sessionStorage.getItem('office-id');
    this.configurationService.getOfficeIdByDiscomCode(discomOffiefilter).then(async (data) => {
      if (data && data.length > 0) {
        const matchingOffice = data.find((office) => office.officeMasterId === sessionOfficeId);
        if (matchingOffice) {
          this.officeId = matchingOffice.officeMasterId; 
          
          this.loader.show('Loading Data');
          const filter: any = {
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            officeMasterId: this.officeId,  
          };
    
          const officeData = await this.storeOfficeService.getOfficeMasterByOfficeMasterId(filter) as Array<any>;
          this.parent = [officeData.find((v: any) => v.officeMasterId === this.officeId)].filter(Boolean);

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
    
          //this.officeHierarchy(data1, parent.parentId);
          this.treeControl.setValue(this.nodes);
          this.loader.hide();
          this.loading = false;
          this.dataSource.paginator = this.paginator;
        } else {
          console.error('No matching officeId found');
        }
      }
    });
  }

  displayedColumns: string[] = [
    'slno',
    'officeId',
    'accountHeadMasterId',
    'financialYear',
    'alphabetSequence',
    'startNumber',
    'endNumber',
    // 'action',
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

  openAddWorkOrderSeriesDialog() {
    this.dialog.open(AddWorkOrderSeriesMasterComponent, {
      width: '100%',
      data: {
        field1: this.parent,
        field3: this.financialData,
      },
    });
  }

  openUpdateWorkOrderSeriesDialog(workOrderSeriesMasterId: any) {
    this.dialog.open(UpdateWorkOrderSeriesMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.parent,
        field3: this.financialData,
        field5: workOrderSeriesMasterId,
      },
    });
  }
}
