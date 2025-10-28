import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meter-replacements-estimation-creation',
  templateUrl: './meter-replacements-estimation-creation.component.html',
  styleUrls: ['./meter-replacements-estimation-creation.component.scss'],
})
export class MeterReplacementsEstimationCreationComponent implements OnInit {
  estimatesList = [];
  constructor() {}

  ngOnInit(): void {
    console.log('meter replacement');
  }
}
