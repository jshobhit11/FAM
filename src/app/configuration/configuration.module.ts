import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from '../shared/shared.module';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationSidenavComponent } from './components/configuration-sidenav/configuration-sidenav.component';
import { AddLabourMasterItemComponent } from './pages/labour-master/add-labour-master-item/add-labour-master-item.component';
import { LabourMasterComponent } from './pages/labour-master/labour-master.component';
import { UpdateLabourMasterItemComponent } from './pages/labour-master/update-labour-master-item/update-labour-master-item.component';
import { AddMaterialLabourMappingComponent } from './pages/material-labour-mapping/add-material-labour-mapping/add-material-labour-mapping.component';
import { MaterialLabourMappingComponent } from './pages/material-labour-mapping/material-labour-mapping.component';
import { UpdateMaterialLabourMappingComponent } from './pages/material-labour-mapping/update-material-labour-mapping/update-material-labour-mapping.component';
import { AddMaterialMasterItemComponent } from './pages/material-master/add-material-master-item/add-material-master-item.component';
import { MaterialMasterComponent } from './pages/material-master/material-master.component';
import { UpdateMaterialMasterItemComponent } from './pages/material-master/update-material-master-item/update-material-master-item.component';
import { AddMeterTypeComponent } from './pages/material-type-data/add-meter-type/add-meter-type.component';
import { MaterialTypeDataComponent } from './pages/material-type-data/material-type-data.component';
import { UpdateMeterTypeComponent } from './pages/material-type-data/update-meter-type/update-meter-type.component';
import { AddMaterialUnitComponent } from './pages/material-unit-master/add-material-unit/add-material-unit.component';
import { MaterialUnitMasterComponent } from './pages/material-unit-master/material-unit-master.component';
import { UpdateMaterialUnitComponent } from './pages/material-unit-master/update-material-unit/update-material-unit.component';
import { MaterialAdditionalChargesComponent } from './pages/material-additional-charges/material-additional-charges.component';
import { AddMaterialAdditionalChargesComponent } from './pages/material-additional-charges/add-material-additional-charges/add-material-additional-charges.component';
import { UpdateMaterialAdditionalChargesComponent } from './pages/material-additional-charges/update-material-additional-charges/update-material-additional-charges.component';
import { ConstituencyMasterComponent } from './pages/constituency-master/constituency-master.component';
import { AddConstituenctMasterComponent } from './pages/constituency-master/add-constituenct-master/add-constituenct-master.component';
import { UpdateConstituenctMasterComponent } from './pages/constituency-master/update-constituenct-master/update-constituenct-master.component';
import { DeviationTypeMasterComponent } from './pages/deviation-type-master/deviation-type-master.component';
import { AddDeviationTypeMasterComponent } from './pages/deviation-type-master/add-deviation-type-master/add-deviation-type-master.component';
import { UpdateDeviationTypeMasterComponent } from './pages/deviation-type-master/update-deviation-type-master/update-deviation-type-master.component';
import { EstimateTypeMasterComponent } from './pages/estimate-type-master/estimate-type-master.component';
import { EstimateTemplateMasterComponent } from './pages/estimate-template-master/estimate-template-master.component';
import { AddEstimateTemplateMasterComponent } from './pages/estimate-template-master/add-estimate-template-master/add-estimate-template-master.component';
import { AddEstimateTypeMasterComponent } from './pages/estimate-type-master/add-estimate-type-master/add-estimate-type-master.component';
import { UpdateEstimateTypeMasterComponent } from './pages/estimate-type-master/update-estimate-type-master/update-estimate-type-master.component';
import { NetworkExtensionTypeMasterComponent } from './pages/network-extension-type-master/network-extension-type-master.component';
import { AddNetworkExtensionTypeMasterComponent } from './pages/network-extension-type-master/add-network-extension-type-master/add-network-extension-type-master.component';
import { UpdateNetworkExtensionTypeMasterComponent } from './pages/network-extension-type-master/update-network-extension-type-master/update-network-extension-type-master.component';
import { WorkCategoryMasterComponent } from './pages/work-category-master/work-category-master.component';
import { AddWorkCategoryMasterComponent } from './pages/work-category-master/add-work-category-master/add-work-category-master.component';
import { UpdateWorkCategoryMasterComponent } from './pages/work-category-master/update-work-category-master/update-work-category-master.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { AddVendorComponent } from './pages/vendor/add-vendor/add-vendor.component';
import { UpdateVendorComponent } from './pages/vendor/update-vendor/update-vendor.component';
import { AssetCategoryMasterComponent } from './pages/asset-category-master/asset-category-master.component';
import { AddAssetCategoryMasterComponent } from './pages/asset-category-master/add-asset-category-master/add-asset-category-master.component';
import { UpdateAssetCategoryMasterComponent } from './pages/asset-category-master/update-asset-category-master/update-asset-category-master.component';
import { WorkExecutionMethodMasterComponent } from './pages/work-execution-method/work-execution-method.component';
import { AddWorkExecutionMethodMasterComponent } from './pages/work-execution-method/add-work-execution-method/add-work-execution-method.component';
import { UpdateWorkExecutionMethodMasterComponent } from './pages/work-execution-method/update-work-execution-method/update-work-execution-method.component';
import { AccountHeadMasterComponent } from './pages/account-head-master/account-head-master.component';
import { AddAccountHeadMasterComponent } from './pages/account-head-master/add-account-head-master/add-account-head-master.component';
import { UpdateAccountHeadMasterComponent } from './pages/account-head-master/update-account-head-master/update-account-head-master.component';
import { ApplicantTypeMasterComponent } from './pages/applicant-type-master/applicant-type-master.component';
import { AddApplicantTypeMasterComponent } from './pages/applicant-type-master/add-applicant-type-master/add-applicant-type-master.component';
import { UpdateApplicantTypeMasterComponent } from './pages/applicant-type-master/update-applicant-type-master/update-applicant-type-master.component';
import { ApplicationTypeMasterComponent } from './pages/application-type-master/application-type-master.component';
import { AddApplicationTypeMasterComponent } from './pages/application-type-master/add-application-type-master/add-application-type-master.component';
import { UpdateApplicationTypeMasterComponent } from './pages/application-type-master/update-application-type-master/update-application-type-master.component';
import { ApplicationStatusMasterComponent } from './pages/application-status-master/application-status-master.component';
import { AddApplicationStatusMasterComponent } from './pages/application-status-master/add-application-status-master/add-application-status-master.component';
import { UpdateApplicationStatusMasterComponent } from './pages/application-status-master/update-application-status-master/update-application-status-master.component';
import { ConnectionTypeMasterComponent } from './pages/connection-type-master/connection-type-master.component';
import { AddConnectionTypeMasterComponent } from './pages/connection-type-master/add-connection-type-master/add-connection-type-master.component';
import { UpdateConnectionTypeMasterComponent } from './pages/connection-type-master/update-connection-type-master/update-connection-type-master.component';
import { ConnectionNatureMasterComponent } from './pages/connection-nature-master/connection-nature-master.component';
import { AddConnectionNatureMasterComponent } from './pages/connection-nature-master/add-connection-nature-master/add-connection-nature-master.component';
import { UpdateConnectionNatureMasterComponent } from './pages/connection-nature-master/update-connection-nature-master/update-connection-nature-master.component';
import { WorkscopeDescriptionMasterComponent } from './pages/workscope-description-master/workscope-description-master.component';
import { AddWorkscopeDescriptionMasterComponent } from './pages/workscope-description-master/add-workscope-description-master/add-workscope-description-master.component';
import { UpdateWorkscopeDescriptionMasterComponent } from './pages/workscope-description-master/update-workscope-description-master/update-workscope-description-master.component';
import { WorkOrderSeriesMasterComponent } from './pages/work-order-series-master/work-order-series-master.component';
import { AddWorkOrderSeriesMasterComponent } from './pages/work-order-series-master/add-work-order-series-master/add-work-order-series-master.component';
import { UpdateWorkOrderSeriesMasterComponent } from './pages/work-order-series-master/update-work-order-series-master/update-work-order-series-master.component';
import { EmployeeMasterComponent } from './pages/employee-master/employee-master.component';
import { AddEmployeeMasterComponent } from './pages/employee-master/add-employee-master/add-employee-master.component';
import { UpdateEmployeeMasterComponent } from './pages/employee-master/update-employee-master/update-employee-master.component';
import { AccountHeadMainMasterComponent } from './pages/account-head-main-master/account-head-main-master.component';
import { AddAccountHeadMainMasterComponent } from './pages/account-head-main-master/add-account-head-main-master/add-account-head-main-master.component';
import { UpdateAccountHeadMainMasterComponent } from './pages/account-head-main-master/update-account-head-main-master/update-account-head-main-master.component';
import { AccountHeadSubmainMasterComponent } from './pages/account-head-submain-master/account-head-submain-master.component';
import { AddAccountHeadSubmainMasterComponent } from './pages/account-head-submain-master/add-account-head-submain-master/add-account-head-submain-master.component';
import { UpdateAccountHeadSubmainMasterComponent } from './pages/account-head-submain-master/update-account-head-submain-master/update-account-head-submain-master.component';
import { AssetCategoryMaterialMappingComponent } from './pages/asset-category-material-mapping/asset-category-material-mapping.component';
import { AddAssetCategoryMaterialMappingComponent } from './pages/asset-category-material-mapping/add-asset-category-material-mapping/add-asset-category-material-mapping.component';
import { UpdateAssetCategoryMaterialMappingComponent } from './pages/asset-category-material-mapping/update-asset-category-material-mapping/update-asset-category-material-mapping.component';
import { StoreMasterComponent } from './pages/store-master/store-master.component';
import { AddStoreMasterComponent } from './pages/store-master/add-store-master/add-store-master.component';
import { UpdateStoreMasterComponent } from './pages/store-master/update-store-master/update-store-master.component';
import { SpecialLocalityAllowanceMasterComponent } from './pages/special-locality-allowance-master/special-locality-allowance-master.component';
import { AddSpecialLocalityAllowanceMasterComponent } from './pages/special-locality-allowance-master/add-special-locality-allowance-master/add-special-locality-allowance-master.component';
import { UpdateSpecialLocalityAllowanceMasterComponent } from './pages/special-locality-allowance-master/update-special-locality-allowance-master/update-special-locality-allowance-master.component';
import { RateContractMasterComponent } from './pages/rate-contract-master/rate-contract-master.component';
import { AddRateContractMasterComponent } from './pages/rate-contract-master/add-rate-contract-master/add-rate-contract-master.component';
import { UpdateRateContractMasterComponent } from './pages/rate-contract-master/update-rate-contract-master/update-rate-contract-master.component';
import { DesignationMasterComponent } from './pages/designation-master/designation-master.component';
import { AddDesignationMasterComponent } from './pages/designation-master/add-designation-master/add-designation-master.component';
import { UpdateDesignationMasterComponent } from './pages/designation-master/update-designation-master/update-designation-master.component';
import { RcRateComponent } from './pages/rc-rate-master/rc-rate/rc-rate.component';
import { AddRcRateComponent } from './pages/rc-rate-master/add-rc-rate/add-rc-rate.component';
import { UpdateRcRateComponent } from './pages/rc-rate-master/update-rc-rate/update-rc-rate.component';
import { DelegationPowerMasterComponent } from './pages/delegation-power-master/delegation-power-master.component';
import { AddDelegationPowerMasterComponent } from './pages/delegation-power-master/add-delegation-power-master/add-delegation-power-master.component';
import { UpdateDelegationPowerMasterComponent } from './pages/delegation-power-master/update-delegation-power-master/update-delegation-power-master.component';
import { ProcessTypeMasterComponent } from './pages/process-type-master/process-type-master.component';
import { AddProcessTypeMasterComponent } from './pages/process-type-master/add-process-type-master/add-process-type-master.component';
import { UpdateProcessTypeMasterComponent } from './pages/process-type-master/update-process-type-master/update-process-type-master.component';
import { ApplicationStatusProcessMappingComponent } from './pages/application-status-process-mapping/application-status-process-mapping.component';
import { AddApplicationStatusProcessMappingComponent } from './pages/application-status-process-mapping/add-application-status-process-mapping/add-application-status-process-mapping.component';
import { UpdateApplicationStatusProcessMappingComponent } from './pages/application-status-process-mapping/update-application-status-process-mapping/update-application-status-process-mapping.component';
import { FinancialYearMasterComponent } from './pages/financial-year-master/financial-year-master.component';
import { AddFinancialYearMasterComponent } from './pages/financial-year-master/add-financial-year-master/add-financial-year-master.component';
import { UpdateFinancialYearMasterComponent } from './pages/financial-year-master/update-financial-year-master/update-financial-year-master.component';
import { StoreAdjReasonMasterComponent } from './pages/store-adj-reason-master/store-adj-reason-master.component';
import { AddStoreAdjReasonMasterComponent } from './pages/store-adj-reason-master/add-store-adj-reason-master/add-store-adj-reason-master.component';
import { UpdateStoreAdjReasonMasterComponent } from './pages/store-adj-reason-master/update-store-adj-reason-master/update-store-adj-reason-master.component';
import { MaintenanceSchedulerComponent } from './pages/maintenance-scheduler/maintenance-scheduler.component';
import { AddMaintenanceComponent } from './pages/maintenance-scheduler/add-maintenance/add-maintenance.component';
import { UpdateMaintenanceComponent } from './pages/maintenance-scheduler/update-maintenance/update-maintenance.component';
import { MaintenanceAssetTypeMasterComponent } from './pages/maintenance-asset-type-master/maintenance-asset-type-master.component';
import { AddMaintenanceAssetTypeComponent } from './pages/maintenance-asset-type-master/add-maintenance-asset-type/add-maintenance-asset-type.component';
import { UpdateMaintenanceAssetTypeComponent } from './pages/maintenance-asset-type-master/update-maintenance-asset-type/update-maintenance-asset-type.component';
import { MaintenanceFrequencyComponent } from './pages/maintenance-frequency/maintenance-frequency.component';
import { AddMaintenanceFrequencyComponent } from './pages/maintenance-frequency/add-maintenance-frequency/add-maintenance-frequency.component';
import { UpdateMaintenanceFrequencyComponent } from './pages/maintenance-frequency/update-maintenance-frequency/update-maintenance-frequency.component';
import { AreaSpecificLoadingMasterComponent } from './pages/area-specific-loading-master/area-specific-loading-master.component';
import { AddAreaSpecificLoadingComponent } from './pages/area-specific-loading-master/add-area-specific-loading/add-area-specific-loading.component';
import { UpdateAreaSpecificLoadingComponent } from './pages/area-specific-loading-master/update-area-specific-loading/update-area-specific-loading.component';
import { AddAdditionalChargesMasterComponent } from './pages/additional-charges-master/add-additional-charges-master/add-additional-charges-master.component';
import { AdditionalChargesMasterComponent } from './pages/additional-charges-master/additional-charges-master.component';
import { UpdateAdditionalChargesMasterComponent } from './pages/additional-charges-master/update-additional-charges-master/update-additional-charges-master.component';
import { MeterTypeMasterComponent } from './pages/meter-type-master/meter-type-master.component';
import { AddMeterTypeMasterComponent } from './pages/meter-type-master/add-meter-type-master/add-meter-type-master.component';
import { UpdateMeterTypeMasterComponent } from './pages/meter-type-master/update-meter-type-master/update-meter-type-master.component';
import { RoleResourceMappingMasterComponent } from './pages/role-resource-mapping-master/role-resource-mapping-master.component';
import { AddRoleResourceMappingMasterComponent } from './pages/role-resource-mapping-master/add-role-resource-mapping-master/add-role-resource-mapping-master.component';
import { UpdateRoleResourceMappingMasterComponent } from './pages/role-resource-mapping-master/update-role-resource-mapping-master/update-role-resource-mapping-master.component';
import { UpdateEstimateTemplateMasterComponent } from './pages/estimate-template-master/update-estimate-template-master/update-estimate-template-master.component';
import { ConfigDivisionalBudgetHeadComponent } from './pages/config-budget-master/config-divisional-budget-head/config-divisional-budget-head.component';
import { ConfigBudgetEntryComponent } from './pages/config-budget-master/config-budget-entry/config-budget-entry.component';
import { ConfigBudgetApprovalComponent } from './pages/config-budget-master/config-budget-approval/config-budget-approval.component';
import { ConfigBudgetApprovalDetailsComponent } from './pages/config-budget-master/config-budget-approval-details/config-budget-approval-details.component';

