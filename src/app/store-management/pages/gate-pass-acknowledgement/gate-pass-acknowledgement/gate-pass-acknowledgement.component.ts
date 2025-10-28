import { Component, OnInit } from '@angular/core';
import { GatepassService } from 'src/app/services/gatepass.service';

@Component({
  selector: 'app-gate-pass-acknowledgement',
  templateUrl: './gate-pass-acknowledgement.component.html',
  styleUrls: ['./gate-pass-acknowledgement.component.scss'],
})
export class GatePassAcknowledgementComponent implements OnInit {
  data: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];
  constructor(private gatePassService: GatepassService) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId = sessionStorage.getItem('office-id');
    const gatePassData = await this.gatePassService.getGatePassDataByOfficeId({
      apiKey,
      serviceKey,
      userCode,
      userName,
      userRole,
      officeId,
    });
    this.data = gatePassData.map((v: any, i: number) => {
      return { ...v, sno: i + 1 };
    });
    this.cols = [
      { key: 'sno', title: 'S No.' },
      { key: 'materialsIndentNo', title: 'Request No.', route: `/store-management/gate-pass-ackowledgement-details` },
      { key: 'materialsIndentApprovedDate', title: 'Counter Sign Date' },
      { key: 'officename', title: 'From Office' },
      { key: 'store', title: 'Allocated Store' },
      { key: 'requestedBy', title: 'Request By' },
    ];
    this.filterFields = this.cols.map((v: any) => v.key);
  }
}
