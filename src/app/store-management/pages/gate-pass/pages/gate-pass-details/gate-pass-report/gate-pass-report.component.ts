import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { GatepassService } from '../../../../../../services/gatepass.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
@Component({
  selector: 'app-gate-pass-report',
  templateUrl: './gate-pass-report.component.html',
  styleUrls: ['./gate-pass-report.component.scss'],
})
export class GatePassReportComponent implements OnInit {
  isGeneratingPDF = false;
  wmMaterialsIndentId: string = '';
  data: any = {};
  blob: any;
  apiUrl =environment.baseURL;
  constructor(private gatePassService: GatepassService, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const wmMaterialsIndentId = params['wmMaterialsIndentId'];
      this.wmMaterialsIndentId = wmMaterialsIndentId;
      this.data = await this.gatePassService.getGatePassReportData({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        officeId: sessionStorage.getItem('office-id'),
        wmMaterialsIndentId,
      });
    });
  }

  convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
  }

  async download() {
    const filter: any = {
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      officeId: sessionStorage.getItem('office-id'),
      wmMaterialsIndentId: this.wmMaterialsIndentId,
    };
    await this.gatePassService.generateMaterialInvoiceWithGatePassReport(filter);
  }

  downloadPDF() {
    this.isGeneratingPDF = true;
    const element = document.getElementById('print-content');

    html2pdf()
      .set({
        margin: 10,
        filename: 'work order package report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save()
      .then(() => {
        this.isGeneratingPDF = false;
      });
  }

  async generateWorkOrderReport() {
    this.getPdf().subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Gate Pass Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }    });
  }

  getPdf() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const wmMaterialsIndentId = this.wmMaterialsIndentId;
    return this.http.get(
      `${this.apiUrl}/api/materialInvoice/generateMaterialInvoiceWithGatePassReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmMaterialsIndentId=${wmMaterialsIndentId}`,
      { observe: 'response', responseType: 'blob' },
    );
  }
}
