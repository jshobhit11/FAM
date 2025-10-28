import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ViewPopUpComponent } from '../../../estimate-forms/components/view-pop-up/view-pop-up.component';
import { EstimateService } from '../../../services/estimate.service';
import { DashboardService } from '../../../services/dashboard.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimationRegisteredService } from '../../../services/estimationRegistered';
import { GeneratePopupComponent } from '../../../shared/components/generate-popup/generate-popup.component';
import { ConfigurationService } from '../../../services/configuration.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { WorkAwardService } from '../../../services/work-award.service';
import { DocumentService } from 'src/app/shared/document.service';
import { Location } from '@angular/common';
import { GatePassAcknowledgementService } from 'src/app/services/gate-pass-acknowledgement.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
import { MatSelect } from '@angular/material/select';
const estimateCharges = new FormGroup({
  typeOfWork: new FormControl('', []),
  workPart: new FormControl('', []),
  workDescription: new FormControl('', []),
  materialType: new FormControl('', []),
  rateType: new FormControl('', []),
  workCategory: new FormControl('', []),
  workExecutionMethod: new FormControl('', []),
  estimationWorkDescription: new FormControl('', []),
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
  report: new FormControl('', [Validators.required]),
  estimatedBy: new FormControl('', []),
  estimateRemark: new FormControl('', [Validators.required]),
  estimationDate: new FormControl('', [Validators.required]),
});

const addChargeForm = new FormGroup({
  additionalCharges: new FormControl('', []),
  areaSpecificLoading: new FormControl('', []),
  categoryControl: new FormControl('', [Validators.required]),
});

@Component({
  selector: 'app-revised-estimation-creation',
  templateUrl: './revised-estimation-creation.component.html',
  styleUrls: ['./revised-estimation-creation.component.scss'],
})
export class RevisedEstimationCreationComponent implements OnInit {
  certification: string =
    'Certified that I have inspected the spot and prepared this estimate by using current SR for the most economical and safest way of executing the work.';

