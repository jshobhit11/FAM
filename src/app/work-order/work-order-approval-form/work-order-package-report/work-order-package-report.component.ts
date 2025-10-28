import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import html2pdf from 'html2pdf.js';
import { WorkOrderService } from '../../../services/work-order.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/services/loader.service';
import { MobileUtils } from 'src/app/lib/mobile-utils';
@Component({
  selector: 'app-work-order-package-report',
  templateUrl: './work-order-package-report.component.html',
  styleUrls: ['./work-order-package-report.component.scss'],
})
export class WorkOrderPackageReportComponent implements OnInit {
  isGeneratingPDF: boolean = false;
  estimationRegisteredId: any;
  blob: any;
  data: any = {};
  globalArray: any = [];
  workOrderRegisteredId: any;
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];

  creditRegularList: any = {};

  constructor(
    private workOrderService: WorkOrderService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private loader :LoaderService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.loader.show('Data Loading');
      this.workOrderRegisteredId = this.estimationRegisteredId =
        params['estimationRegisteredId'];
      params['workOrderRegisteredId'];
      this.data = await this.workOrderService.getRegisteredWorkOrderData({
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        estimationRegisteredId: this.estimationRegisteredId,
        estimationNumber: 8,
        operationCode: 'A',
      });
      console.log(this.data);

      this.creditRegularList =
        await this.workOrderService.getWorkOrderCreditAndRegularList({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          estimationRegisteredId: this.estimationRegisteredId,
        });

      console.log(this.creditRegularList);

      this.addChargesBeforeTotalLabour =
        this.data.estimationAddlChargesRegistered.filter(
          (v: any) => Number(v.chargesSequenceOrder) < 5
        );
      this.addChargesAfterTotalLabour =
        this.data.estimationAddlChargesRegistered.filter(
          (v: any) => Number(v.chargesSequenceOrder) >= 5
        );
      console.log(
        this.addChargesAfterTotalLabour,
        this.addChargesBeforeTotalLabour
      );

      this.data.estimationWorkScope?.forEach((estimate: any) => {
        const a = this.data.estimationMaterailsRegistered.filter((e: any) => {
          return (
            e.estimationWorkScopeDataId ===
            estimate.estTemplateWorkScopeMasterId
          );
        });
        estimate.materialCost = estimate.materialCost;
        estimate.labourCost = estimate.labourCost;
        this.globalArray.push({ estimate, data: a });
      });
      this.loader.hide();
    });
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

  async generateWorkOrderReport(workOrderRegisteredId) {
    this.getPdf(workOrderRegisteredId).subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Work Order Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
    });
  }

  getPdf(workOrderRegisteredId) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    return this.http.get(
      `${
        environment.baseURL
      }/api/workOrder/generateWorkorderReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmWorkorderRegisteredId=${workOrderRegisteredId}&isRevisedWorkorder=${
        this.data.estimationRegistered.estimationType === 'RE' ? 1 : 0
      }`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  async generateCreditWorkOrderReport(workOrderRegisteredId) {
    this.getCreditPdf(workOrderRegisteredId).subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Credit Work Order Report' + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
    });
  }

  getCreditPdf(workOrderRegisteredId) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    return this.http.get(
      `${environment.baseURL}/api/workOrder/generateWorkorderCreditReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmWorkorderRegisteredId=${workOrderRegisteredId}`,
      { observe: 'response', responseType: 'blob' }
    );
  }
}
