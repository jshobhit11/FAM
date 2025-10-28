import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WorkCompletionService } from 'src/app/services/work-completion.service';
import { environment } from '../../../../environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
@Component({
  selector: 'app-download-work-completion',
  templateUrl: './download-work-completion.component.html',
  styleUrls: ['./download-work-completion.component.scss'],
})
export class DownloadWorkCompletionComponent implements OnInit {
  apiUrl = environment.baseURL;
  data: any = {};
  workOrderRegisteredId: string = '';
  workExecutionMethodId: any;
  workExecutionMethod: string = '';
  aeRemarks: any;
  aeeRemarks: string = '';
  aoRemarks: string = '';
  userRole: string = '';
  eeRemarks: string = '';
  constructor(
    private route: ActivatedRoute,
    private workCompletionService: WorkCompletionService,
    private snackbar: MatSnackBar,
    private router: Router,
    private http: HttpClient
  ) {}

  sr: any = [];
  rc: any = [];

  ngOnInit() {
    const role = sessionStorage.getItem('user-role');
    this.userRole = role.split('_')[1];
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.workOrderRegisteredId = params['workOrderRegisteredId'];
      const filter: any = {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        wmWorkorderRegisteredId: this.workOrderRegisteredId,
      };
      this.data =
        await this.workCompletionService.getWorkCompletionDataByWorkOrderRegisteredId(
          filter
        );
      if (this.data.workorderRegistered.length) {
        this.workExecutionMethodId =
          this.data.workorderRegistered[0].woExecutionMethodId;
        this.workExecutionMethod =
          this.data.workorderRegistered[0].workExecutionMethod;
        console.log(this.workExecutionMethodId);
      }

      if (this.data.wmWorkorderCompletionVerifiedLog.length) {
        const ae = this.data.wmWorkorderCompletionVerifiedLog.find(
          (v: any) => v.verifiedDesignationCode === 'AE'
        );
        const aee = this.data.wmWorkorderCompletionVerifiedLog.find(
          (v: any) => v.verifiedDesignationCode === 'AEE'
        );
        const ao = this.data.wmWorkorderCompletionVerifiedLog.find(
          (v: any) => v.verifiedDesignationCode === 'AO'
        );
        const ee = this.data.wmWorkorderCompletionVerifiedLog.find(
          (v: any) => v.verifiedDesignationCode === 'EE'
        );
        if (ae) {
          this.aeRemarks = ae.verifiedRemarks;
        }
        if (aee) {
          this.aeeRemarks = aee.verifiedRemarks;
        }
        if (ao) {
          this.aoRemarks = ao.verifiedRemarks;
        }
        if (ee) {
          this.eeRemarks = ee.verifiedRemarks;
        }
      }
      this.sr = this.data.workorderEstimationLog.filter(
        (estimateLog) => estimateLog.rateType === 'SR'
      );
      this.rc = this.data.workorderEstimationLog.filter(
        (estimateLog) => estimateLog.rateType === 'RC'||estimateLog.rateType === 'NDS'
      );
    });
  }

  // blob: any;
  async generateWorkOrderCompletionReport() {
    this.getPdf().subscribe((data: any) => {
      const blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Work Order Completion Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
    });
  }

  async generateWorkOrderCompletionJoinInventoryReport() {
    this.getJoinInventoryPdf().subscribe((data: any) => {
      const blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Work Order Joint Inventory Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }
    });
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const wmWorkorderRegisteredId = this.workOrderRegisteredId;
    return this.http.get(
      `${this.apiUrl}/api/workCompletion/generateWorkCompletionReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  getJoinInventoryPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const wmWorkorderRegisteredId = this.workOrderRegisteredId;
    return this.http.get(
      `${this.apiUrl}/api/workCompletion/generateWorkCompletionWithCertificatePDFReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
}
