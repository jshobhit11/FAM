import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CRegisteredService } from 'src/app/services/c-registered.service';
@Component({
  selector: 'app-acknowledgement-verification',
  templateUrl: './acknowledgement-verification.component.html',
  styleUrls: ['./acknowledgement-verification.component.scss'],
})
export class AcknowledgementVerificationComponent implements OnInit {
  acknowledgementData: object[] = [];
  labelName: any = 'Acknowledgement Pricing';
  filterFields: string[] = [];
  cols: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private cRegisteredService: CRegisteredService) {}

  async ngOnInit() {
    this.acknowledgementData = await this.cRegisteredService.getMaterialAcknowledgementList({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    });
    console.log(this.acknowledgementData);
    this.cols = [
      {
        key: 'invoiceNo',
        title: 'Invoice No.',
        route: '/work-management/acknowledgment-verification',
      },
      { key: 'transactionDate', title: 'Invoice Date' },
      { key: 'workorderNo', title: 'Work Order No' },
      { key: 'workDescription', title: 'Work Description' },
      { key: 'icon', title: 'Status', route: '/main/full-details' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
  }

  navigateToInvoiceDetails(acknowledgement) {
    this.router.navigate([`/work-management/acknowledgment-details`], {
      queryParams: {
        smStoreDispatchedInvoiceId: acknowledgement.smStoreDispatchedInvoiceId,
        wmMaterialsIndentId: acknowledgement.wmMaterialsIndentId,
      },
    });
  }
}
