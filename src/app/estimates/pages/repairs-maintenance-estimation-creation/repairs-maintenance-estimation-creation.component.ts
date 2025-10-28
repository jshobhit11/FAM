import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-repairs-maintenance-estimation-creation',
  templateUrl: './repairs-maintenance-estimation-creation.component.html',
  styleUrls: ['./repairs-maintenance-estimation-creation.component.scss'],
})
export class RepairsMaintenanceEstimationCreationComponent implements OnInit {
  estimatesList = [];
  constructor() {}

  ngOnInit(): void {
    console.log('repairs maintenance');
  }
}
