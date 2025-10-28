import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CRegisteredService } from 'src/app/services/c-registered.service';
import { environment } from 'src/environments/environment';
import { DocumentService } from 'src/app/shared/document.service';
import { Location } from '@angular/common';
import { MobileUtils } from 'src/app/lib/mobile-utils';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-full-details',
  templateUrl: './full-details.component.html',
  styleUrls: ['./full-details.component.scss'],
})
export class FullDetailsComponent implements OnInit {
  details: any = {};
  blob: any;
  loggedInUser: string = '';
  serviceRegistrationId: any = '';
  estimationRegistrationId: string = '';
  workExecution: string = '';
  materialIndent: any[] = [];
  materialReturnIndent: any[] = [];
  materialInvoice: any[] = [];
  materialAck: any[] = [];
  expenditureInvoice: any[] = [];
  expenditureAck: any[] = [];
  status: string = 'completed';
  totalInvoiceAmt: number = 0;
  totalAckAmt: number = 0;
  billSubmissionAmt: number = 0;
  fieldDetails: Boolean = true;
  currentUrl: string | null = null;
  accountMeterMapping: any = {}; 
  connectionType: string;
  wmWorkorderRegisteredId: any;
  constructor(
    private cRegisteredService: CRegisteredService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private documentService: DocumentService,
    private location: Location,
    private loader: LoaderService,
  ) {}

  async ngOnInit() {
    this.loader.show('Loading Data');
    const username = sessionStorage.getItem('user-name');
    this.loggedInUser = username.split('_')[0];
    this.route.params.subscribe(async (params: ParamMap) => {
      const serviceRegistrationId = params['serviceRegistrationId'];
      this.serviceRegistrationId = serviceRegistrationId;
      //     this.navigateToViewDocument(serviceRegistrationId);
      await this.cRegisteredService
        .getEntireApplicationDetails({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          serviceRegistrationId,
        })
        .then((data) => {
          this.details = data;
          if (this.details?.estimationHistoryResponseList) {
            this.details.estimationHistoryResponseList = this.sortHistoryByDate(
              this.details.estimationHistoryResponseList
            );
          }  
          if (this.details?.wmWorkorderRegisteredResponseList && this.details.wmWorkorderRegisteredResponseList.length > 0) {
            this.wmWorkorderRegisteredId = this.details.wmWorkorderRegisteredResponseList[0].wmWorkorderRegisteredId;
          }
          
          if (data.accountMeterMappingResponseDTOList && data.accountMeterMappingResponseDTOList.length) {
            this.accountMeterMapping = data.accountMeterMappingResponseDTOList[0];
            this.connectionType = this.accountMeterMapping.connectionType;
          }
  
          if (this.details && this.details.MeterRegisteredResponseDTOList) {
            this.details.registers = this.details.MeterRegisteredResponseDTOList;
          }
          this.fieldDetails = data.siteInspectionResponseDTO > 0;
          if (
            data.serviceRegistrationResponseDTO.applicationStatusCode == '20'
          ) {
            this.status = 'completed';
          } else if (
            data.serviceRegistrationResponseDTO.applicationStatusCode == '25'
          ) {
            this.status = 'closed';
          } else if (
            data.serviceRegistrationResponseDTO.applicationStatusCode == '99'
          ) {
            this.status = 'rejected';
          } else {
            this.status = 'pending';
          }
          if (
            data &&
            data.estimationRegisteredResponseDTO &&
            data.estimationRegisteredResponseDTO.length
          ) {
            data.estimationRegisteredResponseDTO = this.details.estimationRegisteredResponseDTO.filter(
              (item: any) => item.estimationStatus !== "0"
            );
            this.estimationRegistrationId =
              data.estimationRegisteredResponseDTO[0]?.estimationRegisteredId;
            this.workExecution =
              data.estimationRegisteredResponseDTO[0]?.woExecutionMethodName;
          }
          if (
            data &&
            data.indentAndReturnIndentResponseList &&
            data.indentAndReturnIndentResponseList.length
          ) {
            this.materialIndent = data.indentAndReturnIndentResponseList.filter(
              (v: any) => v.typeOfIndent == 'INDENT'
            );
            this.materialReturnIndent =
              data.indentAndReturnIndentResponseList.filter(
                (v: any) => v.typeOfIndent == 'RETURN_INDENT'
              );
          }
          if (
            data &&
            data.materialInvoiceAndAcknowledgementList &&
            data.materialInvoiceAndAcknowledgementList.length
          ) {
            this.materialInvoice =
              data.materialInvoiceAndAcknowledgementList.filter(
                (v: any) => v.typeOfIndent == 'INDENT'
              );
            this.materialAck =
              data.materialInvoiceAndAcknowledgementList.filter(
                (v: any) => v.typeOfIndent == 'RETURN_INDENT'
              );
          }
          if (
            data &&
            data.allInvoiceWithExpenditure &&
            data.allInvoiceWithExpenditure.length
          ) {
            this.expenditureInvoice = data.allInvoiceWithExpenditure.filter(
              (v: any) => v.typeOfIndent == 'INDENT'
            );
            this.expenditureAck = data.allInvoiceWithExpenditure.filter(
              (v: any) => v.typeOfIndent == 'RETURN_INDENT'
            );
            this.totalInvoiceAmt = this.expenditureInvoice
              .map((v) => v.expenditureAmount)
              .reduce((a, b) => Number(a) + Number(b));
            this.totalAckAmt = this.expenditureAck
              .map((v) => v.expenditureAmount)
              .reduce((a, b) => Number(a) + Number(b));
          }
          if (
            data &&
            data.allBillSubmissionWithExpenditure &&
            data.allBillSubmissionWithExpenditure.length
          ) {
            this.billSubmissionAmt = data.allBillSubmissionWithExpenditure
              .map((v: any) => v.expenditureAmount)
              .reduce((a: any, b: any) => Number(a) + Number(b));
          }
        });
        this.loader.hide();
    });
  }
  hasDCWCharges(): boolean {
    return this.details?.estimationRegisteredResponseDTO?.some(est => est.workCategoryMasterId == 6);
  }
  
