import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-configuration-sidenav',
  templateUrl: './configuration-sidenav.component.html',
  styleUrls: ['./configuration-sidenav.component.scss'],
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
export class ConfigurationSidenavComponent {
  showWorkMasterSection: boolean = false;
  showEstimateMasterSection: boolean = false;
  showMaintenanceSection: boolean = false;
  showCommonSection: boolean = false;
  showBudgetSection:boolean =false;
  constructor() {}

  toggleWorkSection() {
    this.showWorkMasterSection = !this.showWorkMasterSection;
    if (this.showWorkMasterSection) {
      this.showEstimateMasterSection = false;
      this.showMaintenanceSection = false; 
      this.showCommonSection = false;
      this.showBudgetSection = false;
    }
  }

  toggleEstimateSection() {
    this.showEstimateMasterSection = !this.showEstimateMasterSection;
    if (this.showEstimateMasterSection) {
      this.showWorkMasterSection = false;
      this.showMaintenanceSection = false; // Close Maintenance section if open
      this.showCommonSection = false;
      this.showBudgetSection = false;
    }
  }

  toggleMaintenanceSection() {
    this.showMaintenanceSection = !this.showMaintenanceSection;
    if (this.showMaintenanceSection) {
      this.showEstimateMasterSection = false;
      this.showWorkMasterSection = false;
      this.showCommonSection = false;
      this.showBudgetSection = false;
    }
  }

  toggleCommonSection() {
    this.showCommonSection = !this.showCommonSection;
    if (this.showCommonSection) {
      this.showEstimateMasterSection = false;
      this.showWorkMasterSection = false;
      this.showMaintenanceSection = false;
      this.showBudgetSection = false;
    }
  }
  toggleBudgetSection() {
    this.showBudgetSection = !this.showBudgetSection;
    if (this.showBudgetSection) {
      this.showEstimateMasterSection = false;
      this.showWorkMasterSection = false;
      this.showMaintenanceSection = false;
      this.showCommonSection = false;
    }
  }
}
