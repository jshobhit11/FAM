import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TemplatesPopupComponent } from 'src/app/estimate-forms/components/templates-popup/templates-popup.component';
// import { ViewPopUpComponent } from 'src/app/estimate-forms/components/view-pop-up/view-pop-up.component';
import { EstimateService } from 'src/app/services/estimate.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimationRegisteredService } from 'src/app/services/estimationRegistered';
import { SaveTemplateConfirmComponent } from 'src/app/shared/components/save-template-confirm/save-template-confirm.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { WorkAwardService } from 'src/app/services/work-award.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { ViewPopUpEstimateComponent } from 'src/app/estimate-forms/components/view-pop-up-estimate/view-pop-up-estimate.component';

@Component({
  selector: 'app-update-estimate-template-master',
  templateUrl: './update-estimate-template-master.component.html',
  styleUrls: ['./update-estimate-template-master.component.scss']
})
export class UpdateEstimateTemplateMasterComponent implements OnInit {

  estimateCharges: FormGroup;
  estimatedByForm: FormGroup;
  addChargeForm: FormGroup;
  isLinear: boolean = false;
  isTemplate: boolean = false;
  isTemplateButton: boolean = false;
  estimationTypeGEorRG: boolean = true;
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
  allMaterialData : any;
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
  alllabourData: any;
  workPart: string[] = ['Part A', 'Part B', 'Part C', 'Part D', 'Part E', 'Part F'];
  nextPartCharCode = 'F'.charCodeAt(0);
  estimationWorkDescription: any;
  estimationName:any;
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
  templateNumber: any;
  estimationTemplateMasterId: Number;

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
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // this.employeeForm = new FormGroup({
    //   employeeMasterId: new FormControl('', [Validators.required]),
    this.estimateCharges = new FormGroup({
      typeOfWork: new FormControl('', [Validators.required]),
      workPart: new FormControl('', [Validators.required]),
      workDescription: new FormControl('', [Validators.required]),
      materialType: new FormControl('', [Validators.required]),
      rateType: new FormControl('', [Validators.required]),
      workCategory: new FormControl('', [Validators.required]),
      workExecutionMethod: new FormControl('', [Validators.required]),
      estimationWorkDescription: new FormControl('', [Validators.required]),
      estimateType: new FormControl('', [Validators.required]),
      materialUnitControl: new FormControl('', [Validators.required]),
      labourUnitControl: new FormControl('', [Validators.required]),
      labourList: new FormControl('', [Validators.required]),
      undExWork: new FormControl('', []),
      materialOrLabour: new FormControl('MATERIAL', []),
      vendor: new FormControl('', []),
    });

    this.estimatedByForm = new FormGroup({
      certification: new FormControl('', []),
      report: new FormControl('', []),
      estimatedBy: new FormControl('', []),
      estimateRemark: new FormControl('', [Validators.required]),
      estimationDate: new FormControl('', [Validators.required]),
    });

