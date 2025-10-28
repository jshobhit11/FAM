import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeModule } from 'primeng/tree';
import { WorkManagementComponent } from './work-management.component';
import { WorkManagementSidenavComponent } from './components/work-management-sidenav/work-management-sidenav.component';
import { WorkManagementRoutingModule } from './work-management-routing.module';
import { BudgetFromsComponent } from './pages/budget-froms/budget-froms.component';
import { MaterialIndentRequestFormComponent } from './pages/material-indent-request-form/material-indent-request-form.component';
import { MaterialIndentApprovalFormComponent } from './pages/material-indent-approval-form/material-indent-approval-form.component';
import { BudgetApprovalComponent } from './pages/budget-approval/budget-approval.component';
import { WorkComplitionReportComponent } from './pages/work-complition-report/work-complition-report.component';
import { BudgetApprovalDetailsComponent } from './pages/budget-approval/pages/budget-approval-details/budget-approval-details.component';
import { DatePipeSecondComponent } from '../commons/date-pipe/date-pipe.component-second';
import { MaterialIndentApprovalComponent } from './pages/material-indent-approval/material-indent-approval.component';
import { DivisionalBudgetHeadComponent } from './pages/divisional-budget-head/divisional-budget-head.component';
import { AssetBomMappingComponent } from './pages/asset-bom-mapping/asset-bom-mapping.component';
import { WorkCompletionReportComponent } from './work-completion-report/work-completion-report.component';
import { AssetBomReportComponent } from './asset-bom-report/asset-bom-report.component';
import { GeneratedAssetUidReportComponent } from './pages/generated-asset-uid-report/generated-asset-uid-report.component';
import { MaterialsReturnRequestComponent } from './pages/materials-return-request/materials-return-request.component';
import { MaterialsReturnApprovalComponent } from './pages/materials-return-approval/materials-return-approval.component';
import { MaterialsTransferRequestComponent } from './pages/materials-transfer-request/materials-transfer-request.component';
import { MaterialsTransferApprovalComponent } from './pages/materials-transfer-approval/materials-transfer-approval.component';
import { MaterialsReturnApprovalFormComponent } from './pages/materials-return-approval-form/materials-return-approval-form.component';
import { MaterialsTranferApprovalFormComponent } from './pages/materials-tranfer-approval-form/materials-tranfer-approval-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CostRegisteredReportComponent } from './pages/cost-registered-report/cost-registered-report.component';
import { BillSubmissionListComponent } from './bill-submission-list/bill-submission-list.component';
import { BillSubmissionComponent } from './pages/bill-submission/bill-submission.component';
import { BudgetDataService } from '../services/budget-data.service';
import { DownloadWorkCompletionComponent } from './pages/download-work-completion/download-work-completion.component';
import { CreateWorkAwardRequestComponent } from './pages/create-work-award-request/create-work-award-request.component';
import { BudgetAbstractReportComponent } from './pages/budget-abstract-report/budget-abstract-report.component';
import { BudgetTransactionReportComponent } from './pages/budget-transaction-report/budget-transaction-report.component';
import { CRegisteredInvoiceVerficationComponent } from './pages/c-registered-invoice-verfication/c-registered-invoice-verfication.component';
import { InvoiceDetailsComponent } from './pages/invoice-details/invoice-details.component';
import { AcknowledgementVerificationComponent } from './pages/acknowledgement-verification/acknowledgement-verification.component';
import { AcknowledgementDetailsComponent } from './pages/acknowledgement-details/acknowledgement-details.component';
import { CRegisteredDetailComponent } from './pages/c-registered-detail/c-registered-detail.component';
import { CRegisterFullDetailsComponent } from './pages/c-register-full-details/c-register-full-details.component';
import { BillSubmissionCRegisterComponent } from './pages/bill-submission-c-register/bill-submission-c-register.component';
import { BillSubmissionDetailCregisterComponent } from './pages/bill-submission-detail-cregister/bill-submission-detail-cregister.component';
import { PendingRegistrationReportComponent } from './pages/pending-registration-report/pending-registration-report.component';
import { SuspensePopupComponent } from './pages/suspense-popup/suspense-popup.component';
import { TransferSusPopupComponent } from './pages/transfer-sus-popup/transfer-sus-popup.component';
import { WorkManagementDashboardComponent } from './components/work-management-dashboard/work-management-dashboard.component';
import { MaterialIndentGenarateComponent } from './pages/material-indent-genarate/material-indent-genarate.component';
import { ReturnGenerateComponent } from './pages/return-generate/return-generate.component';
import { SuspenseGenerateComponent } from './pages/suspense-generate/suspense-generate.component';
import { RejectSuspensePopupComponent } from './pages/reject-suspense-popup/reject-suspense-popup.component';
import { RejectReturnPopupComponent } from './pages/reject-return-popup/reject-return-popup.component';
import { RejectIndentPopupComponent } from './pages/reject-indent-popup/reject-indent-popup.component';
import { WorkOrderReportComponent } from './pages/work-order-report/work-order-report.component';
import { MeterUploadComponent } from './pages/meter-upload/meter-upload.component';
import { PcTestComponent } from './pages/pc-test/pc-test.component';
import { PcListComponent } from './pc-list/pc-list.component';
import { FieldReportComponent } from './pages/field-report/field-report.component';
import { TransformerUploadComponent } from './pages/transformer-upload/transformer-upload.component';
import { CorporateBudgetReportComponent } from './pages/corporate-budget-report/corporate-budget-report.component';
import { DisConnectionReportComponent } from './pages/dis-connection-report/dis-connection-report.component';
import { BMRSuccessReportComponent } from './pages/bmr-success-report/bmr-success-report.component';
import { BMRErrorReportComponent } from './pages/bmr-error-report/bmr-error-report.component';
import { PCTestReportComponent } from './pages/pc-test-report/pc-test-report.component';
import { PendingSuspenceMeterReportComponent } from './pages/pending-suspence-meter-report/pending-suspence-meter-report.component';
import { PendingCompletionReportComponent } from './pages/pending-completion-report/pending-completion-report.component';
@NgModule({
  declarations: [
    WorkManagementComponent,
    WorkManagementSidenavComponent,
    WorkManagementDashboardComponent,
    BudgetFromsComponent,
    MaterialIndentRequestFormComponent,
    MaterialIndentApprovalFormComponent,
    BudgetApprovalComponent,
    BudgetApprovalDetailsComponent,
    WorkComplitionReportComponent,
    DatePipeSecondComponent,
    MaterialIndentApprovalComponent,
    DivisionalBudgetHeadComponent,
    AssetBomMappingComponent,
    WorkCompletionReportComponent,
    AssetBomReportComponent,
    GeneratedAssetUidReportComponent,
    MaterialsReturnRequestComponent,
    MaterialsReturnApprovalComponent,
    MaterialsTransferRequestComponent,
    MaterialsTransferApprovalComponent,
    MaterialsReturnApprovalFormComponent,
    MaterialsTranferApprovalFormComponent,
    CostRegisteredReportComponent,
    BillSubmissionListComponent,
    BillSubmissionComponent,
    DownloadWorkCompletionComponent,
    CreateWorkAwardRequestComponent,
    BudgetAbstractReportComponent,
    BudgetTransactionReportComponent,
    CRegisteredInvoiceVerficationComponent,
    InvoiceDetailsComponent,
    AcknowledgementVerificationComponent,
    AcknowledgementDetailsComponent,
    CRegisteredDetailComponent,
    CRegisterFullDetailsComponent,
    BillSubmissionCRegisterComponent,
    BillSubmissionDetailCregisterComponent,
    PendingRegistrationReportComponent,
    SuspensePopupComponent,
    TransferSusPopupComponent,
    MaterialIndentGenarateComponent,
    ReturnGenerateComponent,
    SuspenseGenerateComponent,
    RejectSuspensePopupComponent,
    RejectReturnPopupComponent,
    RejectIndentPopupComponent,
    WorkOrderReportComponent,
    MeterUploadComponent,
    PcTestComponent,
    PcListComponent,
    FieldReportComponent,
    TransformerUploadComponent,
    CorporateBudgetReportComponent,
    DisConnectionReportComponent,
    BMRSuccessReportComponent,
    BMRErrorReportComponent,
    PCTestReportComponent,
    PendingSuspenceMeterReportComponent,
    PendingCompletionReportComponent,
  ],
  imports: [
    CommonModule,
    WorkManagementRoutingModule,
    SharedModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    TreeSelectModule,
    TreeModule,
  ],
  providers: [BudgetDataService],
})
export class WorkManagementModule {}
