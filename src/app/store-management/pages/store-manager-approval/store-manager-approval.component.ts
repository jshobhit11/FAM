import { Component, OnInit } from '@angular/core';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
@Component({
  selector: 'app-store-manager-approval',
  templateUrl: './store-manager-approval.component.html',
  styleUrls: ['./store-manager-approval.component.scss'],
})
export class StoreManagerApprovalComponent implements OnInit {
  greenColor: boolean = false;
  yellowColor: boolean = false;
  redColor: boolean = false;
  data: any[] = [];
  cols: any[] = [];
  filterFields: any[] = [];
  constructor(private storeOfficeService: StoreOfficeService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId = sessionStorage.getItem('office-id');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, officeMasterId: officeId };
    const storeData = await this.storeOfficeService.getStoreOfficeApprovalListData(filter);
    this.data = storeData.map((v: any) => {
      return { ...v, indicator: this.getDayDiff(v.materialsIndentApprovedDate) };
    });
    this.cols = [
      { key: 'materialsIndentNo', title: 'Request No.', route: `/store-management` },
      { key: 'materialsIndentApprovedDate', title: 'Counter Sign Date' },
      { key: 'indicator', title: 'Indicator' },
      { key: 'requestedBy', title: 'Request By	' },
      { key: 'typeOfIndent', title: 'Type Of Indent	' },
      { key: 'store', title: 'To Store Office' },
      { key:'download', title:'Download'}
    ];
    this.filterFields = this.cols.map((v: any) => v.key);
  }

  getDayDiff(dt: Date): number {
    const startDate = new Date(dt);
    const today = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs(today.getTime() - startDate.getTime()) / msInDay);
  }
}
