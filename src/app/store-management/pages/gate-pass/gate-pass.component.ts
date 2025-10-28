import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GatepassService } from '../../../services/gatepass.service';
@Component({
  selector: 'app-gate-pass',
  templateUrl: './gate-pass.component.html',
  styleUrls: ['./gate-pass.component.scss'],
})
export class GatePassComponent implements OnInit {
  data: any[] = [];
  greenColor: boolean = false;
  yellowColor: boolean = false;
  redColor: boolean = false;
  constructor(private gatePassService: GatepassService, private route: ActivatedRoute) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      console.log(params);
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeId = sessionStorage.getItem('office-id');
      this.data = await this.gatePassService.getGatePassDataByOfficeId({
        apiKey,
        serviceKey,
        userCode,
        userName,
        userRole,
        officeId,
      });
      console.log(this.data);
    });
  }

  isDesignationRole(designationShortCode: string): boolean {
    const userRole = sessionStorage.getItem('user-role');
    const role = userRole.split('_');
    const designation = role[1];
    if (designationShortCode === designation) {
      return true;
    } else {
      return false;
    }
  }

  getDayDiff(startDate: Date): number {
    const today = new Date();
    const msInDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs(today.getTime() - startDate.getTime()) / msInDay);
  }

  isGreenColor(date: any): boolean {
    const miDate = new Date(date);
    const daysDiff = this.getDayDiff(miDate);
    if (daysDiff === 1) {
      return true;
    } else {
      return false;
    }
  }

  isYellowColor(date: any): boolean {
    const miDate = new Date(date);
    const daysDiff = this.getDayDiff(miDate);
    if (daysDiff === 2) {
      return true;
    } else {
      return false;
    }
  }

  isRedColor(date: any): boolean {
    const miDate = new Date(date);
    const daysDiff = this.getDayDiff(miDate);
    if (daysDiff >= 2) {
      return true;
    } else {
      return false;
    }
  }
}
