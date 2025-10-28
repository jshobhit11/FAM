import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-suspense-popup',
  templateUrl: './suspense-popup.component.html',
  styleUrls: ['./suspense-popup.component.scss']
})
export class SuspensePopupComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  get isSubmitConfirmation(): boolean {
    return this.data.type === 'submit'; 
  }
}
