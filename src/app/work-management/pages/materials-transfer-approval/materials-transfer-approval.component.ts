import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialsIntentService } from '../../../services/materialsIntent.service';

@Component({
  selector: 'app-materials-transfer-approval',
  templateUrl: './materials-transfer-approval.component.html',
  styleUrls: ['./materials-transfer-approval.component.scss'],
})
export class MaterialsTransferApprovalComponent implements OnInit {
  data: any = [];
  cols: any[] = [];
  filterFields: string[] = [];

  constructor(private materialIntentService: MaterialsIntentService, private snackBar: MatSnackBar, private route: ActivatedRoute) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const materialData = await this.materialIntentService.getUnApprovedListByOffice({
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      officeId: officeCode,
      typeOfIndent: 'SUSPENSE_INDENT',
    });
    this.data = materialData.map((v: any, i: number) => {
      return {
        ...v,
        srCode: `${v.storeCode == 'null' ? '-' : v.storeCode} - ${v.receiverStoreCode == 'null' ? '-' : v.receiverStoreCode}`,
        sno: i + 1,
      };
    });
    this.cols = [
      { key: 'sno', title: 'S No.' },
      { key: 'materialsIndentNo', title: 'Request No', route: '/work-management/materials-transfer-approval-form' },
      { key: 'materialsIndentDate', title: 'Request Date' },
      { key: 'srCode', title: 'Store' },
      { key:'download', title:'Download'}
    ];
    this.filterFields = this.cols.map((v: any) => v.key);
  }
}
