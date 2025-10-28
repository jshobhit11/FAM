import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repairs-maintenance-estimation-approval',
  templateUrl: './repairs-maintenance-estimation-approval.component.html',
  styleUrls: ['./repairs-maintenance-estimation-approval.component.scss'],
})
export class RepairsMaintenanceEstimationApprovalComponent implements OnInit {
  estimatesList = [];
  constructor() {}

  ngOnInit(): void {
    console.log('repairs maintenance');
  }
}
