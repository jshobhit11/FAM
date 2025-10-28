import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabourMasterComponent } from './pages/labour-master/labour-master.component';
import { MaterialLabourMappingComponent } from './pages/material-labour-mapping/material-labour-mapping.component';
import { MaterialMasterComponent } from './pages/material-master/material-master.component';
import { MaterialTypeDataComponent } from './pages/material-type-data/material-type-data.component';
import { MaterialUnitMasterComponent } from './pages/material-unit-master/material-unit-master.component';
import { MaterialAdditionalChargesComponent } from './pages/material-additional-charges/material-additional-charges.component';
import { ConstituencyMasterComponent } from './pages/constituency-master/constituency-master.component';
import { DeviationTypeMasterComponent } from './pages/deviation-type-master/deviation-type-master.component';
import { EstimateTypeMasterComponent } from './pages/estimate-type-master/estimate-type-master.component';
import { EstimateTemplateMasterComponent } from './pages/estimate-template-master/estimate-template-master.component';
import { NetworkExtensionTypeMasterComponent } from './pages/network-extension-type-master/network-extension-type-master.component';
import { AssetCategoryMasterComponent } from './pages/asset-category-master/asset-category-master.component';
import { WorkExecutionMethodMasterComponent } from './pages/work-execution-method/work-execution-method.component';
import { AccountHeadMasterComponent } from './pages/account-head-master/account-head-master.component';
import { ApplicantTypeMasterComponent } from './pages/applicant-type-master/applicant-type-master.component';
import { ApplicationTypeMasterComponent } from './pages/application-type-master/application-type-master.component';
import { ConnectionTypeMasterComponent } from './pages/connection-type-master/connection-type-master.component';
import { ConnectionNatureMasterComponent } from './pages/connection-nature-master/connection-nature-master.component';
import { ApplicationStatusMasterComponent } from './pages/application-status-master/application-status-master.component';
import { WorkscopeDescriptionMasterComponent } from './pages/workscope-description-master/workscope-description-master.component';
import { WorkOrderSeriesMasterComponent } from './pages/work-order-series-master/work-order-series-master.component';
import { WorkCategoryMasterComponent } from './pages/work-category-master/work-category-master.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { EmployeeMasterComponent } from './pages/employee-master/employee-master.component';
import { SpecialLocalityAllowanceMasterComponent } from './pages/special-locality-allowance-master/special-locality-allowance-master.component';
import { StoreMasterComponent } from './pages/store-master/store-master.component';
import { AccountHeadMainMasterComponent } from './pages/account-head-main-master/account-head-main-master.component';
import { AccountHeadSubmainMasterComponent } from './pages/account-head-submain-master/account-head-submain-master.component';
import { AssetCategoryMaterialMappingComponent } from './pages/asset-category-material-mapping/asset-category-material-mapping.component';
import { RateContractMasterComponent } from './pages/rate-contract-master/rate-contract-master.component';
import { DesignationMasterComponent } from './pages/designation-master/designation-master.component';
import { RcRateComponent } from './pages/rc-rate-master/rc-rate/rc-rate.component';
import { AddRcRateComponent } from './pages/rc-rate-master/add-rc-rate/add-rc-rate.component';
import { UpdateRcRateComponent } from './pages/rc-rate-master/update-rc-rate/update-rc-rate.component';
import { DelegationPowerMasterComponent } from './pages/delegation-power-master/delegation-power-master.component';
import { AddEstimateTemplateMasterComponent } from './pages/estimate-template-master/add-estimate-template-master/add-estimate-template-master.component';
import { ProcessTypeMasterComponent } from './pages/process-type-master/process-type-master.component';
import { ApplicationStatusProcessMappingComponent } from './pages/application-status-process-mapping/application-status-process-mapping.component';
import { FinancialYearMasterComponent } from './pages/financial-year-master/financial-year-master.component';
import { StoreAdjReasonMasterComponent } from './pages/store-adj-reason-master/store-adj-reason-master.component';
import { MaintenanceSchedulerComponent } from './pages/maintenance-scheduler/maintenance-scheduler.component';
import { MaintenanceAssetTypeMasterComponent } from './pages/maintenance-asset-type-master/maintenance-asset-type-master.component';
import { MaintenanceFrequencyComponent } from './pages/maintenance-frequency/maintenance-frequency.component';
import { AreaSpecificLoadingMasterComponent } from './pages/area-specific-loading-master/area-specific-loading-master.component';
import { AdditionalChargesMasterComponent } from './pages/additional-charges-master/additional-charges-master.component';
import { MeterTypeMasterComponent } from './pages/meter-type-master/meter-type-master.component';
import { RoleResourceMappingMasterComponent } from './pages/role-resource-mapping-master/role-resource-mapping-master.component';
import { UpdateEstimateTemplateMasterComponent } from './pages/estimate-template-master/update-estimate-template-master/update-estimate-template-master.component';
import { ConfigDivisionalBudgetHeadComponent } from './pages/config-budget-master/config-divisional-budget-head/config-divisional-budget-head.component';
import { ConfigBudgetEntryComponent } from './pages/config-budget-master/config-budget-entry/config-budget-entry.component';
import { ConfigBudgetApprovalComponent } from './pages/config-budget-master/config-budget-approval/config-budget-approval.component';
import { ConfigBudgetApprovalDetailsComponent } from './pages/config-budget-master/config-budget-approval-details/config-budget-approval-details.component';

