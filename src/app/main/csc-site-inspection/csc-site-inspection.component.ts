import { Component, ElementRef, OnInit ,ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { SiteInspectionService } from '../../services/siteInspection.service';
import { ConfirmationPopupComponent } from '../../shared/components/confirmation-popup/confirmation-popup.component';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { GisServicesService } from 'src/app/services/gis-services.service';
import { PopupGisContentComponent } from 'src/app/popup-gis-content/popup-gis-content.component';
import { ViewPointPopupComponent } from 'src/app/view-point-popup/view-point-popup.component';
import { DocumentService } from 'src/app/shared/document.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { GatePassAcknowledgementService } from 'src/app/services/gate-pass-acknowledgement.service';
import { MobileUtils } from 'src/app/lib/mobile-utils';
const networkExtensionForm = new FormGroup({
  networkAssetNo: new FormControl('', Validators.required),
  nearestNetwork: new FormControl('', Validators.required),
  dismantleNearestNetwork:new FormControl('',Validators.required),
  isNetworkExtensionRequired: new FormControl('', []),
  latitude: new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]*'),
  ]),
  longitude: new FormControl('', [Validators.pattern('[0-9]*')]),
  networkExtensionType: new FormControl('', [Validators.pattern('[0-9]*')]),
  connectionExtendedFrom: new FormControl('', []),
  nameOfTheTransformer: new FormControl('', []),
  feederName: new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z0-9]*'),
  ]),
  substationName: new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z0-9]*'),
  ]),
  inspectedByAE: new FormControl('', []),
  inspectedByAEE: new FormControl('', []),
  inspectedByEE: new FormControl('', []),
  inspectedBySE: new FormControl('', []),
  inspectedByCE: new FormControl('', []),
  inspectionDate: new FormControl('', []),
  deviationRemarks: new FormControl('', Validators.required),
  yrOfCommMtr:new FormControl('',[])
});

