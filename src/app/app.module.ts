import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardFormsComponent } from './dashboard-forms/dashboard-forms.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipeComponent } from './commons/date-pipe/date-pipe.component';
import { EstimateFormsComponent } from './estimate-forms/estimate-forms.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewPopUpComponent } from './estimate-forms/components/view-pop-up/view-pop-up.component';
import { TemplatesPopupComponent } from './estimate-forms/components/templates-popup/templates-popup.component';
import { ConfigurationModule } from './configuration/configuration.module';
import { EstimatesModule } from './estimates/estimates.module';
import { WorkManagementModule } from './work-management/work-management.module';
import { EstimationApprovalComponent } from './estimation-approval/estimation-approval.component';
import { WorkAwardRequestComponent } from './work-management/pages/work-award-request/work-award-request.component';
import { WorkOrderSummaryComponent } from './work-order/work-order-summary/work-order-summary.component';
import { WorkOrderFormComponent } from './work-order/work-order-form/work-order-form.component';
import { WorkOrderApprovalFormComponent } from './work-order/work-order-approval-form/work-order-approval-form.component';
import { SubListComponent } from './sub-list/sub-list.component';
import { WorkOrderCreationComponent } from './work-order/work-order-creation/work-order-creation.component';
import { WorkOrderPendingComponent } from './work-order/work-order-pending/work-order-pending.component';
import { EstimationReportComponent } from './estimation-report/estimation-report.component';
import { SaveTemplateConfirmComponent } from './shared/components/save-template-confirm/save-template-confirm.component';
import { GeneratePopupComponent } from './shared/components/generate-popup/generate-popup.component';
import { PermitToWorkRequestComponent } from './work-order/permit-to-work-request/permit-to-work-request.component';
import { LineClearanceComponent } from './work-order/line-clearance/line-clearance.component';
import { AssetIdAndCunsumerMappingComponent } from './work-order/asset-id-and-cunsumer-mapping/asset-id-and-cunsumer-mapping.component';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ServiceLineEstimateComponent } from './estimate-forms/service-line-estimate/service-line-estimate.component';
import { WorkOrderPackageReportComponent } from './work-order/work-order-approval-form/work-order-package-report/work-order-package-report.component';
import { InspectionPopupComponent } from './shared/components/inspection-popup/inspection-popup.component';
import { AcceptPopupComponent } from './shared/components/accept-popup/accept-popup.component';
import { RejectPopupComponent } from './shared/components/reject-popup/reject-popup.component';
import { GenerateRequestPopupComponent } from './shared/components/generateRequest-popup/generateRequest-popup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { OfficeHierarchyComponent } from './office-hierarchy/office-hierarchy.component';
import { MaterialInspectionComponent } from './work-order/material-inspection/material-inspection.component';
import { AccountIdMeterMappingComponent } from './work-order/account-id-meter-mapping/account-id-meter-mapping.component';
import { EstimationSanctionComponent } from './estimation-sanction/estimation-sanction.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoaderComponent, LoaderService } from './services/loader.service';
import { EstimationCscApprovalComponent } from './estimation-csc-approval/estimation-csc-approval.component';
import { MeterChangeDetailsComponent } from './work-order/meter-change-details/meter-change-details.component';
import { CookieService } from 'ngx-cookie-service';
import { UserIdleModule } from 'angular-user-idle';
import { AccountIdMappingScComponent } from './work-order/account-id-mapping-sc/account-id-mapping-sc.component';
import { PopupGisContentComponent } from './popup-gis-content/popup-gis-content.component';
import { ViewPointPopupComponent } from './view-point-popup/view-point-popup.component';
import { MeterChangeDetailsScComponent } from './work-order/meter-change-details-sc/meter-change-details-sc.component';
import { PopupGisFeasibilityComponent } from './popup-gis-feasibility/popup-gis-feasibility.component';
import { ViewFeasibilityPointPopupComponent } from './view-feasibility-point-popup/view-feasibility-point-popup.component';
import { MeterReplicateAndValidateComponent } from './work-order/meter-replicate-and-validate/meter-replicate-and-validate.component';
import { LrLeMeterPowerApprovalComponent } from './lr-le-meter-power-approval/lr-le-meter-power-approval.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ViewPopUpEstimateComponent } from './estimate-forms/components/view-pop-up-estimate/view-pop-up-estimate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopUpComponent } from './lr-le-meter-power-approval/pop-up/pop-up.component';
import { MultipleAccountMeterMappingComponent } from './meter-energization/multiple-account-meter-mapping/multiple-account-meter-mapping.component';
import { MultipleAccountMeterReplacemantComponent } from './meter-energization/multiple-account-meter-replacemant/multiple-account-meter-replacemant.component';
import { SingleAccountMeterReplacemantComponent } from './meter-energization/single-account-meter-replacemant/single-account-meter-replacemant.component';
import { SingleAccountMeterMappingComponent } from './meter-energization/single-account-meter-mapping/single-account-meter-mapping.component';
import { WelcomeComponent } from './welcome/welcome/welcome.component';
import { fieldResolutionModule } from './field-resolution/field-resolution.module';
//import { OtpComponent } from './components/otp/otp.component';
import { OtpComponent } from './otp/otp.component';
import { PremisesDocUploadComponent } from './premises-doc-upload/premises-doc-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardFormsComponent,
    HomeComponent,
    DashboardComponent,
    PageNotFoundComponent,
    DatePipeComponent,
    EstimateFormsComponent,
    ServiceLineEstimateComponent,
    TemplatesPopupComponent,
    ViewPopUpComponent,
    EstimationApprovalComponent,
    EstimationSanctionComponent,
    WorkAwardRequestComponent,
    WorkOrderSummaryComponent,
    WorkOrderFormComponent,
    WorkOrderApprovalFormComponent,
    SubListComponent,
    WorkOrderCreationComponent,
    WorkOrderPendingComponent,
    EstimationReportComponent,
    SaveTemplateConfirmComponent,
    GeneratePopupComponent,
    GenerateRequestPopupComponent,
    AcceptPopupComponent,
    RejectPopupComponent,
    PermitToWorkRequestComponent,
    LineClearanceComponent,
    AssetIdAndCunsumerMappingComponent,
    WorkOrderPackageReportComponent,
    InspectionPopupComponent,
    OfficeHierarchyComponent,
    MaterialInspectionComponent,
    AccountIdMeterMappingComponent,
    MeterChangeDetailsComponent,
    LoaderComponent,
    EstimationCscApprovalComponent,
    AccountIdMappingScComponent,
    PopupGisContentComponent,
    ViewPointPopupComponent,
    MeterChangeDetailsScComponent,
    PopupGisFeasibilityComponent,
    ViewFeasibilityPointPopupComponent,
    MeterReplicateAndValidateComponent,
    LrLeMeterPowerApprovalComponent,
    UnauthorizedComponent,
    ViewPopUpEstimateComponent,
    PopUpComponent,
    MultipleAccountMeterMappingComponent,
    MultipleAccountMeterReplacemantComponent,
    SingleAccountMeterReplacemantComponent,
    SingleAccountMeterMappingComponent,
    WelcomeComponent,
    OtpComponent,
    PremisesDocUploadComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    EstimatesModule,
    ConfigurationModule,
    WorkManagementModule,
    NgMultiSelectDropDownModule,
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    fieldResolutionModule,
    UserIdleModule.forRoot({ idle: 900, timeout: 1000, ping: 10 }),
    FormsModule,

    HttpClientModule
  ],
  providers: [LoaderService, BsModalRef, BsModalService, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule { }



// @NgModule({
//   imports: [

//   ],
//   bootstrap: [AppComponent]
// })
//export class AppModule { }
