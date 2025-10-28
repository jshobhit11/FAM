import { Component, EventEmitter, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-work-management-sidenav',
  templateUrl: './work-management-sidenav.component.html',
  styleUrls: ['./work-management-sidenav.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden',
        })
      ),
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      transition('open <=> closed', [animate('0.3s')]),
    ]),
  ],
})
export class WorkManagementSidenavComponent {
  showMaterialIndentSection: boolean = false;
  showCRegistered: boolean = false;
  showReportSection: boolean = false;
  showBudgetSection: boolean = false;
  showUserSection: boolean = false;
  constructor() {}

  @Output() toggleSidebarForMe = new EventEmitter<void>();

  toggleSideBar() {
    this.toggleSidebarForMe.emit();
  }

  toggleMaterialIndentSection() {
    this.showMaterialIndentSection = !this.showMaterialIndentSection;
    if (this.showMaterialIndentSection) {
      this.showCRegistered = false;
      this.showReportSection = false;
      this.showBudgetSection = false;
      this.showUserSection = false;
    }
  }

  toggleCRegisteredSection() {
    this.showCRegistered = !this.showCRegistered;
    if (this.showCRegistered) {
      this.showMaterialIndentSection = false;
      this.showReportSection = false;
      this.showBudgetSection = false;
      this.showUserSection = false;
    }
  }

  toggleReportSection() {
    this.showReportSection = !this.showReportSection;
    if (this.showReportSection) {
      this.showMaterialIndentSection = false;
      this.showCRegistered = false;
      this.showBudgetSection = false;
      this.showUserSection = false;
    }
  }

  toggleBudgetSection() {
    this.showBudgetSection = !this.showBudgetSection;
    if (this.showBudgetSection) {
      this.showMaterialIndentSection = false;
      this.showCRegistered = false;
      this.showReportSection = false;
      this.showUserSection = false;
    }
  }

  tooggleUserSection() {
    this.showUserSection = !this.showUserSection;
    if (this.showUserSection) {
      this.showMaterialIndentSection = false;
      this.showCRegistered = false;
      this.showReportSection = false;
      this.showBudgetSection = false;
    }
  }
}