@Component({
  selector: 'app-csc-site-inspection',
  templateUrl: './csc-site-inspection.component.html',
  styleUrls: ['./csc-site-inspection.component.scss'],
})
export class CscSiteInspectionComponent implements OnInit {
  networkExtensionForm: FormGroup = networkExtensionForm;
  isNetworkExtensionType: boolean = true;
  networkExtensionType: any;
  label: any;
  isNetworkAssetNo: boolean = false;
  data: any;
  accountId: any;
  isLinear: boolean = false;
  statusCode: any;
  siteInspectionType: string = '';
  process: string = '';
  newName: string = '';
  newCategoryId: string = '';
  categoryMaterialName: string = '';
  categoryMaterialResponse: any;
  gistappingDetails: any[] = [];
  GISSavedTappingDetails: any[] = [];
  meterData:any[]=[];
  dialogRef: MatDialogRef<PopupGisContentComponent>;
  showViewPointButton: boolean = false;
  tappingInProgress: boolean = false;
  isLoading: boolean = false;
  serviceRegistrationsId: any;
  displayedColumns: string[] = ['registerReadSeqNo', 'registerId', 'registerUom', 'registerTou', 'registerReading'];
  storedParsedServiceResponse: any;
  defaultInspectionDate: Date;
  referenceNo: string;
  selectedFile: File | null = null;
  apiUrl = environment.baseURL;
  documentId: number | null = null;
  selectedFileName: string | null = null;
  @ViewChild('pdfFileInput', { static: false }) pdfFileInput: ElementRef;
  discomCode: string;
  yearOptions: number[] = [];
  dataError: any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private siteInspectionService: SiteInspectionService,
    private gisService: GisServicesService,
    private documentService: DocumentService,
    private location: Location,
    private gatePassAcknowledgementService: GatePassAcknowledgementService,
    private fb: FormBuilder,
    // private loader: LoaderService,
  ) {
    this.networkExtensionForm = this.fb.group({
      pdfFile: [null, Validators.required],
      nameOfTheTransformer:[''],
      substationName:[''],
      feederName:[''],
      deviationRemarks:[''],
      longitude:[''],
      latitude:[''],
      accountNumber:[''],
      dismantleNearestNetwork:[''],
      yrOfCommMtr:['']
    });
  }

 async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.route.queryParamMap.subscribe(queryParams => {
        this.serviceRegistrationsId = queryParams.get('serviceRegistrationsId');
      });
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeCode = sessionStorage.getItem('office-id');
      const discom = sessionStorage.getItem('discom');
      this.discomCode = discom;
      const filterParams: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      const meterfilterParams: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        serviceRegistrationsId:this.serviceRegistrationsId
      };
      const accountId = params.get('accountId');
      const applicationStatusCode = params.get('statusCode');
      const processTypeName = params.get('processTypeName');
      this.statusCode = applicationStatusCode;
      this.process = processTypeName;
      this.accountId = accountId;
      if (processTypeName === 'CSC') {
        this.siteInspectionType = 'Service Request Site Inspection';
      }
      if (processTypeName === 'DND') {
        this.siteInspectionType = 'Dismantlement Site Inspection';
      }
      const mainCategoryFilter: any = {
        ...filterParams,
        processTypeName,
        officeCode,
        serviceRegistrationsId:this.serviceRegistrationsId,
        applicationStatusCode,
      };
      this.data = await this.dashboardService.getDataByServiceIdAndApplicationStatus(
        mainCategoryFilter
      );
      const accountNumber=this.data.accountId
      if(this.data.applicationTypeCode==='PD'){
        this.networkExtensionForm.get('accountNumber').setValue(accountNumber);
      }
      this.newName = this.data.newName;
      this.newCategoryId = this.data.newCategoryId;
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        categoryMasterId: this.newCategoryId,
      };
      if(this.newCategoryId !=='null'){
        this.categoryMaterialResponse =
        await this.dashboardService.getcategoryMaterialGetById(filters);
      }
      this.meterData = 
        await this.dashboardService.getMeterRegistersLogDataByServiceRegistrationsId(meterfilterParams);
      this.categoryMaterialName = this.categoryMaterialResponse?.categoryName;
      this.networkExtensionType =
        await this.dashboardService.getNetworkExtensionTypeData(filterParams); 
    });

    this.defaultInspectionDate = new Date();

    this.checkApplicationTypeCode();
    this.yearOptions = Array.from({ length: 2025 - 2000 + 1 }, (_, i) => 2000 + i);

  }

  checkApplicationTypeCode() {
    if (this.data?.applicationTypeCode === 'SMR' || this.data?.applicationTypeCode === 'UMT_MT' ) {
      // Remove validation for the following fields if the application type is SMR
      this.networkExtensionForm.get('networkAssetNo')?.clearValidators();
      this.networkExtensionForm.get('latitude')?.clearValidators();
      this.networkExtensionForm.get('longitude')?.clearValidators();
      this.networkExtensionForm.get('nameOfTheTransformer')?.clearValidators();
      this.networkExtensionForm.get('feederName')?.clearValidators();
      this.networkExtensionForm.get('substationName')?.clearValidators();
      
      // Optionally, update the form to reflect these changes
      this.networkExtensionForm.get('networkAssetNo')?.updateValueAndValidity();
      this.networkExtensionForm.get('latitude')?.updateValueAndValidity();
      this.networkExtensionForm.get('longitude')?.updateValueAndValidity();
      this.networkExtensionForm.get('nameOfTheTransformer')?.updateValueAndValidity();
      this.networkExtensionForm.get('feederName')?.updateValueAndValidity();
      this.networkExtensionForm.get('substationName')?.updateValueAndValidity();
    } 
  }
  validateInput(event: KeyboardEvent , registerUom: string, index: number) {
    const pattern = /^\d+(\.\d{0,4})?$/;
    const pattern1 = /^[0-9]\d*(\.\d{0,4})?$/;
    const input = (event.target as HTMLInputElement).value + event.key;

    if (!pattern.test(input)) {
        this.meterData[index].errorMessage = "Reading is Mandatory.";
        event.preventDefault();
    }else {
      // Clear the error if the value is valid
      this.meterData[index].errorMessage = null;
    }
  //   if (registerUom === 'PF' && (!pattern1.test(input) || parseFloat(input) <= 0)) {
  //     event.preventDefault();
  // }
}
validatePFValue(item: any, index: number): void {
      if (item.registerUom === 'PF') {
        const value = parseFloat(item.registerReading);
        if (isNaN(value) || value <= 0) {
          this.meterData[index].errorMessage = "Value must be greater than 0 for PF.";
        } else {
          // Clear the error if the value is valid
          this.meterData[index].errorMessage = null;
        }
      } 
    
}
  async onTapping() {
    if (this.tappingInProgress) {
      return;
    }
    this.tappingInProgress = true;
    try {
      this.referenceNo = this.getReferenceNo();
      const gisparms: any = {
        NearestConsumerAccountID: this.networkExtensionForm.get('accountNumber').value,
        TargetAsset:this.networkExtensionForm.get('dismantleNearestNetwork').value,
        WorkOrder: this.referenceNo,
        discomCode:this.discomCode
      };
      const gistappingDetails = await this.gisService.gettappingDetailsData(
        gisparms
      );
      this.showViewPointButton = true;
      if (typeof cordova !== 'undefined') {
        await MobileUtils.openGisApp(gisparms.NearestConsumerAccountID, gisparms.TargetAsset, gisparms.WorkOrder);
        this.tappingInProgress = false;
      } else {
        this.dialogRef = this.dialog.open(PopupGisContentComponent, {
          width: '100%',
          height: '95%',
          disableClose: true,
          data: `${gistappingDetails.surl}`,
        });
        this.dialogRef.afterClosed().subscribe(() => {
          this.onViewPoint();
          this.tappingInProgress = false;
        });
      }
    } catch (error) {
      console.error('Error occurred during tapping:', error);
      this.tappingInProgress = false;
    }
  }
  async onViewPoint() {
    const gisSaveParams: any = {
      referenceCode: String(this.referenceNo),
    };
    const response = await this.gisService.getSaveGisViewData(gisSaveParams);

    if (response && response.serviceResponse) {
      const parsedServiceResponse = this.parseServiceResponse(
        response.serviceResponse
      );
      this.storedParsedServiceResponse = parsedServiceResponse;

      const {
        latitude,
        longitude,
        nameOfTheTransformer,
        transformerCapacity,
        feederName,
        substationName,
      } = parsedServiceResponse;
      this.networkExtensionForm.get('latitude').setValue(latitude);
      this.networkExtensionForm.get('longitude').setValue(longitude);
      this.networkExtensionForm
        .get('nameOfTheTransformer')
        .setValue(nameOfTheTransformer);
      this.networkExtensionForm
        .get('transformerCapacity')
        .setValue(transformerCapacity);
      this.networkExtensionForm.get('feederName').setValue(feederName);
      this.networkExtensionForm.get('substationName').setValue(substationName);
      const dialogRef = this.dialog.open(ViewPointPopupComponent, {
        width: '400px',
        disableClose: true,
        data: parsedServiceResponse,
      });
    } else {
      console.error('Failed to get valid response data.');
    }
  }

  getReferenceNo() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const officeId = sessionStorage.getItem('office-id');
    const referenceNo = officeId + day + month + year + hours + minutes;
    return referenceNo;
  }
  parseServiceResponse(serviceResponse: string): any {
    const data: any = {};
    const matches = serviceResponse.match(/(\w+)\s*=\s*([^,]+)/g);
    if (matches) {
      matches.forEach((match) => {
        const [key, value] = match.split('=');
        const trimmedKey = key.trim();
        const trimmedValue = value.trim();
        data[trimmedKey] = trimmedValue;
      });
    }
    return data;
  }

  onNetworkExtentionRequiredChange(event) {
    if (event == 1) {
      this.isNetworkExtensionType = false;
    } else {
      this.isNetworkExtensionType = true;
    }
  }

  onNearestNetworkChange(val) {
    this.label = val;
    if(this.data?.applicationTypeCode==='PD'){
      this.isNetworkAssetNo = false;
    }
    this.isNetworkAssetNo = true;
    this.networkExtensionForm.get('dismantleNearestNetwork').setValue(val);
  }

  openConfirmationpopupDialog() {
   const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.submitForm();
      }
    });
  }

  onFileChange(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const selectedFileName = selectedFile.name;
      selectedFileName;
    }
  }
  async saveData() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const selectedFile = this.pdfFileInput.nativeElement.files[0];
    if (!selectedFile) {
      return { success: true };
    }
    const documentName =encodeURIComponent(selectedFile.name);
    const serviceRegisterationsId=this.data.serviceRegistrationId;   
    const documentReferenceNumber='R12651265'; 
    const processName= 'Site Inspection';
    try {
      const submit = await this.gatePassAcknowledgementService.documentUploadService(
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
         this.snackBar.open('Document Saved Successfully', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        })
        .onAction()
        .subscribe(() => {
          this.snackBar.dismiss();
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

  async submitForm() {
    try {
      //Validation of meter data for PD case
     if(this.data?.applicationTypeCode === 'PD'){
     // if(this.meterData.length > 0){
          let isValid = true;
        // Iterate over meterData to validate each item
        for (let item of this.meterData) {
          // Check if the input field is empty
          if (!item.registerReading) {
            isValid = false;
            item.errorMessage = "Reading is mandatory.";
            break;
          }

          // Specific validation for 'PF' UOM
          if (item.registerUom === 'PF') {
            const value = parseFloat(item.registerReading);
            if (isNaN(value) || value <= 0) {
              isValid = false;
              item.errorMessage = "Value must be greater than 0 for PF.";
              break;
            }
          }
        }

        if (isValid) {
          // Proceed with your form submission logic
          console.log('Form is valid. Proceeding with submission...');
        } else {
          // Show a validation message
          console.log('Form is invalid. Please check the input values.');
          this.dataError = "Reading is Mandatory.";
          this.snackBar.open('Provide All Mandatory Data..', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          });
          return;
        }
      //}
      }
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');

      if (this.data?.applicationTypeCode === 'SMR' || this.data?.applicationTypeCode === 'UMT_MT' ) {
        this.networkExtensionForm.get('networkAssetNo')?.clearValidators();
        this.networkExtensionForm.get('latitude')?.clearValidators();
        this.networkExtensionForm.get('longitude')?.clearValidators();
        this.networkExtensionForm.get('nameOfTheTransformer')?.clearValidators();
        this.networkExtensionForm.get('feederName')?.clearValidators();
        this.networkExtensionForm.get('substationName')?.clearValidators();
        
        // Update validity of fields after clearing validators
        this.networkExtensionForm.get('networkAssetNo')?.updateValueAndValidity();
        this.networkExtensionForm.get('latitude')?.updateValueAndValidity();
        this.networkExtensionForm.get('longitude')?.updateValueAndValidity();
        this.networkExtensionForm.get('nameOfTheTransformer')?.updateValueAndValidity();
        this.networkExtensionForm.get('feederName')?.updateValueAndValidity();
        this.networkExtensionForm.get('substationName')?.updateValueAndValidity();

      }

      const saveDataResult = await this.saveData();
      if (!saveDataResult.success) {
        this.snackBar.open('Document upload failed. Please try again.', 'OK', {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        });
        return; 
      }
      let siteInspectionBody:any= {
        latitude: (this.data?.applicationTypeCode === 'SMR'  || this.data?.applicationTypeCode === 'UMT_MT')  ? null : this.networkExtensionForm.get('latitude').value,
        longitude: (this.data?.applicationTypeCode === 'SMR' || this.data?.applicationTypeCode === 'UMT_MT')  ? null : this.networkExtensionForm.get('longitude').value,
       
        siteInspectionId: 0,
        serviceRegistrationId: this.data.serviceRegistrationId,
        mainCategory: 0,
        subCategory: 0,
        isGovtSchemeApplicatible: 0,
        schemeName: 'string',
        beneficiaryIssuerDept: 'string',
        connectionNatureId: 0,
        isNameAddressCorrect: 0,
        isSiteInAccordance: 0,
        wardNo: 0,
        assemblyConstituency: 0,
        parliamentConstituency: 0,
        isInternalWiringDone: 0,
        isBoreWellExisting: 0,
        oldAccNoInPremises: 'string',
        arrears: 0,
        totNoFloor: 0,
        plotSize: 0,
        totBuildupArea: 0,
        buildingHeight: 0,
        loadKw: 0,
        loadHp: 0,
        totalLoadKw: 0,
        totNoOfDomestic: 0,
        totNoOfCommercial: 0,
        totNoOfEducation: 0,
        totNoOfIndustrial: 0,
        domesticLoadKw: 0,
        commercialLoadKw: 0,
        educationLoadKw: 0,
        industrialLoadKw: 0,
        isSpaceProvided: 0,
        executionMethod: 0,
        remarks:this.networkExtensionForm.get('deviationRemarks').value,
        adjacentAccountNo: 'string',
        isNetworkExtRequired: Number(
          this.networkExtensionForm.value.isNetworkExtensionRequired
        ),
        networkExtType: 0,
        isFeasibility: 0,
        distanceFromConnection: 0,
        // latitude: this.networkExtensionForm.get('latitude').value,
        // longitude: this.networkExtensionForm.get('longitude').value,
        mrCode: 'string',
        mrDay: 'string',
        isCablePrecomTestRequired: 0,
        isRmuPrecomTestRequired: 0,
        isLbsPrecomTestRequired: 0,
        isDtPrecomTestRequired: 0,
        isMeterChange: 0,
        isMeterProcured: 0,
        isMeterUploaded: 0,
        isSolarHeaterMandatory: 0,
        isSolarHeaterProvisioned: 0,
        anyDeviation: 0,
        isHtEhtLineCrossing: 0,
        lineClearenceCertSubmitted: 0,
        areaBelongsTo: 0,
        premisesBelongsTo: 0,
        decommisionAssetsRequired: 0,
        anyAddlDocCollected: 0,
        anyDocsPending: 0,
        others: 'string',
        inspectedByAe:
          this.networkExtensionForm.value.inspectedByAE == true ? 1 : 0,
        inspectedByAee:
          this.networkExtensionForm.value.inspectedByAEE == true ? 1 : 0,
        inspectedByEe:
          this.networkExtensionForm.value.inspectedByEE == true ? 1 : 0,
        inspectedBySe:
          this.networkExtensionForm.value.inspectedBySE == true ? 1 : 0,
        inspectedByCe:
          this.networkExtensionForm.value.inspectedByCE == true ? 1 : 0,
        scheduleDate: '2023-09-01',
        inspectionData: '2023-09-01',
        inspectionDate: this.networkExtensionForm.value.inspectionDate,
        networkAssetNo: this.networkExtensionForm.value.networkAssetNo,
        nearestNetwork: this.networkExtensionForm.value.nearestNetwork,
        yrOfCommMtr: this.networkExtensionForm.value.yrOfCommMtr,
      };



      // if (this.storedParsedServiceResponse) {
      //   siteInspectionBody.tpAssetId = this.storedParsedServiceResponse.assetId;
      //   siteInspectionBody.tpAssetType = this.storedParsedServiceResponse.assetType;
      //   siteInspectionBody.tpGisUid = this.storedParsedServiceResponse.gisUid;
      //   siteInspectionBody.tpParentUid = this.storedParsedServiceResponse.parentUid;
      //   siteInspectionBody.dtrId = this.networkExtensionForm.get('nameOfTheTransformer').value;
      //   siteInspectionBody.feederName = this.networkExtensionForm.get('feederName').value;
      //   siteInspectionBody.substationName = this.networkExtensionForm.get('substationName').value;
      // } else {
      //   this.snackBar
      //     .open('Latitude and Longitude of the location details are required.', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' })
      //     .onAction()
      //     .subscribe(() => {
      //       this.snackBar.dismiss();
      //     });
      //   return; 
      // }
      if (['NMCHG', 'TCNG', 'PD'].includes(this.data.applicationTypeCode)) {
        siteInspectionBody.tpAssetId = null;
        siteInspectionBody.tpAssetType = null;
        siteInspectionBody.tpGisUid = null;
        siteInspectionBody.tpParentUid = null;
        siteInspectionBody.dtrId = null;
        siteInspectionBody.feederName = null;
        siteInspectionBody.substationName = null;
      } else if (this.storedParsedServiceResponse) {
        siteInspectionBody.tpAssetId = this.storedParsedServiceResponse.assetId;
        siteInspectionBody.tpAssetType = this.storedParsedServiceResponse.assetType;
        siteInspectionBody.tpGisUid = this.storedParsedServiceResponse.gisUid;
        siteInspectionBody.tpParentUid = this.storedParsedServiceResponse.parentUid;
        siteInspectionBody.dtrId = this.networkExtensionForm.get('nameOfTheTransformer').value;
        siteInspectionBody.feederName = this.networkExtensionForm.get('feederName').value;
        siteInspectionBody.substationName = this.networkExtensionForm.get('substationName').value;
      } else if(this.data.applicationTypeCode !== 'SMR' && this.data?.applicationTypeCode !== 'UMT_MT' ) {

        this.snackBar
          .open('Latitude and Longitude of the location details are required. Please Click on Get Tapping Point', 'OK', { verticalPosition: cordova !== undefined ? 'bottom' : 'top' })
          .onAction()
          .subscribe(() => {
            this.snackBar.dismiss();
          });
        return; 
      }
      if (this.process == 'DND') {
        delete siteInspectionBody.networkExtType;
        delete siteInspectionBody.isNetworkExtRequired;
      }
      const wmMeterRegistersLogList: any[] = [];
      if (this.data.applicationTypeCode === 'NMCHG' || this.data.applicationTypeCode === 'TCNG'||this.data.applicationTypeCode==='PD') {
        this.meterData.forEach((item) => {
          const wmMeterRegistersLogItem = {
            wmMeterRegistersId: item.wmMeterRegistersId,
            discom: item.discom,
            serviceRegistrationsId: item.serviceRegistrationsId,
            serviceRequestNo: item.serviceRequestNo,
            accountId: item.accountId,
            badgeNumber: item.badgeNumber,
            registerId: item.registerId,
            registerReadSeqNo: item.registerReadSeqNo,
            registerUom: item.registerUom,
            registerTou: item.registerTou,
            registerReadType: item.registerReadType,
            registerReading: item.registerReading,
            insertedBy: item.insertedBy,
            insertedDate: item.insertedDate,
            modifiedBy: item.modifiedBy,
            modifiedDate: item.modifiedDate,
            sessionIpAddress: item.sessionIpAddress,
            activeStatus: item.activeStatus,
            uniqueCondition: item.uniqueCondition,
            meterFlag: item.meterFlag,
          };
          wmMeterRegistersLogList.push(wmMeterRegistersLogItem);
        });
      }
      // this.loader.show('Saving Site Inspection...');
      this.isLoading = true;
    
      const save = await this.siteInspectionService.saveCSCSiteInspection(
        {
          apiKey,
          serviceKey,
          userCode,
          userName,
          userRole,
        },
        {
          siteInspectionDTO: siteInspectionBody,
          consumerMetersProcuredDTO: [
            {
              consumerMeterProcuredId: 0,
              siteInspectionId: 0,
              accountId: 'string',
              meterSerialNo: 'string',
              kwhReading: 0,
              kvahReading: 0,
              kwReading: 0,
              kvaReading: 0,
              pf: 0,
              rrNumber: 'string',
              insertedBy: 0,
              modifiedBy: 0,
              insertedDate: '2023-09-01T10:34:50.817Z',
              modifiedDate: '2023-09-01T10:34:50.817Z',
              sessionIpAddress: 'string',
              activeStatus: 0,
              uniqueCondition: 'string',
            },
          ],
          inspectionDeviationDTO: [
            {
              inspectionDeviationId: 0,
              siteInspectionId: 0,
              accountId: 'string',
              particulars: 0,
              remarks: 'string',
              insertedBy: 0,
              insertedDate: '2023-09-01T10:34:50.817Z',
              modifiedBy: 0,
              modifiedDate: '2023-09-01T10:34:50.817Z',
              sessionIpAddress: 'string',
              activeStatus: 0,
              uniqueCondition: 'string',
            },
          ],
          wmMeterRegistersLogList
        }
      );
  
      if (save.messageType == 'SUCCESS') {
        // this.loader.hide();
        const snackBarRef = this.snackBar 
          .open(`${this.siteInspectionType} saved successfully`, 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          snackBarRef.onAction()
          .subscribe(() => {
            this.snackBar.dismiss();
            this.networkExtensionForm.reset();
            this.isNetworkAssetNo = false;
  
            if (this.process === 'CSC') {
              this.router.navigate(['/main/home/1/CSC']);
            }
            if (this.process === 'DND') {
              this.router.navigate(['/main/home/1/DND']);
            }
            this.isLoading = false;
            // this.loader.hide();
          });
      }else if (save.messageType === 'FAILURE') {
        const snackFailBar = this.snackBar.open(
            save.messageText,
            'ok',
            {
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            }
        );
        
        snackFailBar.onAction().subscribe(() => {
            this.snackBar.dismiss();
            this.isLoading = false;
        });
    }
  }
     catch (error) {
      console.error('Error:', error);
    }
  }
  
  onNextButtonClick(stepper: MatHorizontalStepper) {
    stepper.next();
  }
  navigate() {
    this.router.navigate([`/main/home/${this.statusCode}/${this.process}`]);
  }
  // navigateToViewDocument() {
  //   const currentUrl = this.location.path();
  //   this.documentService.setPreviousUrl(currentUrl);
  //   const serviceRegistrationId = this.data.serviceRegistrationId;
  //   this.documentService.setServiceRegistrationId(serviceRegistrationId);
  //   this.documentService.navigateToViewDocument('/main/document-upload');
  // }
  navigateToPrintForm(accountId: string): void {
    const meterDataJson = JSON.stringify(this.meterData);

    this.router.navigate(['/main/print-form', accountId ], { queryParams: { meterData: meterDataJson } });
  }

  onyrOfCommMtrSelected(year: any) {
    this.networkExtensionForm.patchValue({
      yrOfCommMtr: year,
    });
  }
}
