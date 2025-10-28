import { Component, OnInit } from '@angular/core';
import { MaterialsIntentService } from '../../../services/materialsIntent.service';

@Component({
  selector: 'app-store-transfer-approval',
  templateUrl: './store-transfer-approval.component.html',
  styleUrls: ['./store-transfer-approval.component.scss'],
})
export class StoreTransferApprovalComponent implements OnInit {
  data: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];

  constructor(private materialIntentService: MaterialsIntentService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const materialData = await this.materialIntentService.getUnApprovedStoreListByOffice({
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      officeId: officeCode,
      typeOfIndent: 'STOCK_INDENT',
    });
    this.data = materialData.map((v: any, i: number) => {
      return {
        ...v,
        sno: i + 1,
        receiverStore: `${v.receiverStoreCode == 'null' ? '-' : v.receiverStoreCode}-${
          v.receiverStoreName == 'null' ? '-' : v.receiverStoreName
        }`,
        senderStore: `${v.storeCode == 'null' ? '-' : v.storeCode}-${v.senderStoreName == 'null' ? '-' : v.senderStoreName}`,
      };
    });
    this.cols = [
      { key: 'sno', title: 'S No.' },
      { key: 'materialsIndentNo', title: 'Request No.', route: `/store-management/store-transfer-approval-form` },
      { key: 'materialsIndentDate', title: 'Request Date' },
      { key: 'receiverStore', title: 'Receiver Store' },
      // { key: 'receiverOfficeName', title: 'Receiver Division' },
      { key: 'senderStore', title: 'Sender Store' },
      // { key: 'senderOfficeName', title: 'Sender Division' },
      { key: 'download', title: 'Download' },
    ];
    this.filterFields = this.cols.map((v: any) => v.key);
  }
}
