import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-pop-up',
  templateUrl: './view-pop-up.component.html',
  styleUrls: ['./view-pop-up.component.scss'],
})
export class ViewPopUpComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
