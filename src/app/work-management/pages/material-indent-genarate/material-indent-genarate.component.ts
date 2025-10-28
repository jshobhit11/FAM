import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
@Component({
  selector: 'app-material-indent-genarate',
  templateUrl: './material-indent-genarate.component.html',
  styleUrls: ['./material-indent-genarate.component.scss']
})
export class MaterialIndentGenarateComponent implements OnInit {
  isGeneratingPDF = false;
  blob: any;
  data: any[] = [];
  v:any
  wmMaterialsIndentId: string;
  materialsIndentNo: string;
  materialsIndentDate: string;
  apiUrl =environment.baseURL;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    
  ) { }

   ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.wmMaterialsIndentId = params.wmMaterialsIndentId;
      this.materialsIndentNo = params.materialsIndentNo;
      this.materialsIndentDate = params.materialsIndentDate;
    });
    }
  

  async generateIndentReport(wmMaterialsIndentId: string) {
    if (wmMaterialsIndentId) {
      this.downloadMaterialIndentPdf(wmMaterialsIndentId).subscribe((data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'MaterialIndentGenerate' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
      });
  }
}
  downloadMaterialIndentPdf(wmMaterialsIndentId: string) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filterParams: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        wmMaterialsIndentId,
      };
      return this.http.get(
            `${this.apiUrl}/api/materialIndent/generateMaterialIndentReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmMaterialsIndentId=${wmMaterialsIndentId}`,
            { observe: 'response', responseType: 'blob' }
          );
        }
  }
