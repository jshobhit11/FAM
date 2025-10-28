import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dismantlement-works-estimation-creation',
  templateUrl: './dismantlement-works-estimation-creation.component.html',
  styleUrls: ['./dismantlement-works-estimation-creation.component.scss'],
})
export class DismantlementWorksEstimationCreationComponent implements OnInit {
  estimatesList = [];
  constructor() {}

  ngOnInit(): void {
    console.log('dismantlement works');
  }
}
