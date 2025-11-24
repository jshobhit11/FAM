import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardFormsComponent } from '../dashboard-forms/dashboard-forms.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EstimateFormsComponent } from '../estimate-forms/estimate-forms.component';
import { ViewSiteInspectionPageComponent } from '../estimate-forms/pages/view-site-inspection-page/view-site-inspection-page.component';
import { HomeComponent } from '../home/home.component';
import { EstimationApprovalComponent } from '../estimation-approval/estimation-approval.component';
import { WorkOrderSummaryComponent } from '../work-order/work-order-summary/work-order-summary.component';
import { WorkOrderFormComponent } from '../work-order/work-order-form/work-order-form.component';
import { WorkOrderApprovalFormComponent } from '../work-order/work-order-approval-form/work-order-approval-form.component';
import { AssignCrewFormComponent } from './pages/assign-crew-form/assign-crew-form.component';
import { WorkExecutionComponent } from './pages/work-execution/work-execution.component';
import { WorkExecutionDetailsComponent } from './pages/work-execution-details/work-execution-details.component';
import { WorkAwardComponent } from './pages/work-award/work-award.component';
import { SubListComponent } from '../sub-list/sub-list.component';
import { WorkOrderCreationComponent } from '../work-order/work-order-creation/work-order-creation.component';
import { WorkOrderPendingComponent } from '../work-order/work-order-pending/work-order-pending.component';
import { EstimationReportComponent } from '../estimation-report/estimation-report.component';
import { PermitToWorkRequestComponent } from '../work-order/permit-to-work-request/permit-to-work-request.component';
import { LineClearanceComponent } from '../work-order/line-clearance/line-clearance.component';
import { AssetIdAndCunsumerMappingComponent } from '../work-order/asset-id-and-cunsumer-mapping/asset-id-and-cunsumer-mapping.component';
import { ServiceLineEstimateComponent } from '../estimate-forms/service-line-estimate/service-line-estimate.component';
import { WorkOrderPackageReportComponent } from '../work-order/work-order-approval-form/work-order-package-report/work-order-package-report.component';
import { AwardingOfWorkOnLabourContractComponent } from './pages/work-award/awarding-of-work-on-labour-contract/awarding-of-work-on-labour-contract.component';
import { SearchByAccountIdComponent } from './search-by-account-id/search-by-account-id.component';
import { EditWorkExecutionComponent } from './pages/edit-work-execution/edit-work-execution.component';
import { MaterialInspectionComponent } from '../work-order/material-inspection/material-inspection.component';
import { CreateWorkAwardRequestComponent } from '../work-management/pages/create-work-award-request/create-work-award-request.component';
import { AwaitingPaymentComponent } from './awaiting-payment/awaiting-payment.component';
import { AccountIdMeterMappingComponent } from '../work-order/account-id-meter-mapping/account-id-meter-mapping.component';
import { EstimationSanctionComponent } from '../estimation-sanction/estimation-sanction.component';
import { CscSiteInspectionComponent } from './csc-site-inspection/csc-site-inspection.component';
import { PrintFormComponent } from './print-form/print-form.component';
import { EstimationCscApprovalComponent } from '../estimation-csc-approval/estimation-csc-approval.component';
import { ServiceLineEstimateApprovalComponent } from '../estimate-forms/service-line-estimate-approval/service-line-estimate-approval.component';
import { MeterChangeDetailsComponent } from '../work-order/meter-change-details/meter-change-details.component';
import { FullDetailsComponent } from '../work-management/pages/full-details/full-details.component';
import { AccountIdMappingScComponent } from '../work-order/account-id-mapping-sc/account-id-mapping-sc.component';
import { MeterChangeDetailsScComponent } from '../work-order/meter-change-details-sc/meter-change-details-sc.component';
import { MeterReplicateAndValidateComponent } from '../work-order/meter-replicate-and-validate/meter-replicate-and-validate.component';
import { FieldReportComponent } from '../work-management/pages/field-report/field-report.component';
import { MeterUploadComponent } from '../work-management/pages/meter-upload/meter-upload.component';
import { LrLeMeterPowerApprovalComponent } from '../lr-le-meter-power-approval/lr-le-meter-power-approval.component';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent

  },
  //  children: [
  { path: 'dashboard', component: DashboardComponent },

  { path: 'home/:statusCode/:processTypeName', component: HomeComponent },
  { path: 'sub-list/:statusCode/:processTypeName', component: SubListComponent },
  { path: 'siteInspection/:statusCode/:processTypeName/:serviceRegistrationsId', component: DashboardFormsComponent },
  { path: 'cscSiteInspection/:statusCode/:processTypeName/:serviceRegistrationsId', component: CscSiteInspectionComponent },
  { path: 'print-form/:accountId', component: PrintFormComponent },

  // Estimation Forms
  { path: 'estimate-forms/:statusCode/:processTypeName/:serviceRegistrationsId', component: EstimateFormsComponent },
  { path: 'estimate-forms/:statusCode/:serviceRegistrationsId/:edit/:processTypeName', component: EstimateFormsComponent },
  { path: 'estimation-report/:estimationId/:registrationId', component: EstimationReportComponent },
  { path: 'estimation-approval/:statusCode/:processTypeName/:serviceRegistrationsId', component: EstimationApprovalComponent },
  { path: 'load-power-sanction/:statusCode/:processTypeName/:serviceRegistrationsId', component: LrLeMeterPowerApprovalComponent },
  { path: 'other-estimation-approval/:statusCode/:processTypeName/:serviceRegistrationsId', component: EstimationCscApprovalComponent },
  { path: 'estimation-sanction/:statusCode/:processTypeName/:serviceRegistrationsId', component: EstimationSanctionComponent },
  { path: 'service-line-estimate/:statusCode/:processTypeName/:serviceRegistrationsId', component: ServiceLineEstimateComponent },
  { path: 'service-line-estimate/:serviceRegistrationsId/:statusCode/:processTypeName/:edit', component: ServiceLineEstimateComponent },
  { path: 'view-site-inspection', component: ViewSiteInspectionPageComponent },

  // Work Execution
  { path: 'work-execution', component: WorkExecutionComponent },
  { path: 'work-execution-details', component: WorkExecutionDetailsComponent },

  // Work Order
  { path: 'work-order-summary', component: WorkOrderSummaryComponent },
  { path: 'work-order-creation', component: WorkOrderCreationComponent },
  { path: 'work-order-pending', component: WorkOrderPendingComponent },
  { path: 'work-order-approval', component: WorkOrderApprovalFormComponent },
  { path: 'work-award', component: WorkAwardComponent },
  { path: 'create-work-order-form', component: WorkOrderFormComponent },
  { path: 'assign-crew-form', component: AssignCrewFormComponent },
  { path: 'permit-to-work-request', component: PermitToWorkRequestComponent },
  { path: 'line-clearance', component: LineClearanceComponent },
  { path: 'asset-id-and-consumer-mapping', component: AssetIdAndCunsumerMappingComponent },
  { path: 'work-order-package-report', component: WorkOrderPackageReportComponent },
  { path: 'awarding-of-work-on-labour-contract/:workorderRegisteredId', component: AwardingOfWorkOnLabourContractComponent },
  { path: 'search-result/:accountId/:searchBy/:searchType', component: SearchByAccountIdComponent },
  { path: 'edit-work-execution', component: EditWorkExecutionComponent },
  { path: 'material-inspection', component: MaterialInspectionComponent },
  { path: 'create-work-award-request', component: CreateWorkAwardRequestComponent },
  { path: 'service-line-estimate-approval/:statusCode/:processTypeName/:serviceRegistrationsId', component: ServiceLineEstimateApprovalComponent },
  { path: 'awaiting-payment/:accountId/:statusCode/:processTypeName', component: AwaitingPaymentComponent },
  { path: 'account-id-meter-mapping', component: AccountIdMeterMappingComponent },
  { path: 'meter-uploads', component: MeterUploadComponent },
  { path: 'full-details/:serviceRegistrationId', component: FullDetailsComponent },
  { path: 'meter-replacement', component: MeterChangeDetailsComponent },
  { path: 'meter-validate-and-replicate', component: MeterReplicateAndValidateComponent },
  { path: 'account-id-meter-mapping-sc', component: AccountIdMappingScComponent },
  { path: 'meter-replacement-sc', component: MeterChangeDetailsScComponent },
  { path: 'field-report', component: FieldReportComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
