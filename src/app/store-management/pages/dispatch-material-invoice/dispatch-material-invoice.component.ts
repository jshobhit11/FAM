import { Component, OnInit } from '@angular/core';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';

@Component({
  selector: 'app-dispatch-material-invoice',
  templateUrl: './dispatch-material-invoice.component.html',
  styleUrls: ['./dispatch-material-invoice.component.scss'],
})
export class DispatchMaterialInvoiceComponent implements OnInit {
  data: any[] = [];
  cols: any[] = [];
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
    const invoiceData = await this.materialInvoiceService.getMaterialInvoiceDataByOfficeId(filter);
    const filteredData = invoiceData.filter(
      (item: any) => item.typeOfIndent === 'INDENT' || item.typeOfIndent === 'SUSPENSE_INDENT' || item.typeOfIndent === 'STOCK_INDENT',
    );
    this.data = filteredData.map((v: any, i: number) => {
      return { ...v, sno: i + 1, indicator: this.getDayDiff(v.materialsIndentApprovedDate) };
    });
    this.cols = [
      { key: 'sno', title: 'S NO.' },
      { key: 'materialsIndentNo', title: 'Request No.', route: `/store-management` },
      { key: 'materialsIndentApprovedDate', title: 'Counter Sign Date' },
      { key: 'indicator', title: 'Indicator' },
      { key: 'typeOfIndent', title: 'Type Of Indent' },
      { key: 'officename', title: 'From Office' },
      { key: 'store', title: 'Allocated Store' },
      { key: 'requestedBy', title: 'Request By' },
      { key: 'download', title:'Download'}
    ];
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