@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigurationSidenavComponent,
    MaterialTypeDataComponent,
    UpdateMeterTypeComponent,
    AddMeterTypeComponent,
    MaterialUnitMasterComponent,
    AddMaterialUnitComponent,
    UpdateMaterialUnitComponent,
    MaterialMasterComponent,
    AddMaterialMasterItemComponent,
    UpdateMaterialMasterItemComponent,
    LabourMasterComponent,
    AddLabourMasterItemComponent,
    UpdateLabourMasterItemComponent,
    MaterialLabourMappingComponent,
    AddMaterialLabourMappingComponent,
    UpdateMaterialLabourMappingComponent,
    MaterialAdditionalChargesComponent,
    AddMaterialAdditionalChargesComponent,
    UpdateMaterialAdditionalChargesComponent,
    ConstituencyMasterComponent,
    AddConstituenctMasterComponent,
    UpdateConstituenctMasterComponent,
    DeviationTypeMasterComponent,
    AddDeviationTypeMasterComponent,
    UpdateDeviationTypeMasterComponent,
    EstimateTypeMasterComponent,
    AddEstimateTypeMasterComponent,
    UpdateEstimateTypeMasterComponent,
    EstimateTemplateMasterComponent,
    AddEstimateTemplateMasterComponent,
    NetworkExtensionTypeMasterComponent,
    AddNetworkExtensionTypeMasterComponent,
    UpdateNetworkExtensionTypeMasterComponent,
    WorkCategoryMasterComponent,
    AddWorkCategoryMasterComponent,
    UpdateWorkCategoryMasterComponent,
    VendorComponent,
    AddVendorComponent,
    UpdateVendorComponent,
    AssetCategoryMasterComponent,
    AddAssetCategoryMasterComponent,
    UpdateAssetCategoryMasterComponent,
    WorkExecutionMethodMasterComponent,
    AddWorkExecutionMethodMasterComponent,
    UpdateWorkExecutionMethodMasterComponent,
    AccountHeadMasterComponent,
    AddAccountHeadMasterComponent,
    UpdateAccountHeadMasterComponent,
    ApplicantTypeMasterComponent,
    AddApplicantTypeMasterComponent,
    UpdateApplicantTypeMasterComponent,
    ApplicationTypeMasterComponent,
    AddApplicationTypeMasterComponent,
    UpdateApplicationTypeMasterComponent,
    ApplicationStatusMasterComponent,
    AddApplicationStatusMasterComponent,
    UpdateApplicationStatusMasterComponent,
    ConnectionTypeMasterComponent,
    AddConnectionTypeMasterComponent,
    UpdateConnectionTypeMasterComponent,
    ConnectionNatureMasterComponent,
    AddConnectionNatureMasterComponent,
    UpdateConnectionNatureMasterComponent,
    WorkscopeDescriptionMasterComponent,
    AddWorkscopeDescriptionMasterComponent,
    UpdateWorkscopeDescriptionMasterComponent,
    WorkOrderSeriesMasterComponent,
    AddWorkOrderSeriesMasterComponent,
    UpdateWorkOrderSeriesMasterComponent,
    EmployeeMasterComponent,
    AddEmployeeMasterComponent,
    UpdateEmployeeMasterComponent,
    AccountHeadMainMasterComponent,
    AddAccountHeadMainMasterComponent,
    UpdateAccountHeadMainMasterComponent,
    AccountHeadSubmainMasterComponent,
    AddAccountHeadSubmainMasterComponent,
    UpdateAccountHeadSubmainMasterComponent,
    AssetCategoryMaterialMappingComponent,
    AddAssetCategoryMaterialMappingComponent,
    UpdateAssetCategoryMaterialMappingComponent,
    StoreMasterComponent,
    AddStoreMasterComponent,
    UpdateStoreMasterComponent,
    SpecialLocalityAllowanceMasterComponent,
    AddSpecialLocalityAllowanceMasterComponent,
    UpdateSpecialLocalityAllowanceMasterComponent,
    RateContractMasterComponent,
    AddRateContractMasterComponent,
    UpdateRateContractMasterComponent,
    DesignationMasterComponent,
    AddDesignationMasterComponent,
    UpdateDesignationMasterComponent,
    RcRateComponent,
    AddRcRateComponent,
    UpdateRcRateComponent,
    DelegationPowerMasterComponent,
    AddDelegationPowerMasterComponent,
    UpdateDelegationPowerMasterComponent,
    ProcessTypeMasterComponent,
    AddProcessTypeMasterComponent,
    UpdateProcessTypeMasterComponent,
    ApplicationStatusProcessMappingComponent,
    AddApplicationStatusProcessMappingComponent,
    UpdateApplicationStatusProcessMappingComponent,
    FinancialYearMasterComponent,
    AddFinancialYearMasterComponent,
    UpdateFinancialYearMasterComponent,
    StoreAdjReasonMasterComponent,
    AddStoreAdjReasonMasterComponent,
    UpdateStoreAdjReasonMasterComponent,
    MaintenanceSchedulerComponent,
    AddMaintenanceComponent,
    UpdateMaintenanceComponent,
    MaintenanceAssetTypeMasterComponent,
    AddMaintenanceAssetTypeComponent,
    UpdateMaintenanceAssetTypeComponent,
    MaintenanceFrequencyComponent,
    AddMaintenanceFrequencyComponent,
    UpdateMaintenanceFrequencyComponent,
    AreaSpecificLoadingMasterComponent,
    AddAreaSpecificLoadingComponent,
    UpdateAreaSpecificLoadingComponent,
    AdditionalChargesMasterComponent,
    AddAdditionalChargesMasterComponent,
    UpdateAdditionalChargesMasterComponent,
    MeterTypeMasterComponent,
    AddMeterTypeMasterComponent,
    UpdateMeterTypeMasterComponent,
    RoleResourceMappingMasterComponent,
    AddRoleResourceMappingMasterComponent,
    UpdateRoleResourceMappingMasterComponent,
    UpdateEstimateTemplateMasterComponent,
    ConfigDivisionalBudgetHeadComponent,
    ConfigBudgetEntryComponent,
    ConfigBudgetApprovalComponent,
    ConfigBudgetApprovalDetailsComponent,

  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    SharedModule,
    MatAutocompleteModule,
  ],
})
export class ConfigurationModule {}
