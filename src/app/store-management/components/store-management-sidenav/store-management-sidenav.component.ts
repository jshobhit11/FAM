import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-store-management-sidenav',
  templateUrl: './store-management-sidenav.component.html',
  styleUrls: ['./store-management-sidenav.component.scss'],
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
export class StoreManagementSidenavComponent {
  showReportSection: boolean = false;
  showStoreTransferSection = false;
  showInventoryReportSection: boolean = false;

  constructor() {}

  toggleReportSection() {
    this.showReportSection = !this.showReportSection;
    if (this.showReportSection) {
      this.showStoreTransferSection = false;
      this.showInventoryReportSection = false;
    }
  }

  toggleUploadInventorySection() {
    this.showInventoryReportSection = !this.showInventoryReportSection;
    if (this.showInventoryReportSection) {
      this.showReportSection = false;
      this.showStoreTransferSection = false;
    }
  }

  toggleStoreTransferSection() {
    this.showStoreTransferSection = !this.showStoreTransferSection;
    if (this.showStoreTransferSection) {
      this.showReportSection = false;
      this.showInventoryReportSection = false;
    }
  }
}
