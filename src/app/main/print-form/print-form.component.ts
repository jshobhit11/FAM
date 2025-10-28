import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
@Component({
  selector: 'app-print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.scss'],
})
export class PrintFormComponent implements OnInit {
  accountId: string = '';
  meterData:any[]=[];
  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private router: Router) {}

  data: any = {};
  ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const accountId = this.route.snapshot.params['accountId'];
    //this.meterData = JSON.parse(this.route.snapshot.params['meterData']);
    this.route.queryParams.subscribe(params => {
      this.meterData = JSON.parse(params['meterData']);
  });
    this.route.params.subscribe(async (params: ParamMap) => {
      console.log(params['accountId']);

      const mainCategoryFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        applicationStatusCode: 1,
        accountId: params['accountId'],
      };
      this.accountId = accountId;
      this.data = await this.dashboardService.getDataByAccountId(mainCategoryFilter);
      console.log(this.data);
    });
  }

  cancel() {
    this.router.navigate(['/main', 'cscSiteInspection', this.accountId, 41]);
  }

  printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }
}