const routes: Routes = [
  {
    path: 'material-type-master',
    component: MaterialTypeDataComponent,
  },
  {
    path: 'meter-type-master',
    component: MeterTypeMasterComponent,
  },
  {
    path: 'material-unit-master',
    component: MaterialUnitMasterComponent,
  },
  {
    path: 'material-master',
    component: MaterialMasterComponent,
  },
  {
    path: 'labour-master',
    component: LabourMasterComponent,
  },
  {
    path: 'material-labour-mapping',
    component: MaterialLabourMappingComponent,
  },
  {
    path: 'material-additional-charges',
    component: MaterialAdditionalChargesComponent,
  },
  {
    path: 'constituency-master',
    component: ConstituencyMasterComponent,
  },

  {
    path: 'deviation-type-master',
    component: DeviationTypeMasterComponent,
  },

  {
    path: 'estimate-type-master',
    component: EstimateTypeMasterComponent,
  },
  {
    path: 'estimate-template-master',
    component: EstimateTemplateMasterComponent,
  },

  {
    path: 'estimate-template-master/create',
    component: AddEstimateTemplateMasterComponent,
  },

 /* {
    path: 'estimate-template-master/create/:templateNumber',
    component: AddEstimateTemplateMasterComponent,
  },*/
  
  {
    path: 'estimate-template-master/update/:estimationTemplateMasterId',
    component: UpdateEstimateTemplateMasterComponent,
  },

  {
    path: 'network-extension-type-master',
    component: NetworkExtensionTypeMasterComponent,
  },
  {
    path: 'assest-category-master',
    component: AssetCategoryMasterComponent,
  },
  {
    path: 'work-execution-master',
    component: WorkExecutionMethodMasterComponent,
  },
  {
    path: 'account-head-master',
    component: AccountHeadMasterComponent,
  },
  {
    path: 'applicant-type-master',
    component: ApplicantTypeMasterComponent,
  },
  {
    path: 'application-type-master',
    component: ApplicationTypeMasterComponent,
  },

  {
    path: 'connection-type-master',
    component: ConnectionTypeMasterComponent,
  },
  {
    path: 'connection-nature-master',
    component: ConnectionNatureMasterComponent,
  },
  {
    path: 'application-status-master',
    component: ApplicationStatusMasterComponent,
  },
  {
    path: 'workscope-description-master',
    component: WorkscopeDescriptionMasterComponent,
  },
  {
    path: 'workorder-series-master',
    component: WorkOrderSeriesMasterComponent,
  },
  {
    path: 'work-category-master',
    component: WorkCategoryMasterComponent,
  },

  {
    path: 'work-vendor-master',
    component: VendorComponent,
  },
  {
    path: 'employee-master',
    component: EmployeeMasterComponent,
  },
  {
    path: 'account-head-main-master',
    component: AccountHeadMainMasterComponent,
  },
  {
    path: 'account-head-submain-master',
    component: AccountHeadSubmainMasterComponent,
  },
  {
    path: 'asset-category-material-mapping',
    component: AssetCategoryMaterialMappingComponent,
  },
  {
    path: 'special-locality-allowance-master',
    component: SpecialLocalityAllowanceMasterComponent,
  },
  {
    path: 'store-master',
    component: StoreMasterComponent,
  },
  {
    path: 'rate-contract-master',
    component: RateContractMasterComponent,
  },
  {
    path: 'rc-rate-master',
    component: RcRateComponent,
  },
  {
    path: 'add-rc-master',
    component: AddRcRateComponent,
  },
  {
    path: 'upadate-rc-master',
    component: UpdateRcRateComponent,
  },
  {
    path: 'designation-master',
    component: DesignationMasterComponent,
  },
  {
    path: 'delegation-power-master',
    component: DelegationPowerMasterComponent,
  },
  {
    path: 'process-type-master',
    component: ProcessTypeMasterComponent,
  },
  {
    path: 'application-status-process-mapping',
    component: ApplicationStatusProcessMappingComponent,
  },
  {
    path: 'financial-year-master',
    component: FinancialYearMasterComponent,
  },
  {
    path: 'store-adjust-reason-master',
    component: StoreAdjReasonMasterComponent,
  },
  {
    path: 'maintenance-scheduler',
    component: MaintenanceSchedulerComponent,
  },
  {
    path: 'maintenance-asset-type',
    component: MaintenanceAssetTypeMasterComponent,
  },
  {
    path: 'maintenance-frequency-type',
    component: MaintenanceFrequencyComponent,
  },
  {
    path: 'area-specific-loading',
    component: AreaSpecificLoadingMasterComponent,
  },
  {
    path:'role-resource-mapping',
    component:RoleResourceMappingMasterComponent,
  },
  {
    path:'additional-charges-master',
    component:AdditionalChargesMasterComponent
  },
  {
    path:'config-budget-head',
    component:ConfigDivisionalBudgetHeadComponent
  },
  {
    path:'config-budget-forms',
    component:ConfigBudgetEntryComponent
  },
  {
    path:'config-budget-approval',
    component:ConfigBudgetApprovalComponent
  },
  {
    path:'config-budget-approval-details',
    component:ConfigBudgetApprovalDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
