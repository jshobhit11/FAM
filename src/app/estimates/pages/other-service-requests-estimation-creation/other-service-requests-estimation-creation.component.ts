import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TemplatesPopupComponent } from '../../../estimate-forms/components/templates-popup/templates-popup.component';
import { ViewPopUpComponent } from '../../../estimate-forms/components/view-pop-up/view-pop-up.component';
import { EstimateService } from '../../../services/estimate.service';
import { DashboardService } from '../../../services/dashboard.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimationRegisteredService } from '../../../services/estimationRegistered';
import { SaveTemplateConfirmComponent } from '../../../shared/components/save-template-confirm/save-template-confirm.component';
import { GeneratePopupComponent } from '../../../shared/components/generate-popup/generate-popup.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { WorkAwardService } from '../../../services/work-award.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { DocumentService } from 'src/app/shared/document.service';
import { Location } from '@angular/common';
const estimateCharges = new FormGroup({
  typeOfWork: new FormControl('', []),
  workPart: new FormControl('', []),
  workDescription: new FormControl('', []),
  materialType: new FormControl('', []),
  rateType: new FormControl('', []),
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

const estimatedByForm = new FormGroup({
  estimatedBy: new FormControl('', []),
  estimateRemark: new FormControl('', [Validators.required]),
  estimationDate: new FormControl('', [Validators.required]),
});

const addChargeForm = new FormGroup({
  additionalCharges: new FormControl('', []),
});

@Component({
  selector: 'app-other-service-requests-estimation-creation',
  templateUrl: './other-service-requests-estimation-creation.component.html',
  styleUrls: ['./other-service-requests-estimation-creation.component.scss'],
})
export class OtherServiceRequestsEstimationCreationComponent implements OnInit {
  estimateCharges: FormGroup = estimateCharges;
  estimatedByForm: FormGroup = estimatedByForm;
  addChargeForm: FormGroup = addChargeForm;
  isLinear: boolean = false;
  isTemplate: boolean = false;
  estimationTypeGEorRG: boolean = true;
  data: any;
  applicationStatusCode: any;
  allWorkscopeDescription: any;
  dashboardList: any;
  templateList: any;
  workExecution: any;
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
  isWorkExecutionSelected: boolean = false;
  showVendor: boolean = false;
  showTable: boolean = true;
  additionalCharges: any[] = [];
  executionWorkTable: any[] = [];
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
  estimateDetailData: any;
  areaSpecificLoadingCharges: any[] = []; 
  selectedAreaCharge: any[] = []; 
  areaSpecificLoadingAmount: number[] = []; 
  chargeData: any[] = [];
  showPercentage: boolean;
  totalEstimateCost: string = '';
  showAmountInput: boolean;
  i: number;
  materialMasterObj = {
    materialsLabourMasterId: '',
    materialTypeMasterId: ' ',
    mlType: '',
    mlCode: '',
    mlName: '',
    mlRate: '',
    mlUnit: '',
    rateType: '',
  };

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
    private documentService:DocumentService,
    private location: Location,
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const edit = params.get('edit') as string;
      this.resetFields();
      this.estimateCharges.get('workExecutionMethod').valueChanges.subscribe((v) => {
        if (v) {
          this.isWorkExecutionSelected = true;
        } else {
          this.isWorkExecutionSelected = false;
        }
      });
      const accountId = params.get('accountId');
      const applicationStatusCode = params.get('statusCode');
      this.applicationStatusCode = applicationStatusCode;
      this.accountId = accountId;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeCode = sessionStorage.getItem('office-id');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
      const dashboardFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeCode };
      const specialFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeId: officeCode };
      const spLocAllowData = await this.estimateService.getSpecialLocalityAllowanceDataByOfficeId(specialFilter);
      const vendorFilter: any = { apiKey, serviceKey, userRole, userName, userCode };
      this.vendorData = await this.workAwardService.getAllRateContractData(vendorFilter);
      console.log('VENDOR__DATA', this.vendorData);

      this.specialLocalityAllowancePercent = spLocAllowData.percentageValue;
      const mainCategoryFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeCode, applicationStatusCode, accountId };
      const detailFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeCode, applicationStatusCode, accountId };
      this.dashboardList = await this.dashboardService.getDashboard(dashboardFilter);
      const estimateDetailData = await this.estimationRegisteredService.getDetailsByAccountIdAndStatusCode(detailFilter);
      const areaFilters:any ={apiKey,serviceKey,userRole,userName,userCode,}
      this.configurationService.getAreaSpecificLoaderGetAllData(areaFilters)
      .then((data: any) => {
        this.areaSpecificLoadingCharges = data;
      });
      // check if estimation type is GE then redirect it to estimation approval
      if (
        estimateDetailData &&
        estimateDetailData.estimationRegisteredDTO &&
        estimateDetailData.estimationRegisteredDTO.length &&
        estimateDetailData.estimationRegisteredDTO[0].estimationType === 'GE' &&
        edit !== 'edit'
      ) {
        this.router.navigate(['/main', 'estimation-approval', this.accountId, Number(applicationStatusCode)]);
      }

      // then implement this
      this.data = await this.dashboardService.getDataByAccountId(mainCategoryFilter);
      this.placeholder = `${this.data?.designationShortCode} - ${sessionStorage.getItem('user-name')}`;
      if (Number(this.data.totalContractedLoad) > 35) {
        const workExecution = await this.estimateService.getWorkExecutionMethodData(filter);
        this.workExecution = workExecution.filter((v: any) => v.woExecutionMethodName === 'Self Execution');
      } else {
        this.workExecution = await this.estimateService.getWorkExecutionMethodData(filter);
      }
      this.allWorkscopeDescription = await this.estimateService.getWorkDescMasterData(filter);
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
      const estType = await this.estimateService.getEstimateTypeMasterData(filter);
      this.estimateType = estType.filter((v: any) => v.estimateTypeMasterId === 1 || v.estimateTypeMasterId === 2);
      this.templateList = await this.estimateService.getTemplateList(filter);
      await this.onChangeMaterials();

      if (estimateDetailData && estimateDetailData.estimationWorkScopeDataDTO) {
        if (
          estimateDetailData.estimationRegisteredDTO[0]?.estimationType === 'GE' ||
          estimateDetailData.estimationRegisteredDTO[0]?.estimationType === 'RG'
        ) {
          this.estimationTypeGEorRG = false;
        }

        estimateDetailData.estimationWorkScopeDataDTO.forEach((workScope: any) => {
          let materialItems: any[] = [];
          const material = estimateDetailData.estimationMaterailsRegisteredDTOList.filter(
            (v: any) => v.estimationWorkScopeDataId === workScope.estTemplateWorkScopeMasterId,
          );
          if (material && material.length) {
            material.forEach((mat: any) => {
              let laboursData: any[] = [];
              const labour = estimateDetailData.estimationMaterialLabourDetailsDTOList.filter(
                (v: any) =>
                  v.estimationWorkScopeDataId === workScope.estTemplateWorkScopeMasterId && v.materialsMasterId === mat.materialsMasterId,
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
              // const mCode = mat.materialName.split('-');
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
          this.executionWorkTable.push({
            workType: workScope.workType,
            workPart: workScope.workPart,
            workscopeDescription: workScope.workscopeDescription,
            materialItems,
            materialCost: workScope.materialCost,
            labourCost: workScope.labourCost,
          });
        });
        this.estimationMaterialCost = estimateDetailData.estimationRegisteredDTO[0]?.estimationMaterialCost;
        this.estimationLabourCost = estimateDetailData.estimationRegisteredDTO[0]?.estimationLabourCost;
        const additionalCharge = estimateDetailData.estimationAddlChargesRegisteredDTOList;
        let sum: number = 0;
        if (additionalCharge && additionalCharge.length) {
          this.additionalCharges = additionalCharge.sort(
            (a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder),
          );
          // const addCharges = additionalCharge.sort((a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder));
          // const spLocAllAddChar = addCharges.find((v: any) => v.additionalChargeName === 'Special Locality Allowance');
          // spLocAllAddChar.chargeTypeValue = this.specialLocalityAllowancePercent;
          // this.additionalCharges = addCharges;
          this.addChargesBeforeTotalLabour = this.additionalCharges.filter(
            (v: any) => Number(v.chargesSequenceOrder) < 5 && Number(v.displayByDefault) === 1,
          );
          this.addChargesAfterTotalLabour = this.additionalCharges.filter(
            (v: any) => Number(v.chargesSequenceOrder) >= 5 && Number(v.displayByDefault) === 1,
          );
          const amt = this.addChargesBeforeTotalLabour.map((v: any) => v.amount);
          if (amt.length) {
            sum = amt.reduce((a: any, b: any) => {
              return Number(a) + Number(b);
            });
          }
        }
        this.totalLabourChargesInRs = Number(Number(sum).toFixed(2)) + Number(Number(this.estimationLabourCost).toFixed(2));
        this.totalEstimationCostInRs = estimateDetailData.estimationRegisteredDTO[0]?.estimationTotalCost;
        this.estimateCharges.get('estimationWorkDescription').setValue(estimateDetailData.estimationRegisteredDTO[0].estimationWorkDesc);
        const woExecutionMethodName = estimateDetailData.estimationRegisteredDTO[0]?.woExecutionMethodName;
        if (woExecutionMethodName && this.workExecution.length) {
          const woId = this.workExecution.find((v: any) => v.woExecutionMethodName === woExecutionMethodName).woExecutionMethodId;
          this.estimateCharges.get('workExecutionMethod').setValue(woId);
        }
        const estTypeName = estimateDetailData.estimationRegisteredDTO[0]?.estimateTypeName;
        const estTypeId = this.estimateType.find((v: any) => v.estimateTypeName === estTypeName).estimateTypeMasterId;
        this.estimateCharges.get('estimateType').setValue(estTypeId);
        this.estimateCharges.get('rateType').setValue(estimateDetailData.estimationRegisteredDTO[0]?.rateType);
        this.estimatedByForm.get('estimateRemark').setValue(estimateDetailData.estimationRegisteredDTO[0]?.estimationRemarks);
      }
      console.log('THIS.WORKEX', this.executionWorkTable);
    });
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
      });
      this.estimatedByForm.reset({
        estimatedBy: '',
        estimateRemark: '',
        estimationDate: '',
      });
      this.addChargeForm.reset({
        additionalCharges: '',
      });
      this.executionWorkTable = [];
      this.additionalCharges = [];
      this.savedAdditionalCharges = [];
      this.addChargesBeforeTotalLabour = [];
      this.addChargesAfterTotalLabour = [];
      this.templateData = {};
      this.selectedMaterialUnit = '';
      this.dataSource = [];
      this.allMaterials = [];
      resolve(true);
    });
  }

  private _filterMaterialUnits(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allMaterials.filter((name) => name.toLowerCase().includes(filterValue));
  }

  onChangeRateType(rateType: any) {
    if (rateType === 'SR') {
      this.showVendor = false;
    } else if (rateType === 'RC') {
      this.showVendor = true;
    }
    this.estimateCharges.get('vendor').setValue('');
  }

  onChangeVendor() {
    this.onChangeMaterials();
  }

  filterMaterialUnits(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredMaterialUnits = this.estimateCharges.get('materialUnitControl').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterMaterialUnits(value)),
    );
    this.filteredMaterialUnits = this.filteredMaterialUnits.pipe(
      map((units) => units.filter((unit) => unit.toLowerCase().includes(filterValue))),
    );
  }

  filterLabourUnits(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.filteredMaterialUnits = this.estimateCharges.get('labourUnitControl').valueChanges.pipe(
      startWith(''),
      map((value) => this._filterMaterialUnits(value)),
    );
    this.filteredMaterialUnits = this.filteredMaterialUnits.pipe(
      map((units) => units.filter((unit) => unit.toLowerCase().includes(filterValue))),
    );
  }

  async onMaterialUnitSelected(name: any) {
    this.materialMasterObj.mlName = name;
    const mat = name.split('-');
    const ml = this.dataSource.find((v: any) => v.rateType === mat[0] && v.mlCode === mat[1]);
    this.materialMasterObj.materialTypeMasterId = ml.materialTypeMasterId;
    this.materialMasterObj.rateType = ml.rateType;
    this.materialMasterObj.mlCode = ml.mlCode;
    this.materialMasterObj.materialsLabourMasterId = ml.materialsLabourMasterId;
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    if (ml.mlType === 'LABOR') {
      const labourFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        materialTypeMasterId: this.materialMasterObj.materialTypeMasterId,
        mlType: 'LABOR',
        rateType: this.materialMasterObj.rateType,
      };
      this.labourList = [];
      const ml1 = await this.estimateService.getMaterialLabourMasterData(labourFilter);
      this.materialList = ml1.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
    } else {
      const materialLabourMappingFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        materialMasterId: this.materialMasterObj.materialsLabourMasterId,
      };
      const labourMapping = await this.estimateService.getMaterialLabourMapping(materialLabourMappingFilter);
      if (labourMapping && labourMapping.length) {
        const labourIds = labourMapping.map((v: any) => v.labourMasterId);
        if (labourIds && labourIds.length) {
          this.estimateCharges.get('labourList').setValue(labourIds);
        }
      }
      const materialFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        materialTypeMasterId: this.materialMasterObj.materialTypeMasterId,
        mlType: 'MATERIAL',
        rateType: this.materialMasterObj.rateType,
      };
      const ml2 = await this.estimateService.getMaterialLabourMasterData(materialFilter);
      this.materialList = ml2.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
      const labourFilter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        materialTypeMasterId: this.materialMasterObj.materialTypeMasterId,
        mlType: 'LABOR',
        rateType: this.materialMasterObj.rateType,
      };
      const ll = await this.estimateService.getMaterialLabourMasterData(labourFilter);
      this.labourList = ll.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
    }
  }

  displayTemplateData(templateData: any) {
    if (templateData.estTemplateWorkScopeMaster && templateData.estTemplateWorkScopeMaster.length) {
      this.isTemplate = true;
      this.executionWorkTable = [];
      templateData.estTemplateWorkScopeMaster.forEach((workScope: any) => {
        const materialItems: any[] = [];
        const material = templateData.estTemplateMaterialsMaster.filter(
          (v: any) => Number(v.estimationWorkScopeDataId) === Number(workScope.estTemplateWorkScopeMasterId),
        );
        if (material && material.length) {
          material.forEach((mat: any) => {
            const laboursData: any[] = [];
            const labour = templateData.estimationTemplateMaterialLabourMaster.filter(
              (v: any) =>
                Number(v.estimationWorkScopeDataId) === Number(workScope.estTemplateWorkScopeMasterId) &&
                mat.materialsMasterId === v.materialsMasterId,
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
            // const mCode = mat.materialName.split('-');
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
        this.executionWorkTable.push({
          workType: workScope.workType,
          workPart: workScope.workPart,
          workscopeDescription: workScope.workscopeDescription,
          materialItems,
          materialCost: totalMaterialsAmount,
          labourCost: totalLaborAmount,
        });
      });
      let mc: number = 0;
      let lc: number = 0;
      const m = this.executionWorkTable.map((v: any) => v.materialCost);
      if (m.length) {
        mc = m.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
      const l = this.executionWorkTable.map((v: any) => v.labourCost);
      if (l.length) {
        lc = l.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
      this.estimationMaterialCost = Number(mc);
      this.estimationLabourCost = Number(lc);
      // forms setvalue
      this.estimateCharges.get('rateType').setValue(templateData?.estimationTemplateMaster?.rateType);
      this.estimateCharges.get('estimationWorkDescription').setValue(templateData?.estimationTemplateMaster?.estimationWorkDesc);
      const woExecutionMethodName = templateData?.estimationTemplateMaster?.woExecutionMethodName;
      console.log(woExecutionMethodName, this.workExecution);
      const woId = this.workExecution.find((v: any) => v.woExecutionMethodName === woExecutionMethodName).woExecutionMethodId;
      this.estimateCharges.get('workExecutionMethod').setValue(woId);
      const estTypeName = templateData?.estimationTemplateMaster?.estimateTypeName;
      const estTypeId = this.estimateType.find((v: any) => v.estimateTypeName === estTypeName).estimateTypeMasterId;
      this.estimateCharges.get('estimateType').setValue(estTypeId);
      console.log('EX WOR TAB', this.executionWorkTable);

      // for add charges
      const additionalCharge = templateData.estimationTemplateAddlChargesMaster;
      let sum: number = 0;
      if (additionalCharge && additionalCharge.length) {
        this.additionalCharges = additionalCharge.sort((a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder));
        this.addChargesBeforeTotalLabour = this.additionalCharges.filter(
          (v: any) => Number(v.chargesSequenceOrder) < 5 && Number(v.displayByDefault) === 1,
        );
        this.addChargesAfterTotalLabour = this.additionalCharges.filter(
          (v: any) => Number(v.chargesSequenceOrder) >= 5 && Number(v.displayByDefault) === 1,
        );
        const amt = this.addChargesBeforeTotalLabour.map((v: any) => v.amount);
        if (amt.length) {
          sum = amt.reduce((a: any, b: any) => {
            return Number(a) + Number(b);
          });
        }
      }
      this.totalLabourChargesInRs = Number(Number(sum).toFixed(2)) + Number(Number(this.estimationLabourCost).toFixed(2));

      ///////////////////////////////////////////////////////////////////////////////////////

      const totalMLCost = Number((Number(this.estimationMaterialCost) + Number(this.estimationLabourCost)).toFixed(2));
      const valueCalculatedByOnlyLabour = this.additionalCharges.filter(
        (v: any) => Number(v.valueCalculatedByLabour) === 1 && Number(v.valueCalculatedByMaterial) === 0,
      );
      if (valueCalculatedByOnlyLabour && valueCalculatedByOnlyLabour.length) {
        valueCalculatedByOnlyLabour.forEach((v: any) => {
          v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) / 100).toFixed(2));
        });
      }
      const valueCalculatedByBothLabourAndMaterial = this.additionalCharges.filter(
        (v: any) => Number(v.valueCalculatedByLabour) === 1 && Number(v.valueCalculatedByMaterial) === 1,
      );
      if (valueCalculatedByBothLabourAndMaterial && valueCalculatedByBothLabourAndMaterial.length) {
        valueCalculatedByBothLabourAndMaterial.forEach((v: any) => {
          v.amount = Number(Number((Number(v.chargeTypeValue) * Number(totalMLCost)) / 100).toFixed(2));
        });
      }
      const valueCalculatedByOnlyMaterial = this.additionalCharges.filter((v: any) => Number(v.valueCalculatedByMaterial) === 1);
      if (valueCalculatedByOnlyMaterial && valueCalculatedByOnlyMaterial.length) {
        valueCalculatedByOnlyMaterial.forEach((v: any) => {
          v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationMaterialCost)) / 100).toFixed(2));
        });
      }
      let beforeTotalLabour: number = 0;
      let afterTotalLabour: number = 0;
      if (this.additionalCharges) {
        const bLabour1 = this.additionalCharges.filter((v: any) => Number(v.chargesSequenceOrder) < 5 && Number(v.displayByDefault) === 1);
        if (bLabour1.length) {
          const bLabour2 = bLabour1.map((v: any) => v.amount);
          beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
            return Number(a) + Number(b);
          });
        }
        this.totalLabourChargesInRs = Number(this.estimationLabourCost) + Number(beforeTotalLabour);
        const aLabour1 = this.additionalCharges.filter((v: any) => v.chargesSequenceOrder >= 5 && Number(v.displayByDefault) === 1);
        if (aLabour1.length) {
          const aLabour2 = aLabour1.map((v: any) => v.amount);
          afterTotalLabour = aLabour2.reduce((a: any, b: any) => {
            return Number(a) + Number(b);
          });
        }
      }
      this.totalLabourChargesInRs = Number((Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(2));
      this.totalEstimationCostInRs = Number(
        (Number(this.estimationMaterialCost) + Number(this.totalLabourChargesInRs) + Number(afterTotalLabour)).toFixed(2),
      );
      console.log('IGREKF', this.executionWorkTable);
    }
  }

  async onChangeTypeOfWork() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    const workDescData = await this.estimateService.getWorkDescMasterData(filter);
    const workD = workDescData.filter((v: any) => v.workscopeDescCode !== 'SM');
    if (this.estimateCharges.get('typeOfWork').value === 'LT') {
      this.workscopeDesc = workD.filter((v: any) => {
        if (
          Number(v.estimateType) === Number(this.estimateCharges.get('estimateType').value) &&
          (v.workTypeApplicable === 'LT' || v.workTypeApplicable === 'BOTH')
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (this.estimateCharges.get('typeOfWork').value === 'HT') {
      this.workscopeDesc = workD.filter((v: any) => {
        if (
          Number(v.estimateType) === Number(this.estimateCharges.get('estimateType').value) &&
          (v.workTypeApplicable === 'HT' || v.workTypeApplicable === 'BOTH')
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    const workDesVal = Number(this.estimateCharges.get('workDescription').value);
    const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId === workDesVal);
    const alreadyExist = this.executionWorkTable.find(
      (v) =>
        v.workType === this.estimateCharges.get('typeOfWork').value &&
        v.workPart === this.estimateCharges.get('workPart').value &&
        v.workscopeDescription === workDesc.workscopeDescription,
    );
    if (alreadyExist) {
      this.snackbar.open('Scope of Work Already Exists!', 'OK');
      this.alreadyExistScopeOfWork = true;
    } else this.alreadyExistScopeOfWork = false;
  }

  async onChangeMaterialType() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    if (this.estimateCharges.get('materialType').value === '26') {
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
      const ml = await this.estimateService.getMaterialLabourMasterData(labourFilter);
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
      const ml = await this.estimateService.getMaterialLabourMasterData(materialFilter);
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
      const ll = await this.estimateService.getMaterialLabourMasterData(labourFilter);
      this.labourList = ll.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
    }
  }

  async onChangeWorkExecution(value: any) {
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
      woExecutionMethodId: this.estimateCharges.get('workExecutionMethod').value,
    };
    const additionCharge = await this.estimateService.getAdditionalChargesMasterData(additionalChargesFilter);
    const addedAmount = additionCharge.map((v: any) => {
      return { ...v, amount: 0 };
    });
    const addCharges = addedAmount.sort((a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder));
    // const spLocAllAddChar = addCharges.find((v: any) => v.additionalChargeName === 'Special Locality Allowance');
    // if (this.specialLocalityAllowancePercent) {
    //   spLocAllAddChar.chargeTypeValue = this.specialLocalityAllowancePercent;
    // }
    this.additionalCharges = addCharges;
    console.log('lgkmrds;', this.additionalCharges);
    this.addChargesBeforeTotalLabour = this.additionalCharges.filter(
      (v: any) => Number(v.chargesSequenceOrder) < 5 && Number(v.displayByDefault) === 1,
    );
    this.addChargesAfterTotalLabour = this.additionalCharges.filter(
      (v: any) => Number(v.chargesSequenceOrder) >= 5 && Number(v.displayByDefault) === 1,
    );
    if (Number(value) === 1 || Number(value) === 2 || Number(value) === 6) {
      this.estimateCharges.get('rateType').setValue('SR');
      this.onChangeRateType('SR');
    } else {
      this.estimateCharges.get('rateType').setValue('RC');
      this.onChangeRateType('RC');
    }
    this.estimateCharges.get('rateType').disable();
    this.onChangeMaterials();
  }

  async onChangeMaterials() {
    const vendor = this.estimateCharges.get('vendor').value;
    const workExecutionMethod = this.estimateCharges.get('workExecutionMethod').value;
    this.estimateCharges.get('materialUnitControl').setValue('');
    this.estimateCharges.get('labourUnitControl').setValue('');
    this.estimateCharges.get('labourList').setValue('');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, mlType: this.estimateCharges.get('materialOrLabour').value };
    const turnkeyFilter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      mlType: this.estimateCharges.get('materialOrLabour').value,
      rateContractMasterId: vendor,
    };
    if (Number(workExecutionMethod) === 4 && vendor) {
      this.dataSource = await this.configurationService.getDataByMlTypeAndVendorIdForPartialTurnkey(turnkeyFilter);
    } else if (Number(workExecutionMethod) === 5 && vendor) {
      this.dataSource = await this.configurationService.getDataByMlTypeAndVendorIdForTotalTurnkey(turnkeyFilter);
    } else if (Number(workExecutionMethod) === 4 && !vendor) {
      this.snackbar.open('Please select vendor', 'OK');
      this.dataSource = [];
    } else if (Number(workExecutionMethod) === 5 && !vendor) {
      this.snackbar.open('Please select vendor', 'OK');
      this.dataSource = [];
    } else {
      this.dataSource = await this.configurationService.getmaterialLabourMasterGetDataMlType(filter);
    }
    console.log('DATA SOURCE', this.dataSource);
    this.allMaterials = this.dataSource.map((v: any) => `${v.rateType}-${v.mlCode}-${v.mlName}`);
    if (this.estimateCharges.get('materialOrLabour').value === 'MATERIAL') {
      this.filteredMaterialUnits = this.estimateCharges.get('materialUnitControl').valueChanges.pipe(
        startWith(''),
        map((value) => {
          return this._filterMaterialUnits(value);
        }),
      );
    }
    if (this.estimateCharges.get('materialOrLabour').value === 'LABOR') {
      this.filteredMaterialUnits = this.estimateCharges.get('labourUnitControl').valueChanges.pipe(
        startWith(''),
        map((value) => this._filterMaterialUnits(value)),
      );
    }
  }

  openviewDialog(data: any) {
    this.dialog.open(ViewPopUpComponent, {
      data,
      width: '100%',
    });
  }

  deleteItem(i: number, id: number) {
    this.executionWorkTable[i].materialItems.splice(id, 1);
    let mrt: number = 0;
    let lrt: number = 0;
    const mAmt = this.executionWorkTable[i].materialItems.map((v: any) => v.materialsAmount);
    const lAmt = this.executionWorkTable[i].materialItems.map((v: any) => v.laboursAmount);
    if (mAmt.length) {
      mrt = mAmt.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    if (lAmt.length) {
      lrt = lAmt.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    this.executionWorkTable[i].materialCost = Number(Number(mrt).toFixed(2));
    this.executionWorkTable[i].labourCost = Number(Number(lrt).toFixed(2));
    this.refreshing();
  }

  removeExecutionWorkTable(index: number) {
    this.executionWorkTable.splice(index, 1);
    this.refreshing();
  }

  refreshing() {
    let mc: number = 0;
    let lc: number = 0;
    const m = this.executionWorkTable.map((v: any) => v.materialCost);
    if (m.length) {
      mc = m.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    const l = this.executionWorkTable.map((v: any) => v.labourCost);
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

  refreshAdditionalCharges() {
    const totalMLCost = Number((Number(this.estimationMaterialCost) + Number(this.estimationLabourCost)).toFixed(2));
    const valueCalculatedByOnlyBeforeLabour = this.addChargesBeforeTotalLabour.filter(
      (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 0,
    );
    const valueCalculatedByOnlyAfterLabour = this.addChargesBeforeTotalLabour.filter(
      (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 0,
    );
    if (valueCalculatedByOnlyBeforeLabour && valueCalculatedByOnlyBeforeLabour.length) {
      valueCalculatedByOnlyBeforeLabour.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) / 100).toFixed(2));
      });
    }
    if (valueCalculatedByOnlyAfterLabour && valueCalculatedByOnlyAfterLabour.length) {
      valueCalculatedByOnlyAfterLabour.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) / 100).toFixed(2));
      });
    }
    const valueCalculatedByBothBeforeLabourAndMaterial = this.addChargesBeforeTotalLabour.filter(
      (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 1,
    );
    const valueCalculatedByBothAfterLabourAndMaterial = this.addChargesAfterTotalLabour.filter(
      (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 1,
    );
    if (valueCalculatedByBothBeforeLabourAndMaterial && valueCalculatedByBothBeforeLabourAndMaterial.length) {
      valueCalculatedByBothBeforeLabourAndMaterial.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(totalMLCost)) / 100).toFixed(2));
      });
    }
    if (valueCalculatedByBothAfterLabourAndMaterial && valueCalculatedByBothAfterLabourAndMaterial.length) {
      valueCalculatedByBothAfterLabourAndMaterial.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(totalMLCost)) / 100).toFixed(2));
      });
    }
    const valueCalculatedByOnlyBeforeMaterial = this.additionalCharges.filter((v: any) => v.valueCalculatedByMaterial == 1);
    const valueCalculatedByOnlyAfterMaterial = this.additionalCharges.filter((v: any) => v.valueCalculatedByMaterial == 1);
    if (valueCalculatedByOnlyBeforeMaterial && valueCalculatedByOnlyBeforeMaterial.length) {
      valueCalculatedByOnlyBeforeMaterial.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationMaterialCost)) / 100).toFixed(2));
      });
    }
    if (valueCalculatedByOnlyAfterMaterial && valueCalculatedByOnlyAfterMaterial.length) {
      valueCalculatedByOnlyAfterMaterial.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationMaterialCost)) / 100).toFixed(2));
      });
    }
    let beforeTotalLabour: number = 0;
    let afterTotalLabour: number = 0;
    if (this.additionalCharges && this.additionalCharges.length) {
      const bLabour1 = this.addChargesBeforeTotalLabour.filter((v: any) => v.displayByDefault == 1);
      if (bLabour1.length) {
        const bLabour2 = bLabour1.map((v: any) => v.amount);
        beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
      const aLabour1 = this.addChargesAfterTotalLabour.filter((v: any) => v.displayByDefault == 1);
      if (aLabour1.length) {
        const aLabour2 = aLabour1.map((v: any) => v.amount);
        afterTotalLabour = aLabour2.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
    }
    this.totalLabourChargesInRs = Number((Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(2));
    console.log('log', beforeTotalLabour, afterTotalLabour, this.estimationLabourCost, this.totalLabourChargesInRs, afterTotalLabour);
    this.totalEstimationCostInRs = Number(
      (Number(this.estimationMaterialCost) + Number(this.totalLabourChargesInRs) + Number(afterTotalLabour)).toFixed(2),
    );
  }

  addItemTable() {
    if (this.executionWorkTable.length) {
      this.showTable = false;
      const labourData: any[] = [];
      let labourRate: number = 0;
      const cod = this.materialMasterObj.mlCode;
      const rt = this.materialMasterObj.rateType;
      const material = this.dataSource.find((v: any) => Number(v.mlCode) === Number(cod) && v.rateType === rt);
      if (material.mlType === 'LABOR') {
        labourRate = material.mlRate;
      } else {
        const materialsLabourMasterId = material.materialsLabourMasterId;
        const laborId = this.estimateCharges.get('labourList').value;
        if (laborId.length) {
          laborId.forEach((id: any) => {
            const labour = this.labourList.find((v: any) => v.materialsLabourMasterId === id);
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
      const selectedRadioButton = this.estimateCharges.get('undExWork').value;

      const exists = this.executionWorkTable[Number(selectedRadioButton)].materialItems.find((v: any) => {
        return Number(v.itemCode) === Number(material.mlCode) && v.rateType === material.rateType;
      });
      if (exists) {
        this.snackbar.open('Material Already Exists!', 'OK');
      } else {
        this.executionWorkTable[Number(selectedRadioButton)].materialItems.push({
          laborData: labourData,
          itemUnit: material.mlUnit,
          itemCode: material.mlCode,
          itemName: material.mlName,
          rateType: material.rateType,
          materialRate: material.mlType === 'LABOR' ? 0 : material.mlRate,
          materialTypeMasterId: material.materialsLabourMasterId,
          materialsLabourMasterId: material.materialsLabourMasterId,
          labourRate,
        });
      }
      this.estimateCharges.get('materialType').setValue('');
      this.estimateCharges.get('materialUnitControl').setValue('');
      this.estimateCharges.get('labourUnitControl').setValue('');
      this.estimateCharges.get('labourList').setValue('');
    } else {
      this.snackbar.open('Please add Workscope First!', 'OK');
    }
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
  async onQuantityChange(quantity: any, i: number, id: number, materialRate: number, labourRate: number) {
    console.log('quantity', quantity);
    let mrt: any;
    let lrt: any;
    if (Number(quantity) > 0) {
      mrt = quantity * materialRate;
      lrt = quantity * labourRate;
    } else {
      mrt = 0;
      lrt = 0;
      this.snackbar.open('Please enter the +ve integer quantity', 'OK');
    }
    this.executionWorkTable[i].materialItems[id].quantity = Number(Number(quantity));
    this.executionWorkTable[i].materialItems[id].materialsAmount = Number(Number(mrt).toFixed(2));
    this.executionWorkTable[i].materialItems[id].laboursAmount = Number(Number(lrt).toFixed(2));
    const tma = this.executionWorkTable[i].materialItems
      .map((v: any) => v.materialsAmount)
      .reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    const totalMaterialsAmount = Number(Number(tma).toFixed(2));
    const tla = this.executionWorkTable[i].materialItems
      .map((v: any) => v.laboursAmount)
      .reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    const totalLaborAmount = Number(Number(tla).toFixed(2));
    this.executionWorkTable[i].materialCost = totalMaterialsAmount;
    this.executionWorkTable[i].labourCost = totalLaborAmount;
    const mc = this.executionWorkTable
      .map((v: any) => v.materialCost)
      .reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    const lc = this.executionWorkTable
      .map((v: any) => v.labourCost)
      .reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    this.estimationMaterialCost = Number(mc);
    this.estimationLabourCost = Number(lc);
    const tmlc1 = Number(this.estimationMaterialCost) + Number(this.estimationLabourCost);
    const tmlc2 = tmlc1.toFixed(2);
    const totalMLCost = Number(tmlc2);
    const valueCalculatedByOnlyLabour = this.additionalCharges.filter(
      (v: any) => Number(v.valueCalculatedByLabour) === 1 && Number(v.valueCalculatedByMaterial) === 0,
    );
    if (valueCalculatedByOnlyLabour && valueCalculatedByOnlyLabour.length) {
      valueCalculatedByOnlyLabour.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) / 100).toFixed(2));
      });
    }
    const valueCalculatedByBothLabourAndMaterial = this.additionalCharges.filter(
      (v: any) => Number(v.valueCalculatedByLabour) === 1 && Number(v.valueCalculatedByMaterial) === 1,
    );
    if (valueCalculatedByBothLabourAndMaterial && valueCalculatedByBothLabourAndMaterial.length) {
      valueCalculatedByBothLabourAndMaterial.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(totalMLCost)) / 100).toFixed(2));
      });
    }
    const valueCalculatedByOnlyMaterial = this.additionalCharges.filter((v: any) => Number(v.valueCalculatedByMaterial) === 1);
    if (valueCalculatedByOnlyMaterial && valueCalculatedByOnlyMaterial.length) {
      valueCalculatedByOnlyMaterial.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationMaterialCost)) / 100).toFixed(2));
      });
    }
    let beforeTotalLabour: number = 0;
    let afterTotalLabour: number = 0;
    console.log('additionalCharges', this.additionalCharges);
    if (this.additionalCharges) {
      const bLabour1 = this.additionalCharges.filter((v: any) => Number(v.chargesSequenceOrder) < 5 && Number(v.displayByDefault) === 1);
      if (bLabour1.length) {
        const bLabour2 = bLabour1.map((v: any) => v.amount);
        beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
      this.totalLabourChargesInRs = Number(this.estimationLabourCost) + Number(beforeTotalLabour);
      const aLabour1 = this.additionalCharges.filter((v: any) => v.chargesSequenceOrder >= 5 && Number(v.displayByDefault) === 1);
      if (aLabour1.length) {
        const aLabour2 = aLabour1.map((v: any) => v.amount);
        console.log('aLabour2', aLabour2);
        afterTotalLabour = aLabour2.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
    }
    this.totalLabourChargesInRs = Number((Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(2));
    this.totalEstimationCostInRs = Number(
      (Number(this.estimationMaterialCost) + Number(this.totalLabourChargesInRs) + Number(afterTotalLabour)).toFixed(2),
    );
  }
  get basicRate(): number {
    const sum = this.estimationMaterialCost + this.estimationLabourCost;
    return Number(sum.toFixed(2)); 
}

calculateAmount(chargesPercentage: number, basicRate: number): number {
    return (basicRate * chargesPercentage) / 100;
}
onChange(addCharge: any, chargesCategory: string) {
  const selectedCharge = this.areaSpecificLoadingCharges.find(charge => charge.chargesCategory === chargesCategory);
  if (selectedCharge) {
    addCharge.chargeTypeValue = selectedCharge.chargesPercentage;
    addCharge.areaSpecificLoadingChargesMasterId = selectedCharge.areaSpecificLoadingChargesMasterId;
    const basicRate = this.basicRate;
    const calculatedAmount = this.calculateAmount(selectedCharge.chargesPercentage, basicRate);
    addCharge.amount = calculatedAmount.toFixed(2);
    addCharge.showPercentage = true;
    addCharge.showAmountInput = true;
    const existingChargeIndex = this.addChargesBeforeTotalLabour.findIndex(charge => charge.chargesCategory === addCharge.chargesCategory);
    if (existingChargeIndex !== -1) {
      this.addChargesBeforeTotalLabour[existingChargeIndex] = addCharge;
    } else {
      this.addChargesBeforeTotalLabour.push(addCharge);
    }

    const gstChargeIndex = this.addChargesBeforeTotalLabour.findIndex(charge => charge.additionalChargeName === 'GST');
    if (gstChargeIndex !== -1) {
      const gstCharge = this.addChargesBeforeTotalLabour[gstChargeIndex];
      const totalAmountIncludingCharge = basicRate + parseFloat(addCharge.amount);
      const gstAmount = ((totalAmountIncludingCharge * gstCharge.chargeTypeValue) / 100).toFixed(2);
      gstCharge.amount = gstAmount;
      gstCharge.showAmountInput = true;
      this.addChargesBeforeTotalLabour[gstChargeIndex] = gstCharge;
      const selectedChargeAmount = parseFloat(addCharge.amount);
      this.totalEstimateCost = (basicRate + selectedChargeAmount + parseFloat(gstCharge.amount)).toFixed(2);
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
      const chargeData = [
        addCharge.areaSpecificLoadingChargesMasterId,
        this.totalEstimateCost,
        addCharge.amount,
        this.totalEstimationCostInRs
      ];
    }
  }
}

  addExecutionWorkTable() {
    const wem = this.estimateCharges.get('workExecutionMethod').value;
    const estimateType = this.estimateCharges.get('estimateType').value;
    const rateType = this.estimateCharges.get('rateType').value;
    if (wem && estimateType && rateType) {
      const workDesVal = Number(this.estimateCharges.get('workDescription').value);
      const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId === workDesVal);
      const alreadyExist = this.executionWorkTable.find(
        (v) =>
          v.workType === this.estimateCharges.get('typeOfWork').value &&
          v.workPart === this.estimateCharges.get('workPart').value &&
          v.workscopeDescription === workDesc.workscopeDescription,
      );
      if (alreadyExist) {
        this.snackbar.open('Scope of Work Already Exists!', 'OK');
        this.alreadyExistScopeOfWork = true;
      } else {
        this.alreadyExistScopeOfWork = false;
        this.estimateCharges.get('undExWork').setValue(`${this.executionWorkTable.length}`);
        this.executionWorkTable.push({
          workType: this.estimateCharges.get('typeOfWork').value,
          workPart: this.estimateCharges.get('workPart').value,
          workscopeDescription: workDesc.workscopeDescription,
          materialItems: [],
          materialCost: null,
          labourCost: null,
        });
        this.estimateCharges.get('typeOfWork').setValue('');
        this.estimateCharges.get('workPart').setValue('');
        this.estimateCharges.get('workDescription').setValue('');
      }
    } else {
      this.snackbar.open('Please select Estimates Charges', 'OK');
    }
  }

  onChangeWorkDescription() {
    const workDesVal = Number(this.estimateCharges.get('workDescription').value);
    const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId === workDesVal);
    const alreadyExist = this.executionWorkTable.find(
      (v) =>
        v.workType === this.estimateCharges.get('typeOfWork').value &&
        v.workPart === this.estimateCharges.get('workPart').value &&
        v.workscopeDescription === workDesc.workscopeDescription,
    );
    if (alreadyExist) {
      this.snackbar.open('Scope of Work Already Exists!', 'OK');
      this.alreadyExistScopeOfWork = true;
    } else this.alreadyExistScopeOfWork = false;
  }

  onChangeWorkPart() {
    if (this.estimateCharges.get('workDescription').value) {
      const workDesVal = Number(this.estimateCharges.get('workDescription').value);
      if (this.workscopeDesc.length) {
        const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId === workDesVal);
        const alreadyExist = this.executionWorkTable.find(
          (v) =>
            v.workType === this.estimateCharges.get('typeOfWork').value &&
            v.workPart === this.estimateCharges.get('workPart').value &&
            v.workscopeDescription === workDesc.workscopeDescription,
        );
        if (alreadyExist) {
          this.snackbar.open('Scope of Work Already Exists!', 'OK');
          this.alreadyExistScopeOfWork = true;
        } else {
          this.alreadyExistScopeOfWork = false;
        }
      }
    }
  }

  removeAdditionalChargesBeforeTotalLabour(estimationAdditionalChargesId: number) {
    const before = this.addChargesBeforeTotalLabour.findIndex(
      (v: any) => Number(v.estimationAdditionalChargesId) === Number(estimationAdditionalChargesId),
    );
    this.addChargesBeforeTotalLabour.splice(before, 1);
    this.refreshAdditionalCharges();
  }

  removeAdditionalChargesAfterTotalLabour(estimationAdditionalChargesId: number) {
    const after = this.addChargesAfterTotalLabour.findIndex(
      (v: any) => Number(v.estimationAdditionalChargesId) === Number(estimationAdditionalChargesId),
    );
    this.addChargesAfterTotalLabour.splice(after, 1);
  //  this.refreshAdditionalCharges();
  }

  onAdditionalChargeAmount($event: any, additionalChargesId: string) {
    let amount = $event.target?.value;
    const addCharge = this.additionalCharges.find((v: any) => Number(v.estimationAdditionalChargesId) === Number(additionalChargesId));
    addCharge.amount = Number(amount);
    let beforeTotalLabour: number = 0;
    let afterTotalLabour: number = 0;
    const bLabour1 = this.additionalCharges.filter((v: any) => Number(v.chargesSequenceOrder) < 5 && Number(v.displayByDefault) === 1);
    if (bLabour1.length) {
      const bLabour2 = bLabour1.map((v: any) => v.amount);
      beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    this.totalLabourChargesInRs = Number(this.estimationLabourCost) + Number(beforeTotalLabour);
    const aLabour1 = this.additionalCharges.filter((v: any) => Number(v.chargesSequenceOrder) >= 5 && Number(v.displayByDefault) === 1);
    if (aLabour1.length) {
      const aLabour2 = aLabour1.map((v: any) => v.amount);
      afterTotalLabour = aLabour2.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    this.totalLabourChargesInRs = Number((Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(2));
    this.totalEstimationCostInRs = Number(
      (Number(this.estimationMaterialCost) + Number(this.totalLabourChargesInRs) + Number(afterTotalLabour)).toFixed(2),
    );
    console.log(this.estimationMaterialCost, this.totalLabourChargesInRs, afterTotalLabour);
  }

  viewInspection() {
    this.router.navigate(['/main/view-site-inspection'], {
      queryParams: { accountId: this.accountId },
    });
  }

  async submitEstimationForm() {
    const chargeData = [this.totalEstimateCost,this.totalEstimationCostInRs];
    const [totalEstimateCost,totalEstimationCostInRs] = chargeData;
    let emptyQuantity: boolean = false;
    let emptyAdditionalCharge: boolean = false;
    console.log('EXECUTION WORK TABLE', this.executionWorkTable);
    const estimationWorkScopeDataDTO: any[] = [];
    const estimationMaterialLabourDetailsDTO: any[] = [];
    const materialDetails: any[] = [];
    const finalAdditionalCharges: any[] = [];
    this.executionWorkTable.forEach((exWorkTable: any) => {
      const workscopeDesc = this.allWorkscopeDescription.find((v: any) => v.workscopeDescription === exWorkTable.workscopeDescription);
      estimationWorkScopeDataDTO.push({
        workType: exWorkTable.workType,
        workPart: exWorkTable.workPart,
        workscopeDescMasterId: workscopeDesc.workscopeDescMasterId,
        workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
        materialCost: exWorkTable.materialCost,
        labourCost: exWorkTable.labourCost,
      });
      const materialItems = exWorkTable.materialItems;
      console.log('materialItems', materialItems);
      materialItems.forEach((wItem: any) => {
        if (!wItem.quantity) {
          emptyQuantity = true;
        }
        const labourAmount = wItem.labourRate * wItem.quantity;
        materialDetails.push({
          rateType: wItem.rateType,
          materailAmount: wItem.materialsAmount,
          quantity: wItem.quantity,
          materialCode: wItem.itemCode,
          materialName: wItem.itemName,
          materialRate: wItem.materialRate,
          labourRate: wItem.labourRate,
          labourAmount,
          materialUnit: wItem.itemUnit,
          materialsMasterId: wItem.materialTypeMasterId,
          materialsLabourMasterId: wItem.materialsLabourMasterId,
          materialDisplayType: wItem.labourRate ? '1' : '0',
          workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
        });
        const labourData = wItem.laborData;
        labourData.forEach((lab: any) => {
          estimationMaterialLabourDetailsDTO.push({
            quantity: wItem.quantity,
            materialName: wItem.itemName,
            labourName: lab.mlName,
            materialMasterId: lab.mlmid,
            labourMasterId: lab.materialsLabourMasterId,
            labourUnit: lab.mlUnit,
            labourRate: lab.mlRate,
            workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
          });
        });
      });
    });
    if (
      this.addChargesBeforeTotalLabour &&
      this.addChargesBeforeTotalLabour.length &&
      this.addChargesAfterTotalLabour &&
      this.addChargesAfterTotalLabour.length &&
      this.chargeData
    ) {
      const addChargeArr = [...this.addChargesBeforeTotalLabour, ...this.addChargesAfterTotalLabour, ...this.chargeData];
      addChargeArr.forEach((v: any) => {
        if (v.amount === 0) {
          emptyAdditionalCharge = true;
        }
        finalAdditionalCharges.push({
          estimationAdditionalChargesId: v.estimationAdditionalChargesId,
          areaSpecificLoadingChargesMasterId:v.areaSpecificLoadingChargesMasterId,
          additionalChargeName: v.additionalChargeName,
          chargeTypeValue: v.chargeTypeValue,
          chargesSequenceOrder: v.chargesSequenceOrder,
          chargeType: v.chargeType,
          amount: v.amount,
        });
      });
    }
    const estimationDate = this.estimatedByForm.get('estimationDate').value;
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    const estimate: any = {
      estimationRegisteredDTO: {
        serviceRegistrationId: this.data.serviceRegistrationId,
        estimationWorkDesc: this.estimateCharges.get('estimationWorkDescription').value,
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod').value,
        estimateType: this.estimateCharges.get('estimateType').value,
        rateType: this.estimateCharges.get('rateType').value,
        estimatedBy: '',
        estimationRemarks: this.estimatedByForm.get('estimateRemark').value,
        estimationMaterialCost: this.estimationMaterialCost,
        estimationLabourCost: totalEstimateCost,
        estimationTotalCost: this.totalEstimationCostInRs,
        officeId: sessionStorage.getItem('office-id'),
        totalLabourCharges: totalEstimationCostInRs,
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
    if (emptyQuantity) {
      this.snackbar.open('Please enter quantity first', 'OK');
    } else if (emptyAdditionalCharge) {
      this.snackbar.open('Either enter value or remove the additional charge', 'OK');
    } else {
      console.log('ESTIMATE SAVE DATA', estimate);
      const res = await this.estimateService.saveEstimationData(filter, estimate).catch((e: any) => console.log(e));
      if (res) {
        this.snackbar.open('Data Saved Successfully', 'OK');
      }
    }
  }

  openTemplatesDialog() {
    const dialogRef = this.dialog.open(TemplatesPopupComponent, {
      data: this.templateList,
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
      this.templateData = result;
      if (result) {
        this.displayTemplateData(result);
      }
    });
  }

  openConfirmationpopupDialog() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.submitEstimationForm();
      }
    });
  }

  openTemplatePopupDialog() {
    const dialogRef = this.dialog.open(SaveTemplateConfirmComponent, {
      data: this.estimateCharges.get('estimationWorkDescription').value,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === 'no') {
        console.log('clicked on NO', res);
      } else {
        console.log('clicked on YES', res);
        this.saveTemplate(res.estimationName);
      }
    });
  }

  openGenerateEstimationDialog() {
    const dialogRef = this.dialog.open(GeneratePopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.generateEstimation();
      }
    });
  }

  openReGenerateEstimationDialog() {
    const dialogRef = this.dialog.open(GeneratePopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.reGenerateEstimation();
      }
    });
  }

  async saveTemplate(estimationName: any) {
    let emptyQuantity: boolean = false;
    let emptyAdditionalCharge: boolean = false;
    console.log(estimationName);
    console.log('EXECUTION WORK TABLE', this.executionWorkTable);
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, estimationName };
    const estimationWorkScopeDataDTO: any[] = [];
    const estimationMaterialLabourDetailsDTO: any[] = [];
    const materialDetails: any[] = [];
    this.executionWorkTable.forEach((exWorkTable: any) => {
      const workscopeDesc = this.allWorkscopeDescription.find((v: any) => v.workscopeDescription === exWorkTable.workscopeDescription);
      estimationWorkScopeDataDTO.push({
        workType: exWorkTable.workType,
        workPart: exWorkTable.workPart,
        workscopeDescMasterId: workscopeDesc.workscopeDescMasterId,
        workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
        materialCost: exWorkTable.materialCost,
        labourCost: exWorkTable.labourCost,
      });
      const materialItems = exWorkTable.materialItems;
      materialItems.forEach((wItem: any) => {
        if (!wItem.quantity) {
          emptyQuantity = true;
        }
        const labourAmount = wItem.labourRate * wItem.quantity;
        materialDetails.push({
          rateType: wItem.rateType,
          materailAmount: wItem.materialsAmount,
          quantity: wItem.quantity,
          materialCode: wItem.itemCode,
          materialName: wItem.itemName,
          materialRate: wItem.materialRate,
          labourRate: wItem.labourRate,
          labourAmount,
          materialUnit: wItem.itemUnit,
          materialsMasterId: wItem.materialTypeMasterId,
          materialsLabourMasterId: wItem.materialsLabourMasterId,
          materialDisplayType: wItem.labourRate ? '1' : '0',
          workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
        });
        const labourData = wItem.laborData;
        labourData.forEach((lab: any) => {
          estimationMaterialLabourDetailsDTO.push({
            quantity: wItem.quantity,
            materialName: wItem.itemName,
            labourName: lab.mlName,
            materialMasterId: lab.mlmid,
            labourMasterId: lab.materialsLabourMasterId,
            labourUnit: lab.mlUnit,
            labourRate: lab.mlRate,
            workScopeText: `${exWorkTable.workType}#${exWorkTable.workPart}#${workscopeDesc.workscopeDescMasterId}`,
          });
        });
      });
    });
    const finalAdditionalCharges: any[] = [];
    if (
      this.addChargesBeforeTotalLabour &&
      this.addChargesBeforeTotalLabour.length &&
      this.addChargesAfterTotalLabour &&
      this.addChargesAfterTotalLabour.length
    ) {
      const addChargeArr = [...this.addChargesBeforeTotalLabour, ...this.addChargesAfterTotalLabour];
      addChargeArr.forEach((v: any) => {
        if (v.amount === 0) {
          emptyAdditionalCharge = true;
        }
        finalAdditionalCharges.push({
          estimationAdditionalChargesId: v.estimationAdditionalChargesId,
          additionalChargeName: v.additionalChargeName,
          chargeTypeValue: v.chargeTypeValue,
          chargesSequenceOrder: v.chargesSequenceOrder,
          chargeType: v.chargeType,
          amount: v.amount,
        });
      });
    }
    const estimationDate = this.estimatedByForm.get('estimationDate').value;
    const estimate: any = {
      estimationTemplateMasterDTO: {
        estimationTemplateName: estimationName,
        serviceRegistrationId: this.data.serviceRegistrationId,
        estimationWorkDesc: this.estimateCharges.get('estimationWorkDescription').value,
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod').value,
        estimateType: this.estimateCharges.get('estimateType').value,
        rateType: this.estimateCharges.get('rateType').value,
        estimatedBy: '',
        estimationRemarks: this.estimatedByForm.get('estimateRemark').value,
        estimationMaterialCost: this.estimationMaterialCost,
        estimationLabourCost: this.estimationLabourCost,
        estimationTotalCost: this.totalEstimationCostInRs,
        officeId: sessionStorage.getItem('office-id'),
        totalLabourCharges: this.totalLabourChargesInRs,
      },
      estTemplateWorkScopeMasterDTO: estimationWorkScopeDataDTO,
      estTemplateMaterialsMasterDTO: materialDetails,
      estimationTemplateMaterialLabourMasterDTO: estimationMaterialLabourDetailsDTO,
      estimationTemplateAddlChargesMasterDTO: finalAdditionalCharges,
      estimationProcessFlowDTO: {
        estimationFlowType: 'S',
      },
    };
    if (estimationDate) {
      const esd = new Date(`${estimationDate} 00:00`);
      estimate.estimationRegisteredDTO.estimationDate = esd.toISOString();
    }
    if (emptyQuantity) {
      this.snackbar.open('Please enter quantity first', 'OK');
    } else if (emptyAdditionalCharge) {
      this.snackbar.open('Either enter value or remove the additional charge', 'OK');
    } else {
      console.log('ESTIMATE SAVE DATA', estimate);
      const res = await this.estimationRegisteredService.saveTemplateData(filter, estimate).catch((e: any) => console.log(e));
      if (res) {
        this.snackbar.open('Data Saved Successfully', 'OK');
      }
    }
  }

  async generateEstimation() {
    let emptyQuantity: boolean = false;
    let emptyAdditionalCharge: boolean = false;
    console.log('EXECUTION WORK TABLE', this.executionWorkTable);
    const estimationWorkScopeDataDTO: any[] = [];
    const estimationMaterialLabourDetailsDTO: any[] = [];
    const materialDetails: any[] = [];
    this.executionWorkTable.forEach((exWorkTable: any) => {
      const workscopeDesc = this.allWorkscopeDescription.find((v: any) => v.workscopeDescription === exWorkTable.workscopeDescription);
      estimationWorkScopeDataDTO.push({
        workType: exWorkTable.workType,
        workPart: exWorkTable.workPart,
        workscopeDescMasterId: workscopeDesc ? workscopeDesc.workscopeDescMasterId : '',
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
          materailAmount: Number(wItem.materialsAmount),
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
      this.addChargesBeforeTotalLabour &&
      this.addChargesBeforeTotalLabour.length &&
      this.addChargesAfterTotalLabour &&
      this.addChargesAfterTotalLabour.length
    ) {
      const addChargeArr = [...this.addChargesBeforeTotalLabour, ...this.addChargesAfterTotalLabour];
      addChargeArr.forEach((v: any) => {
        if (Number(v.amount) === 0) {
          emptyAdditionalCharge = true;
        }
        finalAdditionalCharges.push({
          estimationAdditionalChargesId: Number(v.estimationAdditionalChargesId),
          additionalChargeName: v.additionalChargeName,
          chargeTypeValue: Number(v.chargeTypeValue),
          chargesSequenceOrder: Number(v.chargesSequenceOrder),
          chargeType: v.chargeType,
          amount: Number(v.amount),
        });
      });
    }
    const estimationDate = this.estimatedByForm.get('estimationDate').value;
    console.log('es', estimationDate);

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, estimationType: 'GE' };
    const estimate: any = {
      estimationRegisteredDTO: {
        serviceRegistrationId: this.data.serviceRegistrationId,
        estimationWorkDesc: this.estimateCharges.get('estimationWorkDescription').value,
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod').value,
        estimateType: this.estimateCharges.get('estimateType').value,
        rateType: this.estimateCharges.get('rateType').value,
        estimatedBy: '',
        estimationRemarks: this.estimatedByForm.get('estimateRemark').value,
        estimationMaterialCost: this.estimationMaterialCost,
        estimationLabourCost: this.estimationLabourCost,
        estimationTotalCost: this.totalEstimationCostInRs,
        officeId: sessionStorage.getItem('office-id'),
        totalLabourCharges: this.totalLabourChargesInRs,
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
      console.log('esd', esd);
      estimate.estimationRegisteredDTO.estimationDate = esd.toISOString();
      console.log('estima', estimate.estimationRegisteredDTO.estimationDate);
    }
    if (emptyQuantity) {
      this.snackbar.open('Please enter quantity first', 'OK');
    } else if (emptyAdditionalCharge) {
      this.snackbar.open('Either enter value or remove the additional charge', 'OK');
    } else {
      console.log('ESTIMATE SAVE DATA', estimate);
      const res = await this.estimationRegisteredService.generateEstimation(filter, estimate).catch((e: any) => console.log(e));
      if (res) {
        this.snackbar.open('Data Saved Successfully', 'OK');
        this.router.navigate(['/main', 'estimation-approval', this.accountId, Number(this.applicationStatusCode)]);
      }
    }
  }

  addAdditionalCharges() {
    const addChargeId = Number(this.addChargeForm.get('additionalCharges').value);
    if (this.isTemplate) {
      const ac = this.additionalCharges.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId);
      if (
        this.addChargesBeforeTotalLabour.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId) ||
        this.addChargesAfterTotalLabour.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId)
      ) {
        this.snackbar.open('Additional Charge already exists', 'OK');
      } else {
        if (Number(ac.chargesSequenceOrder) < 5) {
          this.addChargesBeforeTotalLabour.push(ac);
          this.addChargesBeforeTotalLabour.sort((a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder));
        }
        if (Number(ac.chargesSequenceOrder) >= 5) {
          this.addChargesAfterTotalLabour.push(ac);
          this.addChargesAfterTotalLabour.sort((a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder));
        }
      }
    } else {
      const ac = this.additionalCharges.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId);
      if (
        this.addChargesBeforeTotalLabour.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId) ||
        this.addChargesAfterTotalLabour.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId)
      ) {
        this.snackbar.open('Additional Charge already exists', 'OK');
      } else {
        if (Number(ac.chargesSequenceOrder) < 5) {
          this.addChargesBeforeTotalLabour.push(ac);
          this.addChargesBeforeTotalLabour.sort((a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder));
        }
        if (Number(ac.chargesSequenceOrder) >= 5) {
          this.addChargesAfterTotalLabour.push(ac);
          this.addChargesAfterTotalLabour.sort((a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder));
        }
      }
    }
  }

  onChangeAdditionalCharges() {
    const addChargeId = Number(this.addChargeForm.get('additionalCharges').value);
    if (this.isTemplate) {
      if (
        this.addChargesBeforeTotalLabour.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId) ||
        this.addChargesAfterTotalLabour.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId)
      ) {
        this.alreadyExistAdditionalCharge = true;
      } else {
        this.alreadyExistAdditionalCharge = false;
      }
    } else {
      if (
        this.addChargesBeforeTotalLabour.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId) ||
        this.addChargesAfterTotalLabour.find((v) => Number(v.estimationAdditionalChargesId) === addChargeId)
      ) {
        this.alreadyExistAdditionalCharge = true;
      } else {
        this.alreadyExistAdditionalCharge = false;
      }
    }
  }

  async reGenerateEstimation() {
    let emptyQuantity: boolean = false;
    let emptyAdditionalCharge: boolean = false;
    console.log('EXECUTION WORK TABLE', this.executionWorkTable);
    const estimationWorkScopeDataDTO: any[] = [];
    const estimationMaterialLabourDetailsDTO: any[] = [];
    const materialDetails: any[] = [];
    this.executionWorkTable.forEach((exWorkTable: any) => {
      const workscopeDesc = this.allWorkscopeDescription.find((v: any) => v.workscopeDescription === exWorkTable.workscopeDescription);
      estimationWorkScopeDataDTO.push({
        workType: exWorkTable.workType,
        workPart: exWorkTable.workPart,
        workscopeDescMasterId: workscopeDesc ? workscopeDesc.workscopeDescMasterId : '',
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
          materailAmount: Number(wItem.materialsAmount),
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
      this.addChargesBeforeTotalLabour &&
      this.addChargesBeforeTotalLabour.length &&
      this.addChargesAfterTotalLabour &&
      this.addChargesAfterTotalLabour.length
    ) {
      const addChargeArr = [...this.addChargesBeforeTotalLabour, ...this.addChargesAfterTotalLabour];
      addChargeArr.forEach((v: any) => {
        if (Number(v.amount) === 0) {
          emptyAdditionalCharge = true;
        }
        finalAdditionalCharges.push({
          estimationAdditionalChargesId: Number(v.estimationAdditionalChargesId),
          additionalChargeName: v.additionalChargeName,
          chargeTypeValue: Number(v.chargeTypeValue),
          chargesSequenceOrder: Number(v.chargesSequenceOrder),
          chargeType: v.chargeType,
          amount: Number(v.amount),
        });
      });
    }
    const estimationDate = this.estimatedByForm.get('estimationDate').value;
    console.log('es', estimationDate);

    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, estimationType: 'RG' };
    const estimate: any = {
      estimationRegisteredDTO: {
        serviceRegistrationId: this.data.serviceRegistrationId,
        estimationWorkDesc: this.estimateCharges.get('estimationWorkDescription').value,
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod').value,
        estimateType: this.estimateCharges.get('estimateType').value,
        rateType: this.estimateCharges.get('rateType').value,
        estimatedBy: '',
        estimationRemarks: this.estimatedByForm.get('estimateRemark').value,
        estimationMaterialCost: this.estimationMaterialCost,
        estimationLabourCost: this.estimationLabourCost,
        estimationTotalCost: this.totalEstimationCostInRs,
        officeId: sessionStorage.getItem('office-id'),
        totalLabourCharges: this.totalLabourChargesInRs,
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
      console.log('esd', esd);
      estimate.estimationRegisteredDTO.estimationDate = esd.toISOString();
      console.log('estima', estimate.estimationRegisteredDTO.estimationDate);
    }
    if (emptyQuantity) {
      this.snackbar.open('Please enter quantity first', 'OK');
    } else if (emptyAdditionalCharge) {
      this.snackbar.open('Either enter value or remove the additional charge', 'OK');
    } else {
      console.log('ESTIMATE SAVE DATA', estimate);
      const res = await this.estimationRegisteredService.generateEstimation(filter, estimate).catch((e: any) => console.log(e));
      if (res) {
        this.snackbar.open('Data Saved Successfully', 'OK');
        this.router.navigate(['/main', 'estimation-approval', this.accountId, Number(this.applicationStatusCode)]);
      }
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
