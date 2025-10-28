import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ViewPopUpComponent } from '../../../estimate-forms/components/view-pop-up/view-pop-up.component';
import { EstimateService } from 'src/app/services/estimate.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimationRegisteredService } from 'src/app/services/estimationRegistered';
import { GeneratePopupComponent } from '../../../shared/components/generate-popup/generate-popup.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { WorkAwardService } from 'src/app/services/work-award.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { GatePassAcknowledgementService } from 'src/app/services/gate-pass-acknowledgement.service';
import { LoaderService } from 'src/app/services/loader.service';
const estimateCharges = new FormGroup({
  typeOfWork: new FormControl('', []),
  workPart: new FormControl('', []),
  workDescription: new FormControl('', []),
  materialType: new FormControl('', []),
  rateType: new FormControl('SR', [Validators.required]),
  suspenseOffice: new FormControl('', [Validators.required]),
  workCategory: new FormControl('', [Validators.required]),
  workExecutionMethod: new FormControl('', [Validators.required]),
  estimationWorkDescription: new FormControl('', [Validators.required]),
  estimateType: new FormControl('', []),
  materialUnitControl: new FormControl('', []),
  labourUnitControl: new FormControl('', []),
  labourList: new FormControl('', []),
  undExWork: new FormControl('', []),
  materialOrLabour: new FormControl('MATERIAL', []),
  suspenseRequestNo: new FormControl('', [Validators.required]),
});

const estimatedByForm = new FormGroup({
  pdfFile: new FormControl (''),
  certification: new FormControl('', [Validators.required]),
  report: new FormControl('', [Validators.required]),
  estimatedBy: new FormControl('', []),
  estimateRemark: new FormControl('', [Validators.required]),
  estimationDate: new FormControl('', [Validators.required]),
});

const addChargeForm = new FormGroup({
  additionalCharges: new FormControl('', []),
  areaSpecificLoading:new FormControl('',[]) 
});

