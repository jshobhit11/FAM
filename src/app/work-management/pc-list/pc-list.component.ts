import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-pc-list',
  templateUrl: './pc-list.component.html',
  styleUrls: ['./pc-list.component.scss'],
})
export class PcListComponent implements OnInit {
  pcList: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];
  labelName: any = 'PC List';
  workorderNo: '';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private assetService: AssetService
  ) {}
  async ngOnInit() {
    this.pcList = await this.assetService.getPcListData({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
    });
    this.cols = [
      {
        key: 'caseId',
        title: 'Case ID',
        route: '/work-management/pc-test',
      },
      { key: 'requestedDate', title: 'Register Date' },
      { key: 'accountId', title: 'Account ID' },
      { key: 'officeName', title: 'Office' },
      // { key: 'icon', title: 'Status', route: '/main/full-details' },
    ];
    this.filterFields = this.cols.map((v) => v.key);
    console.log('pcList', this.pcList);
  }
  // navigateToBillSubmission(Tests) {
  //   this.router.navigate(['/work-management/pc-test'], {
  // queryParams: {
  //   caseId: Test.caseId,
  //   workorderNo: this.workorderNo,
  // },
  //   });
  // }



  
}
