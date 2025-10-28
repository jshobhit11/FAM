import { Component, OnInit } from '@angular/core';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';

@Component({
  selector: 'app-materials-return-approval',
  templateUrl: './materials-return-approval.component.html',
  styleUrls: ['./materials-return-approval.component.scss'],
})
export class MaterialsReturnApprovalComponent implements OnInit {
  data: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];
  constructor(private materialsIntentService: MaterialsIntentService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId = sessionStorage.getItem('office-id');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, officeId, typeOfIndent: 'RETURN_INDENT' };
    const indentData = await this.materialsIntentService.getUnApprovedListOfReturnByOffice(filter);
    this.data = indentData.map((v: any, i: number) => {
      return { ...v, sno: i + 1 };
    });
    this.cols = [
      { key: 'sno', title: 'S No.' },
      { key: 'materialsIndentNo', title: 'Material Return Request No.', route: `/work-management/materials-return-approval-form` },
      { key: 'workorderNo', title: 'Work Order No.' },
      { key: 'workDescription', title: 'Work Description'},
      { key: 'materialsIndentDate', title: 'Material Indent Date' },
      { key: 'download', title:'Download'}
    ];
    this.filterFields = this.cols.map((v: any) => v.key);
  }
}
