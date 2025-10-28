import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';
import { AddRoleResourceMappingMasterComponent } from './add-role-resource-mapping-master/add-role-resource-mapping-master.component';
import { UpdateRoleResourceMappingMasterComponent } from './update-role-resource-mapping-master/update-role-resource-mapping-master.component';
import { materialTypeparams } from 'src/app/models/configuration.model';
export interface RoleInfo {
  roleId: string;
  resourceName: string;
  resourceDiscription: string;
}

const RoleInfo_DATA: RoleInfo[] = [
  { roleId: 'AE', resourceName: 'Dashboard', resourceDiscription:'aa'},
  { roleId: 'AEE', resourceName: 'Estimates',resourceDiscription:'bb' }
];



@Component({
  selector: 'app-role-resource-mapping-master',
  templateUrl: './role-resource-mapping-master.component.html',
  styleUrls: ['./role-resource-mapping-master.component.scss']
})
export class RoleResourceMappingMasterComponent implements OnInit {

  subscriptionName: Subscription;
  resourceData: any;
  designationMasterData: any;
  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private Service: CommonService
  ) { 
    this.subscriptionName = this.Service.getUpdate().subscribe((message) => {

      console.log('role resource data', message['text']);
      if (message['text'] == 'Role Resource Type Updated') {
        
        this.ngOnInit();
      }
    });
  }

 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource(RoleInfo_DATA);
  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filters = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
    };
    this.resourceData = await this.configurationService.getRoleResourceTypegetallData(filters);
      console.log('Resource Type Master Data from service', this.resourceData);
      this.dataSource = new MatTableDataSource(this.resourceData);
      this.dataSource.paginator = this.paginator;
      console.log('Resource type all data', this.dataSource);

      this.designationMasterData = await this.configurationService.getDesignationMasterGetAllData(filters);

}
displayedColumns: string[] = [
  'slno',
  'roleName',
  'resourceName',
  'resourceDiscription',
  'action',
];

ngAfterViewInit() {
  this.paginator=this.paginator
  
}

applyFilter(filterValue: any) {
  console.log('filtervalue', filterValue);
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

getRoleName(roleId: any){
  const designation = this.designationMasterData.find(item => Number(item.designationMasterId) === roleId);

  var roleName: String="";
  if (designation) {
   roleName = designation.designationName;
    console.log(`Role Name for roleId ${roleId}: ${roleName}`);
} else {
    console.log(`Role with roleId ${roleId} not found.`);
}
return roleName;
}
openAddRoleResourceTypeDialog() {
  this.dialog.open(AddRoleResourceMappingMasterComponent, {
    width: '100%',
    disableClose: true,
    data : {
      field1 :  this.resourceData,
    }
  });
}

openUpdateRoleResourceTypeDialog(resource:any) {
  this.dialog.open(UpdateRoleResourceMappingMasterComponent, {
    width: '100%',
    disableClose: true,
    data : {
      field1 :   this.resourceData,
      field2 : resource,
    }
  });
}
}