  sortHistoryByDate(historyList: any[]): any[] {
    return historyList.sort((a, b) => {
      const dateA = new Date(a.processedDate).getTime();
      const dateB = new Date(b.processedDate).getTime();
      return dateA - dateB; 
    });
  }
  showAsset() {
    this.router.navigate(['/main/edit-work-execution'], {
      queryParams: {
        wmWorkorderRegisteredId:
          this.wmWorkorderRegisteredId,
      },
    });
  }

  showAssetBOM() {
    this.router.navigate(['/work-management/asset-bom-mapping'], {
      queryParams: {
        workorderRegisteredId:
          this.wmWorkorderRegisteredId,
        fullDetails: true,
      },
    });
  }


  showMeterDetails() {
    const applicationTypeCode = this.details?.serviceRegistrationResponseDTO?.applicationTypeCode;
  // const serviceRegistrationId = '306406';
    console.log('applicationTypeCode', applicationTypeCode);
    
    
    if (applicationTypeCode === 'UMT_MT' || applicationTypeCode === 'NC' || applicationTypeCode === 'TC') {
      this.navigateToMeterMapping('./single-account-meter-mapping', this.serviceRegistrationId);
    } else if (applicationTypeCode === 'MC') {
      this.navigateToMeterMapping('./multiple-account-meter-mapping', this.serviceRegistrationId);
    } else if (applicationTypeCode === 'SMR' || applicationTypeCode === 'LE' || applicationTypeCode === 'LR' ) {
      this.navigateToMeterMapping('./single-account-meter-replacemant', this.serviceRegistrationId);
    } else if (applicationTypeCode === 'BMR') {
      this.navigateToMeterMapping('./multiple-account-meter-replacemant', this.serviceRegistrationId);
    }
  }
  
  private navigateToMeterMapping(route: string, serviceRegistrationId: string) {
    this.router.navigate([route], {
      queryParams: {
        serviceRegistrationId: this.serviceRegistrationId,
        fullDetails: true,
      },
    });
  }
  

  moveToEstimateForms() {
    this.router.navigate([
      `/main/estimate-forms/${this.details.serviceRegistrationResponseDTO.applicationStatusCode}/${this.details.serviceRegistrationResponseDTO.accountId}/edit/${this.details.serviceRegistrationResponseDTO.registeredSource}`,
    ]);
  }

  async generateInspectionReport(accountId: string) {
    this.getPdf('inspection', null, null, null, null, accountId).subscribe(
      (data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Site Inspection Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
      }
    );
  }

