import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkCompletionService } from '../../services/work-completion.service';
import { WorkAwardService } from 'src/app/services/work-award.service';

@Component({
  selector: 'app-work-completion-report',
  templateUrl: './work-completion-report.component.html',
  styleUrls: ['./work-completion-report.component.scss'],
})
export class WorkCompletionReportComponent implements OnInit {
  estimatesList: any[] = [];
  labelName = 'Work Completion/Joint Inventory Report';
  cols: any[] = [];
  filterFields: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workCompletionService: WorkCompletionService,
    private workAwardService: WorkAwardService
  ) {}

  async ngOnInit() {
    const role = sessionStorage.getItem('user-role');
    this.estimatesList = await this.workCompletionService.getWorkCompletionData(
      {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        officeMasterId: sessionStorage.getItem('office-id'),
        designationCode: role.split('_')[1],
      }
    );
    this.cols = [
      { key: 'referenceNumber', title: 'Case ID',route: '/work-management/work-complition', },
      {
        key: 'workorderNo',
        title: 'Work Order No.',
        route: '/work-management/work-complition',
      },
      { key: 'workorderDate', title: 'Work Order Date' },
      { key: 'workDescription', title: 'Work Description' },
      { key: 'officeName', title: 'Office Name' },
      // { key: 'statusName', title: 'Status Pending For' },
      // { key: 'registeredSource', title: 'Registered Source' },
      // { key: 'registeredOn', title: 'Registered On' },
      {
        key: 'applicationTypeName',
        title: 'Application Type Name',
        },
      { key: 'icon', title: 'Status', route: '/main/full-details' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
  }

  navigateToWorkCompletionReport(estimation) {
    this.router.navigate(['/work-management/work-complition'], {
      queryParams: { workorderRegisteredId: estimation.workorderRegisteredId },
    });
  }
}
