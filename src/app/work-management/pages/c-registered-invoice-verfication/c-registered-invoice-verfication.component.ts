import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CRegisteredService } from 'src/app/services/c-registered.service';

@Component({
  selector: 'app-c-registered-invoice-verfication',
  templateUrl: './c-registered-invoice-verfication.component.html',
  styleUrls: ['./c-registered-invoice-verfication.component.scss'],
})
export class CRegisteredInvoiceVerficationComponent implements OnInit {
  invoiceData: object[] = [];
  labelName: any = 'Invoice Pricing';
  filterFields: string[] = [];
  cols: any[] = [];

  constructor(private router: Router, private cRegisteredService: CRegisteredService) {}

  async ngOnInit() {
    this.invoiceData = await this.cRegisteredService.getInvoiceListData({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    });
    console.log(this.invoiceData);
    this.cols = [
      {
        key: 'invoiceNo',
        title: 'Invoice No.',
        route: '/work-management/invoice-verification',
      },
      { key: 'transactionDate', title: 'Invoice Date' },
      { key: 'workorderNo', title: 'Work Order No' },
      { key: 'workDescription', title: 'Work Description' },
      { key: 'icon', title: 'Status', route: '/main/full-details' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
  }

  navigateToInvoiceDetails(invoice) {
    this.router.navigate([`/work-management/invoice-verification-details`], {
      queryParams: {
        smStoreDispatchedInvoiceId: invoice.smStoreDispatchedInvoiceId,
        wmMaterialsIndentId: invoice.wmMaterialsIndentId,
      },
    });
  }
}