  async generateEstimationReport(estimationRegisteredId: string) {
    this.getPdf('estimation', null, null, null, null, null, estimationRegisteredId).subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Estimation Report.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
    });
  }
  showEditColumn(est: any): boolean {
    return (
      this.details.serviceRegistrationResponseDTO.applicationStatusCode === '8' &&
      est.approvedName === this.loggedInUser &&
      est.woExecutionMethodName !== 'Self Execution' &&
      est.workCategory !== 'Deport Contribution Works'
    );
  }
  
  async generateWorkOrderReport(wmWorkorderRegisteredId: string) {
    this.getPdf('workOrder', wmWorkorderRegisteredId, null, null, null, null,null ).subscribe(
      (data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Work Order Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
      }
    );
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

  async generateMaterialIndentReport(wmMaterialsIndentId: string) {
    this.getPdf('materialIndent', null, wmMaterialsIndentId).subscribe(
      (data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'Material Indent Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
      }
    );
  }

  async generateMaterialTypeReport(
    wmMaterialsIndentId: string,
    workscopeDescCode: string,
    type: string
  ) {
    let reportName: string = '';
    if (type === 'materialReturnIndent') {
      reportName = 'Material Return Indent';
    } else if (type === 'materialInvoice') {
      reportName = 'Material Invoice';
    } else if (type === 'materialAcknowledgement') {
      reportName = 'Material Acknowledgement';
    }
    this.getPdf(type, null, wmMaterialsIndentId, workscopeDescCode).subscribe(
      (data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `${reportName} Report` + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
      }
    );
  }

  async generateWorkCompletionReport(
    workorderRegisteredId: string,
    type: string
  ) {
    let reportName: string = '';
    if (type === 'jointInventory') {
      reportName = 'Joint Inventory';
    } else if (type === 'workCompletion') {
      reportName = 'Work Completion';
    }
    this.getPdf(type, workorderRegisteredId).subscribe((data: any) => {
      this.blob = new Blob([data.body], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(this.blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `${reportName} Report` + '.pdf';
      if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
    });
  }

  getPdf(
    type: string,
    wmWorkorderRegisteredId?: string,
    wmMaterialsIndentId?: string,
    workscopeDescCode?: string,
    workorderNo?: string,
    accountId?: string,
    estimationRegisteredId?: string  
  ) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const serviceRegistrationId = this.serviceRegistrationId;
    const estimationRegistrationId = this.estimationRegistrationId;
    if (type === 'pcTest') {
      return this.http.get(
        `${environment.baseURL}/api/pcTest/generatePcTestReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationsId=${wmWorkorderRegisteredId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'estimation') {
      return this.http.get(
        `${environment.baseURL}/api/estimationRegistered/generateEstimationDetailsReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegisteredId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'workOrder') {
      return this.http.get(
        `${environment.baseURL}/api/workOrder/generateWorkorderReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'workAward') {
      return this.http.get(
        `${environment.baseURL}/api/workAward/generateWorkAwardReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}&wmWorkorderRegisteredId=${this.details?.wmWorkAwardedLogList[0].wmWorkorderRegisteredId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'materialIndent') {
      return this.http.get(
        `${environment.baseURL}/api/materialIndent/generateMaterialIndentReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmMaterialsIndentId=${wmMaterialsIndentId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'materialReturnIndent') {
      return this.http.get(
        `${environment.baseURL}/api/materialIndent/generateMaterialIndentReportForReturnIndent?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmMaterialsIndentId=${wmMaterialsIndentId}&workscopeDescCode=${workscopeDescCode}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'inspection') {
      return this.http.get(
        `${environment.baseURL}/api/siteInspection/generateSiteInspectionDetailsReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationsId=${serviceRegistrationId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'materialInvoice') {
      return this.http.get(
        `${environment.baseURL}/api/materialInvoice/generateMaterialInvoiceWithGatePassReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&wmMaterialsIndentId=${wmMaterialsIndentId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'materialAcknowledgement') {
      return this.http.get(
        `${environment.baseURL}/api/materialInvoice/generateMaterialAcknowledgementReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'jointInventory') {
      return this.http.get(
        `${environment.baseURL}/api/workCompletion/generateWorkCompletionWithCertificatePDFReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
    if (type === 'workCompletion') {
      return this.http.get(
        `${environment.baseURL}/api/workCompletion/generateWorkCompletionReport?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}&serviceRegistrationId=${serviceRegistrationId}&estimationRegistrationId=${estimationRegistrationId}&wmWorkorderRegisteredId=${wmWorkorderRegisteredId}`,
        { observe: 'response', responseType: 'blob' }
      );
    }
  }
  navigateToViewDocument() {
    const currentUrl = this.location.path();
    this.documentService.setPreviousUrl(currentUrl);
    this.documentService.setServiceRegistrationId(this.serviceRegistrationId);
    this.documentService.navigateToViewDocument('/main/document-upload');
  }
  viewReport() {
    this.currentUrl = this.router.url;
    this.router.navigate(['/main/field-report'], {
      queryParams: {
        serviceRegistrationId: this.serviceRegistrationId,
        returnUrl: this.currentUrl,
      },
    });
  }

  async generatePcTestReport(serviceRegistrationsId: string) {
    this.getPdf('pcTest', serviceRegistrationsId, null, null, null, null,null ).subscribe(
      (data: any) => {
        this.blob = new Blob([data.body], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(this.blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'PC Test Report' + '.pdf';
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, this.blob); } else { link.click(); }
      }
    );
  }
}
