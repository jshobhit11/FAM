  import { Component, Inject, OnInit } from '@angular/core';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { CommonService } from 'src/app/services/common.service';
  import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
  import { ConfigurationService } from 'src/app/services/configuration.service';
  import { FormGroup, FormBuilder, Validators } from '@angular/forms';

  @Component({
    selector: 'app-update-maintenance',
    templateUrl: './update-maintenance.component.html',
    styleUrls: ['./update-maintenance.component.scss'],
  })
  export class UpdateMaintenanceComponent implements OnInit {
    checklistItems: string[] = [];
    jobNotifyDays: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
    frequencyOptions: string[] = ['QUARTERLY', 'HALFEARLY', 'YEARLY','MONTHLEY','THREE YEARS','FIVE YEARLY'];
    MaintenanceOptions: string[] = ['Inspection', 'Preventive', 'Overhaul'];
    officeTypeOptions: string[] = ['DIV STORE','CIRCLE','SUBDIV','ZONE','SECTION','CORPORATE','DIV'];
    notificationRef: any;
    assetTypes: any[] = [];
    designations: any[] = [];
    selectedMaintenanceSchedulerId: number | null = null;
    MaintenanceForm: FormGroup;
    mmMaintenanceAssetTypeMasterId: any;
    constructor(
      private configurationService: ConfigurationService,
      private snackBar: MatSnackBar,
      private dialogRef: MatDialogRef<any>,
      private Service: CommonService,
      private formBuilder: FormBuilder,
      @Inject(MAT_DIALOG_DATA) 
      private data: any
    ) {
      console.log('data=====', data.field1);
      
      dialogRef.disableClose = true;
      this.MaintenanceForm = this.formBuilder.group({
        assetType: ['', Validators.required],
        responsibleOfficer: ['', Validators.required],
        remarks: [''],
        equipment: ['', Validators.required],
        jobNotifyDay: ['', Validators.required],
        frequency: ['', Validators.required],
        maintenanceType: ['', Validators.required],
        checklistInput: [''],
        officeType: ['', Validators.required]
      });
    }

    async ngOnInit() {
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

      const updateDesigFilter = {... filters, mmMaintenanceSchedulerMasterId:this.data.field1};
      try {
        const [assetData, designationData, schedulerData] = await Promise.all([
          this.configurationService.getAllMaintenanceAssetType(filters),
          this.configurationService.getDesignationMasterGetAllData(filters),
          this.configurationService.getMaintenaceSchudulerGetByID( updateDesigFilter)
        ]);

        this.assetTypes = assetData;
        const uniqueDesignationCodes = new Set(designationData.map(item => item.designationCode));
        this.designations = Array.from(uniqueDesignationCodes).map(code => {
          const matchingItem = designationData.find(item => item.designationCode === code);
          return {
            designationCode: matchingItem.designationCode,
            designationMasterId: matchingItem.designationMasterId,
          };
        });

        if (schedulerData) {
          this.mmMaintenanceAssetTypeMasterId = schedulerData.mmMaintenanceAssetTypeMasterId;
          this.MaintenanceForm.patchValue({
            assetType: this.getAssetName(schedulerData.mmMaintenanceAssetTypeMasterId, assetData),
            responsibleOfficer: this.getDesignationName(schedulerData.responsibleOfficer, designationData),
            remarks: schedulerData.remarks,
            equipment: schedulerData.equipment,
            jobNotifyDay: schedulerData.jobNotifyDay,
            frequency: schedulerData.frequency,
            maintenanceType: schedulerData.maintenanceType,
            officeType: schedulerData.responsibleOfficeType
          });
          this.checklistItems = schedulerData.checklistItems || [];
          this.selectedMaintenanceSchedulerId = schedulerData.mmMaintenanceSchedulerMasterId;
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    getAssetName(mmMaintenanceAssetTypeMasterId: any, assetData: any){
      const matchingAsset = assetData.find(asset => asset.mmMaintenanceAssetTypeMasterId === mmMaintenanceAssetTypeMasterId);
      return matchingAsset ? matchingAsset.assetType : '';
    }
    getDesignationName(responsibleOfficer: any, designationData: any){
      const matchingDesignation = designationData.find(designation => Number(designation.designationMasterId)  === responsibleOfficer);
      return matchingDesignation ? matchingDesignation.designationCode : '';
    }
    onAssetTypeSelectionChange(selectedAssetType: string) {
      const selectedAsset = this.assetTypes.find(asset => asset.assetType === selectedAssetType);
      if (selectedAsset) {
        this.mmMaintenanceAssetTypeMasterId = selectedAsset.mmMaintenanceAssetTypeMasterId;
      } else {
        this.mmMaintenanceAssetTypeMasterId = null;
      }
    }

    addToTable(value: string) {
      if (value.trim() !== '') {
        this.checklistItems.push(value);
      }
    }

    deleteItem(index: number) {
      this.checklistItems.splice(index, 1);
    }

    onUpdateMaintenanceType() {
      this.markAllFieldsTouched();
      if (this.MaintenanceForm.valid) {
        const apiKey = sessionStorage.getItem('api-key');
        const serviceKey = sessionStorage.getItem('service-key');
        const userRole = sessionStorage.getItem('user-role');
        const userName = sessionStorage.getItem('user-name');
        const userCode = sessionStorage.getItem('user-code');
        const mmMaintenanceSchedulerMasterId = this.data.field1;
        const filters: any = {
          apiKey,
          serviceKey,
          userRole,
          userName,
          userCode,
          mmMaintenanceSchedulerMasterId,
        };
        const selectedDesignationCode =
        this.MaintenanceForm.get('responsibleOfficer').value;
        const selectedDesignation = this.designations.find(
          (designation) => designation.designationCode === selectedDesignationCode
        );
        const selectedDesignationMasterId = selectedDesignation
        ? selectedDesignation.designationMasterId
        : null;
        const payload = {
          mmMaintenanceSchedulerMasterId: Number(this.data.field1),
          mmMaintenanceAssetTypeMasterId: this.mmMaintenanceAssetTypeMasterId,
          maintenanceType: this.MaintenanceForm.get('maintenanceType')?.value,
          frequency: this.MaintenanceForm.get('frequency')?.value,
          equipment: this.MaintenanceForm.get('equipment')?.value,
          remarks: this.MaintenanceForm.get('remarks')?.value,
          responsibleOfficeType: this.MaintenanceForm.get('officeType')?.value,
          // responsibleOfficer: Number(this.MaintenanceForm.get('responsibleOfficer')?.value),
          responsibleOfficer: parseInt(selectedDesignationMasterId),
          jobNotifyDay: this.MaintenanceForm.get('jobNotifyDay')?.value,

          //assetType: this.MaintenanceForm.get('assetType')?.value,
          //checklistItems: this.checklistItems,
        };

        console.log('payload ===', payload );
        
        this.configurationService.updateMaintenanceData(filters, payload).
        then(() => {
            this.Service.sendUpdate('Maintenance Scheduler Updated');
          this.showSuccessSnackbar();
        })
        .catch((error) => {
          console.error('Error saving maintenance data:', error);
        });
      //       console.log('Data saved successfully:', response);
      //       this.dialogRef.close('Data updated successfully');
      //       this.notificationRef = this.snackBar.open('Data updated successfully', 'Close', { duration: 3000 });
      //     },
      //     error => {
      //       console.error('Error saving data:', error);
      //       this.snackBar.open('Error saving data', 'Close', { duration: 3000 });
      //     }
      //   );
      // } else {
      //   this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      }
    }
    showSuccessSnackbar() {
      if (this.notificationRef) {
        this.notificationRef.dismiss();
        this.notificationRef = null;
      }
      this.notificationRef = this.snackBar.open(
        'Maintenance Scheduler Data Updated Successfully',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      this.notificationRef
        .afterDismissed()
        .toPromise()
        .then(() => {
          this.dialogRef.close();
        });
    }
    markAllFieldsTouched() {
      this.MaintenanceForm.markAllAsTouched();
    }
  }
