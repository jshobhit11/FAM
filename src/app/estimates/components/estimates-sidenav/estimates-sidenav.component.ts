import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { AuthorizationService } from 'src/app/services/authorization.service';

@Component({
  selector: 'app-estimates-sidenav',
  templateUrl: './estimates-sidenav.component.html',
  styleUrls: ['./estimates-sidenav.component.scss'],
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
export class EstimatesSidenavComponent {
  showImprovementMaintanceSection: boolean = false;
  showRevisedEstimate: boolean = false;
  showEmergencyEstimate: boolean = false;
  showBulkMetersEstimate: boolean = false;
  showEstimateMaintenance: boolean = false;
  showMaintenanceReportSection: boolean = false;
  showRevenueMaintenance: boolean = false;
  showQMOM: boolean = false;
  showQMMT: boolean = false;

  @Output() toggleSidebarForMe = new EventEmitter<void>();

  constructor(private router: Router, private authorizationService: AuthorizationService) {}

  toggleSideBar() {
    this.toggleSidebarForMe.emit();
  }

  toggleImprovementMaintanceSection() {
    this.resetSections();
    this.showImprovementMaintanceSection = !this.showImprovementMaintanceSection;
  }

  toggleRevisedEstimateSection() {
    this.resetSections();
    this.showRevisedEstimate = !this.showRevisedEstimate;
  }

  toggleEmergencyEstimateSection() {
    this.resetSections();
    this.showEmergencyEstimate = !this.showEmergencyEstimate;
  }

  toggleEstimateMaintenanceSection() {
    this.resetSections();
    this.showEstimateMaintenance = !this.showEstimateMaintenance;
  }

  toggleBulkMetersEstimateSection() {
    this.resetSections();
    this.showBulkMetersEstimate = !this.showBulkMetersEstimate;
  }

  toggleReportSection() {
    this.resetSections();
    this.showMaintenanceReportSection = !this.showMaintenanceReportSection;
  }

  toggleRevenueMaintenanceSection() {
    this.resetSections();
    this.showRevenueMaintenance = !this.showRevenueMaintenance;
  }

  toggleQMOMSection() {
    this.showQMOM = !this.showQMOM;
  }

  toggleQMMTSection() {
    this.showQMMT = !this.showQMMT;
  }

  private resetSections() {
    this.showImprovementMaintanceSection = false;
    this.showRevisedEstimate = false;
    this.showEmergencyEstimate = false;
    this.showBulkMetersEstimate = false;
    this.showEstimateMaintenance = false;
    this.showMaintenanceReportSection = false;
    this.showRevenueMaintenance = false;
  }
}
