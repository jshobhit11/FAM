import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-update-delegation-power-master',
  templateUrl: './update-delegation-power-master.component.html',
  styleUrls: ['./update-delegation-power-master.component.scss'],
})
export class UpdateDelegationPowerMasterComponent implements OnInit {
  getData: any = {};
  estimateWorkCategoryData: any = {};
  estimateWorkExecutionData: any = {};
  loadCategoryData: any = {};
  materialUnitData: any = {};
  loadUnitData: any = {};
  workCategoryData: any[] = [];
  workExecutionData: any[] = [];
  lCategoryData: any[] = [];
  lUnitData: any[] = [];
  mUnitData: any[] = [];
  designationData: any[] = [];
  filterData: any;
  notificationRef: any;
  categoryName: string;
  typeOfPowers = [];
  delegationOfPowerMasterId = [];
  selectedTypeOfPower: string;
  categoryMasterId: number;
  categoryOptions: { value: any; viewValue: any }[];
  typeOfPowerOptions: string[] = ['ESTIMATE', 'LOAD', 'REVISEDEST'];
  delegationTypeForm: FormGroup;
  error: string;

  constructor(
    private configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UpdateDelegationPowerMasterComponent>,
    private Service: CommonService
  ) {
    dialogRef.disableClose = true;
    this.delegationOfPowerMasterId = getAllData.field1;

    this.delegationTypeForm = new FormGroup({
      typeOfPower: new FormControl('', [Validators.required]),
      workCategoryMasterId: new FormControl('', [Validators.required]),
      categoryCode: new FormControl('', [Validators.required]),
      unit: new FormControl('', [Validators.required]),
      minLoad: new FormControl('', [Validators.required]),
      maxLoad: new FormControl('', [Validators.required]),
      minAmount: new FormControl('', [Validators.required]),
      maxAmount: new FormControl('', [Validators.required]),
      minPerAmount: new FormControl('', [Validators.required]),
      maxPerAmount: new FormControl('', [Validators.required]),
      workExecutionMethod: new FormControl('', [Validators.required]),
      designationMasterId: new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filters: any = { apiKey, serviceKey, userRole, userName, userCode };
    filters.delegationOfPowerMasterId = this.getAllData.field1;
    this.filterData = { ...filters };
    this.getData =
      await this.configurationService.getDelegationPowerMasterGetById(filters);
    console.log(' Delegation power master get data by id', this.getData);

    this.selectedTypeOfPower = this.getData.typeOfPower;
    this.getData.designationMasterId = this.getData.designationMasterId
      ? this.getData.designationMasterId.toString()
      : this.getData.designationMasterId;

    this.delegationTypeForm.patchValue({
      typeOfPower: this.getData.typeOfPower,
      workCategoryMasterId: this.getData.workCategoryMasterId,
      categoryCode: Number(this.getData.categoryCode),
      unit: this.getData.unit,
      minLoad: this.getData.minLoad,
      maxLoad: this.getData.maxLoad,
      minAmount: this.getData.minAmount,
      maxAmount: this.getData.maxAmount,
      minPerAmount: this.getData.minAmount,
      maxPerAmount: this.getData.maxAmount,
      workExecutionMethod: this.getData.workExecutionMethod,
      designationMasterId: this.getData.designationMasterId,
    });
    console.log('delegationTypeForm==', this.delegationTypeForm.value);

    //selectedTypeOfPower =LOAD
    if (this.selectedTypeOfPower === 'LOAD') {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.loadCategoryData = await this.configurationService.getCategory(
        filters
      );
      this.lCategoryData = this.loadCategoryData.map((workCategory) => ({
        categoryMasterId: workCategory.categoryMasterId,
        categoryCode: workCategory.categoryCode,
      }));
      this.categoryOptions = this.lCategoryData.map((category) => ({
        value: category.categoryMasterId,
        viewValue: category.categoryCode,
      }));
      console.log('lCategoryData', this.lCategoryData);
    }

    console.log('selectedTypeOfPower', this.selectedTypeOfPower);

    //selectedTypeOfPower =LOAD & REVISEDEST
    if (
      this.selectedTypeOfPower === 'LOAD' ||
      this.selectedTypeOfPower === 'REVISEDEST'
    ) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.materialUnitData =
        await this.configurationService.getMaterialUnitMaster(filters);
      this.mUnitData = this.materialUnitData.map((workCategory) => ({
        materialUnitMasterId: workCategory.materialUnitMasterId,
        materialUnit: workCategory.materialUnit,
      }));
      console.log('mUnitData', this.mUnitData);
    }

    //selectedTypeOfPower= ESTIMATE & REVISEDEST
    if (
      this.selectedTypeOfPower === 'ESTIMATE' ||
      this.selectedTypeOfPower === 'REVISEDEST'
    ) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };
      this.estimateWorkCategoryData =
        await this.configurationService.getDelegationWorkCategory(filters);
      this.workCategoryData = this.estimateWorkCategoryData.map(
        (workCategory) => ({
          workCategoryMasterId: workCategory.workCategoryMasterId,
          workCategoryName: workCategory.workCategoryName,
        })
      );
      console.log('this.workCategoryData', this.workCategoryData);
    }

