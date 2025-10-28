import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-material-store-acknw-report',
  templateUrl: './material-store-acknw-report.component.html',
  styleUrls: ['./material-store-acknw-report.component.scss']
})
export class MaterialStoreAcknwReportComponent implements OnInit {
  isGeneratingPDF = false;
  data: any;
  apiUrl =environment.baseURL;
  constructor(
    private materialInvoiceService: MaterialInvoiceService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}
  wmMaterialsIndentId: any;
  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const wmMaterialsIndentId = params.get('wmMaterialsIndentId');
      this.wmMaterialsIndentId = wmMaterialsIndentId;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        wmMaterialsIndentId,
      };
      this.data = await this.materialInvoiceService.getMaterialInvoiceReport(
        filter
      );
    });
  }

  blob: any;
  async generateInvoiceReportReport() {
    this.getPdf().subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Material Acknowledgement Report' + '.pdf';
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
      `${this.apiUrl}/api/materialInvoice/generateMaterialInvoiceWithGatePassReportForSuspenseAndStore?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmMaterialsIndentId=${wmMaterialsIndentId}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
}
