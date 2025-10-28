import { Component, OnInit } from '@angular/core';
import { MaterialsIntentService } from '../../../services/materialsIntent.service';
@Component({
  selector: 'app-receiver-transfer-approval',
  templateUrl: './receiver-transfer-approval.component.html',
  styleUrls: ['./receiver-transfer-approval.component.scss'],
})
export class ReceiverTransferApprovalComponent implements OnInit {
  constructor(private materialIntentService: MaterialsIntentService) {}

  data: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const materialData = await this.materialIntentService.getUnApprovedStoreReceiverListByOffice({
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      receiverOfficeId: officeCode,
      typeOfIndent: 'STOCK_INDENT',
    });
    this.data = materialData.map((v: any, i: number) => {
      return { ...v, sno: i + 1 };
    });
    this.cols = [
      { key: 'sno', title: 'S No.' },
      { key: 'materialsIndentNo', title: 'Request No.', route: `/store-management/Receiver-transfer-approval-form` },
      { key: 'materialsIndentDate', title: 'Request Date' },
      { key: 'receiverStoreCode', title: 'Receiver Store' },
      { key: 'receiverOfficeName', title: 'Receiver Division' },
      { key: 'storeCode', title: 'Sender Store' },
      { key: 'senderOfficeName', title: 'Sender Division' },
    ];
    this.filterFields = this.cols.map((v: any) => v.key);
  }
}
