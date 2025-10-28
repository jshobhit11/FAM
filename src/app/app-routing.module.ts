import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { InspectionPrintFormComponent } from './dashboard-forms/pages/inspection-print-form/inspection-print-form.component';
import { AuthGuard } from './guards';
import { MainComponent } from './main/main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { EstimatesComponent } from './estimates/estimates.component';
import { WorkManagementComponent } from './work-management/work-management.component';
import { StoreManagementComponent } from './store-management/store-management.component';
import { OfficeHierarchyComponent } from './office-hierarchy/office-hierarchy.component';
import { DocumentUploadComponent } from './shared/components/document-upload/document-upload.component';
import { RoleBasedGuard } from './guards/role-based.guard';
// import { SSOLoginComponent } from './sso/sso.login.component';
import { SingleAccountMeterMappingComponent } from './meter-energization/single-account-meter-mapping/single-account-meter-mapping.component';
import { MultipleAccountMeterMappingComponent } from './meter-energization/multiple-account-meter-mapping/multiple-account-meter-mapping.component';
import { SingleAccountMeterReplacemantComponent } from './meter-energization/single-account-meter-replacemant/single-account-meter-replacemant.component';
import { MultipleAccountMeterReplacemantComponent } from './meter-energization/multiple-account-meter-replacemant/multiple-account-meter-replacemant.component';
import { FieldResolutionComponent } from './field-resolution/pages/field-resolution/field-resolution.component';
import { OtpComponent } from './otp/otp.component';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },

  // { path:'', component:SSOLoginComponent },
  { path: '', component: LoginComponent },

  {
    path: 'main',
    canActivate: [AuthGuard],
    component: MainComponent,
    loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
  },

  { path: 'otp', component: OtpComponent },

  {
    path: 'estimates',
    canActivate: [AuthGuard],
    component: EstimatesComponent,
    loadChildren: () =>
      import('./estimates/estimates.module').then((m) => m.EstimatesModule),
  },
  {
    path: 'configuration',
    canActivate: [AuthGuard, RoleBasedGuard],
    component: ConfigurationComponent,
    loadChildren: () =>
      import('./configuration/configuration.module').then(
        (m) => m.ConfigurationModule
      ),
  },
  {
    path: 'work-management',
    canActivate: [AuthGuard],
    component: WorkManagementComponent,
    loadChildren: () =>
      import('./work-management/work-management.module').then(
        (m) => m.WorkManagementModule
      ),
  },
  {
    path: 'store-management',
    canActivate: [AuthGuard],
    component: StoreManagementComponent,
    loadChildren: () =>
      import('./store-management/store-management.module').then(
        (m) => m.StoreManagementModule
      ),
  },
  {
    path: 'field-resolution',
    canActivate: [AuthGuard],
    component: FieldResolutionComponent,
    loadChildren: () =>
      import('./field-resolution/field-resolution.module').then(
        (m) => m.fieldResolutionModule
      ),
  },
  {
    path: 'print-inspection-form/:accountId',
    component: InspectionPrintFormComponent,
  },
  {
    path: 'office-hierarchy',
    component: OfficeHierarchyComponent,
  },
  {
    path: 'main',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      {
        path: 'document-upload',
        component: DocumentUploadComponent,
      },
    ],
  },
  { path: 'single-account-meter-mapping', component: SingleAccountMeterMappingComponent, },
  { path: 'multiple-account-meter-mapping', component: MultipleAccountMeterMappingComponent, },
  { path: 'single-account-meter-replacemant', component: SingleAccountMeterReplacemantComponent, },
  { path: 'multiple-account-meter-replacemant', component: MultipleAccountMeterReplacemantComponent, },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
