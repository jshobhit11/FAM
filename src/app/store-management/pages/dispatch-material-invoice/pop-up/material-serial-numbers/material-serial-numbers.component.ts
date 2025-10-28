import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';
import { MaterialIndentRequestFormComponent } from 'src/app/work-management/pages/material-indent-request-form/material-indent-request-form.component';

@Component({
  selector: 'app-material-serial-numbers',
  templateUrl: './material-serial-numbers.component.html',
  styleUrls: ['./material-serial-numbers.component.scss'],
})
export class MaterialSerialNumbersComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['workExecutionMethod', 'workorderDate', 
    'workorderNo', 'workDescription', 'select'];
  searchValue: string = '';
  tempData: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MaterialIndentRequestFormComponent>,
    private materialsIntentService: MaterialsIntentService,
  ) {
    this.tempData = data;
    
  }

  ngOnInit(): void {
    console.log("data in popup",this.data)
  }
  applyFilter(filterValue: string) {
    const searchText = this.searchValue.toLowerCase();
    console.log('searchText===', searchText);

    if (!searchText) {
      this.data = this.tempData;
      return;
    }
    this.data = this.data.filter((template: any) => {
     
      return Object.values(template).some((value: any) =>
        value.toString().toLowerCase().includes(searchText)
      );
    });
  
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  async onApply(wmWorkorderRegisteredId: any) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId = sessionStorage.getItem('office-id');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, officeId, WorkorderRegisteredId: wmWorkorderRegisteredId };
    const wmWorkOrderData = await this.materialsIntentService.getByWmWorkorderRegisteredId(filter);
    this.dialogRef.close(wmWorkOrderData);

}
}