  estimateCharges: FormGroup = estimateCharges;
  estimatedByForm: FormGroup = estimatedByForm;
  addChargeForm: FormGroup = addChargeForm;
  isLinear: boolean = false;
  isTemplate: boolean = false;
  isTemplateButton: boolean = false;
  estimationTypeGEorRG: boolean = true;
  data: any;
  serviceRegistrationId: any;
  estimationRegisteredId: any;
  allWorkscopeDescription: any;
  dashboardList: any;
  templateList: any;
  allWorkExecutionData: any;
  workExecution: any;
  workCategoryData: any[] = [];
  workscopeDesc: any;
  materialType: any;
  estimateType: any;
  allEstimateTypeData: any;
  materialList: any;
  labourList: any;
  accountId: any;
  materialsAmount: number = 0;
  laboursAmount: number = 0;
  totalEstimationCostInRs: number = 0;
  originalEstimationTotalCost: number = 0;
  estimationDiffernceAmount: number = 0;
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
  additionCharge:any[]=[];
  regularFilterExecutionWorkTable: any[] = [];
  creditFilterExecutionWorkTable: any[] = [];
  savedAdditionalCharges: any[] = [];
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  templateData: any = {};
  selectedMaterialUnit: string = '';
  orginalEstimationRegisteredId: string = '';
  placeholder: string = '';
  filteredMaterialUnits: Observable<string[]>;
  dataSource: any[] = [];
  allMaterials: string[] = [];
  vendorData: any[] = [];
  regularTypeIndex: number = 0;
  creditTypeIndex: number = 0;
  selfExecution: any | null;
  processTypeName: string = '';
  isEditMode: boolean = false;
  rateContractMasterId: any;
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
  categoryControl: any;
  isLoadigSavedValue: boolean = false;
  defaultWorkExecutionMethodId: any;
  previousCategoryId: any;
  @ViewChild('pdfFileInput', { static: false }) pdfFileInput: ElementRef;
  @ViewChild('categorySelect') categorySelect: MatSelect;
  workPart: string[] = [
    'Part A',
    'Part B',
    'Part C',
    'Part D',
    'Part E',
    'Part F',
  ];
  nextPartCharCode = 'F'.charCodeAt(0);
  materialMasterObj = {
    materialsLabourMasterId: '',
    materialTypeMasterId: ' ',
    srMaterialsMasterId: '',
    mlType: '',
    mlCode: '',
    mlName: '',
    mlRate: '',
    mlUnit: '',
    rateType: '',
  };
  serviceRegistrationsId: any;
  isEditCase: boolean;
  selectedWorkscopeDescriptionId: string | null = null;
  serviceMainMaterialData: MaterialData[] = [];
  meterWorkScopeDesc: any;
  // isAddButtonDisabled = true;
  creditLabourCost: number = 0;
  previousWorkCategoryMasterId: any;
  charCount: { [key: string]: number } = {};
  maxCharLimits: { [key: string]: number } = {
    estimationWorkDescription: 300,
    report: 3000,
    certification: 400,
    estimateRemark: 300,
  };
  isCharCountVisible: { [key: string]: boolean } = {};
  applicationTypeCode: any;
  filteredCharges = [];
  completeWorkEx: any;
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
      const serviceRegistrationId = params.get('serviceRegistrationId');
      this.serviceRegistrationId = serviceRegistrationId;
      const estimationRegistrationId = params.get('estimationRegisteredId');
      const processTypeName = params.get('processTypeName');
      this.processTypeName = processTypeName;
      this.estimationRegisteredId = estimationRegistrationId;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeCode = sessionStorage.getItem('office-id');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
      const dashboardFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeCode,
      };
      //  const specialFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeId: officeCode };
      const vendorFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      const estimationRegistionFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        serviceRegistrationId,
        estimationRegistrationId,
      };
      const estimateDetailData =
        await this.estimateService.estimationRegistrationDetails(
          estimationRegistionFilter
        );
      this.estimateDetailData = estimateDetailData;

      // check if estimation type is GE then redirect it to estimation approval
      this.configurationService
      .getAreaSpecificLoaderGetAllData(filter)
      .then((data: any) => {
        this.areaSpecificLoadingCharges = data;
    
        // Get area-specific loading charges master ID
        const addlCharge = this.estimateDetailData.estimationAddlChargesRegisteredDTOList.find(
          (charge) => charge.additionalChargeName === 'Area Specific Loading on Basic Rates'
        );
        if (addlCharge) {
          this.areaSpecificLoadingChargesMasterId = addlCharge.areaSpecificLoadingChargesMasterId;
        }
        this.filteredCharges = [...this.areaSpecificLoadingCharges];
    
        // Match and set selected category
        const selectedCharge = this.areaSpecificLoadingCharges.find(
          (charge) =>
            charge.areaSpecificLoadingChargesMasterId.toString() ===
            this.areaSpecificLoadingChargesMasterId.toString()
        );
    
        if (selectedCharge) {
          this.selectedCategory = selectedCharge.chargesCategory;
          // Create addCharge object
          const addCharge = {
            ...addlCharge,
            chargesCategory: this.selectedCategory,
            chargeTypeValue: selectedCharge.chargesPercentage,
            areaSpecificLoadingChargesMasterId: selectedCharge.areaSpecificLoadingChargesMasterId,
            showPercentage: true,
            showAmountInput: true,
          };
          this.onChange(
            addCharge,
            this.selectedCategory
          );
        }
      });
            
      if (
        estimateDetailData &&
        estimateDetailData.estimationRegisteredDTO &&
        estimateDetailData.estimationRegisteredDTO.length &&
        estimateDetailData.estimationRegisteredDTO[0].estimationType == 'RE' &&
        edit !== 'edit'
      ) {
        this.router.navigate([
          '/estimates',
          'revised-estimation-approval',
          this.estimationRegisteredId,
          this.serviceRegistrationId,
        ]);
      }
      // check for edit mode
      if (edit == 'edit') {
        this.isEditMode = true;
      }
      if (
        estimateDetailData &&
        estimateDetailData.estimationRegisteredDTO &&
        estimateDetailData.estimationRegisteredDTO.length
      ) {
        this.orginalEstimationRegisteredId =this.isEditMode ?
        estimateDetailData.estimationRegisteredDTO[0]?.orginalEstimationRegisteredId: estimateDetailData.estimationRegisteredDTO[0]?.estimationRegisteredId;
      }
      console.log(
        'orginalEstimationRegisteredId',
        this.orginalEstimationRegisteredId
      );
      console.log('edit', edit, this.isEditMode);
      // then implement
      // const spLocAllowData = await this.estimateService.getSpecialLocalityAllowanceDataByOfficeId(specialFilter);
      // this.specialLocalityAllowancePercent = spLocAllowData.percentageValue;
      this.dashboardList = await this.dashboardService.getDashboard(
        dashboardFilter
      );
      this.vendorData = await this.workAwardService.getAllRateContractData(
        vendorFilter
      );
      this.data = estimateDetailData.serviceRegistration;
      this.applicationTypeCode = this.data?.applicationTypeCode;
      this.workCategoryData =
        await this.configurationService.getWorkCategoryGetAllData(filter);
        this.workCategoryData = this.workCategoryData.filter(
          (v: any) =>
            v.workCategoryCode === 'SCN' ||
            v.workCategoryCode === 'SEW' ||
            v.workCategoryCode === 'DCW' ||
            v.workCategoryCode === 'RMW' ||
            v.workCategoryCode === 'IMP'
        );  
      // if (['NC', 'TC', 'LE', 'LR','MC'].includes(this.applicationTypeCode)) {
      //   // Case 1
      //   this.workCategoryData = this.workCategoryData.filter(
      //     (v: any) =>
      //       v.workCategoryCode === 'SCN' ||
      //       v.workCategoryCode === 'SEW' ||
      //       v.workCategoryCode === 'DCW'
      //   );
      // } else if (
      //   ['SMR', 'NMCHG', 'TCNG', 'PD'].includes(this.applicationTypeCode)
      // ) {
      //   // Case 2
      //   this.workCategoryData = this.workCategoryData.filter(
      //     (v: any) =>
      //       v.workCategoryCode === 'SEW' || v.workCategoryCode === 'RMW'
      //   );
      // } else if (['IMW', 'BMR'].includes(this.applicationTypeCode)) {
      //   // Case 3
      //   this.workCategoryData = this.workCategoryData.filter(
      //     (v: any) =>
      //       v.workCategoryCode === 'SEW' ||
      //       v.workCategoryCode === 'RMW' ||
      //       v.workCategoryCode === 'IMP'
      //   );
      // } else {
      //   // Default case (if needed)
      //   this.workCategoryData = [];
      // } 
      // work execution method validations
      this.allWorkExecutionData =
        await this.estimateService.getWorkExecutionMethodData(filter);
      this.completeWorkEx = await this.estimateService.getWorkExecutionMethodData(filter);
      const workEx = this.allWorkExecutionData.filter(
        (v: any) => v.woExecutionMethodName == 'Self Execution'
      );
      if (this.data?.woExecutionMethodId == workEx.woExecutionMethodId) {
        if (this.data?.isSpaceProvided == 0) {
          this.estimateCharges.get('workExecutionMethod').disable();
        } else if (this.data?.isSpaceProvided == 1) {
          console.log(this.data.isSpaceProvided);
        }
      }
      this.placeholder = `${
        this.data?.designationShortCode
      } - ${sessionStorage.getItem('user-name')}`;
      const catCode = this.data?.categoryCode?.split('-');
     // set vendor rc code first
      console.log('catCode', catCode);
      // if (Number(this.data.totalContractedLoad) >= 35 && Number(this.data.buildupAreaSize) >= 800) {
      //   if (this.data.categoryCode !== 'LT-5') {
      //     this.workExecution = this.allWorkExecutionData.filter((v: any) => v.woExecutionMethodName == 'Self Execution');
      //     this.estimateCharges.get('workExecutionMethod').setValue(this.workExecution.woExecutionMethodId);
      //     await this.onChangeWorkExecution(this.workExecution.woExecutionMethodId);
      //     this.estimateCharges.get('workExecutionMethod').disable();
      //   }
      // } else {
      //   this.workExecution = this.allWorkExecutionData;
      // }
      this.workExecution = this.allWorkExecutionData;
      this.allWorkscopeDescription =
        await this.estimateService.getWorkDescMasterData(filter);
      const mt = await this.estimateService.getMaterialTypeMasterData(filter);
      this.materialType = mt.sort((a: any, b: any) => {
        if (a.materialTypeName < b.materialTypeName) {
          return -1;
        }
        if (a.materialTypeName > b.materialTypeName) {
          return 1;
        }
        return 0;
      });
      const estType = await this.estimateService.getEstimateTypeMasterData(
        filter
      );
      this.estimateType = estType.filter(
        (v: any) => v.estimateTypeCode == 'RGL' 
      );
