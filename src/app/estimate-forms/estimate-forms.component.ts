import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TemplatesPopupComponent } from './components/templates-popup/templates-popup.component';
import { ViewPopUpComponent } from './components/view-pop-up/view-pop-up.component';
import { EstimateService } from '../services/estimate.service';
import { DashboardService } from '../services/dashboard.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DocumentService } from '../shared/document.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimationRegisteredService } from '../services/estimationRegistered';
import { SaveTemplateConfirmComponent } from '../shared/components/save-template-confirm/save-template-confirm.component';
import { GeneratePopupComponent } from '../shared/components/generate-popup/generate-popup.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { WorkAwardService } from '../services/work-award.service';
import { ConfigurationService } from '../services/configuration.service';
import { ConfirmationPopupComponent } from '../shared/components/confirmation-popup/confirmation-popup.component';
import { get } from 'lodash';
import { MatSelect } from '@angular/material/select';
import { GatePassAcknowledgementService } from '../services/gate-pass-acknowledgement.service';
import { PopUpComponent } from '../lr-le-meter-power-approval/pop-up/pop-up.component';
import { LoaderService } from '../services/loader.service';
const estimateCharges = new FormGroup({
  typeOfWork: new FormControl('', []),
  workPart: new FormControl('', []),
  workDescription: new FormControl('', []),
  materialType: new FormControl('', []),
  rateType: new FormControl('', []),
  workCategory: new FormControl('', [Validators.required]),
  workExecutionMethod: new FormControl('', [Validators.required]),
  estimationWorkDescription: new FormControl('', [Validators.required]),
  estimateType: new FormControl('', []),
  materialUnitControl: new FormControl('', []),
  labourUnitControl: new FormControl('', []),
  labourList: new FormControl('', []),
  undExWork: new FormControl('', []),
  materialOrLabour: new FormControl('MATERIAL', []),
  vendor: new FormControl('', []),
});
interface MaterialData {
  mlCode: string;
}
const estimatedByForm = new FormGroup({
  pdfFile: new FormControl(''),
  certification: new FormControl('', [Validators.required]),
  estReport: new FormControl('', [Validators.required]),
  estimatedBy: new FormControl('', []),
  estimateRemark: new FormControl('', [Validators.required]),
  estimationDate: new FormControl('', [Validators.required]),
});
// const consumerForm =new FormGroup({
//  isNetworkExtension:new FormControl('', []),
// });
const addChargeForm = new FormGroup({
  additionalCharges: new FormControl('', []),
  areaSpecificLoading: new FormControl('', []),
  categoryControl: new FormControl('', []),
});

@Component({
  selector: 'app-estimate-forms',
  templateUrl: './estimate-forms.component.html',
  styleUrls: ['./estimate-forms.component.scss'],
})
export class EstimateFormsComponent implements OnInit {
  certification: string =
    'Certified that I have inspected the spot and prepared this estimate by using current SR for the most economical and safest way of executing the work.';

  estimateCharges: FormGroup = estimateCharges;
  estimatedByForm: FormGroup = estimatedByForm;
  addChargeForm: FormGroup = addChargeForm;
  // consumerForm:FormGroup =consumerForm;
  isLinear: boolean = false;
  isTemplate: boolean = false;
  isTemplateButton: boolean = false;
  estimationTypeGEorRG: boolean = true;
  data: any;
  applicationStatusCode: any;
  allWorkscopeDescription: any;
  dashboardList: any;
  templateList: any;
  allWorkExecutionData: any;
  workExecution: any;
  workCategoryData: any[] = [];
  workscopeDesc: any;
  materialType: any;
  estimateType: any;
  materialList: any;
  labourList: any;
  accountId: any;
  materialsAmount: number = 0;
  laboursAmount: number = 0;
  totalEstimationCostInRs: number = 0;
  totalLabourChargesInRs: number = 0;
  estimationMaterialCost: number = 0;
  estimationLabourCost: number = 0;
  specialLocalityAllowancePercent: number = 0;
  alreadyExistAdditionalCharge: boolean = false;
  alreadyExistScopeOfWork: boolean = false;
  showVendor: boolean = false;
  showTable: boolean = true;
  additionalCharges: any[] = [];
  additionalChargesSel: any[] = [];
  regularFilterExecutionWorkTable: any[] = [];
  creditFilterExecutionWorkTable: any[] = [];
  savedAdditionalCharges: any[] = [];
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  templateData: any = {};
  selectedMaterialUnit: string = '';
  placeholder: string = '';
  filteredMaterialUnits: Observable<string[]>;
  dataSource: any[] = [];
  allMaterials: string[] = [];
  vendorData: any[] = [];
  regularTypeIndex: number = 0;
  creditTypeIndex: number = 0;
  selfExecution: any | null;
  processTypeName: string = '';
  estimateDetailData: any;
  areaSpecificLoadingCharges: any[] = [];
  selectedAreaCharge: any[] = [];
  areaSpecificLoadingAmount: number[] = [];
  chargeData: any[] = [];
  showPercentage: boolean;
  totalEstimateCost: any = '';
  totalLabourCharges: string = '';
  showAmountInput: boolean;
  i: number;
  private selectedWoExecutionMethodCode: any;
  selectedWoExecutionMethodName: string = '';
  totalMaterialsAmountEscom: number = 0;
  totalMaterialsAmountAgency: number = 0;
  selectedMaterialRateType: string = '';
  gstAmount: string | undefined;
  areaSpecificLoadingChargesMasterId: string = '';
  selectedCategory: string;
  msdAmount: number = 0;
  selectedEstimateType: string = '';
  selectedFile: File | null = null;
  documentId: number | null = null;
  applicationTypeCode: 'SMR';
  @ViewChild('pdfFileInput', { static: false }) pdfFileInput: ElementRef;
  @ViewChild('categorySelect') categorySelect: MatSelect;
  isGovernmentWorks: boolean = true;
  governmentWorksAmount: number = 0;
  workPart: string[] = [
    'Part A',
    'Part B',
    'Part C',
    'Part D',
    'Part E',
    'Part F',
  ];

  materialMasterObj = {
    materialsLabourMasterId: '',
    materialTypeMasterId: '',
    srMaterialsMasterId: '',
    mlType: '',
    mlCode: '',
    mlName: '',
    mlRate: '',
    mlUnit: '',
    rateType: '',
  };
  serviceRegistrationsId: any;
  categoryControl: any;
  isEditCase: boolean;
  selectedWorkscopeDescriptionId: string | null = null;
  serviceMainMaterialData: MaterialData[] = [];
  meterWorkScopeDesc: any;
  // isAddButtonDisabled = true;
  creditLabourCost: number = 0;
  isLoadigSavedValue: boolean = false;
  defaultWorkExecutionMethodId: any;
  previousCategoryId: any;
  previousWorkCategoryMasterId: any;
  charCount: { [key: string]: number } = {};
  maxCharLimits: { [key: string]: number } = {
    estimationWorkDescription: 300,
    estReport: 3000,
    certification: 400,
    estimateRemark: 300,
  };
  isCharCountVisible: { [key: string]: boolean } = {};

  filteredCharges = [];
  // layoutData: any;
  serviceData: any;
  smartMeterConnFlag: number;
  @ViewChild('vendorSelect') vendorSelect: ElementRef;

  // showConfirmation: boolean = false;
  // isNetworkExtensionCancelled: boolean = false;
  constructor(
    public dialog: MatDialog,
    private estimateService: EstimateService,
    private estimationRegisteredService: EstimationRegisteredService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private configurationService: ConfigurationService,
    private workAwardService: WorkAwardService,
    private documentService: DocumentService,
    private location: Location,
    private gatePassAcknowledgementService: GatePassAcknowledgementService,
    private loader: LoaderService
  ) {}

