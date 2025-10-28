import { Component, OnInit } from '@angular/core';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';

@Component({
  selector: 'app-material-acknowledment',
  templateUrl: './material-acknowledment.component.html',
  styleUrls: ['./material-acknowledment.component.scss'],
})
export class MaterialAcknowledmentComponent implements OnInit {
  data: any[] = [];
  cols: any[] = [];
  role: string = '';
  filterFields: string[] = [];

  constructor(private materialInvoiceService: MaterialInvoiceService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeMasterId = sessionStorage.getItem('office-id');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, officeMasterId };
    const storeData = await this.materialInvoiceService.getMaterialReturnDataByOfficeId(filter);
    this.data = storeData.map((v: any, i: number) => {
      return { ...v, sno: i + 1, indicator: this.getDayDiff(v.materialsIndentApprovedDate) };
    });
    this.role = userRole.split('_')[1];
    if (this.role == 'AE') {
      this.cols = [
        { key: 'sno', title: 'S No.' },
        { key: 'materialsIndentNo', title: 'Request No.', route: `/store-management` },
        { key: 'requestedBy', title: 'Request By	' },
        { key: 'typeOfIndent', title: 'Type Of Indent	' },
        { key: 'store', title: 'To Store Office' },
        { key: 'download', title: 'Download' },
      ];
    } else {
      this.cols = [
        { key: 'sno', title: 'S No.' },
        { key: 'materialsIndentNo', title: 'Request No.', route: `/store-management` },
        { key: 'materialsIndentApprovedDate', title: 'Counter Sign Date' },
        { key: 'indicator', title: 'Indicator' },
        { key: 'requestedBy', title: 'Request By	' },
        { key: 'typeOfIndent', title: 'Type Of Indent	' },
        { key: 'store', title: 'To Store Office' },
        { key: 'download', title: 'Download' },
      ];
    }
    console.log('data', this.data);
    this.filterFields = this.cols.map((v: any) => v.key);
  }

  getDayDiff(dt: Date): number {
    const startDate = new Date(dt);
    const today = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs(today.getTime() - startDate.getTime()) / msInDay);
  }
}
