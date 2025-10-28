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
import { AddEmployeeMasterComponent } from './add-employee-master/add-employee-master.component';
import { UpdateEmployeeMasterComponent } from './update-employee-master/update-employee-master.component';
import { CommonService } from 'src/app/services/common.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
export interface EmployeeInfo {
  employeeCode: string;
  employeeName: string;
  employeeAddress: string;
  mobileNo: number;
  email: string;
  designationId: string;
  officeId: string;
}
const EmployeeInfo_DATA: EmployeeInfo[] = [];
@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss'],
})
export class EmployeeMasterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(EmployeeInfo_DATA);
  subscriptionName: any;
  officeTypeData: any[] = [];
  designationTypeData: any[] = [];
  designationData: any = {};
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
      console.log('Employee Master data', message['text']);
      if (message['text'] == 'Employee Master Updated') {
        this.ngOnInit();
      }
    });
  }

  async ngOnInit() {
    this.loader.show('Loading Data');
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
      userCode,
    };
    this.configurationService.getEmpMasteGetAllData(filters).then((data) => {
      console.log('Employee Master Data from service', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      console.log('Employee Master all data', this.dataSource);
    });
    console.log(this.dataSource);
    this.configurationService.getAllDiscomData(filters).then((data) => {
      this.DiscomData = data.map((discomData) => ({
        discomCode: discomData.discomCode,
        discomName: discomData.discomName,
      }));
    });
    this.designationData =
      await this.configurationService.getDesignationMasterGetAllData(filters);
    const uniqueValues = {};
    this.designationTypeData = this.designationData
      .map((designationType) => ({
        designationMasterId: designationType.designationMasterId.toString(),
        designationName: designationType.designationName,
      }))
      .filter((designationType) => {
        const isUnique = !uniqueValues[designationType.designationMasterId];
        if (isUnique) {
          uniqueValues[designationType.designationMasterId] = true;
        }
        return isUnique;
      });
    this.loader.show('Loading Data');
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
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  displayedColumns: string[] = [
    'slno',
    'employeeCode',
    'employeeName',
    'employeeAddress',
    'mobileNo',
    'email',
    'designationId',
    'officeId',
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

  openAddEmployeeTypeDialog() {
    this.dialog.open(AddEmployeeMasterComponent, {
      width: '100%',
      data: {
        field1: this.nodes,
        field2: this.designationData,
      },
    });
  }

  openUpdateEmployeeTypeDialog(employeeMasterId: any, item: any) {
    this.dialog.open(UpdateEmployeeMasterComponent, {
      width: '100%',
      disableClose: true,
      data: {
        field1: this.nodes,
        field2: this.designationData,
        field3: employeeMasterId,
        field4: item,
      },
    });
  }
}
