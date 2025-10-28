import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CRegisteredService } from 'src/app/services/c-registered.service';
@Component({
  selector: 'app-bill-submission-c-register',
  templateUrl: './bill-submission-c-register.component.html',
  styleUrls: ['./bill-submission-c-register.component.scss'],
})
export class BillSubmissionCRegisterComponent implements OnInit {
  constructor(private cRegisteredService: CRegisteredService, private route: ActivatedRoute) {}

  data: any = [];
  labelName: any = 'Bill Submission Pricing';
  filterFields: string[] = [];
  cols: any[] = [];

  async ngOnInit() {
    const data = await this.cRegisteredService.getBillSubmissionList({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    });
    this.data = data;
    this.cols = [
      {
        key: 'billInvoiceNo',
        title: 'Bill No.',
        route: '/work-management/c-register-bill-submission',
      },
      { key: 'billAmount', title: 'Bill Amount' },
      { key: 'billSubmissionDate', title: 'Bill Submission Date' },
      { key: 'workorderNo', title: 'Work Order No' },
      { key: 'workDescription', title: 'Work Description' },
      { key: 'icon', title: 'Status', route: '/main/full-details' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
  }
}
