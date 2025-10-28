import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-pop-up-estimate',
  templateUrl: './view-pop-up-estimate.component.html',
  styleUrls: ['./view-pop-up-estimate.component.scss']
})
export class ViewPopUpEstimateComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
