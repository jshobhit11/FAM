import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillSubmissionService } from 'src/app/services/bill-submission.service';

@Component({
  selector: 'app-bill-submission-list',
  templateUrl: './bill-submission-list.component.html',
  styleUrls: ['./bill-submission-list.component.scss'],
})
export class BillSubmissionListComponent implements OnInit {
  billSubmission: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];
  labelName: any = 'Bill Submission List';
  workorderNo: '';
  constructor(private router: Router, private route: ActivatedRoute, private billSubmissionService: BillSubmissionService) {}

  async ngOnInit() {
    this.billSubmission = await this.billSubmissionService.getBillSubmissionDataByOfficeMasterId({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      officeMasterId: sessionStorage.getItem('office-id'),
    });
    this.cols = [
      { key: 'referenceNumber', title: 'Case ID',route: '/work-management/bill-submission',},
      {
        key: 'workorderNo',
        title: 'Work Order No.',
        route: '/work-management/bill-submission',
      },
      { key: 'workorderDate', title: 'Work Order Date' },
      { key: 'workDescription', title: 'Work Description' },
      { key: 'officeName', title: 'Office Name' },
      { key: 'statusName', title: 'Status Pending For' },
      { key: 'registeredSource', title: 'Registered Source' },
      { key: 'registeredOn', title: 'Registered On' },
      { key: 'icon', title: 'Status', route: '/main/full-details' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
  }

  navigateToBillSubmission(bills) {
    this.router.navigate(['/work-management/bill-submission'], {
      queryParams: {
        workorderRegisteredId: bills.workorderRegisteredId,
        workorderNo: this.workorderNo,
      },
    });
  }
}
