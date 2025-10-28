import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-other-service-requests-estimation-approval',
  templateUrl: './other-service-requests-estimation-approval.component.html',
  styleUrls: ['./other-service-requests-estimation-approval.component.scss'],
})
export class OtherServiceRequestsEstimationApprovalComponent implements OnInit {
  estimatesList: any[] = [
    {
      accountId: '13293049303',
      applicantName: 'Rajesh',
      address: 'Bescom office',
      categoryName: 'LT-2(a)(i) Tariff Schedule - Normal',
      phase: '3',
      totalContractedLoad: '1.000',
      loadUnit: 'KW',
      statusName: 'ESTIMATION',
      registeredSource: 'NSC',
      registeredOn: '2023-01-01 05:30:00.0',
      officeName: 'FRAZER TOWN OMU',
      applicationStatusCode: '2',
      loadType: 'LT',
      pendingAtDesignation: null,
      estimationNo: '150014/2023-2024/00113',
      estimationDate: '2023-05-19 00:00:00.0',
      estimationRegisteredId: '282',
      workorderNo: 'null',
      workorderDate: 'null',
      workorderRegisteredId: 'null',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    console.log('other service request');
  }
}
