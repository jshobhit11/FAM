import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { MobileUtils } from 'src/app/lib/mobile-utils';

@Component({
  selector: 'app-inspection-print-form',
  templateUrl: './inspection-print-form.component.html',
  styleUrls: ['./inspection-print-form.component.scss'],
})
export class InspectionPrintFormComponent implements OnInit {
  accountId: string = '';
  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  data: any = {};
  isExecutionMethod: boolean = false;
  ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const accountId = this.route.snapshot.params['accountId'];
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      console.log(params);
      const mainCategoryFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeCode,
        statusCode: 1,
        applicationStatusCode: 1,
        accountId: accountId,
      };
      this.accountId = accountId;
      this.data = await this.dashboardService.getDataByAccountId(
        mainCategoryFilter
      );

      const totalContractedLoad = +Number(
        this.data.totalContractedLoad
      ).toFixed();

      if (
        Number(this.data.totalBuildUpAreaOfBuilding) >= 500 &&
        Number(this.data.totalBuildUpAreaOfBuilding) <= 800 &&
        totalContractedLoad >= 25 &&
        totalContractedLoad <= 34
      ) {
        this.isExecutionMethod = true;
      }
    });
  }

  cancel() {
    this.router.navigate(['/main', 'siteInspection', this.accountId, 1, 'NSC']);
  }

  async printLogic() {
    if (cordova !== undefined) {
      const printContent = document.getElementById('applicationform').innerHTML;
      await html2pdf()
        .set({
          margin: 10,
          html2canvas: { scale: 2, logging: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(printContent)
        .toPdf()
        .output('blob')
        .then((data: Blob) => {
          MobileUtils.downloadFileOnMobile('Applicatoform', 'pdf', data);
        });
      return;
    } else {
      window.print();
    }
  }
}
