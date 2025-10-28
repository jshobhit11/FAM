import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SiteInspectionService } from '../../../services/siteInspection.service';

@Component({
  selector: 'app-view-site-inspection-page',
  templateUrl: './view-site-inspection-page.component.html',
  styleUrls: ['./view-site-inspection-page.component.scss'],
})
export class ViewSiteInspectionPageComponent implements OnInit {
  parameters: any = {};
  data: any = {};
  isExecutionMethod: boolean = false;
  isMeterProcured: boolean = false;
  isMeterChangeRequired: boolean = false;
  processTypeName: string = '';

  constructor(private siteInspectionService: SiteInspectionService, private router: Router, private route: ActivatedRoute) {}

  inspected: any = [];
  inspectedData: any;
  ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const accountId = params['accountId'];
      const applicationStatusCode = params['applicationStatusCode'];
      this.processTypeName = params['processTypeName'];
      console.log(accountId);

      const mainCategoryFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        applicationStatusCode,
        accountId: accountId,
      };
      this.parameters = mainCategoryFilter;
    });
    this.getSiteInspectionData();
    this.checkIsMeterProcured();
  }

  getSiteInspectionData() {
    this.siteInspectionService.viewSiteInspectionData(this.parameters).then((data) => {
      console.log(data);
      this.data = data;
      const totalContractedLoad = +Number(this.data.totalContractedLoad).toFixed();

      if (
        Number(this.data.totalBuildUpAreaOfBuilding) >= 500 &&
        Number(this.data.totalBuildUpAreaOfBuilding) <= 800 &&
        totalContractedLoad >= 25 &&
        totalContractedLoad <= 34
      ) {
        this.isExecutionMethod = true;
      }
      this.inspected = [
        this.data.siteInspection?.inspectedByAe == '1' ? 'AE' : '',
        this.data.siteInspection?.inspectedByAee == '1' ? 'AEE' : '',
        this.data.siteInspection?.inspectedByCe == '1' ? 'CE' : '',
        this.data.siteInspection?.inspectedByEe == '1' ? 'EE' : '',
        this.data.siteInspection?.inspectedBySe == '1' ? 'SE' : '',
      ];

      this.inspected = this.inspected.filter((e) => e);
      this.inspectedData = this.inspected.toString();
    });
  }

  checkIsMeterProcured() {
    if (this.data) {
      if (
        (['New Connection', 'Temporary'].includes(this.data.applicationType) && this.data.connectionType === 'Jenasnehi') ||
        ['Load Enhancement', 'Load Reduction'].includes(this.data.applicationType)
      ) {
        this.isMeterProcured = true;
      }
      if (['Load Enhancement', 'Load Reduction'].includes(this.data.applicationType)) {
        this.isMeterChangeRequired = true;
      }
    }
    console.log(this.isMeterProcured);
  }

  printElement(id) {
    var printHtml = document.getElementById(id).outerHTML;
    var currentPage = document.body.innerHTML;
    var elementPage = '<html><head><title></title></head><body>' + printHtml + '</body>';
    //change the body
    document.body.innerHTML = elementPage;
    //print
    window.print();
    //go back to the original
    document.body.innerHTML = currentPage;
  }

  cancel() {
    this.router.navigate(['/main', 'estimate-forms', 2, this.processTypeName, this.data?.serviceRegistration?.accountId]);
  }
}
