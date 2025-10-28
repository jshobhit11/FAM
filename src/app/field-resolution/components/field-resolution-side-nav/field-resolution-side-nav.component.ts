import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-field-resolution-side-nav',
  templateUrl: './field-resolution-side-nav.component.html',
  styleUrls: ['./field-resolution-side-nav.component.scss'],
})
export class FieldResolutionSideNavComponent {
  isListVisible = false;

  @Output() toggleSidebarForMe = new EventEmitter<void>();

  toggleList() {
    this.isListVisible = !this.isListVisible;
  }

  toggleSideBar() {
    this.toggleSidebarForMe.emit();
  }
}