@Component({
  selector: 'app-emergency-estimation-creation',
  templateUrl: './emergency-estimation-creation.component.html',
  styleUrls: ['./emergency-estimation-creation.component.scss'],
})
export class EmergencyEstimationCreationComponent implements OnInit {
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
  applicationStatusCode: any;
  allWorkscopeDescription: any;
  dashboardList: any;
  templateList: any;
  allWorkExecutionData: any;
  workExecution: any;
  workCategoryData: any[] = [];
  suspenseStoreData: any[] = [];
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
  showTable: boolean = true;
  additionalCharges: any[] = [];
  additionalChargesSel: any[] = [];
  regularizationFilterExecutionWorkTable: any[] = [];
  savedAdditionalCharges: any[] = [];
  addChargesBeforeTotalLabour: any[] = [];
  addChargesAfterTotalLabour: any[] = [];
  workPart: string[] = ['Part A', 'Part B', 'Part C', 'Part D', 'Part E', 'Part F'];
  nextPartCharCode = 'F'.charCodeAt(0);
  templateData: any = {};
  selectedMaterialUnit: string = '';
  placeholder: string = '';
  filteredMaterialUnits: Observable<string[]>;
  dataSource: any[] = [];
  allMaterials: string[] = [];
  regularTypeIndex: number = 0;
  creditTypeIndex: number = 0;
  selfExecution: any | null;
  processTypeName: string = '';
  i: number;
  private selectedWoExecutionMethodCode: any;
  selectedWoExecutionMethodName: string = '';
  totalMaterialsAmountEscom: number = 0;
  totalMaterialsAmountAgency: number = 0;
  selectedMaterialRateType: string = '';
  gstAmount: string | undefined;
  areaSpecificLoadingChargesMasterId:string ='';
  selectedCategory: string;
  areaSpecificLoadingCharges: any[] = []; 
  selectedAreaCharge: any[] = []; 
  areaSpecificLoadingAmount: number[] = []; 
  chargeData: any[] = [];
  showPercentage: boolean;
  totalEstimateCost: string = '';
  totalLabourCharges:string ='';
  selectedFile: File | null = null;
  documentId: number | null = null;
  // @ViewChild('pdfFileInput', { static: false }) pdfFileInput: ElementRef;
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
  defaultWoExecutionMethodId: any = 1;
  serviceRegistrationsId: any;
  charCount: { [key: string]: number } = {};
  maxCharLimits: { [key: string]: number } = {
    estimationWorkDescription: 300,
    report: 3000,
    certification:400,
    estimateRemark:300,
  };
  isCharCountVisible: { [key: string]: boolean } = {};
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
    private gatePassAcknowledgementService: GatePassAcknowledgementService,
    private loader:LoaderService


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
      const dashboardFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeCode };
      const specialFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeId: officeCode };
      this.configurationService.getAreaSpecificLoaderGetAllData(filter)
      .then((data: any) => {
         this.areaSpecificLoadingCharges = data;
      });
      // const spLocAllowData = await this.estimateService.getSpecialLocalityAllowanceDataByOfficeId(specialFilter);
      // this.specialLocalityAllowancePercent = spLocAllowData.percentageValue;
      this.dashboardList = await this.dashboardService.getDashboard(dashboardFilter);
      this.suspenseStoreData = await this.dashboardService.getSuspenseOffice(specialFilter);
      const workCategory = await this.configurationService.getWorkCategoryGetAllData(filter);
      if (workCategory.length) {
        this.workCategoryData = workCategory.filter((v: any) => v.workCategoryCode == 'IMP' || v.workCategoryCode == 'RMW');
      }
      this.allWorkExecutionData = await this.estimateService.getWorkExecutionMethodData(filter);
      this.placeholder = `${sessionStorage.getItem('user-name')}`;
      // this.placeholder = `${this.data?.designationShortCode} - ${sessionStorage.getItem('user-name')}`;
      this.workExecution = this.allWorkExecutionData.filter((v: any) => v.woExecutionMethodName == 'Department');
      this.estimateCharges.get('workExecutionMethod').setValue(this.workExecution[0].woExecutionMethodId);
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
      const estimateType = await this.estimateService.getEstimateTypeMasterData(filter);
      this.estimateType = estimateType.filter((v: any) => v.estimateTypeCode == 'RLZ');
      await this.onChangeMaterials();
      
      this.onChangeWorkExecution(this.defaultWoExecutionMethodId);
    });
  }

  onFocus(formControlName: string) {
    this.isCharCountVisible[formControlName] = true;
  }
  onBlur(formControlName: string) {
    this.isCharCountVisible[formControlName] = false;
  }
  onInputChange(form: FormGroup, formControlName: string) {
    const formControlValue = form.get(formControlName)?.value || '';
    this.charCount[formControlName] = formControlValue.length;
  }
  resetFields() {
    return new Promise((resolve) => {
      this.estimateCharges.reset({
        typeOfWork: '',
        workPart: '',
        workDescription: '',
        materialType: '',
        rateType: 'SR',
        suspenseOffice: '',
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
        estimationDate: '',
      });
      this.addChargeForm.reset({
        additionalCharges: '',
      });
      this.regularizationFilterExecutionWorkTable = [];
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
      resolve(true);
    });
  }

  private _filterMaterialUnits(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allMaterials.filter((name) => name.toLowerCase().includes(filterValue));
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
          const ml1 = await this.estimateService.getMaterialLabourMasterData(
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
          const ml2 = await this.estimateService.getMaterialLabourMasterData(
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
          const ll = await this.estimateService.getMaterialLabourMasterData(
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
      } else {
        console.error('Material not found in dataSource.');
      }
    } catch (error) {
      console.error('Error in onMaterialUnitSelected:', error);
    }
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
      const workDescData = await this.estimateService.getWorkDescMasterData(filter);
      const workD = workDescData.filter((v: any) => v.workscopeDescCode === 'SM');
      const estimateType = this.estimateType.find(
        (v: any) => v.estimateTypeCode == this.estimateCharges.get('estimateType').value,
      )?.estimateTypeMasterId;
      if (typeOfWork == 'LT') {
        this.workscopeDesc = workD.filter((v: any) => {
          if (v.estimateType == estimateType && (v.workTypeApplicable == 'LT' || v.workTypeApplicable == 'BOTH')) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (typeOfWork == 'HT') {
        this.workscopeDesc = workD.filter((v: any) => {
          if (v.estimateType == estimateType && (v.workTypeApplicable == 'HT' || v.workTypeApplicable == 'BOTH')) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (this.estimateCharges.get('workPart').value && this.estimateCharges.get('workDescription').value) {
        const workDesVal = Number(this.estimateCharges.get('workDescription').value);
        const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId == workDesVal);
        const alreadyExist = this.regularizationFilterExecutionWorkTable.find(
          (v) =>
            v.workType == typeOfWork &&
            v.workPart == this.estimateCharges.get('workPart').value &&
            v.workscopeDescription == workDesc.workscopeDescription,
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
  get basicRate(): number {
    const materialCost = Number(this.estimationMaterialCost);
    const labourCost = Number(this.estimationLabourCost);
    if (isNaN(materialCost) || isNaN(labourCost)) {
      console.error("Estimation material cost or labour cost is not a valid number.");
      return 0;
    }
    const sum = materialCost + labourCost;
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
  calculateTotalOtherCharges(): number {
    const otherCharges = this.additionalCharges.filter(charge => charge.additionalChargeName === 'Area Specific Loading on Basic Rates');
    return otherCharges.reduce((total, charge) => total + parseFloat(charge.amount), 0);
  }
  onChangeWorkPart(workPart: string) {
    if (workPart) {
      if (this.estimateCharges.get('workDescription').value && this.estimateCharges.get('typeOfWork').value) {
        const ewt: any[] = this.regularizationFilterExecutionWorkTable;
        const workDesVal = Number(this.estimateCharges.get('workDescription').value);
        if (this.workscopeDesc.length) {
          const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId == workDesVal);
          const exists = ewt.find(
            (v) =>
              v.workType == this.estimateCharges.get('typeOfWork').value &&
              v.workPart == workPart &&
              v.workscopeDescription == workDesc.workscopeDescription,
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
  onChangeWorkDescription(workDescription: string) {
    if (workDescription) {
      if (this.estimateCharges.get('workPart').value && this.estimateCharges.get('typeOfWork').value) {
        const ewt: any[] = this.regularizationFilterExecutionWorkTable;
        const workDesVal = Number(workDescription);
        const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId == workDesVal);
        const exists = ewt.find(
          (v) =>
            v.workType == this.estimateCharges.get('typeOfWork').value &&
            v.workPart == this.estimateCharges.get('workPart').value &&
            v.workscopeDescription == workDesc.workscopeDescription,
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
      const ml = await this.estimateService.getMaterialLabourMasterData(labourFilter);
      this.materialList = ml.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
    } else {
      if (this.estimateCharges.get('suspenseOffice').value) {
        const materialFilter: any = {
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          storeCode: this.estimateCharges.get('suspenseOffice').value,
        };
        this.dataSource = await this.configurationService.getDataWithStoreQuantityByStoreCode(materialFilter);
        const ml = await this.estimateService.getMaterialLabourMasterData(materialFilter);
        this.materialList = ml.sort((a: any, b: any) => {
          return a.mlCode - b.mlCode;
        });
      } else {
        this.snackbar.open('Please select Suspense Store', 'OK');
      }
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

  async onChangeWorkExecution(woExecutionMethodId: any) {
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
      this.additionalChargesSel = this.additionalCharges.filter((v: any) => ( v.displayFlag == 1 ) );
      this.addChargesBeforeTotalLabour = this.additionalCharges.filter(
        (v: any) =>
          Number(v.chargesSequenceOrder) < 5 && v.displayByDefault == 1
      );
      this.addChargesAfterTotalLabour = this.additionalCharges.filter(
        (v: any) =>
          Number(v.chargesSequenceOrder) >= 5 && v.displayByDefault == 1
      );
      if (
        woExecutionMethodId == 1 
      ) {
        this.estimateCharges.get('rateType').setValue('SR');
      } 
    //  this.estimateCharges.get('vendor').setValue('');
      this.estimateCharges.get('rateType').disable();
      this.onChangeMaterials();
    } else {
      this.estimateCharges.get('rateType').setValue('');
    }
  
    const rateType = this.estimateCharges.get('rateType').value;
    if (rateType && woExecutionMethodId) {
    } else {
      this.isTemplateButton = false;
    }
  
    const id = parseInt(woExecutionMethodId, 10);
  
    function findWoExecutionMethodName(woExecutionMethodId: number, workExecution: any[]) {
      for (const executionMethod of workExecution) {
        if (executionMethod.woExecutionMethodId === woExecutionMethodId) {
          return executionMethod.woExecutionMethodName;
        }
      }
      return null;
    }
  
    const woExecutionMethodCode = findWoExecutionMethodName(id, this.workExecution);
    console.log("data is not coming ",woExecutionMethodCode);
    this.selectedWoExecutionMethodName = woExecutionMethodCode;
  }
  
  async onChangeSuspense() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, storeCode: this.estimateCharges.get('suspenseOffice').value };
    this.dataSource = await this.configurationService.getDataWithStoreQuantityByStoreCode(filter);
    this.allMaterials = this.dataSource.map((v: any) => `${v.rateType}-${v.mlCode}-${v.mlName}`);
    if (this.estimateCharges.get('materialOrLabour').value == 'MATERIAL') {
      this.filteredMaterialUnits = this.estimateCharges.get('materialUnitControl').valueChanges.pipe(
        startWith(''),
        map((value) => {
          return this._filterMaterialUnits(value);
        }),
      );
    }
  }

  async onChangeMaterials() {
    this.estimateCharges.get('materialUnitControl').setValue('');
    this.estimateCharges.get('labourUnitControl').setValue('');
    this.estimateCharges.get('labourList').setValue('');
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    if (this.estimateCharges.get('materialOrLabour').value == 'MATERIAL') {
      if (this.estimateCharges.get('suspenseOffice').value) {
        const filter: any = {
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          storeCode: this.estimateCharges.get('suspenseOffice').value,
        };
        this.dataSource = await this.configurationService.getDataWithStoreQuantityByStoreCode(filter);
        this.allMaterials = this.dataSource.map((v: any) => `${v.rateType}-${v.mlCode}-${v.mlName}`);
        this.filteredMaterialUnits = this.estimateCharges.get('materialUnitControl').valueChanges.pipe(
          startWith(''),
          map((value) => {
            return this._filterMaterialUnits(value);
          }),
        );
      } 
    } else if (this.estimateCharges.get('materialOrLabour').value == 'LABOR') {
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, mlType: this.estimateCharges.get('materialOrLabour').value };
      this.dataSource = await this.configurationService.getmaterialLabourMasterGetDataMlType(filter);
      this.allMaterials = this.dataSource.map((v: any) => `${v.rateType}-${v.mlCode}-${v.mlName}`);
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

  deleteRegularizationItem(i: number, id: number) {
    this.regularizationFilterExecutionWorkTable[i].materialItems.splice(id, 1);
    let mrt: number = 0;
    let lrt: number = 0;
    const mAmt = this.regularizationFilterExecutionWorkTable[i].materialItems.map((v: any) => v.materialsAmount);
    const lAmt = this.regularizationFilterExecutionWorkTable[i].materialItems.map((v: any) => v.laboursAmount);
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
    this.regularizationFilterExecutionWorkTable[i].materialCost = Number(Number(mrt).toFixed(2));
    this.regularizationFilterExecutionWorkTable[i].labourCost = Number(Number(lrt).toFixed(2));
    this.refreshing();
  }

  removeRegularizationExecutionWorkTable(index: number, workPartName: string) {
    this.workPart.push(workPartName);
    this.workPart.sort();
    this.regularizationFilterExecutionWorkTable.splice(index, 1);
    this.refreshing();
  }

  refreshing() {
    let mc: number = 0;
    let lc: number = 0;
    const m = this.regularizationFilterExecutionWorkTable.map((v: any) => v.materialCost);
    if (m.length) {
      mc = m.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    const l = this.regularizationFilterExecutionWorkTable.map((v: any) => v.labourCost);
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
    const ewt = this.regularizationFilterExecutionWorkTable;
    if (ewt.length) {
      this.showTable = false;
      const labourData: any[] = [];
      let labourRate: number = 0;
      const cod = this.materialMasterObj.mlCode;
      const rt = this.materialMasterObj.rateType;
      const material = this.dataSource.find((v: any) => v.mlCode == cod && v.rateType == rt);
      if (material.mlType == 'LABOR') {
        labourRate = material.mlRate;
      } else {
        const materialsLabourMasterId = material.materialsLabourMasterId;
        const laborId = this.estimateCharges.get('labourList').value;
        if (laborId.length) {
          laborId.forEach((id: any) => {
            const labour = this.labourList.find((v: any) => v.materialsLabourMasterId == id);
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
      if (selectedRadioButton[1] == 'RLZ') {
        const exists = this.regularizationFilterExecutionWorkTable[Number(selectedRadioButton[0])].materialItems.find((v: any) => {
          return v.itemCode == material.mlCode && v.rateType == material.rateType;
        });
        if (exists) {
          this.snackbar.open('Material Already Exists in Estimation Type ', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
        } else {
          this.regularizationFilterExecutionWorkTable[Number(selectedRadioButton[0])].materialItems.push({
            laborData: labourData,
            storeQuantity: material.storeQuantity,
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
      this.estimateCharges.get('materialType').setValue('');
      this.estimateCharges.get('materialUnitControl').setValue('');
      this.estimateCharges.get('labourUnitControl').setValue('');
      this.estimateCharges.get('labourList').setValue('');
    } else {
      this.snackbar.open('Please add Workscope First!', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
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
  async onQuantityChange(quantity: any, i: number, id: number, materialRate: number, labourRate: number, storeQuantity: any) {
    let mrt: any;
    let lrt: any;
    if (Number(quantity) > 0) {
      mrt = quantity * materialRate;
      lrt = quantity * labourRate;
    } else {
      mrt = 0;
      lrt = 0;
      // this.snackbar.open('Please enter the positive integer quantity', 'OK', {
      //   verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      // });
    }
    console.log(quantity, storeQuantity);
    if (Number(quantity) > Number(storeQuantity)) {
      mrt = 0;
      lrt = 0;
      this.snackbar.open('Quantity should not be greater than suspense available quantity', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
    this.regularizationFilterExecutionWorkTable[i].materialItems[id].quantity = Number(Number(quantity));
    this.regularizationFilterExecutionWorkTable[i].materialItems[id].materialsAmount = Number(Number(mrt).toFixed(2));
    this.regularizationFilterExecutionWorkTable[i].materialItems[id].laboursAmount = Number(Number(lrt).toFixed(2));
    const tma = this.regularizationFilterExecutionWorkTable[i].materialItems
      .map((v: any) => v.materialsAmount)
      .reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    const totalMaterialsAmount = Number(Number(tma).toFixed(2));
    const tla = this.regularizationFilterExecutionWorkTable[i].materialItems
      .map((v: any) => v.laboursAmount)
      .reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    const totalLaborAmount = Number(Number(tla).toFixed(2));
    this.regularizationFilterExecutionWorkTable[i].materialCost = totalMaterialsAmount;
    this.regularizationFilterExecutionWorkTable[i].labourCost = totalLaborAmount;
    // big common code
    const mc = this.regularizationFilterExecutionWorkTable
      .map((v: any) => v.materialCost)
      .reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    const lc = this.regularizationFilterExecutionWorkTable
      .map((v: any) => v.labourCost)
      .reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    this.estimationMaterialCost = Number(mc.toFixed(2));
    this.estimationLabourCost = Number(lc);
    const tmlc1 = Number(this.estimationMaterialCost) + Number(this.estimationLabourCost);
    const tmlc2 = tmlc1.toFixed(2);
    const totalMLCost = Number(tmlc2);
    const valueCalculatedByOnlyLabour = this.additionalCharges.filter(
      (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 0,
    );
    if (valueCalculatedByOnlyLabour && valueCalculatedByOnlyLabour.length) {
      valueCalculatedByOnlyLabour.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) / 100).toFixed(2));
      });
    }
    const valueCalculatedByBothLabourAndMaterial = this.additionalCharges.filter(
      (v: any) => (v.valueCalculatedByLabour = 1 && v.valueCalculatedByMaterial == 1),
    );
    if (valueCalculatedByBothLabourAndMaterial && valueCalculatedByBothLabourAndMaterial.length) {
      valueCalculatedByBothLabourAndMaterial.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(totalMLCost)) / 100).toFixed(2));
      });
    }
    const valueCalculatedByOnlyMaterial = this.additionalCharges.filter((v: any) => v.valueCalculatedByMaterial == 1);
    if (valueCalculatedByOnlyMaterial && valueCalculatedByOnlyMaterial.length) {
      valueCalculatedByOnlyMaterial.forEach((v: any) => {
        v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationMaterialCost)) / 100).toFixed(2));
      });
    }
    let beforeTotalLabour: number = 0;
    let afterTotalLabour: number = 0;
    if (this.additionalCharges) {
      const bLabour1 = this.additionalCharges.filter((v: any) => Number(v.chargesSequenceOrder) < 5 && v.displayByDefault == 1);
      if (bLabour1.length) {
        const bLabour2 = bLabour1.map((v: any) => v.amount);
        beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
      const aLabour1 = this.additionalCharges.filter((v: any) => v.chargesSequenceOrder >= 5 && v.displayByDefault == 1);
      if (aLabour1.length) {
        const aLabour2 = aLabour1.map((v: any) => v.amount);
        afterTotalLabour = aLabour2.reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      }
    }
    this.totalLabourChargesInRs = Number((Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(2));
    this.totalEstimationCostInRs = Number(
      (Number(this.estimationMaterialCost) + Number(this.totalLabourChargesInRs) + afterTotalLabour).toFixed(2),
    );
  }

  addExecutionWorkTable() {
    if (
      estimateCharges.get('estimateType').value &&
      estimateCharges.get('typeOfWork').value &&
      estimateCharges.get('workPart').value &&
      estimateCharges.get('workDescription').value
    ) {
      if (this.estimateCharges.get('workExecutionMethod').value && this.estimateCharges.get('rateType').value) {
        const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId == this.estimateCharges.get('workDescription').value);
        const exists = this.regularizationFilterExecutionWorkTable.find(
          (v) =>
            v.workType == this.estimateCharges.get('typeOfWork').value &&
            v.workPart == this.estimateCharges.get('workPart').value &&
            v.workscopeDescription == workDesc.workscopeDescription,
        );
        if (exists) {
          this.snackbar.open('Scope of Work Already Exists.', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
          this.alreadyExistScopeOfWork = true;
        } else {
          const workPartIndex = this.workPart.findIndex((v) => v == estimateCharges.get('workPart').value);
          this.workPart.splice(workPartIndex, 1);
          this.alreadyExistScopeOfWork = false;
          if (this.estimateCharges.get('estimateType').value == 'RLZ') {
            this.regularizationFilterExecutionWorkTable.push({
              estimateTypeCode: 'RLZ',
              workType: this.estimateCharges.get('typeOfWork').value,
              workPart: this.estimateCharges.get('workPart').value,
              workscopeDescription: workDesc.workscopeDescription,
              materialItems: [],
              materialCost: null,
              labourCost: null,
            });
            this.estimateCharges
              .get('undExWork')
              .setValue(`${this.regularizationFilterExecutionWorkTable.length - 1}-${this.estimateCharges.get('estimateType').value}`);
            console.log(this.estimateCharges.get('undExWork').value);
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

  removeAdditionalChargesBeforeTotalLabour(estimationAdditionalChargesId: number) {
    const before = this.addChargesBeforeTotalLabour.findIndex((v: any) => v.estimationAdditionalChargesId == estimationAdditionalChargesId);
    this.addChargesBeforeTotalLabour.splice(before, 1);
    this.refreshAdditionalCharges();
  }

  removeAdditionalChargesAfterTotalLabour(estimationAdditionalChargesId: number) {
    const after = this.addChargesAfterTotalLabour.findIndex((v: any) => v.estimationAdditionalChargesId == estimationAdditionalChargesId);
    this.addChargesAfterTotalLabour.splice(after, 1);
    this.refreshAdditionalCharges();
  }

  onAdditionalChargeAmount($event: any, additionalChargesId: string) {
    let amount = $event.target?.value;
    const addCharge = this.additionalCharges.find((v: any) => v.estimationAdditionalChargesId == additionalChargesId);
    addCharge.amount = Number(amount);
    let beforeTotalLabour: number = 0;
    let afterTotalLabour: number = 0;
    const bLabour1 = this.additionalCharges.filter((v: any) => Number(v.chargesSequenceOrder) < 5 && v.displayByDefault == 1);
    if (bLabour1.length) {
      const bLabour2 = bLabour1.map((v: any) => v.amount);
      beforeTotalLabour = bLabour2.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    this.totalLabourChargesInRs = Number(this.estimationLabourCost) + Number(beforeTotalLabour);
    const aLabour1 = this.additionalCharges.filter((v: any) => Number(v.chargesSequenceOrder) >= 5 && v.displayByDefault == 1);
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
  }

  viewInspection() {
    this.router.navigate(['/main/view-site-inspection'], {
      queryParams: { accountId: this.accountId },
    });
  }

  openEstimationDialog(type: string) {
    const hasRegularMaterial = this.regularizationFilterExecutionWorkTable.some(
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
    this.estimatedByForm.markAllAsTouched();
    if (this.isValidForm()) {
    const dialogRef = this.dialog.open(type == 'save' ? ConfirmationPopupComponent : GeneratePopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'yes') {
        this.submitEstimation(type);
      }
    });
  }
  }
  isValidForm(): boolean {
    this.estimateCharges.markAllAsTouched();
    this.addChargeForm.markAllAsTouched();
    this.estimatedByForm.markAllAsTouched();
    console.log('Form Valid?', this.estimateCharges.valid);
    console.log('Form Valid?', this.addChargeForm.valid);
    console.log('Form Valid?', this.estimatedByForm.valid);
    let hasError = false;
  
    const checkFormValidity = (form) => {
      Object.keys(form.controls).forEach((key) => {
        const control = form.get(key);
        if (control && (control.invalid || control.untouched)) {
          hasError = true;
        }
      });
    };
  
    checkFormValidity(this.estimateCharges);
    checkFormValidity(this.addChargeForm);
    checkFormValidity(this.estimatedByForm);
  
    return !hasError;
  }

  // async saveData1() {
  //   const apiKey = sessionStorage.getItem('api-key');
  //   const serviceKey = sessionStorage.getItem('service-key');
  //   const userRole = sessionStorage.getItem('user-role');
  //   const userName = sessionStorage.getItem('user-name');
  //   const userCode = sessionStorage.getItem('user-code');
  //   const selectedFile = this.pdfFileInput.nativeElement.files[0];
  //   if (!selectedFile) {
  //     return { success: true };
  //   }
  //   const documentName =encodeURIComponent(selectedFile.name);
  //   const serviceRegisterationsId= this.serviceRegistrationsId;   
  //   const documentReferenceNumber='R12651265'; 
  //   const processName='Emergency Estimation Creation';
  //   try {
  //     const submit = await this.gatePassAcknowledgementService.documentUploadService(
  //       apiKey,
  //       serviceKey,
  //       userCode,
  //       userName,
  //       userRole,
  //       documentName,
  //       serviceRegisterationsId,
  //       documentReferenceNumber,
  //       processName,
  //       selectedFile 
  //     );
  //     if (submit.messageType === 'SUCCESS') {
  //       this.snackbar.open('Document Saved Successfully', 'OK', {
  //         verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  //       })
  //       .onAction()
  //       .subscribe(() => {
  //         this.snackbar.dismiss();
  //       });
  
  //       this.documentId = submit.documentId;
  //       return { success: true }; 
  //     } else {
  //       return { success: false, message: submit.message }; 
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     return { success: false, message: error.message }; 
  //   }
  // }
  
  async submitEstimation(type: string) {
    const chargeData = [
      this.totalEstimateCost,
      this.totalEstimationCostInRs
    ];
    const [
      totalEstimateCost,
      totalEstimationCostInRs
    ] = chargeData;
    let emptyQuantity: boolean = false;
    let emptyAdditionalCharge: boolean = false;
    const estimationWorkScopeDataDTO: any[] = [];
    const estimationMaterialLabourDetailsDTO: any[] = [];
    const materialDetails: any[] = [];
    const ewt = this.regularizationFilterExecutionWorkTable;
    ewt.forEach((exWorkTable: any) => {
      const workscopeDesc = this.allWorkscopeDescription.find((v: any) => v.workscopeDescription == exWorkTable.workscopeDescription);
      estimationWorkScopeDataDTO.push({
        estimateType: this.estimateType.find((v: any) => v.estimateTypeCode == exWorkTable.estimateTypeCode)?.estimateTypeMasterId,
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
      this.addChargesBeforeTotalLabour ||
      this.addChargesBeforeTotalLabour.length ||
      this.addChargesAfterTotalLabour ||
      this.addChargesAfterTotalLabour.length ||
      this.chargeData
    ) {
      const addChargeArr = [
        ...this.addChargesBeforeTotalLabour,
        ...this.addChargesAfterTotalLabour,
        // ...this.regularizationFilterExecutionWorkTable,
        ...this.chargeData
        
      ];
      addChargeArr.forEach((v: any) => {
        if (Number(v.amount) == 0) {
          emptyAdditionalCharge = true;
        }
        finalAdditionalCharges.push({
          estimationAdditionalChargesId: Number(
            v.additionalChargesMasterId
          ),
          areaSpecificLoadingChargesMasterId:v.areaSpecificLoadingChargesMasterId,
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
    const saveFilter: any = { apiKey, serviceKey, userRole, userName, userCode, isEmergencyEstimation: 1 };
    // const saveDataResult = await this.saveData1();
    // if (!saveDataResult.success) {
    //   this.snackbar.open('Document upload failed. Please try again.', 'OK', {
    //     verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    //   });
    //   return; 
    // }
    const generateFilter: any = { apiKey, serviceKey, userRole, userName, userCode, estimationType: 'GE', isEmergencyEstimation: 1 };
    const estimate: any = {
      estimationRegisteredDTO: {
        estimateType: this.estimateType.find((v: any) => v.estimateTypeCode == 'RLZ')?.estimateTypeMasterId,
        workCategoryMasterId: this.estimateCharges.get('workCategory').value,
        estimationWorkDesc: (this.estimateCharges.get('estimationWorkDescription').value||'').slice(0, this.maxCharLimits.estimationWorkDescription),
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod').value,
        rateType: this.estimateCharges.get('rateType').value,
        suspenseRequestNo: this.estimateCharges.get('suspenseRequestNo').value,
        estimatedBy: '',
        estimationRemarks:(this.estimatedByForm.get('estimateRemark').value||'').slice(0, this.maxCharLimits.estimateRemark),
        estimationMaterialCost: this.estimationMaterialCost,
        estimationLabourCost: this.estimationLabourCost,
        estimationTotalCost: totalEstimationCostInRs,
        officeId: sessionStorage.getItem('office-id'),
        totalLabourCharges:totalEstimateCost,
        storeMasterId: this.suspenseStoreData.find((v: any) => v.storeCode == this.estimateCharges.get('suspenseOffice').value)
          ?.storeMasterId,
      },
      estimationWorkScopeDataDTO,
      estimationMaterailsRegisteredDTO: materialDetails,
      estimationMaterialLabourDetailsDTO,
      serviceRegistrationDTO: {},
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
      this.snackbar.open('Please enter quantity first', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    } 
    // else if (emptyAdditionalCharge) {
    //   this.snackbar.open('Either enter value or remove the additional charge', 'OK', {
    //     verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    //   });
    // } 
    else {
      console.log(type, estimate);
      if (type == 'save') {
          this.loader.show('Saving the Emergency estimation...');
        const res = await this.estimateService.saveEstimationData(saveFilter, estimate).catch((err) => console.log(err))
      .finally(() => {
        this.loader.hide();
      });
        if (res.messageType == 'SUCCESS') {
          this.snackbar.open('Emergency Estimation Saved Successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
        }
      } else if (type == 'generate') {
         this.loader.show('Generating the Emergency estimation...');
        const res = await this.estimationRegisteredService.generateEstimation(generateFilter, estimate).catch((err) => console.log(err))
      .finally(() => {
        this.loader.hide();
      });
        if (res.messageType == 'SUCCESS') {
          this.snackbar
            .open('Emergency Estimation Generated Successfully', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            })
            .onAction()
            .subscribe(() => {
              this.router.navigate(['/estimates', 'emergency-estimation-approval', res.estmationRegisteredId, res.serviceRegistrationId]);
            });
        }
      }
    }
  }

  addAdditionalCharges() {
    const addChargeId = Number(this.addChargeForm.get('additionalCharges').value);
    if (this.isTemplate) {
      const ac = this.additionalCharges.find((v) => v.estimationAdditionalChargesId == addChargeId);
      if (
        this.addChargesBeforeTotalLabour.find((v) => v.estimationAdditionalChargesId == addChargeId) ||
        this.addChargesAfterTotalLabour.find((v) => v.estimationAdditionalChargesId == addChargeId)
      ) {
        this.snackbar.open('Additional Charge already exists', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
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
      const ac = this.additionalCharges.find((v) => v.estimationAdditionalChargesId == addChargeId);
      if (
        this.addChargesBeforeTotalLabour.find((v) => v.estimationAdditionalChargesId == addChargeId) ||
        this.addChargesAfterTotalLabour.find((v) => v.estimationAdditionalChargesId == addChargeId)
      ) {
        this.snackbar.open('Additional Charge already exists', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
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
        this.addChargesBeforeTotalLabour.find((v) => v.estimationAdditionalChargesId == addChargeId) ||
        this.addChargesAfterTotalLabour.find((v) => v.estimationAdditionalChargesId == addChargeId)
      ) {
        this.alreadyExistAdditionalCharge = true;
      } else {
        this.alreadyExistAdditionalCharge = false;
      }
    } else {
      if (
        this.addChargesBeforeTotalLabour.find((v) => v.estimationAdditionalChargesId == addChargeId) ||
        this.addChargesAfterTotalLabour.find((v) => v.estimationAdditionalChargesId == addChargeId)
      ) {
        this.alreadyExistAdditionalCharge = true;
      } else {
        this.alreadyExistAdditionalCharge = false;
      }
    }
  }
}
