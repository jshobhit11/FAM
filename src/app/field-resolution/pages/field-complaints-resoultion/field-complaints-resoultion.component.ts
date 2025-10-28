import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-field-complaints-resoultion',
  templateUrl: './field-complaints-resoultion.component.html',
  styleUrls: ['./field-complaints-resoultion.component.scss']
})
export class FieldComplaintsResoultionComponent {
  isVisible: boolean = true;

  hideContent(): void {
    this.isVisible = false;
  }
}
