import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meter-replacements-estimation-approval',
  templateUrl: './meter-replacements-estimation-approval.component.html',
  styleUrls: ['./meter-replacements-estimation-approval.component.scss'],
})
export class MeterReplacementsEstimationApprovalComponent implements OnInit {
  estimatesList = [];
  constructor() {}

  ngOnInit(): void {
    console.log('meter replacement');
  }
}
