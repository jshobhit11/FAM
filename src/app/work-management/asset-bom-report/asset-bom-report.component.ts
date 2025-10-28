import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetService } from '../../services/asset.service';
@Component({
  selector: 'app-asset-bom-report',
  templateUrl: './asset-bom-report.component.html',
  styleUrls: ['./asset-bom-report.component.scss'],
})
export class AssetBomReportComponent implements OnInit {
  estimatesList: any = [];
  cols: any[] = [];
  filterFields: string[] = [];
  labelName: any = 'Asset BOM Mapping';

  constructor(private router: Router, private assetService: AssetService, private route: ActivatedRoute) {}

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId = sessionStorage.getItem('office-id');
    this.estimatesList = await this.assetService.getAssetBomListByOfficeId({
      apiKey,
      serviceKey,
      userCode,
      userName,
      userRole,
      officeMasterId: officeId,
    });
    console.log(this.estimatesList);

    this.cols = [
      { key: 'referenceNumber', title: 'Case ID',route: '/work-management/asset-bom-mapping',},
      {
        key: 'workorderNo',
        title: 'Work Order No.',
        route: '/work-management/asset-bom-mapping',
      },
      { key: 'workorderDate', title: 'Work Order Date' },
      { key: 'workDescription', title: 'Work Description' },
      { key: 'officeName', title: 'Office Name' },
      {
        key: 'applicationTypeName',
        title: 'Application Type Name',
         },

      { key: 'icon', title: 'Status', route: '/main/full-details' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
  }

  navigateToWorkCompletionReport(estimate: any) {
    this.router.navigate(['/work-management/asset-bom-mapping'], {
      queryParams: { wmWorkorderRegisteredId: estimate.workorderRegisteredId },
    });
  }
}
