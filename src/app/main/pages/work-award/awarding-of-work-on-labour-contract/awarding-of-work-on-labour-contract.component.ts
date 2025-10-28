import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { WorkAwardService } from 'src/app/services/work-award.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-awarding-of-work-on-labour-contract',
  templateUrl: './awarding-of-work-on-labour-contract.component.html',
  styleUrls: ['./awarding-of-work-on-labour-contract.component.scss'],
})
export class AwardingOfWorkOnLabourContractComponent implements OnInit {
  workorderRegisteredId: any;
  data: any = {};
  officeData: any[] = [];
  total: number = 0;
  gsttotal: any = 0;
  grandtotal: any = 0;
  labourAwardAmount: any = 0;
  apiUrl =environment.baseURL;
  workAwardedAmount: any;
  constructor(private route: ActivatedRoute, private workAwardService: WorkAwardService, private http: HttpClient) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.workorderRegisteredId = params.get('workorderRegisteredId');
      this.data = await this.workAwardService.getWorkAwardData({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        workorderRegisteredId: this.workorderRegisteredId,
      });
      console.log(this.data);
      if (this.data.estimationMaterialLabourDetails) {
        this.data.estimationMaterialLabourDetails.forEach((labourDetails: any) => {
          this.total += Number(labourDetails.amount);
        });
        const gst = Number(this.total) * 0.18;
        this.gsttotal = gst.toFixed();
        this.grandtotal = Number(this.total) + Number(this.gsttotal);
        this.labourAwardAmount = this.data?.estimationRegisteredResponse[0]?.totalLabourCharges;
        this.workAwardedAmount = this.data?.wmWorkAwardedLogDTOList[0]?.workAwardedAmount;
      }

      this.officeData = await this.workAwardService.getDataByOfficeId({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        officeId: sessionStorage.getItem('office-id'),
      });
    });
  }

  blob: any;
  async generateWorkAwardReport() {
    this.getPdf().subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Work Award Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }    });
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const wmWorkorderRegisteredId = this.workorderRegisteredId;
    return this.http.get(
      `${this.apiUrl}/api/workAward/generateWorkAwardReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
      { observe: 'response', responseType: 'blob' },
    );
  }
}