    //selectedTypeOfPower=ESTIMATE & REVISEDEST
    if (
      this.selectedTypeOfPower === 'ESTIMATE' ||
      this.selectedTypeOfPower === 'REVISEDEST'
    ) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };

      this.estimateWorkExecutionData =
        await this.configurationService.getDelegationWorkExecution(filters);
      this.workExecutionData = this.estimateWorkExecutionData.map(
        (workExecution) => ({
          woExecutionMethodId: workExecution.woExecutionMethodId,
          woExecutionMethodName: workExecution.woExecutionMethodName,
        })
      );
      console.log('this.workExecutionData==', this.workExecutionData);
    }

    //selectedTypeOfPower=ESTIMATE, LOAD and REVISEDEST
    if (
      this.selectedTypeOfPower === 'LOAD' ||
      this.selectedTypeOfPower === 'REVISEDEST' ||
      this.selectedTypeOfPower === 'ESTIMATE'
    ) {
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filters: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
      };

      this.estimateWorkExecutionData =
        await this.configurationService.getDesignationMasterGetAllData(filters);
      this.designationData = this.estimateWorkExecutionData.map(
        (workExecution) => ({
          designationMasterId: workExecution.designationMasterId,
          designationName: workExecution.designationName,
        })
      );
      console.log('this.designationData==', this.designationData);
    }
  }
  async onTypeOfPowerChange(event: any): Promise<void> {
    this.selectedTypeOfPower = event.value;
    console.log(' this.selectedTypeOfPower ===', this.selectedTypeOfPower);

    if (this.selectedTypeOfPower === 'LOAD') {
      this.delegationTypeForm.controls['categoryCode'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['categoryCode'].updateValueAndValidity();
      this.delegationTypeForm.controls['unit'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['unit'].updateValueAndValidity();
      this.delegationTypeForm.controls['minLoad'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['minLoad'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxLoad'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['maxLoad'].updateValueAndValidity();
      this.delegationTypeForm.controls['designationMasterId'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls[
        'designationMasterId'
      ].updateValueAndValidity();

      this.delegationTypeForm.controls[
        'workCategoryMasterId'
      ].clearValidators();
      this.delegationTypeForm.controls[
        'workCategoryMasterId'
      ].updateValueAndValidity();

      this.delegationTypeForm.controls['minAmount'].clearValidators();
      this.delegationTypeForm.controls['minAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxAmount'].clearValidators();
      this.delegationTypeForm.controls['maxAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['minPerAmount'].clearValidators();
      this.delegationTypeForm.controls['minPerAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxPerAmount'].clearValidators();
      this.delegationTypeForm.controls['maxPerAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['workExecutionMethod'].clearValidators();
      this.delegationTypeForm.controls[
        'workExecutionMethod'
      ].updateValueAndValidity();
    } else if (this.selectedTypeOfPower === 'ESTIMATE') {
      this.delegationTypeForm.controls['workCategoryMasterId'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls[
        'workCategoryMasterId'
      ].updateValueAndValidity();
      this.delegationTypeForm.controls['minAmount'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['minAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxAmount'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['maxAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['workExecutionMethod'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls[
        'workExecutionMethod'
      ].updateValueAndValidity();
      this.delegationTypeForm.controls['designationMasterId'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls[
        'designationMasterId'
      ].updateValueAndValidity();

      this.delegationTypeForm.controls['categoryCode'].clearValidators();
      this.delegationTypeForm.controls['categoryCode'].updateValueAndValidity();
      this.delegationTypeForm.controls['unit'].clearValidators();
      this.delegationTypeForm.controls['unit'].updateValueAndValidity();
      this.delegationTypeForm.controls['minLoad'].clearValidators();
      this.delegationTypeForm.controls['minLoad'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxLoad'].clearValidators();
      this.delegationTypeForm.controls['maxLoad'].updateValueAndValidity();
      this.delegationTypeForm.controls['minPerAmount'].clearValidators();
      this.delegationTypeForm.controls['minPerAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxPerAmount'].clearValidators();
      this.delegationTypeForm.controls['maxPerAmount'].updateValueAndValidity();
    } else if (this.selectedTypeOfPower === 'REVISEDEST') {
      this.delegationTypeForm.controls['workCategoryMasterId'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls[
        'workCategoryMasterId'
      ].updateValueAndValidity();
      this.delegationTypeForm.controls['unit'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['unit'].updateValueAndValidity();
      this.delegationTypeForm.controls['minPerAmount'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['minPerAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxPerAmount'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls['maxPerAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['workExecutionMethod'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls[
        'workExecutionMethod'
      ].updateValueAndValidity();
      this.delegationTypeForm.controls['designationMasterId'].setValidators([
        Validators.required,
      ]);
      this.delegationTypeForm.controls[
        'designationMasterId'
      ].updateValueAndValidity();

      this.delegationTypeForm.controls['categoryCode'].clearValidators();
      this.delegationTypeForm.controls['categoryCode'].updateValueAndValidity();
      this.delegationTypeForm.controls['minAmount'].clearValidators();
      this.delegationTypeForm.controls['minAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxAmount'].clearValidators();
      this.delegationTypeForm.controls['maxAmount'].updateValueAndValidity();
      this.delegationTypeForm.controls['minLoad'].clearValidators();
      this.delegationTypeForm.controls['minLoad'].updateValueAndValidity();
      this.delegationTypeForm.controls['maxLoad'].clearValidators();
      this.delegationTypeForm.controls['maxLoad'].updateValueAndValidity();
    }
  }

  onDelegationMaster() {
    let updateBody = {};
    let delegationType: any = {};
    delegationType.typeOfPower = this.selectedTypeOfPower;
    if (this.selectedTypeOfPower == 'ESTIMATE') {
      updateBody = {
        typeOfPower: this.delegationTypeForm.value.typeOfPower,
        minAmount: this.delegationTypeForm.value.minAmount,
        maxAmount: this.delegationTypeForm.value.maxAmount,
        designationMasterId: this.delegationTypeForm.value.designationMasterId,
        workCategoryMasterId:
          this.delegationTypeForm.value.workCategoryMasterId,
        workExecutionMethod: this.delegationTypeForm.value.workExecutionMethod,
      };
    } else if (this.selectedTypeOfPower == 'LOAD') {
      updateBody = {
        typeOfPower: this.delegationTypeForm.value.typeOfPower,
        minLoad: this.delegationTypeForm.value.minLoad,
        maxLoad: this.delegationTypeForm.value.maxLoad,
        categoryCode: this.delegationTypeForm.value.categoryCode,
        designationMasterId: this.delegationTypeForm.value.designationMasterId,
        unit: this.delegationTypeForm.value.unit,
      };
    } else if (this.selectedTypeOfPower == 'REVISEDEST') {
      updateBody = {
        typeOfPower: this.delegationTypeForm.value.typeOfPower,
        minAmount: this.delegationTypeForm.value.minPerAmount,
        maxAmount: this.delegationTypeForm.value.maxPerAmount,
        designationMasterId: this.delegationTypeForm.value.designationMasterId,
        workCategoryMasterId:
          this.delegationTypeForm.value.workCategoryMasterId,
        unit: this.delegationTypeForm.value.unit,
        workExecutionMethod: this.delegationTypeForm.value.workExecutionMethod,
      };
    }
    this.configurationService.getDelegationPowerMasterUpdate(
      this.filterData,
      updateBody
    ).then((response) => {
      console.log(" reponse messageText mat type  "+response.messageText);
      console.log(" reponse mat type  "+response);
      if(Response) {
      this.Service.sendUpdate('Delegation Power Master Updated');
      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }
      this.notificationRef = this.snackBar.open(response.messageText,
        'OK',
      {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.notificationRef
        .afterDismissed()
        .toPromise()
        .then(() => {
          this.dialogRef.close();
        }).catch((error) => {
          console.error('Error closing dialog:', error);
        });
      }
    });
  }

  isValidForm(): boolean {
    this.delegationTypeForm.markAllAsTouched();
    console.log('Form Valid?', this.delegationTypeForm.valid);
    let hasError = false;
    Object.keys(this.delegationTypeForm.controls).forEach((key) => {
      const control = this.delegationTypeForm.get(key);
      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });
    if (hasError) {
      return false;
    } else {
      return true;
    }
  }
}
