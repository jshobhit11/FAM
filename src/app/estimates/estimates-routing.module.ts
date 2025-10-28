import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentalWorksEstimationCreationComponent } from './pages/departmental-works-estimation-creation/departmental-works-estimation-creation.component';
import { DepartmentalWorksEstimationApprovalComponent } from './pages/departmental-works-estimation-approval/departmental-works-estimation-approval.component';
// import { DismantlementWorksEstimationCreationComponent } from './pages/dismantlement-works-estimation-creation/dismantlement-works-estimation-creation.component';
// import { MeterReplacementsEstimationCreationComponent } from './pages/meter-replacements-estimation-creation/meter-replacements-estimation-creation.component';
import { DismantlementWorksEstimationApprovalComponent } from './pages/dismantlement-works-estimation-approval/dismantlement-works-estimation-approval.component';
import { MeterReplacementsEstimationApprovalComponent } from './pages/meter-replacements-estimation-approval/meter-replacements-estimation-approval.component';
import { OtherServiceRequestsEstimationCreationComponent } from './pages/other-service-requests-estimation-creation/other-service-requests-estimation-creation.component';
import { OtherServiceRequestsEstimationApprovalComponent } from './pages/other-service-requests-estimation-approval/other-service-requests-estimation-approval.component';
import { RepairsMaintenanceEstimationCreationComponent } from './pages/repairs-maintenance-estimation-creation/repairs-maintenance-estimation-creation.component';
import { RepairsMaintenanceEstimationApprovalComponent } from './pages/repairs-maintenance-estimation-approval/repairs-maintenance-estimation-approval.component';
import { ImprovementSiteInspectionFormComponent } from './pages/improvement-site-inspection-form/improvement-site-inspection-form.component';
import { RevisedEstimationApprovalComponent } from './pages/revised-estimation-approval/revised-estimation-approval.component';
import { RevisedEstimationCreationComponent } from './pages/revised-estimation-creation/revised-estimation-creation.component';
import { RevisedEstimationCreationListComponent } from './pages/revised-estimation-creation-list/revised-estimation-creation-list.component';
import { RevisedEstimationApprovalListComponent } from './pages/revised-estimation-approval-list/revised-estimation-approval-list.component';
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
import { BmrEstimationApprovalListComponent } from './pages/bmr-estimation-approval-list/bmr-estimation-approval-list.component';
import { BmrEstimationApprovalComponent } from './pages/bmr-estimation-approval/bmr-estimation-approval.component';
import { MaintenancePendingWorksReportComponent } from './pages/maintenance-pending-works-report/maintenance-pending-works-report.component';
import { MaintenanceFinishedWorksReportComponent } from './pages/maintenance-finished-works-report/maintenance-finished-works-report.component';
import { MaintenanceRejectedWorksComponent } from './pages/maintenance-rejected-works/maintenance-rejected-works.component';
import { InspectionMaintenanceListComponent } from './pages/inspection-maintenance-list/inspection-maintenance-list.component';
import { PreventiveMaintenanceListComponent } from './pages/preventive-maintenance-list/preventive-maintenance-list.component';
import { OverhualMaintenanceListComponent } from './pages/overhual-maintenance-list/overhual-maintenance-list.component';
import { MaintenanceDetailsComponent } from './pages/maintenance-details/maintenance-details.component';
import { PvtMaintenanceDetailsComponent } from './pages/pvt-maintenance-details/pvt-maintenance-details.component';
import { OverhualMaintenanceDetailsComponent } from './pages/overhual-maintenance-details/overhual-maintenance-details.component';
import { RoleBasedGuard } from '../guards/role-based.guard';
import { QmomEstimationComponent } from './pages/qmom-estimation/qmom-estimation.component';
import { QmomEstimationApprovalComponent } from './pages/qmom-estimation-approval/qmom-estimation-approval.component';
import { QmmtEstimationComponent } from './pages/qmmt-estimation/qmmt-estimation.component';
import { QmmtEstimationApprovalComponent } from './pages/qmmt-estimation-approval/qmmt-estimation-approval.component';
import { QmomListComponent } from './pages/qmom-list/qmom-list.component';
import { QmmtListComponent } from './pages/qmmt-list/qmmt-list.component';
const routes: Routes = [
  {
    path: 'dashboard',
    component: EstimatesDashboardComponent,
  },
  {
    path: 'customer-service-estimation-creation',
    component: OtherServiceRequestsEstimationCreationComponent,
  },
  {
    path: 'customer-service-estimation-creation/:accountId',
    component: OtherServiceRequestsEstimationCreationComponent,
  },
  {
    path: 'other-service-requests-estimation-approval',
    component: OtherServiceRequestsEstimationApprovalComponent,
  },
  {
    path: 'departmental-works-estimation-creation',
    component: DepartmentalWorksEstimationCreationComponent,
  },
  {
    path: 'departmental-works-estimation-creation/:accountId',
    component: DepartmentalWorksEstimationCreationComponent,
  },
  {
    path: 'departmental-works-estimation-approval',
    component: DepartmentalWorksEstimationApprovalComponent,
  },
  {
    path: 'dismantlement-works-estimation-approval',
    component: DismantlementWorksEstimationApprovalComponent,
  },
  {
    path: 'meter-replacements-estimation-creation',
    component: OtherServiceRequestsEstimationCreationComponent,
  },
  {
    path: 'meter-replacements-estimation-creation/:accountId',
    component: OtherServiceRequestsEstimationCreationComponent,
  },
  {
    path: 'meter-replacements-estimation-approval',
    component: MeterReplacementsEstimationApprovalComponent,
  },
  {
    path: 'repair-maintenance-estimation-creation',
    component: RepairsMaintenanceEstimationCreationComponent,
  },
  {
    path: 'repair-maintenance-estimation-approval',
    component: RepairsMaintenanceEstimationApprovalComponent,
  },
  {
    path: 'improvement-site-inspection-form',
    component: ImprovementSiteInspectionFormComponent,
    canActivate: [RoleBasedGuard],
  },
  {
    path: 'improvement-estimation-approval/:estimationRegisteredId/:serviceRegistrationId',
    component: ImprovementEstimationApprovalComponent,
  },
  {
    path: 'improvement-estimation-report/:estimationRegisteredId/:serviceRegistrationId',
    component: ImprovementEstimationReportComponent,
  },
  {
    path: 'improvement-estimation-approval-list',
    component: ImprovementEstimationApprovalListComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'improvement-estimation/:statusCode/:serviceRegistrationsId',
    component: ImprovementEstimationCreationComponent,
  },
  {
    path: 'improvement-estimation-list',
    component: ImprovementEstimationCreationListComponent, 
    canActivate: [RoleBasedGuard],
  },
  {
    path: 'revised-estimation-approval/:estimationRegisteredId/:serviceRegistrationId',
    component: RevisedEstimationApprovalComponent,
  },
  {
    path: 'revised-estimation-approval-list',
    component: RevisedEstimationApprovalListComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'revised-estimation/:estimationRegisteredId/:serviceRegistrationId',
    component: RevisedEstimationCreationComponent,
  },
  {
    path: 'revised-estimation/:estimationRegisteredId/:serviceRegistrationId/:edit',
    component: RevisedEstimationCreationComponent,
  },
  {
    path: 'revised-estimation-list',
    component: RevisedEstimationCreationListComponent,
    canActivate: [RoleBasedGuard],
  },
  {
    path: 'emergency-estimation',
    component: EmergencyEstimationCreationComponent,
    canActivate: [RoleBasedGuard],
  },
  {
    path: 'bmr-estimation-creation',
    component: BmrEstimationCreationComponent,
  },
  {
    path: 'bmr-estimation-creation/:statusCode/:serviceRegistrationsId',
    component: BmrEstimationCreationComponent,
  },
  {
    path: 'emergency-estimation-approval-list',
    component: EmergencyEstimationApprovalListComponent,
   // canActivate:[RoleBasedGuard]
  },
  {
    path: 'emergency-estimation-approval/:estimationRegisteredId/:serviceRegistrationId',
    component: EmergencyEstimationApprovalComponent,
  },
  {
    path: 'bmr-estimation-approval-list',
    component: BmrEstimationApprovalListComponent,
   canActivate:[RoleBasedGuard]
  },
  {
    path: 'bmr-estimation-approval/:estimationRegisteredId/:serviceRegistrationId',
    component: BmrEstimationApprovalComponent,
  },
  {
    path: 'emergency-estimation-report/:estimationRegisteredId/:serviceRegistrationId',
    component: EmergencyEstimationReportComponent,
  },
  {
    path: 'revised-estimation-report/:estimationId/:registrationId',
    component: RevisedEstimationReportComponent,
  },

  {
    path: 'maintenance-pending-works-report',
    component: MaintenancePendingWorksReportComponent,
  },
  {
    path: 'maintenance-finished-works-report',
    component: MaintenanceFinishedWorksReportComponent,
  },
  {
    path: 'maintenance-rejected-works-report',
    component: MaintenanceRejectedWorksComponent,
  },
  {
    path: 'inspection-maintenance-list',
    component: InspectionMaintenanceListComponent,
    canActivate: [RoleBasedGuard],
  },
  {
    path: 'Preventive-maintenance-list',
    component: PreventiveMaintenanceListComponent,
    canActivate: [RoleBasedGuard],
  },
  {
    path: 'overhual-maintenance-list',
    component: OverhualMaintenanceListComponent,
    canActivate: [RoleBasedGuard],
  },
  {
    path: 'inspection-maintenance-details',
    component: MaintenanceDetailsComponent,
  },
  {
    path: 'inspection-maintenance-list-details',
    component: ImprovementEstimationCreationComponent,
  },
  {
    path: 'preventive-maintenance-details',
    component: PvtMaintenanceDetailsComponent,
  },
  {
    path: 'overhual-maintenance-details',
    component: OverhualMaintenanceDetailsComponent,
  },

  {
    path: 'qmom-estimation',
    component:QmomEstimationComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'qmom-estimation/:statusCode/:serviceRegistrationsId',
    component: QmomEstimationComponent,
  },
  {
    path: 'qmom-estimation-approval-list',
    component: QmomListComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'qmom-estimation-approval/:estimationRegisteredId/:serviceRegistrationId',
    component:QmomEstimationApprovalComponent,
  },
  {
    path: 'qmmt-estimation',
    component:QmmtEstimationComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'qmmt-estimation/:statusCode/:serviceRegistrationsId',
    component: QmmtEstimationComponent,
  },
  {
    path: 'qmmt-estimation-approval-list',
    component: QmmtListComponent,
    canActivate:[RoleBasedGuard]
  },
  {
    path: 'qmmt-estimation-approval/:estimationRegisteredId/:serviceRegistrationId',
    component:QmmtEstimationApprovalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstimatesRoutingModule {}
