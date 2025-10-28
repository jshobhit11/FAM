import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EstimatesComponent } from './estimates.component';
import { EstimatesSidenavComponent } from './components/estimates-sidenav/estimates-sidenav.component';
import { EstimatesRoutingModule } from './estimates-routing.module';
import { OtherServiceRequestsEstimationCreationComponent } from './pages/other-service-requests-estimation-creation/other-service-requests-estimation-creation.component';
import { OtherServiceRequestsEstimationApprovalComponent } from './pages/other-service-requests-estimation-approval/other-service-requests-estimation-approval.component';
import { DismantlementWorksEstimationCreationComponent } from './pages/dismantlement-works-estimation-creation/dismantlement-works-estimation-creation.component';
import { DismantlementWorksEstimationApprovalComponent } from './pages/dismantlement-works-estimation-approval/dismantlement-works-estimation-approval.component';
import { MeterReplacementsEstimationCreationComponent } from './pages/meter-replacements-estimation-creation/meter-replacements-estimation-creation.component';
import { MeterReplacementsEstimationApprovalComponent } from './pages/meter-replacements-estimation-approval/meter-replacements-estimation-approval.component';
import { DepartmentalWorksEstimationCreationComponent } from './pages/departmental-works-estimation-creation/departmental-works-estimation-creation.component';
import { DepartmentalWorksEstimationApprovalComponent } from './pages/departmental-works-estimation-approval/departmental-works-estimation-approval.component';
import { RepairsMaintenanceEstimationCreationComponent } from './pages/repairs-maintenance-estimation-creation/repairs-maintenance-estimation-creation.component';
import { RepairsMaintenanceEstimationApprovalComponent } from './pages/repairs-maintenance-estimation-approval/repairs-maintenance-estimation-approval.component';
import { RevisedEstimationApprovalComponent } from './pages/revised-estimation-approval/revised-estimation-approval.component';
import { RevisedEstimationCreationComponent } from './pages/revised-estimation-creation/revised-estimation-creation.component';
import { RevisedEstimationCreationListComponent } from './pages/revised-estimation-creation-list/revised-estimation-creation-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RevisedEstimationApprovalListComponent } from './pages/revised-estimation-approval-list/revised-estimation-approval-list.component';
import { ImprovementSiteInspectionFormComponent } from './pages/improvement-site-inspection-form/improvement-site-inspection-form.component';
import { ImprovementEstimationApprovalComponent } from './pages/improvement-estimation-approval/improvement-estimation-approval.component';
import { ImprovementEstimationApprovalListComponent } from './pages/improvement-estimation-approval-list/improvement-estimation-approval-list.component';
import { ImprovementEstimationCreationComponent } from './pages/improvement-estimation-creation/improvement-estimation-creation.component';
import { ImprovementEstimationCreationListComponent } from './pages/improvement-estimation-creation-list/improvement-estimation-creation-list.component';
import { ImprovementEstimationReportComponent } from './pages/improvement-estimation-report/improvement-estimation-report.component';
import { EmergencyEstimationCreationComponent } from './pages/emergency-estimation-creation/emergency-estimation-creation.component';
import { EmergencyEstimationApprovalListComponent } from './pages/emergency-estimation-approval-list/emergency-estimation-approval-list.component';
import { EmergencyEstimationApprovalComponent } from './pages/emergency-estimation-approval/emergency-estimation-approval.component';
import { RevisedEstimationReportComponent } from './pages/revised-estimation-report/revised-estimation-report.component';
import { EmergencyEstimationReportComponent } from './pages/emergency-estimation-report/emergency-estimation-report.component';
import { EstimatesDashboardComponent } from './components/estimates-dashboard/estimates-dashboard.component';
import { BmrEstimationCreationComponent } from './pages/bmr-estimation-creation/bmr-estimation-creation.component';
import { BmrEstimationApprovalComponent } from './pages/bmr-estimation-approval/bmr-estimation-approval.component';
import { BmrEstimationApprovalListComponent } from './pages/bmr-estimation-approval-list/bmr-estimation-approval-list.component';
import { MaintenancePendingWorksReportComponent } from './pages/maintenance-pending-works-report/maintenance-pending-works-report.component';
import { MaintenanceFinishedWorksReportComponent } from './pages/maintenance-finished-works-report/maintenance-finished-works-report.component';
import { MaintenanceRejectedWorksComponent } from './pages/maintenance-rejected-works/maintenance-rejected-works.component';
import { InspectionMaintenanceListComponent } from './pages/inspection-maintenance-list/inspection-maintenance-list.component';
import { PreventiveMaintenanceListComponent } from './pages/preventive-maintenance-list/preventive-maintenance-list.component';
import { OverhualMaintenanceListComponent } from './pages/overhual-maintenance-list/overhual-maintenance-list.component';
import { MaintenanceDetailsComponent } from './pages/maintenance-details/maintenance-details.component';
import { PvtMaintenanceDetailsComponent } from './pages/pvt-maintenance-details/pvt-maintenance-details.component';
import { OverhualMaintenanceDetailsComponent } from './pages/overhual-maintenance-details/overhual-maintenance-details.component';
import { QmomEstimationComponent } from './pages/qmom-estimation/qmom-estimation.component';
import { QmomEstimationApprovalComponent } from './pages/qmom-estimation-approval/qmom-estimation-approval.component';
import { QmmtEstimationComponent } from './pages/qmmt-estimation/qmmt-estimation.component';
import { QmmtEstimationApprovalComponent } from './pages/qmmt-estimation-approval/qmmt-estimation-approval.component';
import { QmomListComponent } from './pages/qmom-list/qmom-list.component';
import { QmmtListComponent } from './pages/qmmt-list/qmmt-list.component';
@NgModule({
  declarations: [
    EstimatesComponent,
    EstimatesDashboardComponent,
    EstimatesSidenavComponent,
    OtherServiceRequestsEstimationCreationComponent,
    OtherServiceRequestsEstimationApprovalComponent,
    DismantlementWorksEstimationCreationComponent,
    DismantlementWorksEstimationApprovalComponent,
    MeterReplacementsEstimationCreationComponent,
    MeterReplacementsEstimationApprovalComponent,
    DepartmentalWorksEstimationCreationComponent,
    DepartmentalWorksEstimationApprovalComponent,
    RepairsMaintenanceEstimationCreationComponent,
    RepairsMaintenanceEstimationApprovalComponent,
    RevisedEstimationApprovalComponent,
    RevisedEstimationApprovalListComponent,
    RevisedEstimationCreationComponent,
    RevisedEstimationCreationListComponent,
    RevisedEstimationReportComponent,
    ImprovementSiteInspectionFormComponent,
    ImprovementEstimationApprovalComponent,
    ImprovementEstimationApprovalListComponent,
    ImprovementEstimationCreationComponent,
    ImprovementEstimationCreationListComponent,
    ImprovementEstimationReportComponent,
    EmergencyEstimationCreationComponent,
    EmergencyEstimationApprovalListComponent,
    EmergencyEstimationApprovalComponent,
    EmergencyEstimationReportComponent,
    BmrEstimationApprovalComponent,
    BmrEstimationApprovalListComponent,
    BmrEstimationCreationComponent,
    MaintenancePendingWorksReportComponent,
    MaintenanceFinishedWorksReportComponent,
    MaintenanceRejectedWorksComponent,
    InspectionMaintenanceListComponent,
    PreventiveMaintenanceListComponent,
    OverhualMaintenanceListComponent,
    MaintenanceDetailsComponent,
    PvtMaintenanceDetailsComponent,
    OverhualMaintenanceDetailsComponent,
    QmomEstimationComponent,
    QmomEstimationApprovalComponent,
    QmmtEstimationComponent,
    QmmtEstimationApprovalComponent,
    QmomListComponent,
    QmmtListComponent,
  ],
  imports: [
    CommonModule,
    EstimatesRoutingModule,
    SharedModule,
    MatAutocompleteModule,
  ],
})
export class EstimatesModule {}