// || v.estimateTypeCode == 'CRD'
      await this.onChangeMaterials();
      // work category
      const woExecutionMethod =
        estimateDetailData.estimationRegisteredDTO[0]?.workExecutionMethod;
      if (woExecutionMethod) {
        this.estimateCharges
          .get('workExecutionMethod')
          .setValue(woExecutionMethod);
        await this.onChangeWorkExecution(woExecutionMethod);
      }

      if (estimateDetailData && estimateDetailData.estimationWorkScopeDataDTO) {
        if (
          estimateDetailData.estimationRegisteredDTO[0]?.estimationType ==
            'GE' ||
          estimateDetailData.estimationRegisteredDTO[0]?.estimationType == 'RE'
        ) {
          this.estimationTypeGEorRG = false;
        }
        console.log('estimateDetailData', estimateDetailData);
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
            let materialItems: any[] = [];
            const material =
              estimateDetailData.estimationMaterailsRegisteredDTOList.filter(
                (v: any) =>
                  v.estimationWorkScopeDataId ==
                  workScope.estTemplateWorkScopeMasterId
              );
            if (material && material.length) {
              material.forEach((mat: any) => {
                let laboursData: any[] = [];
                const labour =
                  estimateDetailData.estimationMaterialLabourDetailsDTOList.filter(
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
                  isAlready: 1,
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
                  drawnQuantity: mat.drawnQuantity,
                  originalQty: this.isEditMode ? mat.orginalQty : mat.quantity,
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
                isAlready: 1,
                estimateTypeCode: this.estimateType.find(
                  (v: any) => v.estimateTypeMasterId == workScope.estimateType
                )?.estimateTypeCode,
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
                isAlready: 1,
                estimateTypeCode: this.estimateType.find(
                  (v: any) => v.estimateTypeMasterId == workScope.estimateType
                )?.estimateTypeCode,
                workType: workScope.workType,
                workPart: workScope.workPart,
                workscopeDescription: workScope.workscopeDescription,
                materialItems,
                materialCost: workScope.materialCost,
                labourCost: workScope.labourCost,
                accountMainHeadCode: workScope.accountMainHeadCode,
                accountMainHeadDescription:
                  workScope.accountMainHeadDescription,
                accountHeadMasterId: workScope.accountHeadMasterId,
              });
            }
          }
        );
        this.totalEstimateCost = Number(estimateDetailData.estimationRegisteredDTO[0]?.totalLabourCharges).toFixed(3);
        this.estimationMaterialCost =
          estimateDetailData.estimationRegisteredDTO[0]?.estimationMaterialCost;
        this.estimationLabourCost =
          estimateDetailData.estimationRegisteredDTO[0]?.estimationLabourCost;
        const addlCharges =
          estimateDetailData.estimationAddlChargesRegisteredDTOList;

        const additionalCharge = addlCharges.map((v: any) => {
          return { ...v, isAlready: 1 };
        });
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
        this.totalLabourChargesInRs =
          Number(Number(sum).toFixed(2)) +
          Number(Number(this.estimationLabourCost).toFixed(2));
        this.originalEstimationTotalCost =this.isEditMode ?
          estimateDetailData.estimationRegisteredDTO[0]?.originalEstimationTotalCost:estimateDetailData.estimationRegisteredDTO[0]?.estimationTotalCost;
        this.totalEstimationCostInRs =
          estimateDetailData.estimationRegisteredDTO[0]?.estimationTotalCost;
        this.estimationDiffernceAmount = Number(
          Math.abs(
            Number(this.originalEstimationTotalCost) -
              Number(this.totalEstimationCostInRs)
          ).toFixed(2)
        );
        this.estimateCharges
          .get('estimationWorkDescription')
          .setValue(
            estimateDetailData.estimationRegisteredDTO[0].estimationWorkDesc
          );
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
        }
        this.estimateCharges
          .get('rateType')
          .setValue(estimateDetailData.estimationRegisteredDTO[0]?.rateType);
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

        this.rateContractMasterId =
          estimateDetailData.estimationRegisteredDTO[0]?.rateContractMasterId;
        this.estimateCharges.get('vendor').setValue(this.rateContractMasterId);
        const report =
        estimateDetailData.estimationRegisteredDTO[0]?.estReport === 'null'
          ? ''
          : estimateDetailData.estimationRegisteredDTO[0]?.estReport || '';

        this.estimatedByForm
          .get('estimateRemark')
          .setValue(
            estimateDetailData.estimationRegisteredDTO[0]?.estimationRemarks
          );
        this.estimatedByForm.get('report').setValue(
          estimateDetailData.estimationRegisteredDTO[0]?.estReport
        );
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
      
      this.estimateCharges.get('workCategory').disable();
      this.estimateCharges.get('workExecutionMethod').disable();
      this.estimateCharges.get('vendor').disable();
      this.estimateCharges.get('vendor').setValue(this.rateContractMasterId);
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
  formatNumber(num: number | string): string {
    if (typeof num === 'number' || !isNaN(parseFloat(num as string))) {
      return parseFloat(num as string).toFixed(2);
    }
    return num.toString();
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
        report: '',
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
    // return this.allMaterials.filter((name) => name.toLowerCase().includes(filterValue) && name !== this.materialMasterObj.mlName);
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
          rateType: this.materialMasterObj.rateType,
          workExecutionMethodCode: woExecutionMethodCode,
        };
        this.labourList = [];
        const ml1 =
          await this.estimateService.getDataByMlTypeAndMaterialTypeMasterId(
            labourFilter
          );
        this.materialList = ml1.sort((a: any, b: any) => {
          return a.mlCode - b.mlCode;
        });
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
          workExecutionMethodCode: woExecutionMethodCode,
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
          rateType: this.materialMasterObj.rateType,
          workExecutionMethodCode: woExecutionMethodCode,
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
            this.estimateCharges.get('labourList').setValue(materialsLabourIds);
          }
        }
      }
    } else {
      console.error('Material not found in dataSource.');
    }
  }
  catch(error) {
    console.error('Error in onMaterialUnitSelected:', error);
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
    if (!workType) {
      this.onChangeTypeOfWork(workType, true);
    } else {
      this.onChangeTypeOfWork(workType);
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
      const workD = workDescData.filter(
        (v: any) => v.workscopeDescCode !== 'SM'
      );
      const estimateType = this.estimateType.find(
        (v: any) =>
          v.estimateTypeCode == this.estimateCharges.get('estimateType').value
      )?.estimateTypeMasterId;
      if (typeOfWork == 'LT') {
        this.workscopeDesc = workD.filter((v: any) => {
          if (
            v.estimateType == estimateType &&
            (v.workTypeApplicable == 'LT' || v.workTypeApplicable == 'BOTH')
          ) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (typeOfWork == 'HT') {
        this.workscopeDesc = workD.filter((v: any) => {
          if (
            v.estimateType == estimateType &&
            (v.workTypeApplicable == 'HT' || v.workTypeApplicable == 'BOTH')
          ) {
            return true;
          } else {
            return false;
          }
        });
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
  addNextPart() {
    const nextPart = `Part ${String.fromCharCode(++this.nextPartCharCode)}`;
    if (!this.workPart.includes(nextPart)) {
      this.workPart.push(nextPart);
    }
  }
  get basicRate(): number {
    const materialCost = Number(this.estimationMaterialCost);
    const labourCost = Number(this.estimationLabourCost);
    if (isNaN(materialCost) || isNaN(labourCost)) {
      console.error(
        'Estimation material cost or labour cost is not a valid number.'
      );
      return 0;
    }
    const sum = materialCost + labourCost;
    return Number(sum.toFixed(2));
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
        let afterTotalLabour: number = 0;
        if (this.additionalCharges) {
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
        const totalEstimateCostNum = parseFloat(this.totalEstimateCost);
        const totalEstimationCost = totalEstimateCostNum + afterTotalLabour;
        this.totalEstimationCostInRs = totalEstimationCost;
        this.estimationDiffernceAmount = Number(
          Math.abs(
            Number(this.originalEstimationTotalCost) -
              Number(this.totalEstimationCostInRs)
          ).toFixed(2)
        );
        const chargeData = [
          addCharge.areaSpecificLoadingChargesMasterId,
          this.totalEstimateCost,
          addCharge.amount,
          this.totalEstimationCostInRs,
        ];
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
      this.estimateCharges.get('workExecutionMethod').setValue('');
      this.estimateCharges.get('workExecutionMethod').enable();
      this.estimateCharges.get('rateType').setValue('');
      this.selfExecution = this.allWorkExecutionData.find(
        (v: any) => v.woExecutionMethodName == 'Self Execution'
      );
      const iota = this.workExecution.findIndex(
        (v: any) => v.woExecutionMethodName == 'Self Execution'
      );
      if (iota !== -1) {
        this.workExecution.splice(iota, 1);
      }
      console.log(this.workExecution);
    } else if (workCategoryMasterId == 2) {
      const selfExecution = this.completeWorkEx.find(
        (v: any) => v.woExecutionMethodName == 'Self Execution'
      );
      this.workExecution = [];
      if (selfExecution) {
        this.workExecution.push(selfExecution);
      }

      if (selfExecution) {
        this.estimateCharges
          .get('workExecutionMethod')
          .setValue(selfExecution.woExecutionMethodId);
          this.estimateCharges.get('workExecutionMethod').disable();
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
      this.estimateCharges.get('workExecutionMethod').enable();
      const iota = this.workExecution.findIndex(
        (v: any) => v.woExecutionMethodName == 'Self Execution'
      );
      if (iota !== -1) {
        this.workExecution.splice(iota, 1);
      }
      const wed = this.allWorkExecutionData.find(
        (v: any) => v.woExecutionMethodName !== 'Self Execution'
      );
      if (wed) {
        this.estimateCharges
          .get('workExecutionMethod')
          .setValue(wed.woExecutionMethodId);
        await this.onChangeWorkExecution(wed.woExecutionMethodId);
      } else {
        console.error(
          'No valid execution method found for workCategoryMasterId 6.'
        );
      }
    } else {
      if (this.selfExecution) {
        this.workExecution.push(this.selfExecution);
      }
      this.estimateCharges.get('workExecutionMethod').setValue('');
      this.estimateCharges.get('workExecutionMethod').enable();
      this.estimateCharges.get('rateType').setValue('');
    }
  }

  async onChangeWorkExecution(woExecutionMethodId: any) {
    const previousWorkExecutionMethodId = this.defaultWorkExecutionMethodId;

    if (!this.defaultWorkExecutionMethodId) {
      this.defaultWorkExecutionMethodId = woExecutionMethodId;
    }

    if (woExecutionMethodId !== this.defaultWorkExecutionMethodId) {
      this.editResetValue();
      this.resetWorkParts();
    }

    if (woExecutionMethodId !== this.defaultWorkExecutionMethodId) {
      const dialogRef = this.dialog.open(PopUpComponent, {
        data: { action: 'execution_edit' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.defaultWorkExecutionMethodId = woExecutionMethodId;
          this.editResetValue();
          this.resetWorkParts();
          if (
            woExecutionMethodId == 1 ||
            woExecutionMethodId == 2 ||
            woExecutionMethodId == 6
          ) {
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
      this.additionCharge=additionCharge;  
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
    this.estimationDiffernceAmount=0;
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

        // Add labour data as in addItemTable
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
  }e
  convertEstimateCode(code: string) {
    return code.split('-')[1];
  }

  async onChangeMaterials() {
    const vendor = this.estimateCharges.get('vendor').value;
    if (this.showVendor&&!vendor) {
      this.snackbar.open('Please select a vendor', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        duration:3000,
      });
      return;
    }
    const workExecutionMethod = this.estimateCharges.get(
      'workExecutionMethod'
    ).value;

    this.estimateCharges.get('materialUnitControl').setValue('');
    this.estimateCharges.get('labourUnitControl').setValue('');
    this.estimateCharges.get('labourList').setValue('');

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');

    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      mlType: this.estimateCharges.get('materialOrLabour').value,
    };

    const turnkeyFilter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      mlType: this.estimateCharges.get('materialOrLabour').value,
      rateContractMasterId: vendor,
    };
    if (workExecutionMethod == 4 && vendor) {
      this.dataSource =
        await this.configurationService.getDataByMlTypeAndVendorIdForPartialTurnkey(
          turnkeyFilter
        );
    } else if (workExecutionMethod == 5 && vendor) {
      this.dataSource =
        await this.configurationService.getDataByMlTypeAndVendorIdForTotalTurnkey(
          turnkeyFilter
        );
    } else if (
      (workExecutionMethod == 4 || workExecutionMethod == 5) &&
      !vendor
    ) {
      // this.snackbar.open('Please select a vendor', 'OK', {
      //   verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      //   duration:3000,
      // });
      this.dataSource = [];
    } else {
      const rateType = this.estimateCharges.get('rateType').value;
      if (rateType === 'NDS' && workExecutionMethod == 2) {
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
    }
    this.allMaterials = this.dataSource.map(
      (v: any) => `${v.rateType}-${v.mlCode}-${v.mlName}`
    );
    if (this.estimateCharges.get('materialOrLabour').value === 'MATERIAL') {
      this.filteredMaterialUnits = this.estimateCharges
        .get('materialUnitControl')
        .valueChanges.pipe(
          startWith(''),
          map((value) => this._filterMaterialUnits(value))
        );
    }
    if (this.estimateCharges.get('materialOrLabour').value === 'LABOR') {
      this.filteredMaterialUnits = this.estimateCharges
        .get('labourUnitControl')
        .valueChanges.pipe(
          startWith(''),
          map((value) => this._filterMaterialUnits(value))
        );
    }
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
      executionWork.materialItems.forEach((item: any, id: number) => {
        this.onQuantityChange(
          item.quantity,
          i,
          id,
          item.materialRate,
          item.labourRate,
          executionWork.estimateTypeCode,
          item.originalQty,
          item.drawnQty,
          executionWork, 
          item         
        );
        
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
          this.onQuantityChange(
            item.quantity,
            i,
            id,
            item.materialRate,
            item.labourRate,
            executionWork.estimateTypeCode,
            item.originalQty,
            item.drawnQty,
            executionWork,
            item  
          );
          

          if (item.quantity > 0) {
            allQuantitiesZero = false;
          }
        });
      }
    );

    this.creditFilterExecutionWorkTable.forEach(
      (executionWork: any, i: number) => {
        executionWork.materialItems.forEach((item: any, id: number) => {
          this.onQuantityChange(
            item.quantity,
            i,
            id,
            item.materialRate,
            item.labourRate,
            executionWork.estimateTypeCode,
            item.originalQty,
            item.drawnQty,
            executionWork, 
            item 
          );
          
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
              'Material Already Exists in Regular Estimation Type ',
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

  // async onQuantityChange(
  //   revisedQty: any,
  //   i: number,
  //   id: number,
  //   materialRate: number,
  //   labourRate: number,
  //   estimateTypeCode: string,
  //   originalQty: any,
  //   drawnQty: any
  // ) {
  //   let mrt: any;
  //   let lrt: any;
  //   if (Number(revisedQty) < 0) {
  //     mrt = 0;
  //     lrt = 0;
  //   } else if (Number(revisedQty) < Number(drawnQty)) {
  //     mrt = 0;
  //     lrt = 0;
  //     this.snackbar.open(
  //       'Revised Quantity should not be less than Drawn Quantity',
  //       'OK',
  //       {
  //         verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //       }
  //     );
  //   } else {
  //     this.snackbar.dismiss();
  //     mrt = revisedQty * materialRate;
  //     lrt = revisedQty * labourRate;
  //   }
  //   if (this.selectedMaterialRateType === 'SR') {
  //     this.totalMaterialsAmountEscom += mrt;
  //   } else if (this.selectedMaterialRateType === 'RC'||this.selectedMaterialRateType ==='NDS') {
  //     this.totalMaterialsAmountAgency += mrt;
  //   }
  //   if (estimateTypeCode == 'RGL') {
  //     // revised , drawn and original qty
  //     this.regularFilterExecutionWorkTable[i].materialItems[id].quantity =
  //       Number(Number(revisedQty));
  //     // this.regularFilterExecutionWorkTable[i].materialItems[id].drawnQuantity = Number(Number(drawnQty));
  //     // this.regularFilterExecutionWorkTable[i].materialItems[id].originalQty = Number(Number(originalQty));
  //     this.regularFilterExecutionWorkTable[i].materialItems[
  //       id
  //     ].materialsAmount = Number(Number(mrt).toFixed(2));
  //     this.regularFilterExecutionWorkTable[i].materialItems[id].laboursAmount =
  //       Number(Number(lrt).toFixed(2));
  //     const tma = this.regularFilterExecutionWorkTable[i].materialItems
  //       .map((v: any) => v.materialsAmount)
  //       .reduce((a: any, b: any) => {
  //         return Number(a) + Number(b);
  //       });
  //     const totalMaterialsAmount = Number(Number(tma).toFixed(2));
  //     const tla = this.regularFilterExecutionWorkTable[i].materialItems
  //       .map((v: any) => v.laboursAmount)
  //       .reduce((a: any, b: any) => {
  //         return Number(a) + Number(b);
  //       });
  //     const totalLaborAmount = Number(Number(tla).toFixed(2));
  //     this.regularFilterExecutionWorkTable[i].materialCost =
  //       totalMaterialsAmount;
  //     this.regularFilterExecutionWorkTable[i].labourCost = totalLaborAmount;
  //     // big common code
  //     const mc = this.regularFilterExecutionWorkTable
  //       .map((v: any) => v.materialCost)
  //       .reduce((a: any, b: any) => {
  //         return Number(a) + Number(b);
  //       });
  //     const lc = this.regularFilterExecutionWorkTable
  //       .map((v: any) => v.labourCost)
  //       .reduce((a: any, b: any) => {
  //         return Number(a) + Number(b);
  //       });
  //     this.estimationMaterialCost = Number(mc.toFixed(2));
  //     this.estimationLabourCost = Number(lc);
  //     const tmlc1 =
  //       Number(this.estimationMaterialCost) + Number(this.estimationLabourCost);
  //     const tmlc2 = tmlc1.toFixed(2);
  //     const totalMLCost = Number(tmlc2);
  //     const valueCalculatedByOnlyLabour = this.additionalCharges.filter(
  //       (v: any) =>
  //         v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 0
  //     );
  //     if (valueCalculatedByOnlyLabour && valueCalculatedByOnlyLabour.length) {
  //       valueCalculatedByOnlyLabour.forEach((v: any) => {
  //         v.amount = Number(
  //           Number(
  //             (Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) /
  //               100
  //           ).toFixed(2)
  //         );
  //       });
  //     }
  //     const valueCalculatedByBothLabourAndMaterial =
  //       this.additionalCharges.filter(
  //         (v: any) =>
  //           v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 1
  //       );
  //     if (
  //       valueCalculatedByBothLabourAndMaterial &&
  //       valueCalculatedByBothLabourAndMaterial.length
  //     ) {
  //       valueCalculatedByBothLabourAndMaterial.forEach((v: any) => {
  //         v.amount = Number(
  //           Number(
  //             (Number(v.chargeTypeValue) * Number(totalMLCost)) / 100
  //           ).toFixed(2)
  //         );
  //       });
  //     }
  //     const valueCalculatedByOnlyMaterial = this.additionalCharges.filter(
  //       (v: any) => v.valueCalculatedByMaterial == 1
  //     );
  //     if (
  //       valueCalculatedByOnlyMaterial &&
  //       valueCalculatedByOnlyMaterial.length
  //     ) {
  //       valueCalculatedByOnlyMaterial.forEach((v: any) => {
  //         v.amount = Number(
  //           Number(
  //             (Number(v.chargeTypeValue) *
  //               Number(this.estimationMaterialCost)) /
  //               100
  //           ).toFixed(2)
  //         );
  //       });
  //     }
  //     let beforeTotalLabour: number = 0;
  //     let afterTotalLabour: number = 0;
  //     if (this.additionalCharges) {
  //       const bLabour1 = this.additionalCharges.filter(
  //         (v: any) =>
  //           Number(v.chargesSequenceOrder) < 5 && v.displayByDefault == 1
  //       );
  //       if (bLabour1.length) {
  //         const bLabour2 = bLabour1.map((v: any) => v.amount);
  //         beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
  //           return Number(a) + Number(b);
  //         });
  //       }
  //       this.totalLabourChargesInRs =
  //         Number(this.estimationLabourCost) + Number(beforeTotalLabour);
  //       const aLabour1 = this.additionalCharges.filter(
  //         (v: any) => v.chargesSequenceOrder >= 5 && v.displayByDefault == 1
  //       );
  //       if (aLabour1.length) {
  //         const aLabour2 = aLabour1.map((v: any) => v.amount);
  //         afterTotalLabour = aLabour2.reduce((a: any, b: any) => {
  //           return Number(a) + Number(b);
  //         });
  //       }
  //     }
  //     this.totalLabourChargesInRs = Number(
  //       (Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(
  //         2
  //       )
  //     );
  //     this.totalEstimationCostInRs = Number(
  //       (
  //         Number(this.estimationMaterialCost) +
  //         Number(this.totalLabourChargesInRs) +
  //         afterTotalLabour
  //       ).toFixed(2)
  //     );
  //     this.estimationDiffernceAmount = Number(
  //       Math.abs(
  //         Number(this.originalEstimationTotalCost) -
  //           Number(this.totalEstimationCostInRs)
  //       ).toFixed(2)
  //     );
  //     setTimeout(() => {
  //       const selectedCategory = this.selectedCategory;
  //       if (selectedCategory) {
  //         const selectedCharge = this.areaSpecificLoadingCharges.find(
  //           (charge) => charge.chargesCategory === selectedCategory
  //         );
  //         if (selectedCharge) {
  //           this.onChange(
  //             this.addChargesBeforeTotalLabour[0],
  //             selectedCategory
  //           );
  //         }
  //       }
  //     }, 0);
  //   } else if (estimateTypeCode == 'CRD') {
  //     // revised , drawn and original qty
  //     this.creditFilterExecutionWorkTable[i].materialItems[id].quantity =
  //       Number(Number(revisedQty));
  //     // this.creditFilterExecutionWorkTable[i].materialItems[id].drawnQuantity = Number(Number(drawnQty));
  //     // this.creditFilterExecutionWorkTable[i].materialItems[id].originalQty = Number(Number(originalQty));
  //     this.creditFilterExecutionWorkTable[i].materialItems[id].materialsAmount =
  //       Number(Number(mrt).toFixed(2));
  //     this.creditFilterExecutionWorkTable[i].materialItems[id].laboursAmount =
  //       Number(Number(lrt).toFixed(2));
  //     const tma = this.creditFilterExecutionWorkTable[i].materialItems
  //       .map((v: any) => v.materialsAmount)
  //       .reduce((a: any, b: any) => {
  //         return Number(a) + Number(b);
  //       });
  //     const tla = this.creditFilterExecutionWorkTable[i].materialItems
  //       .map((v: any) => v.laboursAmount)
  //       .reduce((a: any, b: any) => {
  //         return Number(a) + Number(b);
  //       });
  //     const totalMaterialsAmount = Number(Number(tma).toFixed(2));
  //     const totalLaborAmount = Number(Number(tla).toFixed(2));
  //     this.creditFilterExecutionWorkTable[i].materialCost =
  //       totalMaterialsAmount;
  //     this.creditFilterExecutionWorkTable[i].labourCost = totalLaborAmount;
  //   }
  // }
  async onQuantityChange(
    revisedQty,
    i,
    id,
    materialRate,
    labourRate,
    estimateTypeCode,
    originalQty,
    drawnQty,
    executionWork,
    tableItem
  ) {
    console.log('Execution Work:', executionWork);
    console.log('Table Item:', tableItem);
    let mrt = 0;
    let lrt = 0;
    let isReleaseLabour = false;
  
    if (Number(revisedQty) < 0) {
      mrt = 0;
      lrt = 0;
    } else if (Number(revisedQty) < Number(drawnQty)) {
      mrt = 0;
      lrt = 0;
      this.snackbar.open(
        'Revised Quantity should not be less than Drawn Quantity',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
    } else {
      this.snackbar.dismiss();
      const workscopeDescription = executionWork?.workscopeDescription;
  
      if (Number(revisedQty) > 0) {
        isReleaseLabour =
          workscopeDescription == 'Release Labour' && estimateTypeCode == 'CRD';
  
        if (isReleaseLabour) {
          lrt = revisedQty * labourRate;
          mrt = 0;
          tableItem.laboursAmount = lrt; 
        } else if (
          estimateTypeCode === 'CRD' &&
          workscopeDescription === 'Release Scrap'
        ) {
          mrt = this.calculateReleaseScrapAmount(revisedQty, materialRate);
          tableItem.materialsAmount = mrt;
          lrt = 0;
        } else {
          mrt = revisedQty * materialRate;
          lrt = revisedQty * labourRate;
        }
      }
    }
  
    if (this.selectedMaterialRateType === 'SR') {
      this.totalMaterialsAmountEscom += mrt;
    } else if (this.selectedMaterialRateType === 'RC' || this.selectedMaterialRateType === 'NDS') {
      this.totalMaterialsAmountAgency += mrt;
    }
  
    const tableToUpdate =
      estimateTypeCode === 'RGL'
        ? this.regularFilterExecutionWorkTable
        : this.creditFilterExecutionWorkTable;
  
    if (tableToUpdate[i] && tableToUpdate[i].materialItems[id]) {
      tableToUpdate[i].materialItems[id].quantity = Number(revisedQty);
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
      .map((v) => v.materialsAmount || 0)
      .reduce((a, b) => Number(a) + Number(b), 0);
  
    const totalLaborAmount = tableToUpdate[i].materialItems
      .map((v) => v.laboursAmount || 0)
      .reduce((a, b) => Number(a) + Number(b), 0);
  
    tableToUpdate[i].materialCost = totalMaterialsAmount;
    tableToUpdate[i].labourCost = totalLaborAmount;
  
    if (estimateTypeCode === 'CRD' && isReleaseLabour) {
      this.creditLabourCost = totalLaborAmount;
    }
  
    const regularMaterials = this.regularFilterExecutionWorkTable
      .map((v) => v.materialCost || 0)
      .reduce((a, b) => Number(a) + Number(b), 0);
  
    const regularLabour = this.regularFilterExecutionWorkTable
      .map((v) => v.labourCost || 0)
      .reduce((a, b) => Number(a) + Number(b), 0);
  
    const creditLabour = this.creditLabourCost || 0;
  
    this.estimationMaterialCost = Number(regularMaterials.toFixed(2)) || 0;
    this.estimationLabourCost =
      Number((regularLabour + creditLabour).toFixed(2)) || 0;
  
    const totalMLCost =
      Number(
        (this.estimationMaterialCost + this.estimationLabourCost).toFixed(2)
      ) || 0;
  
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
  
    this.estimationDiffernceAmount = Number(
      Math.abs(
        Number(this.originalEstimationTotalCost) -
          Number(this.totalEstimationCostInRs)
      ).toFixed(2)
    );
  
    setTimeout(() => {
      const selectedCategory = this.selectedCategory;
      if (selectedCategory) {
        const selectedCharge = this.areaSpecificLoadingCharges.find(
          (charge) => charge.chargesCategory === selectedCategory
        );
        if (selectedCharge) {
          this.onChange(this.addChargesBeforeTotalLabour[0], selectedCategory);
        }
      }
    }, 0);
  
    this.updateGSTAmount();
    this.calculateTotalEstimateCost();
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
              workscopeDescription: workDesc.workscopeDescription,
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
            if (this.regularFilterExecutionWorkTable.length) {
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
  getSelectedChargeId(): number {
    return Number(this.addChargeForm.get('additionalCharges')?.value) || 0;
  }
  
  addAdditionalCharges(addChargeId: number) {
    const ac = this.additionCharge.find(
      (v) => Number(v.additionalChargesMasterId) === addChargeId
    );
    const isAlreadyPresent = this.addChargesBeforeTotalLabour.some(
      (v) => Number(v.additionalChargesMasterId) === Number(addChargeId)
    ) || this.addChargesAfterTotalLabour.some(
      (v) => Number(v.additionalChargesMasterId) === Number(addChargeId)
    );
    
    if (isAlreadyPresent) {
      this.snackbar.open('Additional Charge already exists', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      return;
    }
    if (Number(ac.chargesSequenceOrder) < 5) {
     this.addChargesBeforeTotalLabour.push(ac);
    //  this.snackbar.open('Additional charge does not exist','Ok',{
    //   verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    //  })
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
    }
    if (ac.additionalChargeName === 'Area Specific Loading on Basic Rates') {
      this.selectedCategory = '';
      ac.amount = '';
      ac.chargeTypeValue = '';
      ac.showAmountInput = false;
    }
  
    this.updateGSTAmount();
    this.calculateTotalEstimateCost();
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

    const totalAfter = this.addChargesAfterTotalLabour
    .filter(charge => charge.amount !== null && !isNaN(charge.amount))
    .reduce((total, charge) => {
      return total + formatAmount(charge.amount);
    }, 0);
  

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
    // this.totalEstimateCost = 0;

    this.totalEstimationCostInRs = 0;
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
    this.estimationDiffernceAmount = Number(
      Math.abs(
        Number(this.originalEstimationTotalCost) -
          Number(this.totalEstimationCostInRs)
      ).toFixed(2)
    );
    this.updateGSTAmount();
    this.calculateTotalEstimateCost();
  }

  chargeAmount(amount: any): string {
    return amount ? parseFloat(amount).toFixed(3) : '0.000';
  }
  viewInspection() {
    this.router.navigate(['/main/view-site-inspection'], {
      queryParams: { accountId: this.accountId },
    });
  }

  openGenerateEstimationDialog() {
    const hasRegularMaterial = this.regularFilterExecutionWorkTable.some(
      (work: any) => work.materialItems && work.materialItems.length > 0
    );
    if (!hasRegularMaterial) {
      this.snackbar.open(
        'Material item or Labor is not selected please select at least one material item or Labor.',
        'OK',
        { verticalPosition: cordova !== undefined ? 'bottom' : 'top' }
      );
      return;
    }
    const dialogRef = this.dialog.open(GeneratePopupComponent);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'yes') {
        this.generateEstimation();
      }
    });
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
    const serviceRegisterationsId = this.serviceRegistrationId;
    const documentReferenceNumber = 'R12651265';
    const processName = 'Revised Estimation Creation';
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

  async generateEstimation() {
    const chargeData = [this.totalEstimateCost, this.totalEstimationCostInRs];
    const [totalEstimateCost, totalEstimationCostInRs] = chargeData;
    // let emptyQuantity: boolean = false;
    let emptyAdditionalCharge: boolean = false;
    const estimationWorkScopeDataDTO: any[] = [];
    const estimationMaterialLabourDetailsDTO: any[] = [];
    const materialDetails: any[] = [];
    const ewt: any[] = [
      ...this.regularFilterExecutionWorkTable,
      ...this.creditFilterExecutionWorkTable,
    ];
    ewt.forEach((exWorkTable: any) => {
      console.log('exWorkTable', exWorkTable);
      const workscopeDesc = this.allWorkscopeDescription.find(
        (v: any) => v.workscopeDescription == exWorkTable.workscopeDescription
      );
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
        accountMainHeadCode: exWorkTable.accountMainHeadCode,
        accountMainHeadDescription: exWorkTable.accountMainHeadDescription,
        accountHeadMasterId: exWorkTable.accountHeadMasterId,
      });
      const materialItems = exWorkTable.materialItems;
      materialItems.forEach((wItem: any) => {
        // if (!wItem.quantity) {
        //   emptyQuantity = true;
        // }
        const labourAmount = wItem.labourRate * wItem.quantity;
        materialDetails.push({
          rateType: wItem.rateType,
          materailAmount: Number(wItem.materialsAmount),
          quantity: Number(wItem.quantity),
          drawnQuantity: Number(wItem.drawnQuantity)
            ? Number(wItem.drawnQuantity)
            : 0,
          originalQty: Number(wItem.originalQty)
            ? Number(wItem.originalQty)
            : 0,
          materialCode: wItem.itemCode,
          materialName: wItem.itemName,
          materialRate: Number(wItem.materialRate),
          labourRate: Number(wItem.labourRate),
          labourAmount: Number(labourAmount.toFixed(3)),
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
            drawnQuantity: Number(wItem.drawnQuantity)
              ? Number(wItem.drawnQuantity)
              : 0,
            originalQty: Number(wItem.originalQty)
              ? Number(wItem.originalQty)
              : 0,
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
      this.addChargesAfterTotalLabour.length
    ) {
      const addChargeArr = [
        ...this.addChargesBeforeTotalLabour,
        ...this.addChargesAfterTotalLabour,
      ];
      addChargeArr.forEach((v: any) => {
        if (v.amount == 0) {
          emptyAdditionalCharge = true;
        }
        finalAdditionalCharges.push({
          areaSpecificLoadingChargesMasterId:
            v.areaSpecificLoadingChargesMasterId,
          estimationAdditionalChargesId: Number(v.additionalChargesMasterId),
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
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      estimationType: 'RE',
    };
    const estimate: any = {
      estimationRegisteredDTO: {
        accountHeadMasterId:
          this.estimateDetailData.estimationRegisteredDTO[0]
            ?.accountHeadMasterId,
        divisionalBudgetId:
          this.estimateDetailData.estimationRegisteredDTO[0]
            ?.divisionalBudgetId,
        estimateType: this.estimateType.find(
          (v: any) => v.estimateTypeCode == 'RGL'
        )?.estimateTypeMasterId,
        orginalEstimationRegisteredId: this.orginalEstimationRegisteredId,
        originalEstimationTotalCost: this.originalEstimationTotalCost,
        estimationDiffernceAmount: this.estimationDiffernceAmount,
        rateContractMasterId:this.estimateCharges.get('vendor').value,
        serviceRegistrationId: this.data.serviceRegistrationId,
        estimationWorkDesc: (
          this.estimateCharges.get('estimationWorkDescription').value || ''
        ).slice(0, this.maxCharLimits.estimationWorkDescription),
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod')
          .value,
        rateType: this.estimateCharges.get('rateType').value,
        estimatedBy: '',
        workCategoryMasterId: this.estimateCharges.get('workCategory').value,
        estimationRemarks: (
          this.estimatedByForm.get('estimateRemark').value||''
        ).slice(0, this.maxCharLimits.estimateRemark),
        estReport:(this.estimatedByForm.get('report').value||'').slice(0,this.maxCharLimits.report),
        estimationMaterialCost: this.estimationMaterialCost,
        estimationLabourCost: this.estimationLabourCost,
        estimationTotalCost: totalEstimationCostInRs,
        officeId: sessionStorage.getItem('office-id'),
        totalLabourCharges: totalEstimateCost,
        escomMaterialCost: this.totalMaterialsAmountEscom,
        agencyMaterialCost: this.totalMaterialsAmountAgency,
      },
      estimationWorkScopeDataDTO,
      estimationMaterailsRegisteredDTO: materialDetails,
      estimationMaterialLabourDetailsDTO,
      estimationAddlChargesRegisteredDTO: finalAdditionalCharges,
      estimationProcessFlowDTO: {
        estimationFlowType: 'S',
      },
    };
    if (estimationDate) {
      const esd = new Date(`${estimationDate} 00:00`);
      estimate.estimationRegisteredDTO.estimationDate = esd.toISOString();
    }
     
      const res = await this.estimationRegisteredService
        .generateEstimation(filter, estimate)
        .catch((e: any) => console.log(e));
      if (res.messageType=="SUCCESS") {
        this.snackbar.open('Revised Estimation Generated Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        this.router.navigate([
          '/estimates',
          'revised-estimation-approval',
          res.estmationRegisteredId,
          res.serviceRegistrationId,
        ]);
    } else if(res.messageType=="FAILURE"){
        this.snackbar.open(`${res.messageText}`, 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
    }
  }
  navigateToViewDocument() {
    const currentUrl = this.location.path();
    this.documentService.setPreviousUrl(currentUrl);
    const serviceRegistrationId = this.data.serviceRegistrationId;
    this.documentService.setServiceRegistrationId(serviceRegistrationId);
    this.documentService.navigateToViewDocument('/main/document-upload');
  }
}
