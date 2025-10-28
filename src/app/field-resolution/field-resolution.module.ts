import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldResolutionSideNavComponent } from './components/field-resolution-side-nav/field-resolution-side-nav.component';
import { FieldResolutionComponent } from './pages/field-resolution/field-resolution.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../shared/shared.module';
import { FieldComplaintsResoultionComponent } from './pages/field-complaints-resoultion/field-complaints-resoultion.component';
import { FieldResolutionRoutingModule } from './field-resolution-routing.module';
import { PowerSanctionComponent } from './pages/power-sanction/power-sanction.component';
import { BackWorkExecutionComponent } from './pages/back-work-execution/back-work-execution.component';
import { BackMeterUploadComponent } from './pages/back-meter-upload/back-meter-upload.component';
import { BackAccountMeterMappingComponent } from './pages/back-account-meter-mapping/back-account-meter-mapping.component';
import { ExecutionMethodChangeComponent } from './pages/execution-method-change/execution-method-change.component';
import { WorkOrderCreationAetComponent } from './pages/work-order-creation-aet/work-order-creation-aet.component';
import { BackSiteInspectionComponent } from './pages/back-site-inspection/back-site-inspection.component';
import { ProcurementLetterComponent } from './pages/procurement-letter/procurement-letter.component';
import { AccountMeterToMeterUploadComponent } from './pages/account-meter-to-meter-upload/account-meter-to-meter-upload.component';
import { MoveToMeterUploadComponent } from './pages/move-to-meter-upload/move-to-meter-upload.component';
import { ChangeDopCategoryComponent } from './pages/change-dop-category/change-dop-category.component';
import { LineExtChangeComponent } from './pages/line-ext-change/line-ext-change.component';
import { SmrEstimationChangeComponent } from './smr-estimation-change/smr-estimation-change.component';
import { AwaitingPaymentComponent } from './awaiting-payment/awaiting-payment.component';
import { WorkImprovementToEstimateComponent } from './pages/work-improvement-to-estimate/work-improvement-to-estimate.component';
import { ImprovementWorksFarComponent } from './pages/improvement-works-far/improvement-works-far.component';
import { ServiceMainEstimateFarComponent } from './pages/service-main-estimate-far/service-main-estimate-far.component';
import { MeterToWorkExecutionFarComponent } from './pages/meter-to-work-execution-far/meter-to-work-execution-far.component';
import { SmrCaseFarComponent } from './pages/smr-case-far/smr-case-far.component';
import { ImwEstimateFarComponent } from './pages/imw-estimate-far/imw-estimate-far.component';
import { SmrEstimateFarComponent } from './pages/smr-estimate-far/smr-estimate-far.component';
import { AmmSmrFarComponent } from './pages/amm-smr-far/amm-smr-far.component';
import { MeterReplacementFarComponent } from './pages/meter-replacement-far/meter-replacement-far.component';
import { MeterMcFarComponent } from './pages/meter-mc-far/meter-mc-far.component';
import { MeterBmrFarComponent } from './pages/meter-bmr-far/meter-bmr-far.component';
import { ServiceMainFarComponent } from './pages/service-main-far/service-main-far.component';

@NgModule({
  declarations: [
    FieldResolutionSideNavComponent,
    FieldResolutionComponent,
    FieldComplaintsResoultionComponent,
    PowerSanctionComponent,
    BackWorkExecutionComponent,
    BackMeterUploadComponent,
    BackAccountMeterMappingComponent,
    ExecutionMethodChangeComponent,
    WorkOrderCreationAetComponent,
    BackSiteInspectionComponent,
    ProcurementLetterComponent,
    AccountMeterToMeterUploadComponent,
    MoveToMeterUploadComponent,
    ChangeDopCategoryComponent,
    LineExtChangeComponent,
    SmrEstimationChangeComponent,
    AwaitingPaymentComponent,
    WorkImprovementToEstimateComponent,
    ImprovementWorksFarComponent,
    ServiceMainEstimateFarComponent,
    MeterToWorkExecutionFarComponent,
    SmrCaseFarComponent,
    ImwEstimateFarComponent,
    SmrEstimateFarComponent,
    AmmSmrFarComponent,
    MeterReplacementFarComponent,
    MeterMcFarComponent,
    MeterBmrFarComponent,
    ServiceMainFarComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FieldResolutionRoutingModule,
    MatAutocompleteModule,
  ]
})
export class fieldResolutionModule { }
