import { ServiceMainEstimateFarComponent } from './pages/service-main-estimate-far/service-main-estimate-far.component';
import { ChangeDopCategoryComponent } from './pages/change-dop-category/change-dop-category.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FieldComplaintsResoultionComponent } from './pages/field-complaints-resoultion/field-complaints-resoultion.component';
import { PowerSanctionComponent } from './pages/power-sanction/power-sanction.component';
import { BackAccountMeterMappingComponent } from './pages/back-account-meter-mapping/back-account-meter-mapping.component';
import { BackMeterUploadComponent } from './pages/back-meter-upload/back-meter-upload.component';
import { BackWorkExecutionComponent } from './pages/back-work-execution/back-work-execution.component';
import { ExecutionMethodChangeComponent } from './pages/execution-method-change/execution-method-change.component';
import { WorkOrderCreationAetComponent } from './pages/work-order-creation-aet/work-order-creation-aet.component';
import { BackSiteInspectionComponent } from './pages/back-site-inspection/back-site-inspection.component';
import { ProcurementLetterComponent } from './pages/procurement-letter/procurement-letter.component';
import { AccountMeterToMeterUploadComponent } from './pages/account-meter-to-meter-upload/account-meter-to-meter-upload.component';
import { MoveToMeterUploadComponent } from './pages/move-to-meter-upload/move-to-meter-upload.component';
import { LineExtChangeComponent } from './pages/line-ext-change/line-ext-change.component';
import { SmrEstimationChangeComponent } from './smr-estimation-change/smr-estimation-change.component';
import { AwaitingPaymentComponent } from './awaiting-payment/awaiting-payment.component';
import { WorkImprovementToEstimateComponent } from './pages/work-improvement-to-estimate/work-improvement-to-estimate.component';
import { ImprovementWorksFarComponent } from './pages/improvement-works-far/improvement-works-far.component';
import { MeterToWorkExecutionFarComponent } from './pages/meter-to-work-execution-far/meter-to-work-execution-far.component';
import { SmrCaseFarComponent } from './pages/smr-case-far/smr-case-far.component';
import { ImwEstimateFarComponent } from './pages/imw-estimate-far/imw-estimate-far.component';
import { SmrEstimateFarComponent } from './pages/smr-estimate-far/smr-estimate-far.component';
import { AmmSmrFarComponent } from './pages/amm-smr-far/amm-smr-far.component';
import { MeterReplacementFarComponent } from './pages/meter-replacement-far/meter-replacement-far.component';
import { MeterMcFarComponent } from './pages/meter-mc-far/meter-mc-far.component';
import { MeterBmrFarComponent } from './pages/meter-bmr-far/meter-bmr-far.component';
import { ServiceMainFarComponent } from './pages/service-main-far/service-main-far.component';
const routes: Routes = [
{path:'revert-to-site-inspection',component:BackSiteInspectionComponent},  
{path:'power-sanction',component:PowerSanctionComponent},
{path:'back-account-mapping',component:BackAccountMeterMappingComponent},
{path:'back-meter-upload',component:BackMeterUploadComponent},
{path:'back-work-execution',component:BackWorkExecutionComponent},
{path:'execution-method-change',component:ExecutionMethodChangeComponent},
{path:'change-approval-in-work-order-creation',component:WorkOrderCreationAetComponent},
{path:'generate-procurement-letter',component:ProcurementLetterComponent},
{path:'account-mapping-to-meter-upload',component:AccountMeterToMeterUploadComponent},
{path:'move-to-meter-upload',component:MoveToMeterUploadComponent}, 
{path:'change-dop-category',component:ChangeDopCategoryComponent},
{path:'line-ext-change',component:LineExtChangeComponent},
{path:'smr-estimation-change',component:SmrEstimationChangeComponent},
{path:'payment-to-estimation-approval',component:AwaitingPaymentComponent},
{path:'work-improvement-to-estimate',component:WorkImprovementToEstimateComponent},
{path:'imw-revert-workexecution',component:ImprovementWorksFarComponent},
{path:'meterupload-to-servicemain',component:ServiceMainEstimateFarComponent},
{path:'meter-to-work-execution',component:MeterToWorkExecutionFarComponent},
{path:'smr-cancellation',component:SmrCaseFarComponent},
{path:'revert-imw',component:ImwEstimateFarComponent},
{path:'smr-approval',component:SmrEstimateFarComponent},
{path:'amm-to-meter',component:AmmSmrFarComponent},
{path:'meter-replacement-validation',component:MeterReplacementFarComponent},
{path:'meter-mc',component:MeterMcFarComponent},
{path:'meter-bmr',component:MeterBmrFarComponent},
{path:'service-main-material',component:ServiceMainFarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldResolutionRoutingModule {}
