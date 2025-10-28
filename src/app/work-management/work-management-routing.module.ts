import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetFromsComponent } from './pages/budget-froms/budget-froms.component';
import { MaterialIndentRequestFormComponent } from './pages/material-indent-request-form/material-indent-request-form.component';
import { MaterialIndentApprovalFormComponent } from './pages/material-indent-approval-form/material-indent-approval-form.component';
import { BudgetApprovalComponent } from './pages/budget-approval/budget-approval.component';
import { WorkComplitionReportComponent } from './pages/work-complition-report/work-complition-report.component';
import { WorkAwardRequestComponent } from './pages/work-award-request/work-award-request.component';
import { BudgetApprovalDetailsComponent } from './pages/budget-approval/pages/budget-approval-details/budget-approval-details.component';
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
import { CostRegisteredReportComponent } from './pages/cost-registered-report/cost-registered-report.component';
import { BillSubmissionListComponent } from './bill-submission-list/bill-submission-list.component';
import { BillSubmissionComponent } from './pages/bill-submission/bill-submission.component';
import { DownloadWorkCompletionComponent } from './pages/download-work-completion/download-work-completion.component';
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
import { WorkManagementDashboardComponent } from './components/work-management-dashboard/work-management-dashboard.component';
import { MaterialIndentGenarateComponent } from './pages/material-indent-genarate/material-indent-genarate.component';
import { ReturnGenerateComponent } from './pages/return-generate/return-generate.component';
import { SuspenseGenerateComponent } from './pages/suspense-generate/suspense-generate.component';
import { WorkOrderReportComponent } from './pages/work-order-report/work-order-report.component';
import { MeterUploadComponent } from './pages/meter-upload/meter-upload.component';
import { PcTestComponent } from './pages/pc-test/pc-test.component';
import { PcListComponent } from './pc-list/pc-list.component';
import { TransformerUploadComponent } from './pages/transformer-upload/transformer-upload.component';
import { RoleBasedGuard } from '../guards/role-based.guard';
import { CorporateBudgetReportComponent } from './pages/corporate-budget-report/corporate-budget-report.component';
import { DisConnectionReportComponent } from './pages/dis-connection-report/dis-connection-report.component';
import { PCTestReportComponent } from './pages/pc-test-report/pc-test-report.component';
import { BMRErrorReportComponent } from './pages/bmr-error-report/bmr-error-report.component';
import { BMRSuccessReportComponent } from './pages/bmr-success-report/bmr-success-report.component';
import { PendingSuspenceMeterReportComponent } from './pages/pending-suspence-meter-report/pending-suspence-meter-report.component';
import { WorkOrderSeriesMasterComponent } from '../configuration/pages/work-order-series-master/work-order-series-master.component';
import { PendingCompletionReportComponent } from './pages/pending-completion-report/pending-completion-report.component';
const routes: Routes = [
  { path: 'dashboard', component: WorkManagementDashboardComponent },
  { path: 'budget-form', component: BudgetFromsComponent,canActivate:[RoleBasedGuard]},
  { path: 'budget-approval', component: BudgetApprovalComponent,canActivate:[RoleBasedGuard]},
  {
    path: 'budget-approval-details',
    component: BudgetApprovalDetailsComponent,
  },
  {
    path: 'material-indent-request-form',
    component: MaterialIndentRequestFormComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'material-indent-approval',
    component: MaterialIndentApprovalComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'material-indent-approval-form/:materialIntentId',
    component: MaterialIndentApprovalFormComponent,
  },
  {
    path: 'work-complition',
    component: WorkComplitionReportComponent,
  },
  {
    path: 'bill-submission',
    component: BillSubmissionComponent,
  },
  {
    path: 'download-work-completion-report',
    component: DownloadWorkCompletionComponent,
  },
  {
    path: 'work-award-request',
    component: WorkAwardRequestComponent,
  },
  { path: 'budget-head', component: DivisionalBudgetHeadComponent,canActivate:[RoleBasedGuard]},
  { path: 'asset-bom-mapping', component: AssetBomMappingComponent },
  { path: 'work-completion-report', component: WorkCompletionReportComponent,canActivate:[RoleBasedGuard] },
  { path: 'asset-bom-report', component: AssetBomReportComponent ,canActivate:[RoleBasedGuard]},
  {
    path: 'generated-asset-uid-report',
    component: GeneratedAssetUidReportComponent,
  },
  { path: 'cost-registered-report', component: CostRegisteredReportComponent },
  { path: 'bill-submission-list', component: BillSubmissionListComponent,canActivate:[RoleBasedGuard]},
  { path: 'budget-head', component: DivisionalBudgetHeadComponent,canActivate:[RoleBasedGuard]},
  { path: 'asset-bom-mapping', component: AssetBomMappingComponent },
  { path: 'work-completion-report', component: WorkCompletionReportComponent,canActivate:[RoleBasedGuard] },
  { path: 'asset-bom-report', component: AssetBomReportComponent,canActivate:[RoleBasedGuard] },
  {
    path: 'generated-asset-uid-report',
    component: GeneratedAssetUidReportComponent,
  },
  { path: 'cost-registered-report', component: CostRegisteredReportComponent },
  {
    path: 'materials-return-request',
    component: MaterialsReturnRequestComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'materials-return-approval',
    component: MaterialsReturnApprovalComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'materials-transfer-request',
    component: MaterialsTransferRequestComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'materials-transfer-approval',
    component: MaterialsTransferApprovalComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'materials-return-approval-form/:materialIntentId',
    component: MaterialsReturnApprovalFormComponent,
  },
  {
    path: 'materials-transfer-approval-form/:wmMaterialsIndentId',
    component: MaterialsTranferApprovalFormComponent,
  },
  {
    path: 'budget-abstract-report',
    component: BudgetAbstractReportComponent,
  },
  {
    path: 'budget-transaction-report',
    component: BudgetTransactionReportComponent,
  },
  {
    path: 'invoice-verification',
    component: CRegisteredInvoiceVerficationComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'invoice-verification-details',
    component: InvoiceDetailsComponent,
  },
  {
    path: 'acknowledgment-verification',
    component: AcknowledgementVerificationComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'acknowledgment-details',
    component: AcknowledgementDetailsComponent,
  },
  {
    path: 'c-registered-details',
    component: CRegisteredDetailComponent,
  },
  {
    path: 'c-register-full-details/:id',
    component: CRegisterFullDetailsComponent,
  },
  {
    path: 'c-register-bill-submission',
    component: BillSubmissionCRegisterComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'c-register-bill-submission-details/:id',
    component: BillSubmissionDetailCregisterComponent,
  },
  {
    path: 'pending-registartion-report',
    component: PendingRegistrationReportComponent,
  },
  {
    path: 'material-indent-generated',
    component: MaterialIndentGenarateComponent,
  },
  {
    path: 'material-Return-generated',
    component: ReturnGenerateComponent,
  },
  {
    path: 'material-suspense-generated',
    component: SuspenseGenerateComponent,
  },
  {
    path: 'transformer-upload',
    component: TransformerUploadComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'meter-upload',
    component: MeterUploadComponent,
  },
  { path: 'work-order-report', component: WorkOrderReportComponent },
  { path: 'pc-test', component: PcTestComponent },
  { path: 'pc-list', component: PcListComponent,canActivate:[RoleBasedGuard]},
  { path: 'Corporate-Budget-Report', component: CorporateBudgetReportComponent },
  { path: 'Disconnection-Report', component: DisConnectionReportComponent },
  { path: 'pc-test-report', component: PCTestReportComponent },
  { path: 'bmr-success-report', component: BMRSuccessReportComponent },
  { path: 'bmr-error-report', component: BMRErrorReportComponent },
  { path: 'pending-suspence-meter-report', component: PendingSuspenceMeterReportComponent},
  { path: 'work-order-series-master', component:WorkOrderSeriesMasterComponent,canActivate:[RoleBasedGuard]},
  { path: 'pending-completion-report', component: PendingCompletionReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkManagementRoutingModule {}
