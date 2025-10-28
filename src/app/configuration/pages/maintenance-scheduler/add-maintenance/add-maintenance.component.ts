import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigurationService } from 'src/app/services/configuration.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  MaxValidator,
} from '@angular/forms';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss'],
})
export class AddMaintenanceComponent {
  checklistItems: string[] = [];
  checklistValue: string = '';
  jobNotifyDays: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  frequencyOptions: string[] = ['QUARTERLY', 'HALFEARLY', 'YEARLY','MONTHLEY','THREE YEARS','FIVE YEARLY'];
  MaintenanceOptions: string[] = ['Inspection', 'Preventive', 'Overhaul'];
  officeTypeOptions: string[] = ['DIV STORE','CIRCLE','SUBDIV','ZONE','SECTION','CORPORATE','DIV']
  notificationRef: any;
  assetTypes: any[] = [];
  selectedAssetType: string = '';
  selctedDesignation: string = '';
  designations: any[] = [];
  selectedDesignationCode: string = '';
  selectedJobNotifyDay: number = null;
  selectedMaintenanceType: string = '';
  selectedFrequency: string = '';
  selectedEquipment: string = '';
  selectedRemarks: string = '';
  selectedMaintenanceSchedulerId: number | null = null;
  selectedDesignationMasterId: number | null = null;
  MaintenanceForm: FormGroup;
  MaintenaceSchedulerTypeObj = {
    mmMaintenanceSchedulerMasterDTO: {
      mmMaintenanceAssetTypeMasterId: '',
      maintenanceType: '',
      frequency: '',
      equipment: '',
      remarks: '',
      responsibleOfficer: null,
      jobNotifyDay: null,
      responsibleOfficeType:null,
    },
    mmMaintenanceChecklistMasterDTOArray: [
      {
        checkList: '',
      },
    ],
  };

  constructor(
    private configurationService: ConfigurationService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<any>,
    private Service: CommonService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private getAllData: any
  ) {
    dialogRef.disableClose = true;
    this.MaintenanceForm = this.formBuilder.group({
      assetType: ['', Validators.required],
      responsibleOfficer: ['AE', Validators.required],
      remarks: [''],
      equipment: ['', Validators.required],
      jobNotifyDay: ['', Validators.required],
      frequency: ['', Validators.required],
      maintenanceType: ['', Validators.required],
      checklistInput: [''],
      officeType:['',Validators.required]
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

    try {
      const data = await this.configurationService.getAllMaintenanceAssetType(
        filters
      );
      const data1 =
        await this.configurationService.getDesignationMasterGetAllData(filters);
      this.assetTypes = data;
      const uniqueDesignationCodes = new Set(
        data1.map((item) => item.designationCode)
      );
      this.designations = Array.from(uniqueDesignationCodes).map((code) => {
        const matchingItem = data1.find(
          (item) => item.designationCode === code
        );
        return {
          designationCode: matchingItem.designationCode,
          designationMasterId: matchingItem.designationMasterId,
        };
      });
      console.log('aset types', this.designations);
      console.log('Maintenance designations all data', this.designations);
    } catch (error) {
      console.error('Error fetching designations:', error);
    }
  }

  onAssetTypeSelectionChange(selectedAssetType: string) {
    const selectedAsset = this.assetTypes.find(
      (asset) => asset.assetType === selectedAssetType
    );
    if (selectedAsset) {
      this.selectedMaintenanceSchedulerId =
        selectedAsset.mmMaintenanceAssetTypeMasterId;
    } else {
      this.selectedMaintenanceSchedulerId = null;
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

  onAddMaintenanceType() {
    this.markAllFieldsTouched();
    if (this.MaintenanceForm.valid) {
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
      const selectedDesignationCode =
        this.MaintenanceForm.get('responsibleOfficer').value;

      if (this.checklistItems.length === 0) {
        return;
      }
      const selectedDesignation = this.designations.find(
        (designation) => designation.designationCode === selectedDesignationCode
      );
      const selectedDesignationMasterId = selectedDesignation
        ? selectedDesignation.designationMasterId
        : null;

      const maintenanceRecord = {
        mmMaintenanceSchedulerMasterDTO: {
          mmMaintenanceAssetTypeMasterId: Number(
            this.selectedMaintenanceSchedulerId
          ),
          maintenanceType: this.MaintenanceForm.get('maintenanceType').value,
          frequency: this.MaintenanceForm.get('frequency').value,
          equipment: this.MaintenanceForm.get('equipment').value,
          remarks: this.MaintenanceForm.get('remarks').value,
          responsibleOfficer: parseInt(selectedDesignationMasterId),
          jobNotifyDay: this.MaintenanceForm.get('jobNotifyDay').value,
          responsibleOfficeType :this.MaintenanceForm.get('officeType').value,
        },
        mmMaintenanceChecklistMasterDTOArray: this.checklistItems.map(
          (checklistItem) => {
            return { checkList: checklistItem };
          }
        ),
      };
      this.configurationService
        .saveMaintenanceData(filters, maintenanceRecord)
        .then(() => {
          this.Service.sendUpdate('Maintenance Scheduler Updated');
          this.showSuccessSnackbar();
        })
        .catch((error) => {
          console.error('Error saving maintenance data:', error);
        });
    }
  }
  showSuccessSnackbar() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
    this.notificationRef = this.snackBar.open(
      'Maintenance Scheduler Data Added Successfully',
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
    Object.values(this.MaintenanceForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
  onCloseNotification() {
    if (this.notificationRef) {
      this.notificationRef.dismiss();
      this.notificationRef = null;
    }
  }
}
