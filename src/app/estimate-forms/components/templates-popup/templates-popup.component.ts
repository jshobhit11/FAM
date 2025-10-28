import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstimationRegisteredService } from 'src/app/services/estimationRegistered';
import { EstimateFormsComponent } from '../../estimate-forms.component';

@Component({
  selector: 'app-templates-popup',
  templateUrl: './templates-popup.component.html',
  styleUrls: ['./templates-popup.component.scss'],
})
export class TemplatesPopupComponent implements OnInit {
  templateData: any;
  tempData: any;
  searchValue: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private estimationService: EstimationRegisteredService,
    public dialogRef: MatDialogRef<EstimateFormsComponent>
  ) {
    this.tempData = data;

  }

  ngOnInit(): void {

    console.log("data in popup",this.data)
  
  }

  async onSave(templateNumber: any) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      templateNumber,
    };
    this.templateData = await this.estimationService.getDataByTemplate(filter);
    this.dialogRef.close(this.templateData);
  }

  applyFilter() {
   
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
  }
}
