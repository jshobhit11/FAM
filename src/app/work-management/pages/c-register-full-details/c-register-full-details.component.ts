import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { CRegisteredService } from 'src/app/services/c-registered.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-c-register-full-details',
  templateUrl: './c-register-full-details.component.html',
  styleUrls: ['./c-register-full-details.component.scss'],
})
export class CRegisterFullDetailsComponent implements OnInit {
  details: any = {};
  blob: any;
  serviceRegistrationId: string = '';
  estimationRegistrationId: string = '';
  expenditureInvoice: any[] = [];
  expenditureAck: any[] = [];
  billSubmissionAmt: number = 0;
  totalInvoiceAmt: number = 0;
  totalAckAmt: number = 0;

  constructor(private cRegisteredService: CRegisteredService, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(async (params: ParamMap) => {
      const workorderNo = params['id'];
      const data = await this.cRegisteredService.getFullDetailsByWorkOrderRegisteredId({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        workorderNo,
      });
      this.details = data;
      if (data && data.estimationRegisteredDTO && data.estimationRegisteredDTO.length) {
        this.serviceRegistrationId = data.estimationRegisteredDTO[0]?.serviceRegistrationId;
        this.estimationRegistrationId = data.estimationRegisteredDTO[0]?.estimationRegisteredId;
      }
      if (data && data.allInvoiceWithExpenditure && data.allInvoiceWithExpenditure.length) {
        this.expenditureInvoice = data.allInvoiceWithExpenditure.filter((v: any) => v.typeOfIndent == 'INDENT');
        this.expenditureAck = data.allInvoiceWithExpenditure.filter((v: any) => v.typeOfIndent == 'RETURN_INDENT');
        this.totalInvoiceAmt = this.expenditureInvoice.map((v) => v.expenditureAmount).reduce((a, b) => Number(a) + Number(b));
        this.totalAckAmt = this.expenditureAck.map((v) => v.expenditureAmount).reduce((a, b) => Number(a) + Number(b));
      }
      if (data && data.allBillSubmissionWithExpenditure && data.allBillSubmissionWithExpenditure.length) {
        this.billSubmissionAmt = data.allBillSubmissionWithExpenditure
          .map((v: any) => v.expenditureAmount)
          .reduce((a: any, b: any) => Number(a) + Number(b));
      }
    });
  }

  async generateEstimationReport() {
    this.getPdf('estimation').subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Estimation Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
    });
  }

  async generateWorkOrderReport(wmWorkorderRegisteredId: string) {
    this.getPdf('workOrder', wmWorkorderRegisteredId).subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Work Order Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
    });
  }

  async generateWorkAwardReport(wmWorkorderRegisteredId: string) {
    this.getPdf('workAward', wmWorkorderRegisteredId).subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Work Award Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
    });
  }

  getPdf(type: string, wmWorkorderRegisteredId?: string) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const serviceRegistrationId = this.serviceRegistrationId;
    const estimationRegistrationId = this.estimationRegistrationId;
    if (type === 'estimation') {
      return this.http.get(
        `${environment.baseURL}/api/estimationRegistered/generateEstimationDetailsReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
    if (type === 'workOrder') {
      return this.http.get(
        `${environment.baseURL}/api/workOrder/generateWorkorderReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
    if (type === 'workAward') {
      return this.http.get(
        `${environment.baseURL}/api/workAward/generateWorkAwardReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
        { observe: 'response', responseType: 'blob' },
      );
    }
  }
}
