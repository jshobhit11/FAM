import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

import { SharedModule } from '../shared/shared.module';
import { InspectionPrintFormComponent } from '../dashboard-forms/pages/inspection-print-form/inspection-print-form.component';
import { ViewSiteInspectionPageComponent } from '../estimate-forms/pages/view-site-inspection-page/view-site-inspection-page.component';
import { AssignCrewFormComponent } from './pages/assign-crew-form/assign-crew-form.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { WorkExecutionComponent } from './pages/work-execution/work-execution.component';
import { WorkExecutionDetailsComponent } from './pages/work-execution-details/work-execution-details.component';
import { WorkAwardComponent } from './pages/work-award/work-award.component';
import { AwardingOfWorkOnLabourContractComponent } from './pages/work-award/awarding-of-work-on-labour-contract/awarding-of-work-on-labour-contract.component';
import { ActualQuantityComponent } from './pages/work-execution/pop-up/actual-quantity/actual-quantity.component';
import { StructureBlockComponent } from './pages/work-execution/pop-up/structure-block/structure-block.component';
import { StructureSpanComponent } from './pages/work-execution/pop-up/structure-span/structure-span.component';
import { SearchByAccountIdComponent } from './search-by-account-id/search-by-account-id.component';
import { EditWorkExecutionComponent } from './pages/edit-work-execution/edit-work-execution.component';
import { AwaitingPaymentComponent } from './awaiting-payment/awaiting-payment.component';
import { CscSiteInspectionComponent } from './csc-site-inspection/csc-site-inspection.component';
import { PrintFormComponent } from './print-form/print-form.component';
import { ConfirmationComponent } from './pages/work-execution/pop-up/confirmation/confirmation.component';
import { WorkExecutionMaterialComponent } from './pages/work-execution/work-execution-material/work-execution-material.component';
import { ServiceLineEstimateApprovalComponent } from '../estimate-forms/service-line-estimate-approval/service-line-estimate-approval.component';
import { FullDetailsComponent } from '../work-management/pages/full-details/full-details.component';

@NgModule({
  declarations: [
    MainComponent,
    SidenavComponent,
    InspectionPrintFormComponent,
    ViewSiteInspectionPageComponent,
    AssignCrewFormComponent,
    WorkExecutionComponent,
    WorkExecutionDetailsComponent,
    WorkAwardComponent,
    AwardingOfWorkOnLabourContractComponent,
    ActualQuantityComponent,
    StructureBlockComponent,
    StructureSpanComponent,
    SearchByAccountIdComponent,
    EditWorkExecutionComponent,
    AwaitingPaymentComponent,
    ServiceLineEstimateApprovalComponent,
    CscSiteInspectionComponent,
    PrintFormComponent,
    ConfirmationComponent,
    WorkExecutionMaterialComponent,
    FullDetailsComponent,
  ],
  imports: [CommonModule, MainRoutingModule, SharedModule],
})
export class MainModule {}
