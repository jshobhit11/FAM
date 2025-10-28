import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MaterialGenerateService } from 'src/app/services/material-generate.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
@Component({
  selector: 'app-return-generate',
  templateUrl: './return-generate.component.html',
  styleUrls: ['./return-generate.component.scss']
})
export class ReturnGenerateComponent implements OnInit {
  isGeneratingPDF = false;
  wmMaterialsIndentId: any;
  workscopeDescCode:any;
  materialsIndentNo:string;
  materialsIndentDate:string;
  blob: any;
  apiUrl =environment.baseURL;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  constructor(
    private materialgenerateservice:MaterialGenerateService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.wmMaterialsIndentId = params.wmMaterialsIndentId;
      this.materialsIndentNo = params.materialsIndentNo;
      this.materialsIndentDate = params.materialsIndentDate;
      this.workscopeDescCode=params.workscopeDescCode;
    });
    }


  async generateReturnReport(wmMaterialsIndentId: string,workscopeDescCode:string) {
    if (wmMaterialsIndentId) {
      this.downloadMaterialIndentPdf(wmMaterialsIndentId,workscopeDescCode).subscribe((data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'MaterialReturnIndentGenerate' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
      });
  }
}
  downloadMaterialIndentPdf(wmMaterialsIndentId: string,workscopeDescCode:string) {
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
        workscopeDescCode,
      };
      return this.http.get(
            `${this.apiUrl}/api/materialIndent/generateMaterialIndentReportForReturnIndent?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmMaterialsIndentId=${wmMaterialsIndentId}&workscopeDescCode=${workscopeDescCode}`,
            { observe: 'response', responseType: 'blob' }
          );
        }
  }