  get today(): string {
    let today = new Date();
    let dd = `${today.getDate()}`;
    let mm = `${today.getMonth() + 1}`;
    const yyyy = today.getFullYear();
    if (Number(dd) < 10) {
      dd = `0${dd}`;
    }
    if (Number(mm) < 10) {
      mm = `0${mm}`;
    }
    return `${yyyy}-${mm}-${dd}`;
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.route.queryParamMap.subscribe((queryParams) => {
        this.serviceRegistrationsId = queryParams.get('serviceRegistrationsId');
      });
      const serviceRegistrationsId = params.get('serviceRegistrationsId');
      this.serviceRegistrationsId = serviceRegistrationsId;
      this.loader.show('Data Loading...');
      const edit = params.get('edit') as string;
      this.resetFields();
      this.estimatedByForm.get('estimationDate').setValue(this.today);
      const accountId = params.get('accountId');
      const applicationStatusCode = params.get('statusCode');
      const processTypeName = params.get('processTypeName');
      this.processTypeName = processTypeName;
      this.applicationStatusCode = applicationStatusCode;
      this.accountId = accountId;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeCode = sessionStorage.getItem('office-id');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
      const specialFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeId: officeCode,
      };
      const vendorFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      const mainCategoryFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeCode,
        serviceRegistrationsId: this.serviceRegistrationsId,
        applicationStatusCode,
      };
      const detailFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeCode,
        serviceRegistrationsId: this.serviceRegistrationsId,
        applicationStatusCode,
      };
      const areaFilters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.meterWorkScopeDesc =
        await this.estimateService.getWorkDescMasterData(filter);
      const estimateDetailData =
        await this.estimationRegisteredService.getDetailsByServiceIdAndStatusCode(
          detailFilter
        );
      console.log('estimateDetailData', estimateDetailData);
      this.serviceMainMaterialData =
        await this.estimationRegisteredService.getServiceMainMaterialData(
          areaFilters
        );

      // check first if estimation type is GE then redirect it to estimation approval
      const estimationAddlChargesRegisteredDTOList =
        estimateDetailData.estimationAddlChargesRegisteredDTOList;
      if (
        Array.isArray(estimationAddlChargesRegisteredDTOList) &&
        estimationAddlChargesRegisteredDTOList.length > 0
      ) {
        const firstCharge = estimationAddlChargesRegisteredDTOList[0];
        this.areaSpecificLoadingChargesMasterId =
          firstCharge.areaSpecificLoadingChargesMasterId;
      }
      this.configurationService
        .getAreaSpecificLoaderGetAllData(areaFilters)
        .then((data: any) => {
          this.areaSpecificLoadingCharges = data;
          this.filteredCharges = [...this.areaSpecificLoadingCharges];
          const selectedCharge = this.areaSpecificLoadingCharges.find(
            (charge) =>
              charge.areaSpecificLoadingChargesMasterId.toString() ===
              this.areaSpecificLoadingChargesMasterId.toString()
          );
          if (selectedCharge) {
            this.selectedCategory = selectedCharge.chargesCategory;
          }
        });

      if (
        estimateDetailData &&
        estimateDetailData.estimationRegisteredDTO &&
        estimateDetailData.estimationRegisteredDTO.length &&
        (estimateDetailData.estimationRegisteredDTO[0].estimationType == 'GE' ||
          estimateDetailData.estimationRegisteredDTO[0].estimationType ==
            'RG') &&
        edit !== 'edit'
      ) {
        this.router.navigate([
          '/main',
          'estimation-approval',
          Number(applicationStatusCode),
          processTypeName,
          this.serviceRegistrationsId,
        ]);
      } else {
        if (edit == 'edit') {
          this.isEditCase = true;
          if (
            estimateDetailData.estimationRegisteredDTO[0].workCategoryCode ==
            'SEW'
          ) {
            this.estimateCharges.get('workExecutionMethod').disable();
          }
          this.onQuantityChange;
          this.calculateGovernmentWorksAmount();
        }
        this.estimateDetailData = estimateDetailData;
        // then implement
        // this.estimateService
        //   .getSpecialLocalityAllowanceDataByOfficeId(specialFilter)
        //   .then((v) => {
        //     console.log('specialLocalityAllowancePercent', v);
        //     this.specialLocalityAllowancePercent = v.percentageValue;
        //   });
        this.workAwardService
          .getAllRateContractData(vendorFilter)
          .then((v) => (this.vendorData = v));
        this.data =
          await this.dashboardService.getDataByServiceIdAndApplicationStatus(
            mainCategoryFilter
          );
        this.serviceData = this.data?.serviceRegistration;
        // this.layoutData =this.data;
        this.allWorkExecutionData =
          await this.estimateService.getWorkExecutionMethodData(filter);
        this.configurationService
          .getWorkCategoryGetAllData(filter)
          .then((workCategory) => {
            // if (this.isNetworkExtensionCancelled) {
            //   this.updateWorkCategoryAndExecution();
            // }
            const isNetworkExtension =
              this.estimateDetailData.serviceRegistration.isNetworkExtension;
            const isInstallBefore2005 =
              this.estimateDetailData.serviceRegistration.isInstallBefore2005;
            if (processTypeName == 'NSC') {
              if (
                this.estimateDetailData.serviceRegistration.connectionCode ===
                  'JVS' ||
                this.estimateDetailData.serviceRegistration.connectionCode ===
                  'MC-JVS'
              ) {
                this.workCategoryData = workCategory.filter(
                  (v: any) =>
                    v.workCategoryCode == 'SCN' || v.workCategoryCode == 'SEW'
                );
                this.workExecution = this.allWorkExecutionData.filter(
                  (v: any) =>
                    v.woExecutionMethodName === 'Department' ||
                    v.woExecutionMethodName === 'Self Execution'
                );
              } else if (
                this.serviceData.applicationTypeCode == 'TC' ||
                this.serviceData.applicationTypeCode == 'LAYOUT'
              ) {
                this.workCategoryData = workCategory.filter(
                  (v: any) => v.workCategoryCode == 'SEW'
                );
                this.workExecution = this.allWorkExecutionData.filter(
                  (v: any) => v.woExecutionMethodName == 'Self Execution'
                );
                this.estimateCharges
                  .get('workCategory')
                  .setValue(this.workCategoryData[0].workCategoryMasterId);
                this.estimateCharges.get('workCategory').disable();
                this.estimateCharges
                  .get('workExecutionMethod')
                  .setValue(this.workExecution[0].woExecutionMethodId);
                this.estimateCharges.get('workExecutionMethod').disable();
                this.estimateCharges.get('rateType').setValue('NDS');
                this.estimateCharges.get('rateType').disable();
                this.onChangeWorkExecution(
                  this.workExecution[0].woExecutionMethodId
                );
              } else if (
                isInstallBefore2005 == '1' &&
                this.serviceData.applicationTypeCode == 'LE' &&
                (Number(this.serviceData.totalContractedLoad) >= 25 ||
                  Number(this.serviceData.buildupAreaSize) >= 500) &&
                (this.serviceData?.connectionCode == 'SC-MSB' ||
                  this.serviceData?.connectionTypeCode == 'SC-MSB')
              ) {
                this.workCategoryData = workCategory.filter(
                  (v: any) => v.workCategoryCode === 'SCN'
                );

                this.workExecution = this.allWorkExecutionData.filter(
                  (v: any) =>
                    v.woExecutionMethodName == 'Department' ||
                    v.woExecutionMethodName == 'Labour Contract'
                );

                this.estimateCharges
                  .get('workCategory')
                  .setValue(this.workCategoryData[0]?.workCategoryMasterId);

                this.estimateCharges
                  .get('workExecutionMethod')
                  .setValue(this.workExecution[0]?.woExecutionMethodId);

                this.onChangeWorkExecution(
                  this.workExecution[0]?.woExecutionMethodId
                );
              } else if (
                isNetworkExtension == '1' &&
                (Number(this.serviceData?.totalContractedLoad) >= 35 ||
                  Number(this.serviceData?.buildupAreaSize) >= 800) &&
                (this.serviceData?.connectionCode === 'MC-MSB' ||
                  this.serviceData?.connectionCode === 'SC-MSB' ||
                  this.serviceData?.connectionTypeCode === 'MC-MSB' ||
                  this.serviceData?.connectionTypeCode === 'SC-MSB')
              ) {
                this.workCategoryData = workCategory.filter(
                  (v: any) =>
                    v.workCategoryCode === 'SEW' || v.workCategoryCode === 'DCW'
                );
                this.estimateCharges
                  .get('workCategory')
                  .setValue(this.workCategoryData[0].workCategoryMasterId);
                // this.estimateCharges.get('workCategory').disable();

                if (this.estimateCharges.get('workCategory').value === 'DCW') {
                  this.workExecution = this.allWorkExecutionData.filter(
                    (v: any) => v.woExecutionMethodName !== 'Self Execution'
                  );
                } else {
                  this.workExecution = this.allWorkExecutionData.filter(
                    (v: any) => v.woExecutionMethodName == 'Self Execution'
                  );
                }

                this.estimateCharges
                  .get('workExecutionMethod')
                  .setValue(this.workExecution[0].woExecutionMethodId);
                this.estimateCharges.get('workExecutionMethod').disable();
                this.estimateCharges.get('rateType').setValue('NDS');
                this.estimateCharges.get('rateType').disable();
                this.onChangeWorkExecution(
                  this.workExecution[0].woExecutionMethodId
                );
              } else if (
                ((Number(this.serviceData?.totalContractedLoad) > 25 &&
                  Number(this.serviceData?.totalContractedLoad) <= 35) ||
                  (Number(this.serviceData?.buildupAreaSize) > 500 &&
                    Number(this.serviceData?.buildupAreaSize) <= 800)) &&
                isNetworkExtension == '1'
              ) {
                if (this.serviceData?.isSpaceProvided == '0') {
                  this.workCategoryData = workCategory.filter(
                    (v: any) => v.workCategoryCode == 'SEW'
                  );
                  this.workExecution = this.allWorkExecutionData.filter(
                    (v: any) => v.woExecutionMethodName === 'Self Execution'
                  );
                  this.estimateCharges
                    .get('workCategory')
                    .setValue(this.workCategoryData[0].workCategoryMasterId);
                  this.estimateCharges.get('workCategory').disable();
                  this.estimateCharges
                    .get('workExecutionMethod')
                    .setValue(this.workExecution[0].woExecutionMethodId);
                  this.estimateCharges.get('workExecutionMethod').disable();
                  this.estimateCharges.get('rateType').setValue('NDS');
                  this.estimateCharges.get('rateType').disable();
                  this.onChangeWorkExecution(
                    this.workExecution[0].woExecutionMethodId
                  );
                } else {
                  this.workCategoryData = workCategory.filter(
                    (v: any) =>
                      v.workCategoryCode == 'SCN' ||
                      v.workCategoryCode == 'SEW' ||
                      v.workCategoryCode == 'DCW'
                  );
                  if (
                    this.workCategoryData.some(
                      (v: any) => v.workCategoryCode == 'DCW'
                    )
                  ) {
                    this.workExecution = this.allWorkExecutionData.filter(
                      (v: any) => v.woExecutionMethodName !== 'Self Execution'
                    );
                  } else {
                    this.workExecution = this.allWorkExecutionData;
                  }
                }
              } else {
                if (isNetworkExtension == '1') {
                  if (this.serviceData.categoryCode === 'LT-6') {
                    this.workCategoryData = workCategory.filter(
                      (v: any) =>
                        v.workCategoryCode == 'SCN' ||
                        v.workCategoryCode == 'SEW' ||
                        v.workCategoryCode == 'DCW'
                    );
                  } else {
                    this.workCategoryData = workCategory.filter(
                      (v: any) =>
                        v.workCategoryCode == 'SCN' ||
                        v.workCategoryCode == 'SEW' ||
                        v.workCategoryCode == 'DCW'
                    );
                  }
                  if (
                    this.workCategoryData.some(
                      (v: any) => v.workCategoryCode == 'DCW'
                    )
                  ) {
                    this.workExecution = this.allWorkExecutionData.filter(
                      (v: any) => v.woExecutionMethodName !== 'Self Execution'
                    );
                  } else {
                    this.workExecution = this.allWorkExecutionData;
                  }
                } else {
                  this.workCategoryData = workCategory.filter(
                    (v: any) =>
                      v.workCategoryCode == 'SCN' ||
                      v.workCategoryCode == 'SEW' ||
                      v.workCategoryCode == 'DCW'
                  );
                  if (
                    this.workCategoryData.some(
                      (v: any) => v.workCategoryCode == 'DCW'
                    )
                  ) {
                    this.workExecution = this.allWorkExecutionData.filter(
                      (v: any) => v.woExecutionMethodName !== 'Self Execution'
                    );
                  } else {
                    this.workExecution = this.allWorkExecutionData.filter(
                      (v: any) =>
                        v.woExecutionMethodName === 'Department' ||
                        v.woExecutionMethodName === 'Self Execution'
                    );
                  }
                }
              }
            }

            if (processTypeName == 'CSC') {
              if (
                this.estimateDetailData.serviceRegistration
                  .applicationTypeCode === 'SMR' ||
                this.estimateDetailData.serviceRegistration
                  .applicationTypeCode === 'UMT_MT'
              ) {
                this.workCategoryData = workCategory.filter(
                  (v: any) =>
                    v.workCategoryCode == 'SEW' || v.workCategoryCode == 'RMW'
                );
                this.workExecution = this.allWorkExecutionData.filter(
                  (v: any) =>
                    v.woExecutionMethodName === 'Department' ||
                    v.woExecutionMethodName === 'Self Execution'
                );
              } else {
                this.workCategoryData = workCategory.filter(
                  (v: any) =>
                    v.workCategoryCode == 'DCW' || v.workCategoryCode == 'SEW'
                );
                this.workExecution = this.allWorkExecutionData;
              }
            }

            if (processTypeName == 'DND') {
              this.workCategoryData = workCategory.filter(
                (v: any) => v.workCategoryCode == 'DW'
              );
              this.workExecution = this.allWorkExecutionData.filter(
                (v: any) => v.woExecutionMethodName === 'Department'
              );
              this.estimateCharges
                .get('workCategory')
                .setValue(this.workCategoryData[0].workCategoryMasterId);
              this.estimateCharges.get('workCategory').disable();
              this.estimateCharges
                .get('workExecutionMethod')
                .setValue(this.workExecution[0].woExecutionMethodId);
              this.estimateCharges.get('workExecutionMethod').disable();
              this.estimateCharges.get('rateType').setValue('SR');
              this.estimateCharges.get('rateType').disable();
              this.onChangeWorkExecution(
                this.workExecution[0].woExecutionMethodId
              );
            }
          });
        this.placeholder = `${
          this.serviceData?.designationShortCode
        } - ${sessionStorage.getItem('user-name')}`;
        const catCode = this.serviceData?.categoryCode?.split('-');
        this.estimateService
          .getWorkDescMasterData(filter)
          .then((v) => (this.allWorkscopeDescription = v));
        this.estimateService.getMaterialTypeMasterData(filter).then((mt) => {
          this.materialType = mt.sort((a: any, b: any) => {
            if (a.materialTypeName < b.materialTypeName) {
              return -1;
            }
            if (a.materialTypeName > b.materialTypeName) {
              return 1;
            }
            return 0;
          });
        });
        this.estimateService
          .getEstimateTypeMasterData(filter)
          .then((estType) => {
            if (processTypeName == 'DND') {
              this.estimateType = estType.filter(
                (v: any) => v.estimateTypeCode == 'CRD'
              );
            } else {
              this.estimateType = estType.filter(
                (v: any) =>
                  v.estimateTypeCode == 'RGL' || v.estimateTypeCode == 'CRD'
              );
            }
          });

        await this.onChangeMaterials();
        // for additional charges
        if (
          estimateDetailData &&
          estimateDetailData.estimationRegisteredDTO &&
          estimateDetailData.estimationRegisteredDTO.length
        ) {
          this.estimateCharges
            .get('workCategory')
            .setValue(
              estimateDetailData.estimationRegisteredDTO[0]
                ?.workCategoryMasterId
            );
          const woExecutionMethodName =
            estimateDetailData.estimationRegisteredDTO[0]
              ?.woExecutionMethodName;

          if (woExecutionMethodName && this.allWorkExecutionData.length) {
            const woData = this.allWorkExecutionData.find(
              (v: any) => v.woExecutionMethodName === woExecutionMethodName
            );

            if (woData) {
              const woId = woData.woExecutionMethodId;
              this.estimateCharges.get('workExecutionMethod').setValue(woId);
              await this.onChangeWorkExecution(woId);
            } else {
              console.warn('No matching work execution method found.');
            }
          }
          this.estimateCharges
            .get('estimationWorkDescription')
            .setValue(
              estimateDetailData.estimationRegisteredDTO[0]?.estimationWorkDesc
            );
          this.estimateCharges
            .get('rateType')
            .setValue(estimateDetailData.estimationRegisteredDTO[0]?.rateType);
          this.estimateCharges
            .get('vendor')
            .setValue(
              estimateDetailData.estimationRegisteredDTO[0]
                ?.rateContractMasterId
            );
          const estimationRemarks =
            estimateDetailData.estimationRegisteredDTO[0]?.estimationRemarks ===
            'null'
              ? ''
              : estimateDetailData.estimationRegisteredDTO[0]
                  ?.estimationRemarks || '';

          const report =
            estimateDetailData.estimationRegisteredDTO[0]?.estReport === 'null'
              ? ''
              : estimateDetailData.estimationRegisteredDTO[0]?.estReport || '';

          this.estimatedByForm
            .get('estimateRemark')
            .setValue(estimationRemarks);
          this.estimatedByForm.get('estReport').setValue(report);

          if (
            estimateDetailData.estimationRegisteredDTO[0]?.estimationType ==
              'GE' ||
            estimateDetailData.estimationRegisteredDTO[0]?.estimationType ==
              'RG'
          ) {
            this.estimationTypeGEorRG = false;
          }
        }

        if (
          estimateDetailData &&
          estimateDetailData.estimationWorkScopeDataDTO &&
          estimateDetailData.estimationWorkScopeDataDTO.length
        ) {
          const wPart = estimateDetailData.estimationWorkScopeDataDTO.map(
            (v: any) => v.workPart
          );
          wPart.forEach((v: any) => {
            this.workPart.splice(
              this.workPart.findIndex((e) => e == v),
              1
            );
          });

          this.workPart.sort();
          estimateDetailData.estimationWorkScopeDataDTO.forEach(
            (workScope: any) => {
              let materialItems = [];
              const material =
                estimateDetailData.estimationMaterailsRegisteredDTOList?.filter(
                  (v: any) =>
                    v.estimationWorkScopeDataId ==
                    workScope.estTemplateWorkScopeMasterId
                );
              if (material && material.length) {
                material.forEach((mat: any) => {
                  let laboursData: any[] = [];
                  const labour =
                    estimateDetailData.estimationMaterialLabourDetailsDTOList?.filter(
                      (v: any) =>
                        v.estimationWorkScopeDataId ==
                          workScope.estTemplateWorkScopeMasterId &&
                        v.materialsMasterId == mat.materialsMasterId
                    );
                  if (labour && labour.length) {
                    laboursData = [];
                    labour.forEach((v: any) => {
                      laboursData.push({
                        materialsLabourMasterId: v.labourMasterId,
                        mlmid: mat.materialsMasterId,
                        mlName: v.labourName,
                        mlRate: v.labourRate,
                        mlUnit: v.labourUnit,
                        mlCode: v.labourCode,
                      });
                    });
                  }
                  materialItems.push({
                    rateType: mat.rateType,
                    laborData: laboursData,
                    itemCode: mat.materialCode,
                    itemUnit: mat.materialUnit,
                    itemName: mat.materialName,
                    materialRate: mat.materialRate,
                    labourRate: mat.labourRate,
                    materialsAmount: mat.materailAmount,
                    laboursAmount: mat.labourAmount,
                    quantity: mat.quantity,
                    materialTypeMasterId: mat.materialsMasterId,
                    materialsLabourMasterId: mat.materialsMasterId,
                  });
                });
              }
              if (
                this.estimateType.find(
                  (v: any) => v.estimateTypeMasterId == workScope.estimateType
                )?.estimateTypeCode == 'RGL'
              ) {
                this.regularFilterExecutionWorkTable.push({
                  estimateTypeCode: 'RGL',
                  workType: workScope.workType,
                  workPart: workScope.workPart,
                  workscopeDescription: workScope.workscopeDescription,
                  materialItems,
                  materialCost: workScope.materialCost,
                  labourCost: workScope.labourCost,
                });
              } else if (
                this.estimateType.find(
                  (v: any) => v.estimateTypeMasterId == workScope.estimateType
                )?.estimateTypeCode == 'CRD'
              ) {
                this.creditFilterExecutionWorkTable.push({
                  estimateTypeCode: 'CRD',
                  workType: workScope.workType,
                  workPart: workScope.workPart,
                  workscopeDescription: workScope.workscopeDescription,
                  materialItems,
                  materialCost: workScope.materialCost,
                  labourCost: workScope.labourCost,
                });
              }
            }
          );
          this.estimationMaterialCost =
            estimateDetailData.estimationRegisteredDTO[0]?.estimationMaterialCost;
          this.estimationLabourCost =
            estimateDetailData.estimationRegisteredDTO[0]?.estimationLabourCost;
          const additionalCharge =
            estimateDetailData.estimationAddlChargesRegisteredDTOList;
          let sum: number = 0;
          if (additionalCharge && additionalCharge.length) {
            this.additionalCharges = additionalCharge.sort(
              (a: any, b: any) =>
                Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder)
            );
            this.addChargesBeforeTotalLabour = this.additionalCharges.filter(
              (v: any) => Number(v.chargesSequenceOrder) < 5
            );
            this.addChargesAfterTotalLabour = this.additionalCharges.filter(
              (v: any) => Number(v.chargesSequenceOrder) >= 5
            );
            const amt = this.addChargesBeforeTotalLabour.map(
              (v: any) => v.amount
            );
            if (amt.length) {
              sum = amt.reduce((a: any, b: any) => {
                return Number(a) + Number(b);
              });
            }
          }
          this.addChargesBeforeTotalLabour.forEach((addCharge) => {
            if (addCharge.chargeType === 'PERCENTAGE') {
              addCharge.showPercentage = true;
            } else {
              addCharge.showPercentage = false;
            }
            if (addCharge.additionalChargeName !== 'GST') {
              addCharge.showAmountInput = true;
            }
          });
          // this.totalLabourChargesInRs =
          //   estimateDetailData.estimationRegisteredDTO[0]?.totalLabourCharges;
          this.totalEstimateCost = Number(
            estimateDetailData.estimationRegisteredDTO[0]?.totalLabourCharges
          ).toFixed(3);
          this.totalEstimationCostInRs =
            estimateDetailData.estimationRegisteredDTO[0]?.estimationTotalCost;
          const gstObject =
            this.estimateDetailData.estimationAddlChargesRegisteredDTOList.find(
              (obj) => obj.additionalChargeName === 'GST'
            );
          if (gstObject) {
            this.gstAmount = gstObject.amount;
          } else {
            this.gstAmount = 'GST not found';
          }
        }
      }
      this.loader.hide();
    });
  }
  applyFilter(value: string) {
    const filterValue = value.trim().toLowerCase();
    if (!filterValue) {
      this.filteredCharges = [...this.areaSpecificLoadingCharges];
    } else {
      this.filteredCharges = this.areaSpecificLoadingCharges.filter((charge) =>
        charge.chargesCategory.toLowerCase().includes(filterValue)
      );
    }
  }
  onInputChange(form: FormGroup, formControlName: string) {
    const formControlValue = form.get(formControlName)?.value || '';
    this.charCount[formControlName] = formControlValue.length;
  }
  onFocus(formControlName: string) {
    this.isCharCountVisible[formControlName] = true;
  }
  onBlur(formControlName: string) {
    this.isCharCountVisible[formControlName] = false;
  }
  convertEstimateCode(code: string) {
    return code.split('-')[1];
  }
  formatNumber(num: number | string): string {
    if (typeof num === 'number' || !isNaN(parseFloat(num as string))) {
      return parseFloat(num as string).toFixed(2);
    }
    return num.toString();
  }

  async getTemplate() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeId = sessionStorage.getItem('office-id');
    const rateType = this.estimateCharges.get('rateType').value;
    const workExecutionMethod = this.estimateCharges.get(
      'workExecutionMethod'
    ).value;
    const workCategorySelect = document.querySelector(
      '[formControlName="workCategory"]'
    ) as HTMLSelectElement;
    const workCategoryMasterId = workCategorySelect.value;
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      officeId,
      rateType,
      workExecutionMethod,
      workCategoryMasterId,
    };
    this.isTemplateButton = true;
    this.templateList = await this.estimateService.getTemplateList(filter);
  }

  resetFields() {
    return new Promise((resolve) => {
      this.estimateCharges.reset({
        typeOfWork: '',
        workPart: '',
        workDescription: '',
        materialType: '',
        rateType: '',
        workExecutionMethod: '',
        estimationWorkDescription: '',
        estimateType: '',
        materialUnitControl: '',
        labourUnitControl: '',
        labourList: '',
        undExWork: '',
        materialOrLabour: 'MATERIAL',
        workCategory: '',
      });
      this.estimatedByForm.reset({
        estimatedBy: '',
        estimateRemark: '',
        estReport: '',
        estimationDate: '',
      });
      this.addChargeForm.reset({
        additionalCharges: '',
      });
      this.regularFilterExecutionWorkTable = [];
      this.creditFilterExecutionWorkTable = [];
      this.additionalCharges = [];
      this.additionalChargesSel = [];
      this.savedAdditionalCharges = [];
      this.addChargesBeforeTotalLabour = [];
      this.addChargesAfterTotalLabour = [];
      this.templateData = {};
      this.selectedMaterialUnit = '';
      this.dataSource = [];
      this.allMaterials = [];
      this.isTemplateButton = false;
      this.resetMaterialMasterObj();
      resolve(true);
    });
  }

  private _filterMaterialUnits(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allMaterials.filter((name) =>
      name.toLowerCase().includes(filterValue)
    );
  }

  filterMaterialUnits(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredMaterialUnits = this.estimateCharges
      .get('materialUnitControl')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterMaterialUnits(value))
      );
    this.filteredMaterialUnits = this.filteredMaterialUnits.pipe(
      map((units) =>
        units.filter((unit) => unit.toLowerCase().includes(filterValue))
      )
    );
  }

  filterLabourUnits(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredMaterialUnits = this.estimateCharges
      .get('labourUnitControl')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterMaterialUnits(value))
      );
    this.filteredMaterialUnits = this.filteredMaterialUnits.pipe(
      map((units) =>
        units.filter((unit) => unit.toLowerCase().includes(filterValue))
      )
    );
  }
  async onMaterialUnitSelected(name: any) {
    try {
      const woExecutionMethodCode = this.selectedWoExecutionMethodCode;
      console.log('woExecutionMethodCode:', woExecutionMethodCode);
      this.materialList = [];
      this.materialMasterObj.mlName = name;
      const mat = name.split('-');
      const ml = this.dataSource.find(
        (v: any) => v.rateType == mat[0] && v.mlCode == mat[1]
      );
      if (ml) {
        this.materialMasterObj.materialTypeMasterId = ml.materialTypeMasterId;
        this.materialMasterObj.rateType = ml.rateType;
        this.materialMasterObj.mlCode = ml.mlCode;
        this.materialMasterObj.materialsLabourMasterId =
          ml.materialsLabourMasterId;
        this.materialMasterObj.srMaterialsMasterId = ml.srMaterialsMasterId;
        this.selectedMaterialRateType = ml.rateType;
        const executionMethod = this.estimateCharges.get(
          'workExecutionMethod'
        ).value;
        const apiKey = sessionStorage.getItem('api-key');
        const serviceKey = sessionStorage.getItem('service-key');
        const userRole = sessionStorage.getItem('user-role');
        const userName = sessionStorage.getItem('user-name');
        const userCode = sessionStorage.getItem('user-code');
        console.log('ML', ml);
        if (ml.mlType == 'LABOR') {
          const labourFilter: any = {
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            materialTypeMasterId: this.materialMasterObj.materialTypeMasterId,
            mlType: 'LABOR',
            rateType:
              executionMethod == '1' ? 'NDS' : this.materialMasterObj.rateType,
            //workExecutionMethodCode: woExecutionMethodCode,
          };
          this.labourList = [];
          const ml1 =
            await this.estimateService.getDataByMlTypeAndMaterialTypeMasterId(
              labourFilter
            );
          this.materialList = ml1.sort((a: any, b: any) => {
            return a.mlCode - b.mlCode;
          });
          // this.enableAddButtonAfterDelay();
        } else if (
          this.estimateCharges.get('undExWork').value.split('-')[1] !== 'CRD'
        ) {
          const materialFilter: any = {
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            materialTypeMasterId: this.materialMasterObj.materialTypeMasterId,
            mlType: 'MATERIAL',
            rateType: this.materialMasterObj.rateType,
            //  workExecutionMethodCode: woExecutionMethodCode,getDataByMlTypeAndMaterialTypeMasterId
          };
          const ml2 =
            await this.estimateService.getDataByMlTypeAndMaterialTypeMasterId(
              materialFilter
            );
          this.materialList = ml2.sort((a: any, b: any) => {
            return a.mlCode - b.mlCode;
          });
          console.log('ml2', ml2);
          const labourFilter: any = {
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            materialTypeMasterId: this.materialMasterObj.materialTypeMasterId,
            mlType: 'LABOR',
            rateType:
              executionMethod == '1' ? 'NDS' : this.materialMasterObj.rateType,
            //workExecutionMethodCode: woExecutionMethodCode,
          };
          const ll =
            await this.estimateService.getDataByMlTypeAndMaterialTypeMasterId(
              labourFilter
            );
          console.log('ll', ll);
          this.labourList = ll.sort((a: any, b: any) => {
            return a.mlCode - b.mlCode;
          });
          // mapping
          const materialLabourMappingFilter: any = {
            apiKey,
            serviceKey,
            userRole,
            userName,
            userCode,
            materialMasterId: this.materialMasterObj.srMaterialsMasterId,
          };
          const labourMapping =
            await this.estimateService.getMaterialLabourMapping(
              materialLabourMappingFilter
            );
          const labourMapped: any[] = [];
          if (labourMapping && labourMapping.length) {
            labourMapping.forEach((v: any) => {
              labourMapped.push(
                ll.find((e: any) => e.srMaterialsMasterId == v.labourMasterId)
              );
            });
            console.log('labourMapped:', labourMapped);
            const materialsLabourIds = labourMapped
              .filter((v: any) => v !== undefined) // Filter out undefined elements
              .map((v: any) => v.materialsLabourMasterId);
            if (materialsLabourIds && materialsLabourIds.length) {
              this.estimateCharges
                .get('labourList')
                .setValue(materialsLabourIds);
            }
          }
        }
        // this.updateAddButtonState();
      } else {
        console.error('Material not found in dataSource.');
      }
    } catch (error) {
      console.error('Error in onMaterialUnitSelected:', error);
    }
  }
  resetMaterialMasterObj() {
    this.materialMasterObj = {
      materialsLabourMasterId: '',
      materialTypeMasterId: '',
      srMaterialsMasterId: '',
      mlType: '',
      mlCode: '',
      mlName: '',
      mlRate: '',
      mlUnit: '',
      rateType: '',
    };
  }

  onChangeEstimateType() {
    const workType = this.estimateCharges.get('typeOfWork').value;
    this.selectedEstimateType = this.estimateCharges.get('estimateType').value;
    console.log('estimateCharges', estimateCharges);
    if (!workType) {
      this.onChangeTypeOfWork(workType, true);
    } else {
      this.onChangeTypeOfWork(workType);
    }
  }

  displayTemplateData(templateData: any) {
    if (
      templateData.estTemplateWorkScopeMaster &&
      templateData.estTemplateWorkScopeMaster.length
    ) {
      this.isTemplate = true;
      this.regularFilterExecutionWorkTable = [];
      this.creditFilterExecutionWorkTable = [];
      const wPart = templateData.estTemplateWorkScopeMaster.map(
        (v: any) => v.workPart
      );
      wPart.forEach((v: any) => {
        this.workPart.splice(
          this.workPart.findIndex((e) => e == v),
          1
        );
      });
      this.workPart.sort();
      templateData.estTemplateWorkScopeMaster.forEach((workScope: any) => {
        const materialItems: any[] = [];
        const material = templateData.estTemplateMaterialsMaster.filter(
          (v: any) =>
            v.estimationWorkScopeDataId ==
            workScope.estTemplateWorkScopeMasterId
        );
        if (material && material.length) {
          material.forEach((mat: any) => {
            const laboursData: any[] = [];
            const labour =
              templateData.estimationTemplateMaterialLabourMaster.filter(
                (v: any) =>
                  v.estimationWorkScopeDataId ==
                    workScope.estTemplateWorkScopeMasterId &&
                  mat.materialsMasterId == v.materialsMasterId
              );
            if (labour && labour.length) {
              labour.forEach((v: any) => {
                laboursData.push({
                  materialsLabourMasterId: v.labourMasterId,
                  mlmid: mat.materialsMasterId,
                  mlName: v.labourName,
                  mlRate: v.labourRate,
                  mlUnit: v.labourUnit,
                  mlCode: v.labourCode,
                });
              });
            }
            const mAmt = mat.quantity * mat.materialRate;
            const lAmt = mat.quantity * mat.labourRate;
            materialItems.push({
              rateType: mat.rateType,
              laborData: laboursData,
              itemCode: mat.materialCode,
              itemUnit: mat.materialUnit,
              itemName: mat.materialName,
              materialRate: mat.materialRate,
              labourRate: mat.labourRate !== 'null' ? mat.labourRate : 0,
              materialsAmount: mAmt,
              laboursAmount: lAmt,
              quantity: mat.quantity,
              materialTypeMasterId: mat.materialsMasterId,
              materialsLabourMasterId: mat.materialsMasterId,
            });
          });
        }
        let totalMaterialsAmount: number = 0;
        const tma = materialItems.map((v: any) => v.materialsAmount);
        if (tma.length) {
          const m = tma.reduce((a: any, b: any) => {
            return Number(a) + Number(b);
          });
          totalMaterialsAmount = Number(Number(m).toFixed(2));
        }
        let totalLaborAmount: number = 100;
        const tla = materialItems.map((v: any) => v.laboursAmount);
        if (tma.length) {
          const l = tla.reduce((a: any, b: any) => {
            return Number(a) + Number(b);
          });
          totalLaborAmount = Number(Number(l).toFixed(2));
        }
        if (
          this.estimateType.find(
            (v: any) => v.estimateTypeMasterId == workScope.estimateType
          )?.estimateTypeCode == 'RGL'
        ) {
          this.regularFilterExecutionWorkTable.push({
            estimateTypeCode: 'RGL',
            workType: workScope.workType,
            workPart: workScope.workPart,
            workscopeDescription: workScope.workscopeDescription,
            materialItems,
            materialCost: totalMaterialsAmount,
            labourCost: totalLaborAmount,
          });
        } else if (
          this.estimateType.find(
            (v: any) => v.estimateTypeMasterId == workScope.estimateType
          )?.estimateTypeCode == 'CRD'
        ) {
          this.creditFilterExecutionWorkTable.push({
            estimateTypeCode: 'CRD',
            workType: workScope.workType,
            workPart: workScope.workPart,
            workscopeDescription: workScope.workscopeDescription,
            materialItems,
            materialCost: totalMaterialsAmount,
            labourCost: totalLaborAmount,
          });
        }
      });
      let mc: number = 0;
      let lc: number = 0;
      const m = this.regularFilterExecutionWorkTable.map(
        (v: any) => v.materialCost
      );
      if (m.length) {
        mc = m.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
      const l = this.regularFilterExecutionWorkTable.map(
        (v: any) => v.labourCost
      );
      if (l.length) {
        lc = l.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
      this.estimationMaterialCost = Number(mc);
      this.estimationLabourCost = Number(lc);
      // forms setvalue
      this.estimateCharges
        .get('rateType')
        .setValue(templateData?.estimationTemplateMaster?.rateType);
      this.estimateCharges
        .get('estimationWorkDescription')
        .setValue(templateData?.estimationTemplateMaster?.estimationWorkDesc);
      const woExecutionMethodName =
        templateData?.estimationTemplateMaster?.woExecutionMethodName;
      const woId = this.workExecution.find(
        (v: any) => v.woExecutionMethodName == woExecutionMethodName
      ).woExecutionMethodId;
      // this.estimateCharges
      //   .get('workCategory')
      //   .setValue(templateData?.estimationTemplateMaster?.workCategoryMasterId);
      this.estimateCharges.get('workExecutionMethod').setValue(woId);
      this.onChangeWorkExecution(this.workExecution[0].woExecutionMethodId);

      // for add charges
      const additionalCharge = templateData.estimationTemplateAddlChargesMaster;
      let sum: number = 0;
      if (additionalCharge && additionalCharge.length) {
        this.additionalCharges = additionalCharge.sort(
          (a: any, b: any) =>
            Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder)
        );
        this.addChargesBeforeTotalLabour = this.additionalCharges.filter(
          (v: any) =>
            Number(v.chargesSequenceOrder) < 5 && v.displayByDefault == 1
        );
        this.addChargesAfterTotalLabour = this.additionalCharges.filter(
          (v: any) =>
            Number(v.chargesSequenceOrder) >= 5 && v.displayByDefault == 1
        );
        const amt = this.addChargesBeforeTotalLabour.map((v: any) => v.amount);
        if (amt.length) {
          sum = amt.reduce((a: any, b: any) => {
            return Number(a) + Number(b);
          });
        }
        if (this.addChargesBeforeTotalLabour.length) {
          sum = this.addChargesBeforeTotalLabour.reduce((a: any, b: any) => {
            return Number(a.amount) + Number(b.amount);
          });
        }
      }
      this.totalEstimateCost = Number(
        (this.estimationMaterialCost + this.estimationLabourCost + sum).toFixed(
          2
        )
      );
      this.totalLabourChargesInRs =
        Number(Number(sum).toFixed(2)) +
        Number(Number(this.estimationLabourCost).toFixed(2));
      // line
      const totalMLCost = Number(
        (
          Number(this.estimationMaterialCost) +
          Number(this.estimationLabourCost)
        ).toFixed(2)
      );
      const valueCalculatedByOnlyLabour = this.additionalCharges.filter(
        (v: any) =>
          v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 0
      );
      if (valueCalculatedByOnlyLabour && valueCalculatedByOnlyLabour.length) {
        valueCalculatedByOnlyLabour.forEach((v: any) => {
          v.amount = Number(
            Number(
              (Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) /
                100
            ).toFixed(2)
          );
        });
      }
      const valueCalculatedByBothLabourAndMaterial =
        this.additionalCharges.filter(
          (v: any) =>
            v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 1
        );
      if (
        valueCalculatedByBothLabourAndMaterial &&
        valueCalculatedByBothLabourAndMaterial.length
      ) {
        valueCalculatedByBothLabourAndMaterial.forEach((v: any) => {
          v.amount = Number(
            Number(
              (Number(v.chargeTypeValue) * Number(totalMLCost)) / 100
            ).toFixed(2)
          );
        });
      }
      const valueCalculatedByOnlyMaterial = this.additionalCharges.filter(
        (v: any) => v.valueCalculatedByMaterial == 1
      );
      if (
        valueCalculatedByOnlyMaterial &&
        valueCalculatedByOnlyMaterial.length
      ) {
        valueCalculatedByOnlyMaterial.forEach((v: any) => {
          v.amount = Number(
            Number(
              (Number(v.chargeTypeValue) *
                Number(this.estimationMaterialCost)) /
                100
            ).toFixed(2)
          );
        });
      }
      let beforeTotalLabour: number = 0;
      let afterTotalLabour: number = 0;
      if (this.additionalCharges) {
        const bLabour1 = this.additionalCharges.filter(
          (v: any) =>
            Number(v.chargesSequenceOrder) < 5 && v.displayByDefault == 1
        );
        if (bLabour1.length) {
          const bLabour2 = bLabour1.map((v: any) => v.amount);
          beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
            return Number(a) + Number(b);
          });
        }
        this.totalLabourChargesInRs =
          Number(this.estimationLabourCost) + Number(beforeTotalLabour);
        const aLabour1 = this.additionalCharges.filter(
          (v: any) => v.chargesSequenceOrder >= 5 && v.displayByDefault == 1
        );
        if (aLabour1.length) {
          const aLabour2 = aLabour1.map((v: any) => v.amount);
          afterTotalLabour = aLabour2.reduce((a: any, b: any) => {
            return Number(a) + Number(b);
          });
        }
      }
      this.totalLabourChargesInRs = Number(
        (Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(
          2
        )
      );
      this.totalEstimationCostInRs = Number(
        (Number(this.totalEstimateCost) + afterTotalLabour).toFixed(3)
      );
    }
  }
  async onChangeTypeOfWork(typeOfWork: string, initial?: boolean | false) {
    if (typeOfWork) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode };

      const workDescData = await this.estimateService.getWorkDescMasterData(
        filter
      );
      const connectionCode =
        this.estimateDetailData.serviceRegistration.connectionCode;
      const isNetworkExtension =
        this.estimateDetailData.serviceRegistration.isNetworkExtension;
      const selectedEstimateType = this.selectedEstimateType;
      const applicationTypeCode = this.serviceData.applicationTypeCode;
      if (selectedEstimateType === 'RGL' && isNetworkExtension === '0') {
        this.workscopeDesc = workDescData.filter(
          (v: any) =>
            v.workscopeDescCode === 'SM' && v.estimateTypeCode === 'RGL'
        );
        return;
      } else if (selectedEstimateType === 'RLZ') {
        this.workscopeDesc = workDescData.filter(
          (v: any) =>
            v.workscopeDescCode === 'SM' && v.estimateTypeCode === 'RLZ'
        );
        return;
      } else if (
        selectedEstimateType === 'RGL' &&
        applicationTypeCode === 'UMT_MT'
      ) {
        this.workscopeDesc = workDescData.filter(
          (v: any) =>
            v.workscopeDescCode === 'SM' && v.estimateTypeCode === 'RGL'
        );
        return;
      } else if (
        selectedEstimateType === 'RGL' &&
        applicationTypeCode === 'SMR'
      ) {
        this.workscopeDesc = workDescData.filter(
          (v: any) =>
            v.workscopeDescCode === 'SM' && v.estimateTypeCode === 'RGL'
        );
        return;
      } else if (selectedEstimateType === 'CRD' && isNetworkExtension === '0') {
        if (typeOfWork === 'LT') {
          const workD = workDescData.filter(
            (v: any) => v.workscopeDescCode !== 'SM'
          );
          const estimateType = this.estimateType.find(
            (v: any) =>
              v.estimateTypeCode ==
              this.estimateCharges.get('estimateType').value
          )?.estimateTypeMasterId;
          this.workscopeDesc = workD.filter((v: any) => {
            return (
              v.estimateType == estimateType &&
              (v.workTypeApplicable == 'LT' || v.workTypeApplicable == 'BOTH')
            );
          });
          return;
        } else if (typeOfWork === 'HT') {
          const workD = workDescData.filter(
            (v: any) => v.workscopeDescCode !== 'SM'
          );
          const estimateType = this.estimateType.find(
            (v: any) =>
              v.estimateTypeCode ==
              this.estimateCharges.get('estimateType').value
          )?.estimateTypeMasterId;
          this.workscopeDesc = workD.filter((v: any) => {
            return (
              v.estimateType == estimateType &&
              (v.workTypeApplicable == 'HT' || v.workTypeApplicable == 'BOTH')
            );
          });
        }
      } else if (selectedEstimateType === 'RGL' && connectionCode === 'JVS') {
        this.workscopeDesc = workDescData.filter(
          (v: any) =>
            v.workscopeDescCode === 'SM' && v.estimateTypeCode === 'RGL'
        );
      } else if (selectedEstimateType === 'RLZ' && connectionCode === 'JVS') {
        this.workscopeDesc = workDescData.filter(
          (v: any) =>
            v.workscopeDescCode === 'SM' && v.estimateTypeCode === 'RLZ'
        );
      } else if (selectedEstimateType === 'CRD') {
        if (typeOfWork === 'LT') {
          const workD = workDescData.filter(
            (v: any) => v.workscopeDescCode !== 'SM'
          );
          const estimateType = this.estimateType.find(
            (v: any) =>
              v.estimateTypeCode ==
              this.estimateCharges.get('estimateType').value
          )?.estimateTypeMasterId;
          this.workscopeDesc = workD.filter((v: any) => {
            return (
              v.estimateType == estimateType &&
              (v.workTypeApplicable == 'LT' || v.workTypeApplicable == 'BOTH')
            );
          });
        } else if (typeOfWork === 'HT') {
          const workD = workDescData.filter(
            (v: any) => v.workscopeDescCode !== 'SM'
          );
          const estimateType = this.estimateType.find(
            (v: any) =>
              v.estimateTypeCode ==
              this.estimateCharges.get('estimateType').value
          )?.estimateTypeMasterId;
          this.workscopeDesc = workD.filter((v: any) => {
            return (
              v.estimateType == estimateType &&
              (v.workTypeApplicable == 'HT' || v.workTypeApplicable == 'BOTH')
            );
          });
        }
      } else {
        let workD = workDescData.filter(
          (v: any) => v.workscopeDescCode !== 'SM'
        );
        const estimateType = this.estimateType.find(
          (v: any) =>
            v.estimateTypeCode == this.estimateCharges.get('estimateType').value
        )?.estimateTypeMasterId;
        if (typeOfWork == 'LT') {
          this.workscopeDesc = workD.filter((v: any) => {
            return (
              v.estimateType == estimateType &&
              (v.workTypeApplicable == 'LT' || v.workTypeApplicable == 'BOTH')
            );
          });
        }
        if (typeOfWork == 'HT') {
          this.workscopeDesc = workD.filter((v: any) => {
            return (
              v.estimateType == estimateType &&
              (v.workTypeApplicable == 'HT' || v.workTypeApplicable == 'BOTH')
            );
          });
        }
      }

      if (
        this.estimateCharges.get('workPart').value &&
        this.estimateCharges.get('workDescription').value
      ) {
        const ewt: any[] = [
          ...this.regularFilterExecutionWorkTable,
          ...this.creditFilterExecutionWorkTable,
        ];
        const workDesVal = Number(
          this.estimateCharges.get('workDescription').value
        );
        const workDesc = this.workscopeDesc.find(
          (v: any) => v.workscopeDescMasterId == workDesVal
        );
        const alreadyExist = ewt.find(
          (v) =>
            v.workType == typeOfWork &&
            v.workPart == this.estimateCharges.get('workPart').value &&
            v.workscopeDescription == workDesc.workscopeDescription
        );
        if (alreadyExist) {
          this.snackbar.open('Scope of Work Already Exists.', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
          this.alreadyExistScopeOfWork = true;
        } else {
          this.alreadyExistScopeOfWork = false;
        }
      }
    } else if (!initial) {
      this.snackbar.open('Please select Type of Work.', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.alreadyExistScopeOfWork = true;
    }
  }
  resetWorkParts() {
    this.workPart = [];
    this.addInitialParts();
  }
  addInitialParts() {
    this.workPart = [
      'Part A',
      'Part B',
      'Part C',
      'Part D',
      'Part E',
      'Part F',
    ];
  }

  onChangeWorkPart(workPart: string) {
    if (workPart) {
      if (
        this.estimateCharges.get('workDescription').value &&
        this.estimateCharges.get('typeOfWork').value
      ) {
        const ewt: any[] = [
          ...this.regularFilterExecutionWorkTable,
          ...this.creditFilterExecutionWorkTable,
        ];
        const workDesVal = Number(
          this.estimateCharges.get('workDescription').value
        );
        if (this.workscopeDesc.length) {
          const workDesc = this.workscopeDesc.find(
            (v: any) => v.workscopeDescMasterId == workDesVal
          );
          const exists = ewt.find(
            (v) =>
              v.workType == this.estimateCharges.get('typeOfWork').value &&
              v.workPart == workPart &&
              v.workscopeDescription == workDesc.workscopeDescription
          );
          if (exists) {
            this.snackbar.open('Scope of Work Already Exists.', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            });
            this.alreadyExistScopeOfWork = true;
          } else {
            this.alreadyExistScopeOfWork = false;
          }
        }
      }
      this.addNextPart();
    } else {
      this.snackbar.open('Please select Work Part.', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.alreadyExistScopeOfWork = true;
    }
  }
  nextPartCharCode = 'F'.charCodeAt(0);
  addNextPart() {
    const nextPart = `Part ${String.fromCharCode(++this.nextPartCharCode)}`;
    if (!this.workPart.includes(nextPart)) {
      this.workPart.push(nextPart);
    }
  }
  get basicRate(): number {
    const labourCost = Number(this.estimationLabourCost);
    const materialCost = Number(this.estimationMaterialCost);

    if (this.serviceData?.applicationTypeCode == 'PD') {
      const validLabourCost = isNaN(labourCost) ? 0 : labourCost;
      const validMaterialCost = isNaN(materialCost) ? 0 : materialCost;
      const sum = validLabourCost + validMaterialCost;

      return Number(sum.toFixed(2));
    } else {
      const validLabourCost = isNaN(labourCost) ? 0 : labourCost;
      const validMaterialCost = isNaN(materialCost) ? 0 : materialCost;
      const sum = validLabourCost + validMaterialCost;

      return Number(sum.toFixed(2));
    }
  }

  calculateAmount(chargesPercentage: number, basicRate: number): number {
    return (basicRate * chargesPercentage) / 100;
  }

  onChange(addCharge: any, chargesCategory: string) {
    const selectedCharge = this.areaSpecificLoadingCharges.find(
      (charge) => charge.chargesCategory === chargesCategory
    );

    if (selectedCharge) {
      addCharge.chargeTypeValue = selectedCharge.chargesPercentage;
      addCharge.areaSpecificLoadingChargesMasterId =
        selectedCharge.areaSpecificLoadingChargesMasterId;
      addCharge.showPercentage = true;
      addCharge.showAmountInput = true;
      const basicRate = this.basicRate;
      const calculatedAmount = this.calculateAmount(
        selectedCharge.chargesPercentage,
        basicRate
      );
      addCharge.amount = calculatedAmount.toFixed(2);

      const existingChargeIndex = this.addChargesBeforeTotalLabour.findIndex(
        (charge) => charge.chargesCategory === addCharge.chargesCategory
      );

      if (existingChargeIndex !== -1) {
        this.addChargesBeforeTotalLabour[existingChargeIndex] = addCharge;
      } else {
        this.addChargesBeforeTotalLabour.push(addCharge);
      }

      const gstChargeIndex = this.addChargesBeforeTotalLabour.findIndex(
        (charge) => charge.additionalChargeName === 'GST'
      );

      let afterTotalLabour: number = 0;
      if (this.additionalCharges && this.additionalCharges.length) {
        let aLabour1: any[] = [];

        if (this.isEditCase) {
          aLabour1 = this.additionalCharges.filter(
            (v: any) => Number(v.chargesSequenceOrder) >= 5
          );
        } else {
          aLabour1 = this.additionalCharges.filter(
            (v: any) =>
              Number(v.chargesSequenceOrder) >= 5 && v.displayByDefault == '1'
          );
        }

        if (aLabour1.length) {
          const aLabour2 = aLabour1.map((v: any) => Number(v.amount));
          afterTotalLabour = aLabour2.reduce(
            (a: number, b: number) => a + b,
            0
          );
        }
      }

      if (gstChargeIndex !== -1) {
        const gstCharge = this.addChargesBeforeTotalLabour[gstChargeIndex];
        const totalAmountIncludingCharge =
          basicRate + parseFloat(addCharge.amount);
        const gstAmount = (
          (totalAmountIncludingCharge * gstCharge.chargeTypeValue) /
          100
        ).toFixed(2);
        gstCharge.amount = gstAmount;
        gstCharge.showAmountInput = true;
        this.addChargesBeforeTotalLabour[gstChargeIndex] = gstCharge;

        const selectedChargeAmount = parseFloat(addCharge.amount);
        this.totalEstimateCost = (
          basicRate +
          selectedChargeAmount +
          parseFloat(gstCharge.amount)
        ).toFixed(2);

        const totalEstimateCostNum = parseFloat(this.totalEstimateCost);
        this.totalEstimationCostInRs = totalEstimateCostNum + afterTotalLabour;
      } else {
        const selectedChargeAmount = parseFloat(addCharge.amount);
        this.totalEstimateCost = (basicRate + selectedChargeAmount).toFixed(3);

        const totalEstimateCostNum = parseFloat(this.totalEstimateCost);
        this.totalEstimationCostInRs = totalEstimateCostNum + afterTotalLabour;
      }

      const chargeData = [
        addCharge.areaSpecificLoadingChargesMasterId,
        this.totalEstimateCost,
        addCharge.amount,
        this.totalEstimationCostInRs,
      ];
    }
    this.calculateGovernmentWorksAmount();
  }
  calculateGovernmentWorksAmount(): void {
    if (this.estimateCharges.get('workCategory').value == 6) {
      let amount: number;

      if (this.isGovernmentWorks) {
        amount = this.totalEstimationCostInRs * 1.05;
      } else {
        amount = this.totalEstimationCostInRs * 1.1;
      }
      const decimalPart = amount % 1;
      if (decimalPart >= 0.5) {
        this.governmentWorksAmount = Math.round(amount);
      } else {
        this.governmentWorksAmount = Math.floor(amount) + 0.5;
      }
    }
  }

  formatAmount(amount: any): string {
    if (typeof amount == 'number' && !isNaN(amount)) {
      return amount.toFixed(3);
    }
    return '0';
  }

  calculateTotalOtherCharges(): number {
    const otherCharges = this.additionalCharges.filter(
      (charge) =>
        charge.additionalChargeName === 'Area Specific Loading on Basic Rates'
    );
    return otherCharges.reduce(
      (total, charge) => total + parseFloat(charge.amount),
      0
    );
  }
  async onChangeWorkDescription(workDescriptionId: string) {
    this.selectedWorkscopeDescriptionId = workDescriptionId;
    const selectedWorkDescription = this.workscopeDesc.find(
      (v: any) => v.workscopeDescMasterId == Number(workDescriptionId)
    );
    const workDescriptionName = selectedWorkDescription?.workscopeDescription;
    const selectedEstimateType = this.estimateCharges.get('estimateType').value;

    const materialRadio: HTMLInputElement = document.getElementById(
      'materialRadio'
    ) as HTMLInputElement;
    const labourRadio: HTMLInputElement = document.getElementById(
      'labourRadio'
    ) as HTMLInputElement;

    if (workDescriptionName) {
      if (
        selectedEstimateType == 'CRD' &&
        workDescriptionName == 'Release Labour'
      ) {
        if (labourRadio) {
          labourRadio.checked = true;
          const event = new Event('change', { bubbles: true });
          labourRadio.dispatchEvent(event);
          labourRadio.disabled = false;
          await this.onChangeMaterials();
        }
        if (materialRadio) {
          materialRadio.disabled = true;
        }
      } else {
        if (materialRadio) {
          materialRadio.checked = true;
          //labourRadio.disabled = true;
          const event = new Event('change', { bubbles: true });
          materialRadio.dispatchEvent(event);
          materialRadio.disabled = false;
          await this.onChangeMaterials();
        }
      }
      if (
        this.estimateCharges.get('workPart').value &&
        this.estimateCharges.get('typeOfWork').value
      ) {
        const ewt: any[] = [
          ...this.regularFilterExecutionWorkTable,
          ...this.creditFilterExecutionWorkTable,
        ];
        const workDesVal = Number(workDescriptionId);
        const workDesc = this.workscopeDesc.find(
          (v: any) => v.workscopeDescMasterId == workDesVal
        );
        const exists = ewt.find(
          (v) =>
            v.workType == this.estimateCharges.get('typeOfWork').value &&
            v.workPart == this.estimateCharges.get('workPart').value &&
            v.workscopeDescription == workDesc.workscopeDescription
        );
        if (exists) {
          this.snackbar.open('Scope of Work Already Exists.', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
          this.alreadyExistScopeOfWork = true;
        } else {
          this.alreadyExistScopeOfWork = false;
        }
      }
    } else {
      this.snackbar.open('Please select Work Description.', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.alreadyExistScopeOfWork = true;
    }
  }

  async onChangeMaterialType() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    if (this.estimateCharges.get('materialType').value == '26') {
      const labourFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        materialTypeMasterId: this.estimateCharges.get('materialType').value,
        mlType: 'LABOR',
        rateType: this.estimateCharges.get('rateType').value,
      };
      this.labourList = [];
      const ml = await this.estimateService.getMaterialLabourMasterData(
        labourFilter
      );
      this.materialList = ml.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
    } else {
      const materialFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        materialTypeMasterId: this.estimateCharges.get('materialType').value,
        mlType: 'MATERIAL',
        rateType: this.estimateCharges.get('rateType').value,
      };
      const ml = await this.estimateService.getMaterialLabourMasterData(
        materialFilter
      );
      this.materialList = ml.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
      const labourFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        materialTypeMasterId: this.estimateCharges.get('materialType').value,
        mlType: 'LABOR',
        rateType: this.estimateCharges.get('rateType').value,
      };
      const ll = await this.estimateService.getMaterialLabourMasterData(
        labourFilter
      );
      this.labourList = ll.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
    }
  }

  async onChangeWorkCategory(workCategoryMasterId: any) {
    if (workCategoryMasterId == 1) {
      this.estimateCharges.get('workExecutionMethod').enable();
      this.estimateCharges.get('rateType').setValue('');

      const isNetworkExtension =
        this.estimateDetailData.serviceRegistration.isNetworkExtension;

      if (isNetworkExtension == 0) {
        this.workExecution = [];
        const departmentExecution = this.allWorkExecutionData.find(
          (v: any) => v.woExecutionMethodName == 'Department'
        );
        if (departmentExecution) {
          this.workExecution.push(departmentExecution);
        }
        const selfExecution = this.allWorkExecutionData.find(
          (v: any) => v.woExecutionMethodName == 'Self Execution'
        );
        if (selfExecution) {
          this.workExecution.push(selfExecution);
        }
      } else if (isNetworkExtension == 1) {
        this.workExecution = this.allWorkExecutionData.filter(
          (v: any) =>
            v.woExecutionMethodName !== 'Self Execution' &&
            v.woExecutionMethodName !== 'Department'
        );

        const departmentExecution = this.allWorkExecutionData.find(
          (v: any) => v.woExecutionMethodName == 'Department'
        );
        if (departmentExecution) {
          this.workExecution.push(departmentExecution);
        }
      }
      this.estimateCharges.get('workExecutionMethod').setValue('');
    } else if (workCategoryMasterId == 2) {
      const selfExecution = this.allWorkExecutionData.find(
        (v: any) => v.woExecutionMethodName == 'Self Execution'
      );

      this.workExecution = [];
      if (selfExecution) {
        this.workExecution.push(selfExecution);
      }
      this.estimateCharges.get('workExecutionMethod').disable();
      if (selfExecution) {
        this.estimateCharges
          .get('workExecutionMethod')
          .setValue(selfExecution.woExecutionMethodId);
        await this.onChangeWorkExecution(selfExecution.woExecutionMethodId);
      }
    } else if (workCategoryMasterId == 5) {
      const departmentExecution = this.allWorkExecutionData.filter(
        (v: any) =>
          v.woExecutionMethodName === 'Department' ||
          v.woExecutionMethodName === 'Self Execution'
      );
      this.workExecution = departmentExecution;

      this.estimateCharges.get('workExecutionMethod').enable();
      this.estimateCharges.get('workExecutionMethod').setValue('');
    } else if (workCategoryMasterId == 6) {
      // this.workExecution = this.allWorkExecutionData;
      const isNetworkExtension =
        this.estimateDetailData.serviceRegistration.isNetworkExtension;
      const connectionCode =
        this.estimateDetailData.serviceRegistration.connectionCode;
      const totalCload = this.serviceData?.totalContractedLoad >= 35;
      const totalBuildUpArea = this.serviceData?.buildupAreaSize >= 800;
      if (
        (connectionCode === 'MC-MSB' || connectionCode === 'SC-MSB') &&
        isNetworkExtension == 1 &&
        (totalCload || totalBuildUpArea)
      ) {
        this.workExecution = this.allWorkExecutionData.filter(
          (v: any) =>
            v.woExecutionMethodName !== 'Self Execution' &&
            v.woExecutionMethodName !== 'Total Turnkey' &&
            v.woExecutionMethodName !== 'Partial Turnkey'
        );
        this.estimateCharges.get('workExecutionMethod').enable();
        this.estimateCharges.get('workExecutionMethod').setValue('');
      } else {
      this.workExecution = this.allWorkExecutionData.filter(
        (v: any) => v.woExecutionMethodName !== 'Self Execution'
      );
      this.estimateCharges.get('workExecutionMethod').enable();
      this.estimateCharges.get('workExecutionMethod').setValue('');
      }
    } else {
      this.estimateCharges.get('workExecutionMethod').setValue('');
      this.estimateCharges.get('workExecutionMethod').enable();
      this.estimateCharges.get('rateType').setValue('');
    }
  }

  async onChangeWorkExecution(woExecutionMethodId: any) {
    const previousWorkExecutionMethodId = this.defaultWorkExecutionMethodId;
    const isInstallBefore2005 =
      this.estimateDetailData.serviceRegistration.isInstallBefore2005;
    const applicationTypeCode =
      this.estimateDetailData.serviceRegistration.applicationTypeCode;
    if (!this.defaultWorkExecutionMethodId) {
      this.defaultWorkExecutionMethodId = woExecutionMethodId;
    }

    if (woExecutionMethodId !== this.defaultWorkExecutionMethodId) {
      this.editResetValue();
      this.resetWorkParts();
    }
    const isSpecialLECase =
      isInstallBefore2005 == '1' &&
      applicationTypeCode == 'LE' &&
      (Number(this.serviceData?.totalContractedLoad) >= 25 ||
        Number(this.serviceData?.buildupAreaSize) >= 500) &&
      (this.serviceData?.connectionCode === 'SC-MSB' ||
        this.serviceData?.connectionTypeCode === 'SC-MSB');

    if (isSpecialLECase) {
      this.workExecution = this.workExecution.filter(
        (execution: any) => execution.woExecutionMethodName !== 'Self Execution'
      );

      this.estimateCharges.get('rateType').setValue('SR');
      this.estimateCharges.get('rateType').disable();
      this.estimateCharges.get('workExecutionMethod')?.enable();
      return;
    }
    if (
      this.isEditCase &&
      woExecutionMethodId !== this.defaultWorkExecutionMethodId
    ) {
      const dialogRef = this.dialog.open(PopUpComponent, {
        data: { action: 'execution_edit' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.defaultWorkExecutionMethodId = woExecutionMethodId;
          this.editResetValue();
          this.resetWorkParts();
          if (woExecutionMethodId == 1 || woExecutionMethodId == 6) {
            this.estimateCharges.get('rateType').setValue('SR');
            this.showVendor = false;
          } else if (woExecutionMethodId == 2) {
            this.estimateCharges.get('rateType').setValue('NDS');
            this.showVendor = false;
          } else {
            this.estimateCharges.get('rateType').setValue('RC');
            this.showVendor = true;
          }
          this.estimateCharges.get('vendor').setValue('');
          this.editResetValue();
          this.resetWorkParts();
        } else {
          this.estimateCharges
            .get('workExecutionMethod')
            .setValue(previousWorkExecutionMethodId);
          console.log('User canceled the change.');
        }
      });
    } else {
      if (woExecutionMethodId == 1 || woExecutionMethodId == 6) {
        this.estimateCharges.get('rateType').setValue('SR');
        this.showVendor = false;
      } else if (woExecutionMethodId == 2) {
        this.estimateCharges.get('rateType').setValue('NDS');
        this.showVendor = false;
      } else {
        this.estimateCharges.get('rateType').setValue('RC');
        this.showVendor = true;
      }
    }
    const workCategoryControl = this.estimateCharges.get('workCategory')?.value;
    if (
      workCategoryControl == '6' &&
      this.serviceData?.isNetworkExtension == '1' &&
      (Number(this.serviceData?.totalContractedLoad) >= 35 ||
        Number(this.serviceData?.buildupAreaSize) >= 800) &&
      (['MC-MSB', 'SC-MSB'].includes(this.serviceData?.connectionCode) ||
        ['MC-MSB', 'SC-MSB'].includes(this.serviceData?.connectionTypeCode))
    ) {
    } else if (workCategoryControl == '6') {
    } else if (
      !this.workExecution.some(
        (execution: any) => execution.woExecutionMethodName === 'Self Execution'
      )
    ) {
      this.workExecution.push({
        woExecutionMethodId: 2,
        woExecutionMethodName: 'Self Execution',
      });
    }
    if (woExecutionMethodId) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      const additionalChargesFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        woExecutionMethodId,
      };
      const additionCharge =
        await this.estimateService.getAdditionalChargesMasterData(
          additionalChargesFilter
        );

      const addedAmount = additionCharge.map((v: any) => {
        return { ...v, amount: 0 };
      });

      const addCharges = addedAmount.sort(
        (a: any, b: any) =>
          Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder)
      );
      this.additionalCharges = addCharges;
      this.additionalChargesSel = this.additionalCharges.filter(
        (v: any) => v.displayFlag == 1
      );
      this.addChargesBeforeTotalLabour = this.additionalCharges.filter(
        (v: any) =>
          Number(v.chargesSequenceOrder) < 5 && v.displayByDefault == 1
      );
      this.addChargesAfterTotalLabour = this.additionalCharges.filter(
        (v: any) =>
          Number(v.chargesSequenceOrder) >= 5 && v.displayByDefault == 1
      );
      this.estimateCharges.get('vendor').setValue('');
      this.estimateCharges.get('rateType').disable();
      this.onChangeMaterials();
    } else {
      this.estimateCharges.get('rateType').setValue('');
    }

    const rateType = this.estimateCharges.get('rateType').value;
    const id = parseInt(woExecutionMethodId, 10);

    function findWoExecutionMethodName(
      woExecutionMethodId: number,
      workExecution: any[]
    ) {
      for (const executionMethod of workExecution) {
        if (executionMethod.woExecutionMethodId === woExecutionMethodId) {
          return executionMethod.woExecutionMethodName;
        }
      }
      return null;
    }

    const woExecutionMethodCode = findWoExecutionMethodName(
      id,
      this.workExecution
    );
    console.log(woExecutionMethodCode);
    this.selectedWoExecutionMethodName = woExecutionMethodCode;
  }

  editResetValue() {
    this.addChargesBeforeTotalLabour.forEach((charge) => {
      if (charge.additionalChargeName !== 'GST') {
        charge.chargesCategory = '';
      }
      charge.showAmountInput = false;
      charge.amount = 0;
      this.selectedCategory = '';
    });

    this.addChargesAfterTotalLabour.forEach((charge) => {
      charge.amount = 0;
    });

    this.totalEstimateCost = 0;
    this.totalEstimationCostInRs = 0;
    this.totalMaterialsAmountEscom = 0;
    this.totalMaterialsAmountAgency = 0;
    this.estimationMaterialCost = 0;
    this.estimationLabourCost = 0;
    this.regularFilterExecutionWorkTable = [];
    this.creditFilterExecutionWorkTable = [];
  }
  onWorkExecutionChange(executionType: string, executionWork: any) {
    const materialRadio: HTMLInputElement = document.getElementById(
      'materialRadio'
    ) as HTMLInputElement;
    const labourRadio: HTMLInputElement = document.getElementById(
      'labourRadio'
    ) as HTMLInputElement;

    let workDescriptionName: string | undefined;
    let workType: string | undefined;

    workDescriptionName = executionWork.workscopeDescription;
    workType = executionWork.estimateTypeCode;

    if (workDescriptionName && workType) {
      if (workType == 'CRD' && workDescriptionName == 'Release Labour') {
        if (labourRadio) {
          labourRadio.checked = true;
          labourRadio.disabled = false;

          const event = new Event('change', { bubbles: true });
          labourRadio.dispatchEvent(event);
        }
        if (materialRadio) {
          materialRadio.disabled = true;
        }
        const labourData: any[] = [];
        let labourRate: number = 0;

        const material = this.dataSource.find(
          (v: any) =>
            v.mlCode == this.materialMasterObj.mlCode &&
            v.rateType == this.materialMasterObj.rateType
        );

        if (material) {
          if (material.mlType == 'LABOR') {
            labourRate = material.mlRate;
          } else {
            const materialsLabourMasterId = material.materialsLabourMasterId;
            const laborId = this.estimateCharges.get('labourList').value;
            if (laborId.length) {
              laborId.forEach((id: any) => {
                const labour = this.labourList.find(
                  (v: any) => v.materialsLabourMasterId == id
                );
                if (labour) {
                  labour.mlmid = materialsLabourMasterId;
                  labourData.push(labour);
                }
              });

              if (labourData.length) {
                const mappedLabourData = labourData.map((v: any) => v.mlRate);
                if (mappedLabourData.length) {
                  labourRate = mappedLabourData.reduce((a: any, b: any) => {
                    return a + b;
                  });
                }
              }
            }
          }

          this.creditFilterExecutionWorkTable[0].materialItems.push({
            laborData: labourData,
            itemUnit: material.mlUnit,
            itemCode: material.mlCode,
            itemName: material.mlName,
            rateType: material.rateType,
            materialRate: 0,
            labourRate,
            materialTypeMasterId: material.materialsLabourMasterId,
            materialsLabourMasterId: material.materialsLabourMasterId,
          });
        }
      } else {
        if (materialRadio) {
          materialRadio.checked = true;
          materialRadio.disabled = false;
          const event = new Event('change', { bubbles: true });
          materialRadio.dispatchEvent(event);
        }
        if (labourRadio) {
          labourRadio.disabled = false;
        }
      }
    }
  }

  areAllFieldsFilled(): boolean {
    return (
      this.estimateCharges.get('estimationWorkDescription').value &&
      this.estimateCharges.get('workCategory').value &&
      this.estimateCharges.get('workExecutionMethod').value &&
      this.estimateCharges.get('rateType').value
    );
  }
  selectTemplates() {
    if (this.areAllFieldsFilled()) {
      this.getTemplate();
    } else {
      this.isTemplateButton = false;
    }
  }
  async onChangeMaterials() {
    const vendor = this.estimateCharges.get('vendor').value;

    if (this.showVendor && !vendor) {
      this.snackbar.open('Please select a vendor', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }
    const workExecutionMethod = this.estimateCharges.get(
      'workExecutionMethod'
    ).value;

    this.estimateCharges.get('materialUnitControl').setValue('');
    this.estimateCharges.get('labourUnitControl').setValue('');
    this.estimateCharges.get('labourList').setValue('');

    const registeredSource =
      this.estimateDetailData.serviceRegistration.registeredSource;
    const isNetworkExtension =
      this.estimateDetailData.serviceRegistration.isNetworkExtension;
    const smartMeterConnFlag =
      this.estimateDetailData.serviceRegistration.smartMeterConnFlag;

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');

    const mlType = this.estimateCharges.get('materialOrLabour').value;
    const rateType = this.estimateCharges.get('rateType').value;

    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      mlType,
    };

    const turnkeyFilter: any = {
      ...filter,
      rateContractMasterId: vendor,
    };
    const undExWorkValue = this.estimateCharges.get('undExWork')?.value;
    const estimateTypeValue = this.estimateCharges.get('estimateType')?.value;
    const selectedWorkDescription =
      this.estimateCharges.get('workDescription').value;
    const workDescriptionName =
      selectedWorkDescription?.workscopeDescription || '';

    if (undExWorkValue && undExWorkValue.includes('CRD')) {
      this.dataSource = await this.configurationService.getDataByMlTypeCredit(
        filter
      );
    }
    const hasValidReleaseKeyword = [
      'Release Scrap',
      'Release Labour',
      'Release Good',
    ].some((keyword) => workDescriptionName.includes(keyword));

    if (
      estimateTypeValue === 'CRD' &&
      (undExWorkValue?.includes('CRD') || hasValidReleaseKeyword)
    ) {
      if (mlType === 'MATERIAL' || mlType === 'LABOUR') {
        this.dataSource = await this.configurationService.getDataByMlTypeCredit(
          filter
        );
      }
    } else if (
      workExecutionMethod == 6 &&
      smartMeterConnFlag == 1 &&
      isNetworkExtension == 0 &&
      mlType === 'MATERIAL'
    ) {
      this.dataSource =
        await this.configurationService.getDataByMlTypeForSmartMeter(filter);
    } else if (
      workExecutionMethod == 5 &&
      smartMeterConnFlag == 1 &&
      isNetworkExtension == 0 &&
      mlType === 'MATERIAL'
    ) {
      this.dataSource =
        await this.configurationService.getDataByMlTypeAndVendorIdForTotalTurnkeySmartMeterCase(
          turnkeyFilter
        );
    } else if (
      workExecutionMethod == 4 &&
      smartMeterConnFlag == 1 &&
      isNetworkExtension == 0 &&
      mlType === 'MATERIAL'
    ) {
      this.dataSource =
        await this.configurationService.getDataByMlTypeAndVendorIdForPartialTurnkeySmartMeterCase(
          turnkeyFilter
        );
    } else if (
      workExecutionMethod == 4 &&
      vendor &&
      estimateTypeValue !== 'CRD'
    ) {
      this.dataSource =
        await this.configurationService.getDataByMlTypeAndVendorIdForPartialTurnkey(
          turnkeyFilter
        );
    } else if (
      workExecutionMethod == 5 &&
      vendor &&
      estimateTypeValue !== 'CRD'
    ) {
      this.dataSource =
        await this.configurationService.getDataByMlTypeAndVendorIdForTotalTurnkey(
          turnkeyFilter
        );
    } else if (
      (workExecutionMethod == 4 || workExecutionMethod == 5) &&
      !vendor
    ) {
      this.snackbar.open('Please select vendor', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.dataSource = [];
    } else if (
      rateType === 'NDS' &&
      workExecutionMethod == 2 &&
      smartMeterConnFlag == 1 &&
      registeredSource === 'CSC' &&
      mlType === 'MATERIAL'
    ) {
      const additionalFilter: any = { ...filter };
      this.dataSource =
        await this.configurationService.getDataByNdsRateTypeForSmartMeter(
          additionalFilter
        );
    } else if (
      rateType === 'NDS' &&
      workExecutionMethod == 2 &&
      smartMeterConnFlag == 1 &&
      isNetworkExtension == 0 &&
      mlType === 'MATERIAL'
      ) {
      const additionalFilter: any = { ...filter };
      this.dataSource =
        await this.configurationService.getDataByNdsRateTypeForSmartMeter(
          additionalFilter
        );
    } else if (workExecutionMethod == 1 && mlType === 'LABOR') {
        const additionalFilter: any = { ...filter, rateType: 'NDS' };
        this.dataSource =
          await this.configurationService.getAdditionalDataByRateType(
            additionalFilter
          );
      } else if (rateType === 'NDS' && workExecutionMethod == 2) {
        const additionalFilter: any = { ...filter };
        this.dataSource =
          await this.configurationService.getAdditionalDataByRateType(
            additionalFilter
          );
      } else {
        this.dataSource =
          await this.configurationService.getmaterialLabourMasterGetDataMlType(
            filter
          );
      }

    this.allMaterials = this.dataSource.map(
      (v: any) => `${v.rateType}-${v.mlCode}-${v.mlName}`
    );

    this.estimateCharges.get('materialUnitControl').setValue('');
      this.filteredMaterialUnits = this.estimateCharges
        .get('materialUnitControl')
        .valueChanges.pipe(
          startWith(''),
          map((value) => this._filterMaterialUnits(value))
        );
    }

  openviewDialog(data: any) {
    this.dialog.open(ViewPopUpComponent, {
      data,
      width: '100%',
    });
  }

  deleteMaterialItem(i: number, id: number, code: string) {
    let executionWork;

    if (code == 'RGL') {
      executionWork = this.regularFilterExecutionWorkTable[i];
      executionWork.materialItems.splice(id, 1);
    } else if (code == 'CRD') {
      executionWork = this.creditFilterExecutionWorkTable[i];
      const removedItem = executionWork.materialItems[id];
      executionWork.materialItems.splice(id, 1);

      if (
        removedItem &&
        removedItem.workscopeDescription === 'Release Labour'
      ) {
        executionWork.labourCost -= removedItem.laboursAmount;
        executionWork.materialItems.forEach((item: any) => {
          item.laboursAmount = 0;
        });
      }
    }

    if (executionWork && executionWork.materialItems.length === 0) {
      executionWork.materialCost = 0;
      executionWork.labourCost = 0;
    }

    this.recalculateWorkEntry(i, code);
    this.recalculateAll();
  }
  private recalculateWorkEntry(i: number, code: string) {
    let executionWork;
    if (code == 'RGL') {
      executionWork = this.regularFilterExecutionWorkTable[i];
    } else if (code == 'CRD') {
      executionWork = this.creditFilterExecutionWorkTable[i];
    }
    if (executionWork) {
      executionWork.materialItems.forEach((item: any, idx: number) => {
        this.onQuantityChange(item.quantity, i, idx, executionWork, item);
      });
    }
  }
  removeExecutionWorkTable(
    index: number,
    estimateTypeCode: string,
    workPart: string
  ) {
    const tableToUpdate =
      estimateTypeCode === 'RGL'
        ? this.regularFilterExecutionWorkTable
        : this.creditFilterExecutionWorkTable;

    if (tableToUpdate[index]) {
      const removedEntry = tableToUpdate[index];
      tableToUpdate.splice(index, 1);
      console.log(`Removed: ${estimateTypeCode} - ${workPart}`);
      this.resetWorkTableParts(workPart);
      this.recalculateCosts(tableToUpdate, estimateTypeCode);

      setTimeout(() => {
        if (this.selectedCategory) {
          const selectedCharge = this.areaSpecificLoadingCharges.find(
            (charge) => charge.chargesCategory === this.selectedCategory
          );
          if (selectedCharge) {
            this.onChange(
              this.addChargesBeforeTotalLabour[0],
              this.selectedCategory
            );
          }
        }
      }, 0);
    } else {
      console.error(
        `Entry at index ${index} not found in ${estimateTypeCode} table.`
      );
    }
  }
  resetWorkTableParts(workPart: string) {
    if (!this.workPart.includes(workPart)) {
      this.workPart.push(workPart);
      this.workPart.sort();
    }
  }

  recalculateCosts(tableToUpdate: any[], estimateTypeCode: string) {
    let totalMaterialsAmount = 0;
    let totalLaborAmount = 0;

    for (const item of tableToUpdate) {
      totalMaterialsAmount += item.materialItems
        .map((v: any) => v.materialsAmount || 0)
        .reduce((a: any, b: any) => Number(a) + Number(b), 0);

      totalLaborAmount += item.materialItems
        .map((v: any) => v.laboursAmount || 0)
        .reduce((a: any, b: any) => Number(a) + Number(b), 0);
    }
    if (estimateTypeCode === 'CRD') {
      this.creditLabourCost = totalLaborAmount;
    }

    const regularMaterials = this.regularFilterExecutionWorkTable
      .map((v: any) => v.materialCost || 0)
      .reduce((a: any, b: any) => Number(a) + Number(b), 0);

    const regularLabour = this.regularFilterExecutionWorkTable
      .map((v: any) => v.labourCost || 0)
      .reduce((a: any, b: any) => Number(a) + Number(b), 0);

    this.estimationMaterialCost = Number(regularMaterials.toFixed(3)) || 0;
    this.estimationLabourCost =
      Number((regularLabour + this.creditLabourCost).toFixed(3)) || 0;

    this.totalEstimateCost = Number(
      (this.estimationMaterialCost + this.estimationLabourCost).toFixed(3)
    );
  }
  recalculateAll() {
    let allQuantitiesZero = true;

    this.regularFilterExecutionWorkTable.forEach(
      (executionWork: any, i: number) => {
        executionWork.materialItems.forEach((item: any, id: number) => {
          this.onQuantityChange(item.quantity, i, id, executionWork, item);

          if (item.quantity > 0) {
            allQuantitiesZero = false;
          }
        });
      }
    );

    this.creditFilterExecutionWorkTable.forEach(
      (executionWork: any, i: number) => {
        executionWork.materialItems.forEach((item: any, id: number) => {
          this.onQuantityChange(item.quantity, i, id, executionWork, item);
          if (item.quantity > 0) {
            allQuantitiesZero = false;
          }
        });
      }
    );

    if (allQuantitiesZero) {
      this.estimationMaterialCost = 0;
      this.estimationLabourCost = 0;
      this.totalEstimateCost = 0;
    } else {
      this.recalculateCosts(this.regularFilterExecutionWorkTable, 'RGL');
      this.recalculateCosts(this.creditFilterExecutionWorkTable, 'CRD');
    }
  }
  refreshing() {
    let mc: number = 0;
    let lc: number = 0;
    const m = this.regularFilterExecutionWorkTable.map(
      (v: any) => v.materialCost
    );
    if (m.length) {
      mc = m.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    const l = this.regularFilterExecutionWorkTable.map(
      (v: any) => v.labourCost
    );
    if (l.length) {
      lc = l.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    this.estimationMaterialCost = Number(mc);
    this.estimationLabourCost = Number(lc);
    //additional charges
    this.refreshAdditionalCharges();
  }

  getLaboursAmount(amount: any): number {
    return amount == null || isNaN(amount) ? 0 : amount;
  }
  getLabourCost(cost: any): number {
    return cost == null || isNaN(cost) ? 0 : cost;
  }

  addItemTable() {
    const ewt: any[] = [
      ...this.regularFilterExecutionWorkTable,
      this.creditFilterExecutionWorkTable,
    ];
    if (ewt.length) {
      this.showTable = false;
      const labourData: any[] = [];
      let labourRate: number = 0;

      const material = this.dataSource.find(
        (v: any) =>
          v.mlCode == this.materialMasterObj.mlCode &&
          v.rateType == this.materialMasterObj.rateType
      );

      if (material) {
        if (material.mlType == 'LABOR') {
          labourRate = material.mlRate;
        } else {
          const materialsLabourMasterId = material.materialsLabourMasterId;
          const laborId = this.estimateCharges.get('labourList').value;
          if (laborId.length) {
            laborId.forEach((id: any) => {
              const labour = this.labourList.find(
                (v: any) => v.materialsLabourMasterId == id
              );
              if (labour) {
                labour.mlmid = materialsLabourMasterId;
                labourData.push(labour);
              }
            });

            if (labourData.length) {
              const mappedLabourData = labourData.map((v: any) => v.mlRate);
              if (mappedLabourData.length) {
                labourRate = mappedLabourData.reduce((a: any, b: any) => {
                  return a + b;
                });
              }
            }
          }
          this.onChangeMaterials();
        }

        const undExWork = this.estimateCharges.get('undExWork').value as string;
        const selectedRadioButton = undExWork.split('-');

        // Handle "Regular" estimate type
        if (selectedRadioButton[1] == 'RGL') {
          const exists = this.regularFilterExecutionWorkTable[
            Number(selectedRadioButton[0])
          ].materialItems.find((v: any) => {
            return v.itemCode == material.mlCode;
          });

          if (exists) {
            this.snackbar.open(
              'Material Already Exists in Regular Estimation Type.',
              'OK',
              { verticalPosition: cordova !== undefined ? 'bottom' : 'top' }
            );
          } else {
            this.regularFilterExecutionWorkTable[
              Number(selectedRadioButton[0])
            ].materialItems.push({
              laborData: labourData,
              itemUnit: material.mlUnit,
              itemCode: material.mlCode,
              itemName: material.mlName,
              rateType: material.rateType,
              materialRate: material.mlType == 'LABOR' ? 0 : material.mlRate,
              materialTypeMasterId: material.materialsLabourMasterId,
              materialsLabourMasterId: material.materialsLabourMasterId,
              labourRate,
            });
          }
          this.onChangeMaterials();
        }
        // Handle "Credit" estimate type
        else if (selectedRadioButton[1] == 'CRD') {
          const exists = this.creditFilterExecutionWorkTable[
            Number(selectedRadioButton[0])
          ].materialItems.find((v: any) => {
            return v.itemCode == material.mlCode;
          });

          if (exists) {
            this.snackbar.open(
              'Material Already Exists in Credit Estimation Type ',
              'OK',
              { verticalPosition: cordova !== undefined ? 'bottom' : 'top' }
            );
          this.onChangeMaterials();
          } else {
            let selectedWorkDescription;
            if (!selectedWorkDescription) {
              const workTableEntry =
                this.creditFilterExecutionWorkTable[
                  Number(selectedRadioButton[0])
                ];

              selectedWorkDescription = {
                workscopeDescription: workTableEntry?.workscopeDescription,
              };
            }
            if (this.workscopeDesc && this.workscopeDesc.length > 0) {
              selectedWorkDescription = this.workscopeDesc.find(
                (v: any) =>
                  v.workscopeDescMasterId ==
                  Number(this.selectedWorkscopeDescriptionId)
              );
            }
            const workDescriptionName =
              selectedWorkDescription?.workscopeDescription;
            if (workDescriptionName == 'Release Scrap') {
              const materialAmount = material.mlRate;
              this.creditFilterExecutionWorkTable[
                Number(selectedRadioButton[0])
              ].materialItems.push({
                laborData: labourData,
                itemUnit: material.mlUnit,
                itemCode: material.mlCode,
                itemName: material.mlName,
                rateType: material.rateType,
                materialRate: materialAmount,
                labourRate: 0,
                materialTypeMasterId: material.materialsLabourMasterId,
                materialsLabourMasterId: material.materialsLabourMasterId,
              });
            } else if (workDescriptionName == 'Release Labour') {
              this.creditFilterExecutionWorkTable[
                Number(selectedRadioButton[0])
              ].materialItems.push({
                laborData: labourData,
                itemUnit: material.mlUnit,
                itemCode: material.mlCode,
                itemName: material.mlName,
                rateType: material.rateType,
                materialRate: 0,
                labourRate,
                materialTypeMasterId: material.materialsLabourMasterId,
                materialsLabourMasterId: material.materialsLabourMasterId,
              });
            } else {
              this.creditFilterExecutionWorkTable[
                Number(selectedRadioButton[0])
              ].materialItems.push({
                laborData: labourData,
                itemUnit: material.mlUnit,
                itemCode: material.mlCode,
                itemName: material.mlName,
                rateType: material.rateType,
                materialRate: 0,
                labourRate,
                materialTypeMasterId: material.materialsLabourMasterId,
                materialsLabourMasterId: material.materialsLabourMasterId,
              });
            }
          }
        } else {
          this.snackbar.open('Please select either Regular or Credit.', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
        }

        this.estimateCharges.get('materialType').setValue('');
        this.estimateCharges.get('materialUnitControl').setValue('');
        this.estimateCharges.get('labourUnitControl').setValue('');
        this.estimateCharges.get('labourList').setValue('');
        this.materialList = [];
        this.labourList = [];
        this.resetMaterialMasterObj();
      } else {
        this.snackbar.open('Please Select Material Item', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    } else {
      this.snackbar.open('Please Add Workscope First', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
  }

  async onQuantityChange(
    quantity: number,
    i: number,
    id: number,
    executionWork: any,
    tableItem: any
  ) {
    let mrt: number = 0;
    let lrt: number = 0;
    let isReleaseLabour = false;
    const estimateTypeCode = executionWork.estimateTypeCode;
    const workscopeDescription = executionWork.workscopeDescription;
    const rateType = tableItem.rateType;
    const labourRate = tableItem.labourRate;
    const materialRate = tableItem.materialRate;
    if (Number(quantity) > 0) {
      isReleaseLabour =
        workscopeDescription === 'Release Labour' && estimateTypeCode === 'CRD';

      if (isReleaseLabour) {
        lrt = quantity * labourRate;
        mrt = 0;
      } else if (
        estimateTypeCode === 'CRD' &&
        workscopeDescription === 'Release Scrap'
      ) {
        mrt = this.calculateReleaseScrapAmount(quantity, materialRate);
        tableItem.materialsAmount = mrt;
        lrt = 0;
      } else if (estimateTypeCode !== 'CRD') {
        mrt = quantity * materialRate;
        lrt = quantity * labourRate;
      }
    }
    if (rateType == 'SR') {
      this.totalMaterialsAmountEscom += mrt;
    } else if (rateType == 'RC' || rateType == 'NDS') {
      this.totalMaterialsAmountAgency += mrt;
    }
    if (
      estimateTypeCode === 'CRD' &&
      workscopeDescription !== 'Release Labour'
    ) {
      return;
    }
    const tableToUpdate =
      estimateTypeCode === 'RGL'
        ? this.regularFilterExecutionWorkTable
        : this.creditFilterExecutionWorkTable;

    if (tableToUpdate[i] && tableToUpdate[i].materialItems[id]) {
      tableToUpdate[i].materialItems[id].quantity = Number(quantity);
      tableToUpdate[i].materialItems[id].materialsAmount =
        estimateTypeCode === 'CRD' && isReleaseLabour
          ? 0
          : Number(mrt.toFixed(2)) || 0;
      tableToUpdate[i].materialItems[id].laboursAmount =
        Number(lrt.toFixed(2)) || 0;
    } else {
      console.error(`Material item at index ${id} not found`);
    }

    const totalMaterialsAmount = tableToUpdate[i].materialItems
      .map((v: any) => v.materialsAmount || 0)
      .reduce((a: any, b: any) => Number(a) + Number(b), 0);

    const totalLaborAmount = tableToUpdate[i].materialItems
      .map((v: any) => v.laboursAmount || 0)
      .reduce((a: any, b: any) => Number(a) + Number(b), 0);

    tableToUpdate[i].materialCost = totalMaterialsAmount;
    tableToUpdate[i].labourCost = totalLaborAmount;

    if (estimateTypeCode === 'CRD' && isReleaseLabour) {
      this.creditLabourCost = totalLaborAmount;
    }

    const regularMaterials = this.regularFilterExecutionWorkTable
      .map((v: any) => v.materialCost || 0)
      .reduce((a: any, b: any) => Number(a) + Number(b), 0);

    const regularLabour = this.regularFilterExecutionWorkTable
      .map((v: any) => v.labourCost || 0)
      .reduce((a: any, b: any) => Number(a) + Number(b), 0);

    const creditLabour = this.creditLabourCost;

    this.estimationMaterialCost = Number(regularMaterials.toFixed(2)) || 0;
    this.estimationLabourCost =
      Number((regularLabour + creditLabour).toFixed(2)) || 0;

    const totalMLCost =
      Number(
        (this.estimationMaterialCost + this.estimationLabourCost).toFixed(2)
      ) || 0;

    // Further calculations and additional charges
    let beforeTotalLabour = 0;
    let afterTotalLabour = 0;

    if (this.additionalCharges) {
      const beforeCharges = this.additionalCharges.filter(
        (v) => Number(v.chargesSequenceOrder) < 5 && v.displayByDefault === 1
      );
      const afterCharges = this.additionalCharges.filter(
        (v) => v.chargesSequenceOrder >= 5 && v.displayByDefault === 1
      );

      beforeTotalLabour = beforeCharges
        .map((v) => v.amount || 0)
        .reduce((a, b) => Number(a) + Number(b), 0);
      afterTotalLabour = afterCharges
        .map((v) => v.amount || 0)
        .reduce((a, b) => Number(a) + Number(b), 0);
    }

    this.totalEstimateCost = Number(
      (
        this.estimationMaterialCost +
        this.estimationLabourCost +
        beforeTotalLabour
      ).toFixed(3)
    );
    this.totalLabourChargesInRs = Number(
      (this.estimationLabourCost + beforeTotalLabour).toFixed(2)
    );
    this.totalEstimationCostInRs = Number(
      (
        this.estimationMaterialCost +
        this.totalLabourChargesInRs +
        afterTotalLabour
      ).toFixed(3)
    );

    setTimeout(() => {
      const selectedCategory = this.selectedCategory;
      if (selectedCategory) {
        const selectedCharge = this.areaSpecificLoadingCharges.find(
          (charge: any) => charge.chargesCategory === selectedCategory
        );
        if (selectedCharge) {
          this.onChange(this.addChargesBeforeTotalLabour[0], selectedCategory);
        }
      }
    }, 0);
    this.updateGSTAmount();
    this.calculateTotalEstimateCost();
    this.calculateGovernmentWorksAmount();
  }
  calculateReleaseScrapAmount(quantity: number, materialRate: number): number {
    return quantity * materialRate;
  }

  validateDecimalInput(event: KeyboardEvent): void {
    const inputChar = event.key;
    const inputElement = event.target as HTMLInputElement;

    // Allow navigation and deletion keys
    if (
      !/[0-9]/.test(inputChar) &&
      inputChar !== '.' &&
      inputChar !== 'Backspace' &&
      inputChar !== 'Delete' &&
      inputChar !== 'ArrowLeft' &&
      inputChar !== 'ArrowRight'
    ) {
      event.preventDefault();
      return;
    }

    // Prevent multiple decimals
    if (inputChar === '.' && inputElement.value.includes('.')) {
      event.preventDefault();
      return;
    }

    const [integerPart, decimalPart] = inputElement.value.split('.');

    // Limit integer part to 20 digits
    if (
      !inputElement.value.includes('.') &&
      integerPart.length >= 20 &&
      inputChar !== '.' &&
      inputChar !== 'Backspace' &&
      inputChar !== 'Delete'
    ) {
      event.preventDefault();
      return;
    }

    // Limit decimal part to 3 digits
    if (
      decimalPart &&
      decimalPart.length >= 3 &&
      inputChar !== 'Backspace' &&
      inputChar !== 'Delete'
    ) {
      event.preventDefault();
    }
  }
  sanitizeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.value) return;

    const sanitizedValue = inputElement.value.match(/^\d+(\.\d{0,3})?/);
    if (sanitizedValue) {
      inputElement.value = sanitizedValue[0];
    }
  }
  addExecutionWorkTable() {
    if (
      estimateCharges.get('estimateType').value &&
      estimateCharges.get('typeOfWork').value &&
      estimateCharges.get('workPart').value &&
      estimateCharges.get('workDescription').value
    ) {
      if (
        this.estimateCharges.get('workExecutionMethod').value &&
        this.estimateCharges.get('rateType').value
      ) {
        const workDesc = this.workscopeDesc.find(
          (v: any) =>
            v.workscopeDescMasterId ==
            this.estimateCharges.get('workDescription').value
        );
        const exists = this.regularFilterExecutionWorkTable.find(
          (v) =>
            v.workType == this.estimateCharges.get('typeOfWork').value &&
            v.workPart == this.estimateCharges.get('workPart').value &&
            v.workscopeDescription == workDesc.workscopeDescription
        );
        if (exists) {
          this.snackbar.open('Scope of Work Already Exists.', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
          this.alreadyExistScopeOfWork = true;
        } else {
          const workPartIndex = this.workPart.findIndex(
            (v) => v == estimateCharges.get('workPart').value
          );
          this.workPart.splice(workPartIndex, 1);
          this.alreadyExistScopeOfWork = false;
          if (this.estimateCharges.get('estimateType').value == 'RGL') {
            this.regularFilterExecutionWorkTable.push({
              estimateTypeCode: this.estimateCharges.get('estimateType').value,
              workType: this.estimateCharges.get('typeOfWork').value,
              workPart: this.estimateCharges.get('workPart').value,
              workscopeDescription: workDesc?.workscopeDescription,
              materialItems: [],
              materialCost: null,
              labourCost: null,
            });
            this.estimateCharges
              .get('undExWork')
              .setValue(
                `${this.regularFilterExecutionWorkTable.length - 1}-${
                  this.estimateCharges.get('estimateType').value
                }`
              );
          } else if (this.estimateCharges.get('estimateType').value == 'CRD') {
            if (
              this.regularFilterExecutionWorkTable.length ||
              this.processTypeName == 'DND'
            ) {
              this.creditFilterExecutionWorkTable.push({
                estimateTypeCode:
                  this.estimateCharges.get('estimateType').value,
                workType: this.estimateCharges.get('typeOfWork').value,
                workPart: this.estimateCharges.get('workPart').value,
                workscopeDescription: workDesc.workscopeDescription,
                materialItems: [],
                materialCost: null,
                labourCost: null,
              });
              this.estimateCharges
                .get('undExWork')
                .setValue(
                  `${this.creditFilterExecutionWorkTable.length - 1}-${
                    this.estimateCharges.get('estimateType').value
                  }`
                );
            } else {
              this.snackbar.open(
                'Please select Regular Estimate Type first',
                'OK',
                {
                  verticalPosition: cordova !== undefined ? 'bottom' : 'top',
                }
              );
            }
          }
          this.estimateCharges.get('typeOfWork').setValue('');
          this.estimateCharges.get('workPart').setValue('');
          this.estimateCharges.get('workDescription').setValue('');
          this.onChangeMaterials();
        }
      } else {
        this.snackbar.open('Please enter Estimates Charges details', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    } else {
      if (!estimateCharges.get('estimateType').value) {
        this.snackbar.open('Please select Estimate Type', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      } else if (!estimateCharges.get('typeOfWork').value) {
        this.snackbar.open('Please select Type of Work', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      } else if (!estimateCharges.get('workPart').value) {
        this.snackbar.open('Please select Work Part', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      } else if (!estimateCharges.get('workDescription').value) {
        this.snackbar.open('Please select Work Description', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    }
  }
  removeAdditionalChargesBeforeTotalLabour(
    estimationAdditionalChargesId: number
  ) {
    const chargeIndex = this.addChargesBeforeTotalLabour.findIndex(
      (v: any) =>
        v.estimationAdditionalChargesId === estimationAdditionalChargesId
    );

    if (chargeIndex !== -1) {
      const removedCharge = this.addChargesBeforeTotalLabour[chargeIndex];
      const isGST = removedCharge.additionalChargeName == 'GST';
      const isAreaSpecific =
        removedCharge.additionalChargeName ==
        'Area Specific Loading on Basic Rates';

      this.addChargesBeforeTotalLabour.splice(chargeIndex, 1);
      if (isGST || isAreaSpecific) {
        this.refreshAdditionalCharges();
      }
    }
  }

  refreshAdditionalCharges() {
    const totalMLCost = Number(
      (
        Number(this.estimationMaterialCost) + Number(this.estimationLabourCost)
      ).toFixed(2)
    );
    const chargesBeforeLabour = this.addChargesBeforeTotalLabour.filter(
      (v: any) =>
        v.valueCalculatedByLabour === 1 && v.valueCalculatedByMaterial === 0
    );
    chargesBeforeLabour.forEach((charge: any) => {
      charge.amount = Number(
        (
          (charge.chargeTypeValue * Number(this.estimationLabourCost)) /
          100
        ).toFixed(2)
      );
    });

    const chargesAfterLabour = this.addChargesAfterTotalLabour.filter(
      (v: any) =>
        v.valueCalculatedByLabour === 1 && v.valueCalculatedByMaterial === 0
    );
    chargesAfterLabour.forEach((charge: any) => {
      charge.amount = Number(
        (
          (charge.chargeTypeValue * Number(this.estimationLabourCost)) /
          100
        ).toFixed(2)
      );
    });

    const chargesBeforeBoth = this.addChargesBeforeTotalLabour.filter(
      (v: any) =>
        v.valueCalculatedByLabour === 1 && v.valueCalculatedByMaterial === 1
    );
    chargesBeforeBoth.forEach((charge: any) => {
      charge.amount = Number(
        ((charge.chargeTypeValue * totalMLCost) / 100).toFixed(2)
      );
    });

    const chargesAfterBoth = this.addChargesAfterTotalLabour.filter(
      (v: any) =>
        v.valueCalculatedByLabour === 1 && v.valueCalculatedByMaterial === 1
    );
    chargesAfterBoth.forEach((charge: any) => {
      charge.amount = Number(
        ((charge.chargeTypeValue * totalMLCost) / 100).toFixed(2)
      );
    });
    const beforeTotalLabour = this.addChargesBeforeTotalLabour.reduce(
      (sum: number, charge: any) =>
        sum + (charge.displayByDefault ? Number(charge.amount) : 0),
      0
    );

    const afterTotalLabour = this.addChargesAfterTotalLabour.reduce(
      (sum: number, charge: any) =>
        sum + (charge.displayByDefault ? Number(charge.amount) : 0),
      0
    );
    const labourCost = Number(this.estimationLabourCost) || 0;
    this.totalLabourChargesInRs = Number(
      (labourCost + beforeTotalLabour).toFixed(2)
    );

    const materialCost = Number(this.estimationMaterialCost) || 0;
    this.totalEstimateCost = Number(
      (materialCost + labourCost + beforeTotalLabour).toFixed(3)
    );

    const gstChargeIndex = this.addChargesBeforeTotalLabour.findIndex(
      (charge) => charge.additionalChargeName === 'GST'
    );

    if (gstChargeIndex !== -1) {
      const gstCharge = this.addChargesBeforeTotalLabour[gstChargeIndex];
      let gstAmount;
      const isAreaSpecificLoadingPresent =
        this.addChargesBeforeTotalLabour.some(
          (charge) =>
            charge.additionalChargeName ===
            'Area Specific Loading on Basic Rates'
        );

      if (isAreaSpecificLoadingPresent) {
        gstAmount = (
          (this.totalEstimateCost * gstCharge.chargeTypeValue) /
          100
        ).toFixed(3);
      } else {
        gstAmount = (
          (this.basicRate * gstCharge.chargeTypeValue) /
          100
        ).toFixed(3);
      }

      gstCharge.amount = gstAmount;
      gstCharge.showAmountInput = true;
      this.addChargesBeforeTotalLabour[gstChargeIndex] = gstCharge;
    }

    this.totalEstimationCostInRs = Number(
      (this.totalEstimateCost + afterTotalLabour).toFixed(3)
    );
  }
  removeAdditionalChargesAfterTotalLabour(
    estimationAdditionalChargesId: number
  ) {
    const chargeIndex = this.addChargesAfterTotalLabour.findIndex(
      (v: any) =>
        v.estimationAdditionalChargesId === estimationAdditionalChargesId
    );
    if (chargeIndex > -1) {
      const removedCharge = this.addChargesAfterTotalLabour[chargeIndex];
      this.addChargesAfterTotalLabour.splice(chargeIndex, 1);
      this.totalEstimationCostInRs = Number(
        (
          Number(this.totalEstimationCostInRs) - Number(removedCharge.amount)
        ).toFixed(3)
      );
    }
  }

  addAdditionalCharges() {
    const addChargeId = Number(
      this.addChargeForm.get('additionalCharges').value
    );
    let ac = this.isTemplate
      ? this.additionalChargesSel.find(
          (v) => Number(v.estimationAdditionalChargesId) === addChargeId
        )
      : this.additionalChargesSel.find(
          (v) => Number(v.additionalChargesMasterId) === addChargeId
        );

    if (
      this.addChargesBeforeTotalLabour.some(
        (v) =>
          Number(
            v.additionalChargesMasterId || v.estimationAdditionalChargesId
          ) === addChargeId
      ) ||
      this.addChargesAfterTotalLabour.some(
        (v) =>
          Number(
            v.additionalChargesMasterId || v.estimationAdditionalChargesId
          ) === addChargeId
      )
    ) {
      this.snackbar.open('Additional Charge already exists', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }

    if (Number(ac.chargesSequenceOrder) < 5) {
      this.addChargesBeforeTotalLabour.push(ac);
      this.addChargesBeforeTotalLabour.sort(
        (a, b) =>
          Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder)
      );
    } else {
      this.addChargesAfterTotalLabour.push(ac);
      this.addChargesAfterTotalLabour.sort(
        (a, b) =>
          Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder)
      );
      if (ac.additionalChargeName == 'Area Specific Loading on Basic Rates') {
        this.selectedCategory = '';
        ac.amount = '';
        ac.chargeTypeValue = '';
        ac.showAmountInput = false;
      }
    }
    if (ac.additionalChargeName == 'Area Specific Loading on Basic Rates') {
      this.selectedCategory = '';
      ac.amount = '';
      ac.chargeTypeValue = '';
      ac.showAmountInput = false;
    }

    this.updateGSTAmount();
    this.calculateTotalEstimateCost();
    this.calculateGovernmentWorksAmount();
  }

  updateGSTAmount() {
    const gstChargeIndex = this.addChargesBeforeTotalLabour.findIndex(
      (charge) => charge.additionalChargeName === 'GST'
    );
    const areaSpecificLoadingIndex = this.addChargesBeforeTotalLabour.findIndex(
      (charge) =>
        charge.additionalChargeName === 'Area Specific Loading on Basic Rates'
    );
    if (gstChargeIndex !== -1) {
      const gstCharge = this.addChargesBeforeTotalLabour[gstChargeIndex];
      let totalBasisForGST = this.basicRate;
      if (areaSpecificLoadingIndex !== -1) {
        const areaSpecificLoadingCharge =
          this.addChargesBeforeTotalLabour[areaSpecificLoadingIndex];
        totalBasisForGST += areaSpecificLoadingCharge.amount
          ? parseFloat(areaSpecificLoadingCharge.amount)
          : 0;
      }
      const gstAmount = (totalBasisForGST * gstCharge.chargeTypeValue) / 100;
      gstCharge.amount = gstAmount.toFixed(2);
      gstCharge.showAmountInput = true;
      this.addChargesBeforeTotalLabour[gstChargeIndex] = gstCharge;
    }
  }

  calculateTotalEstimateCost() {
    const formatAmount = (amount) => {
      return amount ? parseFloat(parseFloat(amount).toFixed(3)) : 0;
    };

    const totalBefore = this.addChargesBeforeTotalLabour.reduce(
      (total, charge) => {
        return total + formatAmount(charge.amount);
      },
      0
    );

    const totalAfter = this.addChargesAfterTotalLabour.reduce(
      (total, charge) => {
        return total + formatAmount(charge.amount);
      },
      0
    );

    this.totalEstimateCost = parseFloat(
      (this.basicRate + totalBefore).toFixed(3)
    );
    this.totalEstimationCostInRs = parseFloat(
      (parseFloat(this.totalEstimateCost) + parseFloat(totalAfter)).toFixed(3)
    );
  }

  onChangeAdditionalCharges() {
    const addChargeId = Number(
      this.addChargeForm.get('additionalCharges').value
    );
    const selectedCharge = this.additionalCharges.find(
      (charge) => charge.estimationAdditionalChargesId === addChargeId
    );
    if (selectedCharge) {
      if (
        this.addChargesBeforeTotalLabour.find(
          (v) => Number(v.estimationAdditionalChargesId) === addChargeId
        ) ||
        this.addChargesAfterTotalLabour.find(
          (v) => Number(v.estimationAdditionalChargesId) === addChargeId
        )
      ) {
        this.alreadyExistAdditionalCharge = true;
      } else {
        this.alreadyExistAdditionalCharge = false;
        this.calculateAmount(selectedCharge, this.basicRate);
      }
    }
  }
  onAdditionalChargeAmount($event: any, additionalChargesId: string) {
    let amount = $event.target?.value;
    if (amount) {
      amount = parseFloat(amount).toFixed(3);
    }
    const addCharge = this.additionalCharges.find(
      (v: any) => v.estimationAdditionalChargesId == additionalChargesId
    );
    addCharge.amount = Number(amount);
    let beforeTotalLabour: number = 0;
    let afterTotalLabour: number = 0;
    const bLabour1 = this.additionalCharges.filter(
      (v: any) =>
        Number(v.chargesSequenceOrder) < 5 && Number(v.displayByDefault) == 1
    );
    if (bLabour1.length) {
      const bLabour2 = bLabour1.map((v: any) => v.amount);
      beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    this.totalLabourChargesInRs =
      Number(this.estimationLabourCost) + Number(beforeTotalLabour);
    const aLabour1 = this.additionalCharges.filter(
      (v: any) => Number(v.chargesSequenceOrder) >= 5 && v.displayByDefault == 1
    );
    if (aLabour1.length) {
      const aLabour2 = aLabour1.map((v: any) => v.amount);
      afterTotalLabour = aLabour2.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    this.totalLabourChargesInRs = Number(
      (Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(2)
    );
    this.totalEstimationCostInRs = Number(
      (
        Number(this.estimationMaterialCost) +
        Number(this.totalLabourChargesInRs) +
        Number(afterTotalLabour)
      ).toFixed(2)
    );
    this.calculateGovernmentWorksAmount();
  }

  navigateToViewDocument() {
    const currentUrl = this.location.path();
    this.documentService.setPreviousUrl(currentUrl);
    const serviceRegistrationId = this.serviceData.serviceRegistrationId;
    this.documentService.setServiceRegistrationId(serviceRegistrationId);
    this.documentService.navigateToViewDocument('/main/document-upload');
  }
  viewInspection() {
    this.router.navigate(['/main/view-site-inspection'], {
      queryParams: {
        serviceRegistrationsId: this.serviceRegistrationsId,
        applicationStatusCode: this.applicationStatusCode,
        processTypeName: this.processTypeName,
      },
    });
  }
  resetValues() {
    this.addChargesBeforeTotalLabour.forEach((charge) => {
      if (charge.additionalChargeName !== 'GST') {
        charge.chargesCategory = '';
      }
      charge.showAmountInput = false;
      charge.amount = 0;
    });
    this.addChargesAfterTotalLabour.forEach((charge) => {
      charge.amount = 0;
    });
    this.totalEstimateCost = 0;
    this.totalEstimationCostInRs = 0;
  }
  checkMeterSelection() {
    const { isCtChangeReq, applicationTypeCode } =
      this.estimateDetailData.serviceRegistration;

    if (isCtChangeReq == 1) {
      return true;
    } else {
      let workscopeDescriptionId = this.selectedWorkscopeDescriptionId;
      if (
        !workscopeDescriptionId &&
        this.regularFilterExecutionWorkTable.length
      ) {
        const workscopeDescription =
          this.regularFilterExecutionWorkTable[0].workscopeDescription;

        const workDescMatch = this.meterWorkScopeDesc.find(
          (v) => v.workscopeDescription === workscopeDescription
        );

        if (workDescMatch) {
          workscopeDescriptionId = workDescMatch.workscopeDescMasterId;
        } else {
          this.showSnackbarAndReset('Workscope description not found.');
          return false;
        }
      }
      const workDesc = this.meterWorkScopeDesc.find(
        (v) => v.workscopeDescMasterId == workscopeDescriptionId
      );
      const { registeredSource, isNetworkExtension } =
        this.estimateDetailData.serviceRegistration;

      // Get meter material codes from meterMaterialsDataList
      const meterMlCodes = this.estimateDetailData.meterMaterialsDataList.map(
        (item) => item.mlCode
      );

      // Get all material codes from both regular and credit work tables
      const allMaterials = [
        ...this.regularFilterExecutionWorkTable.reduce(
          (acc, work) => acc.concat(work.materialItems),
          []
        ),
        ...this.creditFilterExecutionWorkTable.reduce(
          (acc, work) => acc.concat(work.materialItems),
          []
        ),
      ];
      const tableMlCodes = allMaterials.map((material) => material.itemCode);

      // Condition: Meter is mandatory for LE case
      if (applicationTypeCode == 'LE' || applicationTypeCode == 'LR') {
        const meterMaterialPresent = tableMlCodes.some((mlCode) =>
          meterMlCodes.includes(mlCode)
        );
        if (!meterMaterialPresent) {
          this.showSnackbarAndReset('Meter material is mandatory.');
          return false;
        }
      }

      // Condition 1: Service Main material is mandatory for NEW connection with Line Estimation
      if (
        registeredSource == 'NSC' &&
        isNetworkExtension == 1 &&
        applicationTypeCode !== 'LAYOUT' &&
        applicationTypeCode !== 'LE' &&
        applicationTypeCode !== 'LR' &&
        !this.isServiceMainMaterialPresent()
      ) {
        this.showSnackbarAndReset('Service Main material is mandatory.');
        return false;
      }

      // Condition 2: Both Meter & Service Main materials are mandatory for NEW connection without Line Estimation
      if (
        registeredSource == 'NSC' &&
        isNetworkExtension == 0 &&
        applicationTypeCode !== 'LAYOUT'
      ) {
        const meterMaterialPresent = this.isMeterMaterialPresent(
          meterMlCodes,
          tableMlCodes
        );
        const serviceMainMaterialPresent = this.isServiceMainMaterialPresent();

        if (!meterMaterialPresent && !serviceMainMaterialPresent) {
          this.showSnackbarAndReset(
            'Both Meter & Service Main materials are mandatory.'
          );
          return false;
        } else if (!meterMaterialPresent) {
          this.showSnackbarAndReset('Meter material is mandatory.');
          return false;
        } else if (!serviceMainMaterialPresent) {
          this.showSnackbarAndReset('Service Main material is mandatory.');
          return false;
        }
      }

      // Condition 3: Original meter selection condition for Service Main
      // Condition 4: For the CSC case meter mandatory for the un-meter to metered||SMR||BMR||PD
      if (
        (workDesc && workDesc.workscopeDescription == 'Service Main') ||
        (registeredSource == 'CSC' &&
          ['UMT_MT', 'SMR', 'BMR', 'PD'].includes(applicationTypeCode))
      ) {
        const atLeastOneMlCodePresent = tableMlCodes.some((mlCode) =>
          meterMlCodes.includes(mlCode)
        );

        if (!atLeastOneMlCodePresent) {
          this.showSnackbarAndReset('Meter material is mandatory');
          return false;
        }
      }
      return true;
    }
  }

  isServiceMainMaterialPresent() {
    const serviceMainMlCodes = this.serviceMainMaterialData.map(
      (material) => material.mlCode
    );
    const allMaterials = [
      ...this.regularFilterExecutionWorkTable.reduce(
        (acc, work) => acc.concat(work.materialItems),
        []
      ),
      ...this.creditFilterExecutionWorkTable.reduce(
        (acc, work) => acc.concat(work.materialItems),
        []
      ),
    ];
    const tableMlCodes = allMaterials.map((material) => material.itemCode);
    return serviceMainMlCodes.some((mlCode) => tableMlCodes.includes(mlCode));
  }
  isMeterMaterialPresent(meterMlCodes, tableMlCodes) {
    return tableMlCodes.some((mlCode) => meterMlCodes.includes(mlCode));
  }

  showSnackbarAndReset(message: string) {
    const snackbarRef = this.snackbar.open(message, 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    });
    snackbarRef.onAction().subscribe(() => {
      this.resetValues();
    });
  }

  async openTemplatesDialog() {
    await this.getTemplate();
    const dialogRef = this.dialog.open(TemplatesPopupComponent, {
      data: this.templateList,
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.templateData = result;
      if (result) {
        this.displayTemplateData(result);
      }
    });
  }

  openDialog(type: string) {
    if (type === 'save') {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.submitEstimation(type);
        }
      });
    } else if (type === 'template') {
      if (!this.checkMeterSelection()) {
        return;
      }
      const dialogRef = this.dialog.open(SaveTemplateConfirmComponent, {
        data: this.estimateCharges.get('estimationWorkDescription').value,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res === 'no' || res === undefined) {
        } else {
          this.submitEstimation(type, res.estimationName);
        }
      });
    } else if (type === 'GE' || type === 'RG') {
      if (!this.checkMeterSelection()) {
        return;
      }
      const { applicationTypeCode } =
        this.estimateDetailData.serviceRegistration;

      const hasRegularMaterial = this.regularFilterExecutionWorkTable.some(
        (work: any) => work.materialItems && work.materialItems.length > 0
      );

      const hasCreditMaterial = this.creditFilterExecutionWorkTable.some(
        (work: any) => work.materialItems && work.materialItems.length > 0
      );

      if (applicationTypeCode == 'PD' && !hasCreditMaterial) {
        this.snackbar.open(
          'Material item or Labor is not selected please select at least one material item or Labor.',
          'OK',
          { verticalPosition: cordova !== undefined ? 'bottom' : 'top' }
        );
        return;
      }

      if (applicationTypeCode !== 'PD' && !hasRegularMaterial) {
        this.snackbar.open(
          'Material item or Labor is not selected please select at least one material item or Labor.',
          'OK',
          { verticalPosition: cordova !== undefined ? 'bottom' : 'top' }
        );
        return;
      }

      const dialogRef = this.dialog.open(GeneratePopupComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.submitEstimation(type);
        }
      });
    }
    // else if (type === 'RG') {
    //   const dialogRef = this.dialog.open(GeneratePopupComponent);
    //   dialogRef.afterClosed().subscribe((result) => {
    //     if (result === 'yes') {
    //       this.submitEstimation(type);
    //     }
    //   });
    // }
  }

  async saveData1() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const selectedFile = this.pdfFileInput.nativeElement.files[0];
    if (!selectedFile) {
      return { success: true };
    }
    const documentName = encodeURIComponent(selectedFile.name);
    const serviceRegisterationsId = this.serviceData.serviceRegistrationId;
    const documentReferenceNumber = 'R12651265';
    const processName = 'Estimation Forms';
    try {
      const submit =
        await this.gatePassAcknowledgementService.documentUploadService(
          apiKey,
          serviceKey,
          userCode,
          userName,
          userRole,
          documentName,
          serviceRegisterationsId,
          documentReferenceNumber,
          processName,
          selectedFile
        );
      if (submit.messageType === 'SUCCESS') {
        this.snackbar
          .open('Document Saved Successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          .onAction()
          .subscribe(() => {
            this.snackbar.dismiss();
          });

        this.documentId = submit.documentId;
        return { success: true };
      } else {
        return { success: false, message: submit.message };
      }
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: error.message };
    }
  }

  async submitEstimation(type: string, estimationName?: string) {

    // if(this.layoutData.layoutRefServiceRegistrationResponseDTOList.impEstimationTotalCost =='0'&& this.serviceData.applicationTypeCode=='LAYOUT'){
    //   this.snackbar.open('For The Layout Case DCW Amount Should be greater than zero than only Estimation Will be approved!', 'OK', {
    //     verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    //   });
    //  return;
    // }
    const vendorControl = this.estimateCharges.get('vendor');
    const vendor = vendorControl?.value;
    const rateType = this.estimateCharges.get('rateType').value;
    const executionMethod = this.estimateCharges.get(
      'workExecutionMethod'
    ).value;

    const isInvalidVendor =
      vendor === null ||
      vendor === undefined ||
      vendor === '' ||
      vendor === 0 ||
      vendor === false ||
      vendor === 'null';

    if (rateType == 'RC' && isInvalidVendor) {
      vendorControl.setErrors({ required: true });
      vendorControl.markAsTouched();
      this.snackbar.open('Please select a Vendor', 'OK', {
        verticalPosition: 'top',
      });

      // Wait for the DOM to update, then focus
      setTimeout(() => {
        this.vendorSelect?.nativeElement?.focus();
      }, 0);

      return;
    }

    const chargeData = [this.totalEstimateCost, this.totalEstimationCostInRs];
    const [totalEstimateCost, totalEstimationCostInRs] = chargeData;
    let emptyQuantity: boolean = false;
    let emptyAdditionalCharge: boolean = false;
    const estimationWorkScopeDataDTO: any[] = [];
    const estimationMaterialLabourDetailsDTO: any[] = [];
    const materialDetails: any[] = [];
    const ewt: any[] = [
      ...this.regularFilterExecutionWorkTable,
      ...this.creditFilterExecutionWorkTable,
    ];
    ewt.forEach((exWorkTable: any) => {
      const workscopeDesc = this.allWorkscopeDescription.find(
        (v: any) => v.workscopeDescription == exWorkTable.workscopeDescription
      );
      const estimateTypeMasterId = this.estimateType.find(
        (v: any) => v.estimateTypeCode == exWorkTable.estimateTypeCode
      )?.estimateTypeMasterId;
      estimationWorkScopeDataDTO.push({
        estimateType: this.estimateType.find(
          (v: any) => v.estimateTypeCode == exWorkTable.estimateTypeCode
        )?.estimateTypeMasterId,
        workType: exWorkTable.workType,
        workPart: exWorkTable.workPart,
        workscopeDescMasterId: workscopeDesc
          ? workscopeDesc.workscopeDescMasterId
          : '',
        workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
        materialCost: Number(exWorkTable.materialCost),
        labourCost: Number(exWorkTable.labourCost),
      });
      const materialItems = exWorkTable.materialItems;

      materialItems.forEach((wItem: any) => {
        if (!wItem.quantity) {
          emptyQuantity = true;
        }
        const labourAmount = wItem.labourRate * wItem.quantity;
        materialDetails.push({
          rateType: wItem.rateType,
          materailAmount: isNaN(Number(wItem.materialsAmount))
            ? 0
            : Number(wItem.materialsAmount),
          quantity: Number(wItem.quantity),
          materialCode: wItem.itemCode,
          materialName: wItem.itemName,
          materialRate: Number(wItem.materialRate),
          labourRate: Number(wItem.labourRate),
          labourAmount,
          materialUnit: wItem.itemUnit,
          materialsMasterId: Number(wItem.materialTypeMasterId),
          materialsLabourMasterId: Number(wItem.materialsLabourMasterId),
          materialDisplayType: wItem.labourRate ? '1' : '0',
          workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
        });
        const labourData = wItem.laborData;
        labourData.forEach((lab: any) => {
          estimationMaterialLabourDetailsDTO.push({
            quantity: Number(wItem.quantity),
            materialName: wItem.itemName,
            labourName: lab.mlName,
            materialMasterId: Number(lab.mlmid),
            labourMasterId: Number(lab.materialsLabourMasterId),
            labourUnit: lab.mlUnit,
            labourRate: Number(lab.mlRate),
            workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
          });
        });
      });
    });
    const finalAdditionalCharges: any[] = [];
    if (
      this.addChargesBeforeTotalLabour ||
      this.addChargesBeforeTotalLabour.length ||
      this.addChargesAfterTotalLabour ||
      this.addChargesAfterTotalLabour.length ||
      this.chargeData
    ) {
      const addChargeArr = [
        ...this.addChargesBeforeTotalLabour,
        ...this.addChargesAfterTotalLabour,
        ...this.chargeData,
      ];
      addChargeArr.forEach((v: any) => {
        if (type !== 'save' && v.isRequired && Number(v.amount) == 0) {
          emptyAdditionalCharge = true;
        }
        finalAdditionalCharges.push({
          estimationAdditionalChargesId: Number(v.additionalChargesMasterId),
          areaSpecificLoadingChargesMasterId:
            v.areaSpecificLoadingChargesMasterId,
          additionalChargeName: v.additionalChargeName,
          chargeTypeValue: Number(v.chargeTypeValue),
          chargesSequenceOrder: Number(v.chargesSequenceOrder),
          chargeType: v.chargeType,
          amount: Number(v.amount),
        });
      });
    }
    const estimationDate = this.estimatedByForm.get('estimationDate').value;
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const saveDataResult = await this.saveData1();
    if (!saveDataResult.success) {
      this.snackbar.open('Document upload failed. Please try again.', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }
    const currentDate = new Date();
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      estimationType: type,
    };
    const saveFilter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      estimationName: estimationName,
      templateNumber: currentDate.getTime(),
    };
    const estimate: any = {
      estimationRegisteredDTO: {
        estCertificate: (
          this.estimatedByForm.get('certification').value || ''
        ).slice(0, this.maxCharLimits.certification),
        estReport: (this.estimatedByForm.get('estReport').value || '').slice(
          0,
          this.maxCharLimits.estReport
        ),
        estimateType: this.estimateType.find(
          (v: any) =>
            v.estimateTypeCode ==
            (this.processTypeName == 'DND' ? 'CRD' : 'RGL')
        )?.estimateTypeMasterId,
        workCategoryMasterId: this.estimateCharges.get('workCategory').value,
        serviceRegistrationId: this.serviceData.serviceRegistrationId,
        estimationWorkDesc: (
          this.estimateCharges.get('estimationWorkDescription').value || ''
        ).slice(0, this.maxCharLimits.estimationWorkDescription),
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod')
          .value,
        rateType: this.estimateCharges.get('rateType').value,
        estimatedBy: '',
        estimationRemarks: (
          this.estimatedByForm.get('estimateRemark')?.value || ''
        ).slice(0, this.maxCharLimits.estimateRemark),
        estimationMaterialCost: this.estimationMaterialCost,
        estimationLabourCost: this.estimationLabourCost,
        estimationTotalCost: totalEstimationCostInRs,
        officeId: this.estimateDetailData.serviceRegistration.officeId,
        totalLabourCharges: Number(totalEstimateCost).toFixed(3),
        rateContractMasterId: this.estimateCharges.get('vendor').value
          ? Number(this.estimateCharges.get('vendor').value)
          : '',
        escomMaterialCost: this.totalMaterialsAmountEscom,
        agencyMaterialCost: this.totalMaterialsAmountAgency,
        msdAmount: 0,
        dcwAmount: this.governmentWorksAmount,
        govtFlag: this.isGovernmentWorks ? 'Y' : 'N',
      },
      estimationWorkScopeDataDTO,
      estimationMaterailsRegisteredDTO: materialDetails,
      estimationMaterialLabourDetailsDTO,
      estimationAddlChargesRegisteredDTO: finalAdditionalCharges,
      estimationProcessFlowDTO: {
        estimationFlowType: 'S',
      },
    };
    // // Calculate and set supervision charges
    // if (estimate.estimationRegisteredDTO.workExecutionMethod === 'Self Execution') {
    //   const supervisionCharges = 0.05 * estimate.estimationRegisteredDTO.estimationTotalCost;
    //   estimate.estimationRegisteredDTO.supervisionCharges = supervisionCharges;
    // }

    const templateEstimate: any = {
      estimationTemplateMasterDTO: {
        estimateType: this.estimateType.find(
          (v: any) =>
            v.estimateTypeCode ==
            (this.processTypeName == 'DND' ? 'CRD' : 'RGL')
        )?.estimateTypeMasterId,
        estimationTemplateName: estimationName,
        serviceRegistrationId: this.serviceData.serviceRegistrationId,
        estimationWorkDesc: (
          this.estimateCharges.get('estimationWorkDescription').value || ''
        ).slice(0, this.maxCharLimits.estimationWorkDescription),
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod')
          .value,
        rateType: this.estimateCharges.get('rateType').value,
        estimatedBy: '',
        estimationRemarks: (
          this.estimatedByForm.get('estimateRemark').value || ''
        ).slice(0, this.maxCharLimits.estimateRemark),
        estimationMaterialCost: this.estimationMaterialCost,
        estimationLabourCost: this.estimationLabourCost,
        estimationTotalCost: totalEstimationCostInRs,
        officeId: this.estimateDetailData.serviceRegistration.officeId,
        totalLabourCharges: totalEstimateCost,
      },
      estTemplateWorkScopeMasterDTO: estimationWorkScopeDataDTO,
      estTemplateMaterialsMasterDTO: materialDetails,
      estimationTemplateMaterialLabourMasterDTO:
        estimationMaterialLabourDetailsDTO,
      estimationTemplateAddlChargesMasterDTO: finalAdditionalCharges,
      estimationProcessFlowDTO: {
        estimationFlowType: 'S',
      },
    };
    console.log(templateEstimate);
    if (estimationDate) {
      const esd = new Date(`${estimationDate} 00:00`);
      estimate.estimationRegisteredDTO.estimationDate = esd.toISOString();
    }
    if (emptyQuantity) {
      this.snackbar.open('Please enter quantity first', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    } else if (emptyAdditionalCharge) {
      this.snackbar.open(
        'Either enter value or remove the additional charge',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
    } else {
      if (type == 'save') {
        const res = await this.estimateService
          .saveEstimationData(saveFilter, estimate)
          .catch((e: any) => console.log(e));
        if (res.messageType == 'SUCCESS') {
          this.snackbar.open('Estimation Saved Successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
        }
      } else if (type == 'template') {
        const res = await this.estimationRegisteredService
          .saveTemplateData(saveFilter, estimate)
          .catch((e: any) => console.log(e));
        if (res.messageType == 'SUCCESS') {
          this.snackbar
            .open('Template Saved Successfully', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            })
            .onAction()
            .subscribe(() => {
              this.router.navigate([
                '/main',
                'home',
                this.applicationStatusCode,
                this.processTypeName,
              ]);
            });
        }
      } else if (type == 'GE' || type == 'RG') {
        const res = await this.estimationRegisteredService
          .generateEstimation(filter, estimate)
          .catch((e: any) => console.log(e));
        if (res.messageType == 'SUCCESS') {
          if (type == 'GE') {
            this.snackbar
              .open('Estimation Generation Done Successfully', 'OK', {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              })
              .onAction()
              .subscribe(() => {
                if (this.processTypeName == 'NSC') {
                  this.router.navigate([
                    '/main',
                    'estimation-approval',
                    this.applicationStatusCode,
                    this.processTypeName,
                    this.serviceRegistrationsId,
                  ]);
                } else if (
                  this.processTypeName == 'CSC' ||
                  this.processTypeName == 'DND'
                ) {
                  this.router.navigate([
                    '/main',
                    'other-estimation-approval',
                    this.applicationStatusCode,
                    this.processTypeName,
                    this.serviceRegistrationsId,
                  ]);
                }
              });
          } else if (type == 'RG') {
            this.snackbar
              .open('Estimation Re-Generation Done Successfully', 'OK', {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              })
              .onAction()
              .subscribe(() => {
                if (this.processTypeName == 'NSC') {
                  this.router.navigate([
                    '/main',
                    'estimation-approval',
                    this.applicationStatusCode,
                    this.processTypeName,
                    this.serviceRegistrationsId,
                  ]);
                } else if (
                  this.processTypeName == 'CSC' ||
                  this.processTypeName == 'DND'
                ) {
                  this.router.navigate([
                    '/main',
                    'other-estimation-approval',
                    this.applicationStatusCode,
                    this.processTypeName,
                    this.serviceRegistrationsId,
                  ]);
                }
              });
          }
        }
      }
    }
  }

  navigate() {
    console.log(this.applicationStatusCode);
    this.router.navigate([
      `/main/home/${this.applicationStatusCode}/${this.processTypeName}`,
    ]);
  }
}