    this.addChargeForm = new FormGroup({
      additionalCharges: new FormControl('', []),
    });
  }

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

    
    this.resetFields();
    this.estimatedByForm.get('estimationDate').setValue(this.today);
    
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const officeCode = sessionStorage.getItem('office-id');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    const specialFilter: any = { apiKey, serviceKey, userRole, userName, userCode, officeId: officeCode };
    const vendorFilter: any = { apiKey, serviceKey, userRole, userName, userCode };
    // then implement
    this.estimateService.getSpecialLocalityAllowanceDataByOfficeId(specialFilter).then((v) => {
      console.log('specialLocalityAllowancePercent', v);
      this.specialLocalityAllowancePercent = v.percentageValue;
    });
    this.workAwardService.getAllRateContractData(vendorFilter).then((v) => (this.vendorData = v));
    this.configurationService.getWorkCategoryGetAllData(filter).then((workCategory) => {
      this.workCategoryData = workCategory;
    });
    // work execution method validations
    this.allWorkExecutionData = await this.estimateService.getWorkExecutionMethodData(filter);
    this.workExecution = this.allWorkExecutionData;
    this.estimateService.getWorkDescMasterData(filter).then((v) => (this.allWorkscopeDescription = v));
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
    this.estimateService.getEstimateTypeMasterData(filter).then((estType) => {
      this.estimateType = estType.filter((v: any) => v.estimateTypeCode == 'RGL' || v.estimateTypeCode == 'CRD');
    });

    await this.onChangeMaterials();
    const templateNumber = this.route.snapshot.paramMap.get('estimationTemplateMasterId');
    if (templateNumber) {
      await this.fetchTemplateData(templateNumber);  
    }
  }

  async fetchTemplateData(templateNumber: string) {
    
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode, estimationTemplateMasterId: templateNumber };
    console.log('Fetch Filter:', filter);  
    try {
      this.templateData = await this.estimationRegisteredService.getEstimationTemplateData(filter);
      console.log('Fetched Template Data:889080-', this.templateData);
      if (this.templateData) {
          //this.displayTemplateData(this.templateData);
          this.populateForm(this.templateData);
      } else {
          this.snackbar.open('No template data found.', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' });
      }
  } catch (error) {
      console.error('Error fetching template data:', error);
      this.snackbar.open('Error fetching template data.', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' });
  }
}

  async populateForm(data: any) {
  this.estimationTemplateMasterId = data.estimationTemplateMasterDTO.estimationTemplateMasterId
  const rateType = data.estimationTemplateMasterDTO.rateType;
  const apiKey = sessionStorage.getItem('api-key');
  const serviceKey = sessionStorage.getItem('service-key');
  const userRole = sessionStorage.getItem('user-role');
  const userName = sessionStorage.getItem('user-name');
  const userCode = sessionStorage.getItem('user-code');
  const labourFilter: any = {
    apiKey,
    serviceKey,
    userRole,
    userName,
    userCode,
    materialTypeMasterId: data.estimationTemplateMasterDTO.materialTypeMasterId,
    mlType: 'LABOR',
    rateType: rateType,
  };
this.alllabourData = await this.estimateService.getMaterialLabourMasterData(labourFilter);
    console.log('this.alllabourData=====', this.alllabourData);

    console.log('Populating Form with Data:', data);
    if (!data) {
      this.snackbar.open('No data to populate the form.', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' });
      return;
    }
  
  // if (!data) {
  //     this.snackbar.open('No data to populate the form.', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' });
  //     return;
  // }
  // Populate main form
  if (data.estimationTemplateMasterDTO) {
      this.estimateCharges.patchValue({
          estimationWorkDescription: data.estimationTemplateMasterDTO.estimationTemplateName || '',
          workCategory: data.estimationTemplateMasterDTO.workCategoryMasterId || '',
          workExecutionMethod: data.estimationTemplateMasterDTO.workExecutionMethod || '',
          rateType: data.estimationTemplateMasterDTO.rateType || '',
      });
  }

    
    // Populate work scope details
    if (data.estTemplateWorkScopeMasterDTOList && Array.isArray(data.estTemplateWorkScopeMasterDTOList)) {
      data.estTemplateWorkScopeMasterDTOList.forEach((workScope: any) => {
      const materialItems: any[] = [];
      if (data.estTemplateMaterialsMasterDTOList) {
      const materials = data.estTemplateMaterialsMasterDTOList.filter((m: any) => m.estTemplateWorkScopeMasterId === workScope.estTemplateWorkScopeMasterId);
      materials.forEach((material: any) => {
        const laboursData: any[] = [];
        if (data.estimationTemplateMaterialLabourMasterDTOList) {
        const labours = data.estimationTemplateMaterialLabourMasterDTOList.filter(
          (l: any) => l.estTemplateWorkScopeMasterId === workScope.estTemplateWorkScopeMasterId && l.materialMasterId === material.materialsMasterId
        );

        labours.forEach((labour: any) => {
          const labourData = this.getLabourData(labour.labourMasterId)
          laboursData.push( {
            materialsLabourMasterId: labour.labourMasterId,
            mlmid: material.materialsMasterId,
            mlName: labourData.mlName,
            mlRate: labourData.mlRate,
            mlUnit: labourData.mlUnit,
            mlCode: labourData.mlCode
          });
        });
      }

     const materialById = this.getMaterialName(material.materialsMasterId)
        materialItems.push({
          rateType: data.estimationTemplateMasterDTO.rateType,
          laborData: laboursData,
          itemCode: materialById.mlCode,
          itemUnit: materialById.mlUnit,
          itemName: materialById.mlName,
          //materialRate: material.materialRate,
          //labourRate: material.labourRate !== 'null' ? material.labourRate : 0,
          //materialsAmount: mAmt,
          //laboursAmount: lAmt,
          quantity: material.quantity,
          materialTypeMasterId: material.materialsMasterId,
          materialsLabourMasterId: material.materialsLabourMasterId,
          //materialDisplayType: material.labourRate ? '1' : '0',
        });
      });
    }

    
      const workPartIndex = this.workPart.findIndex((wp) => wp === workScope.workPart);
       this.workPart.splice(workPartIndex, 1);

      /*this.regularFilterExecutionWorkTable.push({
        estimateTypeCode: data.estimationTemplateMasterDTO.estimateType,
        workType: workScope.workType,
        workPart: workScope.workPart,
        workscopeDescription: this.getWorkScopName(workScope.workscopeDescMasterId),
        materialItems,
      });*/

      this.estimateCharges.patchValue({
        typeOfWork: workScope.workType,
        workPart: workScope.workPart,
        estimateType: workScope.estimateType,
        workDescription: this.getWorkScopName(workScope.workscopeDescMasterId),
      });

      const estimateTypeCode = this.getEstimateTypeCodeById(data.estimationTemplateMasterDTO.estimateType);

      
      if (estimateTypeCode === 'RGL') {
        this.regularFilterExecutionWorkTable.push({
          estimateTypeCode: estimateTypeCode,
          workType: workScope.workType,
          workPart: workScope.workPart,
          workscopeDescription: this.getWorkScopName(workScope.workscopeDescMasterId),
          materialItems,
         // materialCost: materialItems.reduce((sum, item) => sum + item.materialsAmount, 0),
          //labourCost: materialItems.reduce((sum, item) => sum + item.laboursAmount, 0),
        });
      } else if (estimateTypeCode === 'CRD') {
        this.creditFilterExecutionWorkTable.push({
          estimateTypeCode: estimateTypeCode,
          workType: workScope.workType,
          workPart: workScope.workPart,
          workscopeDescription: this.getWorkScopName(workScope.workscopeDescMasterId),
          materialItems,
          //materialCost: materialItems.reduce((sum, item) => sum + item.materialsAmount, 0),
          //labourCost: materialItems.reduce((sum, item) => sum + item.laboursAmount, 0),
        });
      }
    });

    }

  }

  getWorkScopName(workscopeDescMasterId: any){
    const workScopeName = this.allWorkscopeDescription.find(item => Number(item.workscopeDescMasterId) === workscopeDescMasterId);
    return workScopeName ? workScopeName.workscopeDescription : 'Name not found';
  }
  getMaterialName(materialsMasterId : any){
    const material = this.allMaterialData.find(item => item.materialsLabourMasterId === materialsMasterId);
    return material ? material: 'Material not found';

  }

  getLabourData(labourMasterId : any){
    const labour = this.alllabourData.find(item => item.materialsLabourMasterId === labourMasterId);
    return labour ? labour: 'labour not found';

  }

  convertEstimateCode(code: string) {
    return code.split('-')[1];
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
        estimationDate: '',
      });
      this.addChargeForm.reset({
        additionalCharges: '',
      });
      this.regularFilterExecutionWorkTable = [];
      this.creditFilterExecutionWorkTable = [];
      this.additionalCharges = [];
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
    return this.allMaterials.filter((name) => name.toLowerCase().includes(filterValue));
    // return this.allMaterials.filter((name) => name.toLowerCase().includes(filterValue) && name !== this.materialMasterObj.mlName);
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
    this.materialList = [];
    this.materialMasterObj.mlName = name;
    const mat = name.split('-');
    const ml = this.dataSource.find((v: any) => v.rateType == mat[0] && v.mlCode == mat[1]);
    this.materialMasterObj.materialTypeMasterId = ml.materialTypeMasterId;
    this.materialMasterObj.rateType = ml.rateType;
    this.materialMasterObj.mlCode = ml.mlCode;
    this.materialMasterObj.materialsLabourMasterId = ml.materialsLabourMasterId;
    this.materialMasterObj.srMaterialsMasterId = ml.srMaterialsMasterId;
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
      };
      this.labourList = [];
      const ml1 = await this.estimateService.getMaterialLabourMasterData(labourFilter);
      this.materialList = ml1.sort((a: any, b: any) => {
        return a.mlCode - b.mlCode;
      });
    } else if (this.estimateCharges.get('undExWork').value.split('-')[1] !== 'CRD') {
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
      };
      const ll = await this.estimateService.getMaterialLabourMasterData(labourFilter);
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
      const labourMapping = await this.estimateService.getMaterialLabourMapping(materialLabourMappingFilter);
      const labourMapped: any[] = [];
      if (labourMapping && labourMapping.length) {
        labourMapping.forEach((v: any) => {
          labourMapped.push(
            ll.find((e: any) => e.srMaterialsMasterId == v.labourMasterId)
          );
        });
        console.log('labourMapped:', labourMapped);
        const materialsLabourIds = labourMapped
          .filter((v: any) => v !== undefined)
          .map((v: any) => v.materialsLabourMasterId);
        if (materialsLabourIds && materialsLabourIds.length) {
          this.estimateCharges
            .get('labourList')
            .setValue(materialsLabourIds);
        }
      }
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



  // refreshAdditionalCharges() {
  //   const totalMLCost = Number((Number(this.estimationMaterialCost) + Number(this.estimationLabourCost)).toFixed(2));
  //   const valueCalculatedByOnlyBeforeLabour = this.addChargesBeforeTotalLabour.filter(
  //     (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 0,
  //   );
  //   const valueCalculatedByOnlyAfterLabour = this.addChargesBeforeTotalLabour.filter(
  //     (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 0,
  //   );
  //   if (valueCalculatedByOnlyBeforeLabour && valueCalculatedByOnlyBeforeLabour.length) {
  //     valueCalculatedByOnlyBeforeLabour.forEach((v: any) => {
  //       v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) / 100).toFixed(2));
  //     });
  //   }
  //   if (valueCalculatedByOnlyAfterLabour && valueCalculatedByOnlyAfterLabour.length) {
  //     valueCalculatedByOnlyAfterLabour.forEach((v: any) => {
  //       v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) / 100).toFixed(2));
  //     });
  //   }
  //   const valueCalculatedByBothBeforeLabourAndMaterial = this.addChargesBeforeTotalLabour.filter(
  //     (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 1,
  //   );
  //   const valueCalculatedByBothAfterLabourAndMaterial = this.addChargesAfterTotalLabour.filter(
  //     (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 1,
  //   );
  //   if (valueCalculatedByBothBeforeLabourAndMaterial && valueCalculatedByBothBeforeLabourAndMaterial.length) {
  //     valueCalculatedByBothBeforeLabourAndMaterial.forEach((v: any) => {
  //       v.amount = Number(Number((Number(v.chargeTypeValue) * Number(totalMLCost)) / 100).toFixed(2));
  //     });
  //   }
  //   if (valueCalculatedByBothAfterLabourAndMaterial && valueCalculatedByBothAfterLabourAndMaterial.length) {
  //     valueCalculatedByBothAfterLabourAndMaterial.forEach((v: any) => {
  //       v.amount = Number(Number((Number(v.chargeTypeValue) * Number(totalMLCost)) / 100).toFixed(2));
  //     });
  //   }
  //   const valueCalculatedByOnlyBeforeMaterial = this.additionalCharges.filter((v: any) => v.valueCalculatedByMaterial == 1);
  //   const valueCalculatedByOnlyAfterMaterial = this.additionalCharges.filter((v: any) => v.valueCalculatedByMaterial == 1);
  //   if (valueCalculatedByOnlyBeforeMaterial && valueCalculatedByOnlyBeforeMaterial.length) {
  //     valueCalculatedByOnlyBeforeMaterial.forEach((v: any) => {
  //       v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationMaterialCost)) / 100).toFixed(2));
  //     });
  //   }
  //   if (valueCalculatedByOnlyAfterMaterial && valueCalculatedByOnlyAfterMaterial.length) {
  //     valueCalculatedByOnlyAfterMaterial.forEach((v: any) => {
  //       v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationMaterialCost)) / 100).toFixed(2));
  //     });
  //   }
  //   let beforeTotalLabour: number = 0;
  //   let afterTotalLabour: number = 0;
  //   if (this.additionalCharges && this.additionalCharges.length) {
  //     const bLabour1 = this.addChargesBeforeTotalLabour.filter((v: any) => v.displayByDefault == 1);
  //     if (bLabour1.length) {
  //       const bLabour2 = bLabour1.map((v: any) => v.amount);
  //       beforeTotalLabour = bLabour2.reduce((a: any, b: any) => Number(a) + Number(b));
  //     }
  //     const aLabour1 = this.addChargesAfterTotalLabour.filter((v: any) => v.displayByDefault == 1);
  //     if (aLabour1.length) {
  //       const aLabour2 = aLabour1.map((v: any) => v.amount);
  //       afterTotalLabour = aLabour2.reduce((a: any, b: any) => Number(a) + Number(b));
  //     }
  //   }
  //   this.totalLabourChargesInRs = Number((Number(this.estimationLabourCost) + Number(beforeTotalLabour)).toFixed(2));
  //   this.totalEstimationCostInRs = Number(
  //     (Number(this.estimationMaterialCost) + Number(this.totalLabourChargesInRs) + Number(afterTotalLabour)).toFixed(2)
  //   );
  // }


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
      const workD = workDescData.filter((v: any) => v.workscopeDescCode !== 'SM');
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
        const ewt: any[] = [...this.regularFilterExecutionWorkTable, ...this.creditFilterExecutionWorkTable];
        const workDesVal = Number(this.estimateCharges.get('workDescription').value);
        const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId == workDesVal);
        const alreadyExist = ewt.find(
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

  onChangeWorkPart(workPart: string) {
    if (workPart) {
      if (this.estimateCharges.get('workDescription').value && this.estimateCharges.get('typeOfWork').value) {
        const ewt: any[] = [...this.regularFilterExecutionWorkTable, ...this.creditFilterExecutionWorkTable];
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
        const ewt: any[] = [...this.regularFilterExecutionWorkTable, ...this.creditFilterExecutionWorkTable];
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

  async onChangeWorkCategory(workCategoryMasterId: any) {
    if (workCategoryMasterId == 1) {
      this.estimateCharges.get('workExecutionMethod').setValue('');
      this.estimateCharges.get('workExecutionMethod').enable();
      this.estimateCharges.get('rateType').setValue('');
      console.log(this.workExecution);
      this.selfExecution = this.allWorkExecutionData.find((v: any) => v.woExecutionMethodName == 'Self Execution');
      const iota = this.workExecution.findIndex((v: any) => v.woExecutionMethodName == 'Self Execution');
      this.workExecution.splice(iota, 1);
      console.log(this.workExecution);
    } else if (workCategoryMasterId == 2) {
      this.estimateCharges.get('workExecutionMethod').disable();
      if (this.selfExecution) {
        this.workExecution.push(this.selfExecution);
      }
      const wed = this.allWorkExecutionData.find((v: any) => v.woExecutionMethodName == 'Self Execution');
      this.estimateCharges.get('workExecutionMethod').setValue(wed.woExecutionMethodId);
      await this.onChangeWorkExecution(wed.woExecutionMethodId);
    } else {
      if (this.selfExecution) {
        this.workExecution.push(this.selfExecution);
      } else {
        this.estimateCharges.get('workExecutionMethod').setValue('');
        this.estimateCharges.get('workExecutionMethod').enable();
        this.estimateCharges.get('rateType').setValue('');
      }
    }
  }

  async onChangeWorkExecution(woExecutionMethodId: any) {
    if (woExecutionMethodId) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const additionalChargesFilter: any = { apiKey, serviceKey, userRole, userName, userCode, woExecutionMethodId };
      const additionCharge = await this.estimateService.getAdditionalChargesMasterData(additionalChargesFilter);
      const addedAmount = additionCharge.map((v: any) => {
        return { ...v, amount: 0 };
      });
      const addCharges = addedAmount.sort((a: any, b: any) => Number(a.chargesSequenceOrder) - Number(b.chargesSequenceOrder));
      const spLocAllAddChar = addCharges.find((v: any) => v.additionalChargeName == 'Special Locality Allowance');
      if (this.specialLocalityAllowancePercent) {
        spLocAllAddChar.chargeTypeValue = this.specialLocalityAllowancePercent;
      }
      this.additionalCharges = addCharges;
      this.addChargesBeforeTotalLabour = this.additionalCharges.filter(
        (v: any) => Number(v.chargesSequenceOrder) < 5 && v.displayByDefault == 1,
      );
      this.addChargesAfterTotalLabour = this.additionalCharges.filter(
        (v: any) => Number(v.chargesSequenceOrder) >= 5 && v.displayByDefault == 1,
      );
      if (woExecutionMethodId == 1 || woExecutionMethodId == 2 || woExecutionMethodId == 6) {
        this.estimateCharges.get('rateType').setValue('SR');
        this.showVendor = false;
      } else {
        this.estimateCharges.get('rateType').setValue('RC');
        this.showVendor = true;
      }
      this.estimateCharges.get('vendor').setValue('');
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
  }

  async onChangeMaterials() {
    if (
      this.estimateDetailData &&
      this.estimateDetailData.estimationRegisteredDTO &&
      this.estimateDetailData.estimationRegisteredDTO.length &&
      this.estimateDetailData?.estimationRegisteredDTO[0]?.rateContractMasterId
    ) {
      this.estimateCharges.get('vendor').setValue(this.estimateDetailData?.estimationRegisteredDTO[0]?.rateContractMasterId);
    }
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
    if (workExecutionMethod == 4 && vendor) {
      this.dataSource = await this.configurationService.getDataByMlTypeAndVendorIdForPartialTurnkey(turnkeyFilter);
    } else if (workExecutionMethod == 5 && vendor) {
      this.dataSource = await this.configurationService.getDataByMlTypeAndVendorIdForTotalTurnkey(turnkeyFilter);
    } else if (workExecutionMethod == 4 && !vendor) {
      this.snackbar.open('Please select vendor', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.dataSource = [];
    } else if (workExecutionMethod == 5 && !vendor) {
      this.snackbar.open('Please select vendor', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.dataSource = [];
    } else {
      this.dataSource = await this.configurationService.getmaterialLabourMasterGetDataMlType(filter);
      this.allMaterialData = this.dataSource;      
    }
    this.allMaterials = this.dataSource.map((v: any) => `${v.rateType}-${v.mlCode}-${v.mlName}`);
    if (this.estimateCharges.get('materialOrLabour').value == 'MATERIAL') {
      this.filteredMaterialUnits = this.estimateCharges.get('materialUnitControl').valueChanges.pipe(
        startWith(''),
        map((value) => {
          return this._filterMaterialUnits(value);
        }),
      );
    }
    if (this.estimateCharges.get('materialOrLabour').value == 'LABOR') {
      this.filteredMaterialUnits = this.estimateCharges.get('labourUnitControl').valueChanges.pipe(
        startWith(''),
        map((value) => this._filterMaterialUnits(value)),
      );
    }
  }

  openviewDialog(data: any) {
    this.dialog.open( ViewPopUpEstimateComponent , {
      data,
      width: '100%',
    });
  }

  deleteMaterialItem(i: number, id: number, code: string) {
    this.resetMaterialMasterObj();
    if (code == 'RGL') {
      this.regularFilterExecutionWorkTable[i].materialItems.splice(id, 1);
      let mrt: number = 0;
      let lrt: number = 0;
      const mAmt = this.regularFilterExecutionWorkTable[i].materialItems.map((v: any) => v.materialsAmount);
      const lAmt = this.regularFilterExecutionWorkTable[i].materialItems.map((v: any) => v.laboursAmount);
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
      this.regularFilterExecutionWorkTable[i].materialCost = Number(Number(mrt).toFixed(2));
      this.regularFilterExecutionWorkTable[i].labourCost = Number(Number(lrt).toFixed(2));
      this.refreshing();
    } else if (code == 'CRD') {
      this.creditFilterExecutionWorkTable[i].materialItems.splice(id, 1);
      let mrt: number = 0;
      let lrt: number = 0;
      const mAmt = this.creditFilterExecutionWorkTable[i].materialItems.map((v: any) => v.materialsAmount);
      const lAmt = this.creditFilterExecutionWorkTable[i].materialItems.map((v: any) => v.laboursAmount);
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
      this.creditFilterExecutionWorkTable[i].materialCost = Number(Number(mrt).toFixed(2));
      this.creditFilterExecutionWorkTable[i].labourCost = Number(Number(lrt).toFixed(2));
    }
  }

  getEstimateTypeCodeById(estimateTypeMasterId: number): string | null {
    const estimateType = this.estimateType.find((type: any) => type.estimateTypeMasterId === estimateTypeMasterId);
    return estimateType ? estimateType.estimateTypeCode : null;
  }

  
  removeExecutionWorkTable(index: number, code: string, workPartName: string) {
    this.resetMaterialMasterObj();
    this.workPart.push(workPartName);
    this.workPart.sort();
    if (code == 'RGL') {
      this.regularFilterExecutionWorkTable.splice(index, 1);
      this.refreshing();
    } else if (code == 'CRD') {
      this.creditFilterExecutionWorkTable.splice(index, 1);
    }
  }

  refreshing() {
    let mc: number = 0;
    let lc: number = 0;
    const m = this.regularFilterExecutionWorkTable.map((v: any) => v.materialCost);
    if (m.length) {
      mc = m.reduce((a: any, b: any) => {
        return Number(a) + Number(b);
      });
    }
    const l = this.regularFilterExecutionWorkTable.map((v: any) => v.labourCost);
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
    const ewt: any[] = [...this.regularFilterExecutionWorkTable, this.creditFilterExecutionWorkTable];
    if (ewt.length) {
      this.showTable = false;
      const labourData: any[] = [];
      let labourRate: number = 0;
      const material = this.dataSource.find(
        (v: any) => v.mlCode == this.materialMasterObj.mlCode && v.rateType == this.materialMasterObj.rateType,
      );
      if (material) {
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
        if (selectedRadioButton[1] == 'RGL') {
          const exists = this.regularFilterExecutionWorkTable[Number(selectedRadioButton[0])].materialItems.find((v: any) => {
            return v.itemCode == material.mlCode && v.rateType == material.rateType;
          });
          if (exists) {
            this.snackbar.open('Material Already Exists in Regular Estimation Type ', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            });
          } else {
            this.regularFilterExecutionWorkTable[Number(selectedRadioButton[0])].materialItems.push({
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
        } else if (selectedRadioButton[1] == 'CRD') {
          const exists = this.creditFilterExecutionWorkTable[Number(selectedRadioButton[0])].materialItems.find((v: any) => {
            return v.itemCode == material.mlCode && v.rateType == material.rateType;
          });
          if (exists) {
            this.snackbar.open('Material Already Exists in Credit Estimation Type ', 'OK', {
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            });
          } else {
            this.creditFilterExecutionWorkTable[Number(selectedRadioButton[0])].materialItems.push({
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
  validateDecimalInput(event: KeyboardEvent): void {
    const inputChar = event.key;
    const inputElement = event.target as HTMLInputElement;
    if (
      !/[0-9]/.test(inputChar) &&  
      inputChar !== '.' &&          
      inputChar !== 'Backspace' && 
      inputChar !== 'Delete' && 
      inputChar !== 'ArrowLeft' && 
      inputChar !== 'ArrowRight'
    ) {
      event.preventDefault();  
    }

    if (inputChar === '.' && inputElement.value.includes('.')) {
      event.preventDefault(); 
    }
  }
  async onQuantityChange(quantity: any, i: number, id: number, materialRate: number, labourRate: number, code: string) {
    let mrt: any;
    let lrt: any;
    if (Number(quantity) > 0) {
      mrt = quantity * materialRate;
      lrt = quantity * labourRate;
    } else {
      mrt = 0;
      lrt = 0;
      this.snackbar.open('Please enter the positive integer quantity', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    }
    if (code == 'RGL') {
      this.regularFilterExecutionWorkTable[i].materialItems[id].quantity = Number(Number(quantity));
      this.regularFilterExecutionWorkTable[i].materialItems[id].materialsAmount = Number(Number(mrt).toFixed(2));
      this.regularFilterExecutionWorkTable[i].materialItems[id].laboursAmount = Number(Number(lrt).toFixed(2));
      const tma = this.regularFilterExecutionWorkTable[i].materialItems
        .map((v: any) => v.materialsAmount)
        .reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      const totalMaterialsAmount = Number(Number(tma).toFixed(2));
      const tla = this.regularFilterExecutionWorkTable[i].materialItems
        .map((v: any) => v.laboursAmount)
        .reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      const totalLaborAmount = Number(Number(tla).toFixed(2));
      this.regularFilterExecutionWorkTable[i].materialCost = totalMaterialsAmount;
      this.regularFilterExecutionWorkTable[i].labourCost = totalLaborAmount;
      // big common code
      const mc = this.regularFilterExecutionWorkTable
        .map((v: any) => v.materialCost)
        .reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      const lc = this.regularFilterExecutionWorkTable
        .map((v: any) => v.labourCost)
        .reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      this.estimationMaterialCost = Number(mc.toFixed(2));
      this.estimationLabourCost = Number(lc);
      const totalMLCost = Number((Number(this.estimationMaterialCost) + Number(this.estimationLabourCost)).toFixed(2));
      const valueCalculatedByOnlyLabour = this.additionalCharges.filter(
        (v: any) => v.valueCalculatedByLabour == 1 && v.valueCalculatedByMaterial == 0,
      );
      if (valueCalculatedByOnlyLabour && valueCalculatedByOnlyLabour.length) {
        valueCalculatedByOnlyLabour.forEach((v: any) => {
          v.amount = Number(Number((Number(v.chargeTypeValue) * Number(this.estimationLabourCost)) / 100).toFixed(2));
        });
      }
      const valueCalculatedByBothLabourAndMaterial = this.additionalCharges.filter(
        (v: any) => Number(v.valueCalculatedByLabour) == 1 && v.valueCalculatedByMaterial == 1,
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
        this.totalLabourChargesInRs = Number(this.estimationLabourCost) + Number(beforeTotalLabour);
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
    } else if (code == 'CRD') {
      this.creditFilterExecutionWorkTable[i].materialItems[id].quantity = Number(Number(quantity));
      this.creditFilterExecutionWorkTable[i].materialItems[id].materialsAmount = Number(Number(mrt).toFixed(2));
      this.creditFilterExecutionWorkTable[i].materialItems[id].laboursAmount = Number(Number(lrt).toFixed(2));
      const tma = this.creditFilterExecutionWorkTable[i].materialItems
        .map((v: any) => v.materialsAmount)
        .reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      const tla = this.creditFilterExecutionWorkTable[i].materialItems
        .map((v: any) => v.laboursAmount)
        .reduce((a: any, b: any) => {
          return Number(a) + Number(b);
        });
      const totalMaterialsAmount = Number(Number(tma).toFixed(2));
      const totalLaborAmount = Number(Number(tla).toFixed(2));
      this.creditFilterExecutionWorkTable[i].materialCost = totalMaterialsAmount;
      this.creditFilterExecutionWorkTable[i].labourCost = totalLaborAmount;
    }
  }

  addExecutionWorkTable() {
    if (
      this.estimateCharges.get('estimateType').value &&
      this.estimateCharges.get('typeOfWork').value &&
      this.estimateCharges.get('workPart').value &&
      this.estimateCharges.get('workDescription').value
    ) {
      if (this.estimateCharges.get('workExecutionMethod').value && this.estimateCharges.get('rateType').value) {
        const workDesc = this.workscopeDesc.find((v: any) => v.workscopeDescMasterId == this.estimateCharges.get('workDescription').value);
        const exists = this.regularFilterExecutionWorkTable.find(
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
          const workPartIndex = this.workPart.findIndex((v) => v == this.estimateCharges.get('workPart').value);
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
              .setValue(`${this.regularFilterExecutionWorkTable.length - 1}-${this.estimateCharges.get('estimateType').value}`);
          } else if (this.estimateCharges.get('estimateType').value == 'CRD') {
            if (this.regularFilterExecutionWorkTable.length || this.processTypeName == 'DND') {
              this.creditFilterExecutionWorkTable.push({
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
                .setValue(`${this.creditFilterExecutionWorkTable.length - 1}-${this.estimateCharges.get('estimateType').value}`);
            } else {
              this.snackbar.open('Please select Regular Estimate Type first', 'OK', {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              });
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
      if (!this.estimateCharges.get('estimateType').value) {
        this.snackbar.open('Please select Estimate Type', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      } else if (!this.estimateCharges.get('typeOfWork').value) {
        this.snackbar.open('Please select Type of Work', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      } else if (!this.estimateCharges.get('workPart').value) {
        this.snackbar.open('Please select Work Part', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      } else if (!this.estimateCharges.get('workDescription').value) {
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
    const bLabour1 = this.additionalCharges.filter((v: any) => Number(v.chargesSequenceOrder) < 5 && Number(v.displayByDefault) == 1);
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
      queryParams: {
        accountId: this.accountId,
        applicationStatusCode: this.applicationStatusCode,
      },
    });
  }

  openTemplatesDialog() {
    const dialogRef = this.dialog.open(TemplatesPopupComponent, {
      data: this.templateList,
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.templateData = result;
      if (result) {
        //this.displayTemplateData(result);
      }
    });
  }

  back() {
    this.router.navigate(['./configuration/estimate-template-master']);
  }

  // openDialog() {
    // const estimationName = this.estimateCharges.get('estimationWorkDescription').value;
    // this.saveTemplate(estimationName);
  // }
  
  async saveTemplate() {
    const estimationName = this.estimateCharges.get('estimationWorkDescription').value;
    console.log(`template saved with name: ${estimationName}`);
    
    let emptyQuantity: boolean = false;
    const estimationWorkScopeDataDTO: any[] = [];
    const estimationMaterialLabourDetailsDTO: any[] = [];
    const materialDetails: any[] = [];
    const ewt: any[] = [...this.regularFilterExecutionWorkTable, ...this.creditFilterExecutionWorkTable];
    
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
    
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const currentDate = new Date();
    const saveFilter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      estimationName: estimationName,
      templateNumber: currentDate.getTime(),
      estimationTemplateMasterId: this.estimationTemplateMasterId
    };
  
    const templateEstimate: any = {
      estimationTemplateMasterDTO: {
        estimateType: this.estimateType.find((v: any) => v.estimateTypeCode == 'RGL')?.estimateTypeMasterId,
        estimationTemplateName: estimationName,
        estimationWorkDesc: this.estimateCharges.get('estimationWorkDescription').value,
        workExecutionMethod: this.estimateCharges.get('workExecutionMethod').value,
        workCategoryMasterId: this.estimateCharges.get('workCategory').value,
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
      estimationProcessFlowDTO: {
        estimationFlowType: 'S',
      },
    };
   
    if (emptyQuantity) {
      this.snackbar.open('Please enter quantity first', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    } else {
      console.log('ESTIMATION', templateEstimate);
      const res = await this.estimationRegisteredService.saveTemplateData2(saveFilter, templateEstimate).catch((e: any) => console.log(e));
      if (res.messageType == 'SUCCESS') {
        this.snackbar.open('Template Saved Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
      }
    }
  }

  navigate() {
    console.log(this.applicationStatusCode);
    this.router.navigate([`/main/home/${this.applicationStatusCode}/${this.processTypeName}`]);
  }
}

