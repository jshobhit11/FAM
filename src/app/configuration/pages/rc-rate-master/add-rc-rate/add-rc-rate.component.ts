import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../../../shared/components/confirmation-popup/confirmation-popup.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MobileUtils } from 'src/app/lib/mobile-utils';
@Component({
  selector: 'app-add-rc-rate',
  templateUrl: './add-rc-rate.component.html',
  styleUrls: ['./add-rc-rate.component.scss'],
})
export class AddRcRateComponent implements OnInit {
  myGroup: FormGroup;
  tableData: any[] = [];
  rateTypeOptions: string[] = ['RC', 'SR'];
  showRateTypeOptions: boolean = false;
  showRcVendorNameOptions: boolean = false;
  noItemsSelected: boolean = true;
  vendorNameOptions: any[] = [];
  selectedRateType: string;
  rcvendorName: string;
  selectedVendorName: string;
  notificationRef: any;
  dataArray: any[] = [];
  selectedMaterialType: string;
  uniqueMaterialTypes: string[] = [];
  selectedTabIndex: number = 0;
  selectedFields: string[] = [];
  visibleMaterialCounts: { [materialType: string]: number } = {};
  showMainTable: boolean = true;
  showPreviewTable: boolean = false;
  isSaveButtonEnabled: boolean = false;
  selectedMaterialTypes: string[] = [];
  selectedRowsForPreview: { materialTypeName: string; rows: any[] }[] = [];
  canShowPreview: boolean = false;
  isRcVendorNameDropdownEnabled: boolean = false;
  isSRSelected: boolean = false;
  isSnackbarDisplayed: boolean = false;
  isOpen: boolean = true;
  showBtn: boolean = true;
  isYouWantToUploadMeters: string = '0';
  saveData: any = {};
  file: any;
  vendorData: any[] = [];
  rateContractMasterId: string;
  isAPILoaded: boolean = false;
  apiUrl = environment.baseURL;
  DicomData: any[] = [];
  selectedDiscomCode: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private rcratesservices: ConfigurationService,
    private Service: CommonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) {}

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    if (target.files[0].name == 'Non_Serial_No_Upload.xlsx') {
      this.saveData.docType = 'Non-Serial';
    }
    if (target.files[0].name == 'SM_Meter_Upload.xlsx') {
      this.saveData.docType = 'mtr';
    }
    if (target.files[0].name == 'SM_Transformer_Upload.xlsx') {
      this.saveData.docType = 'dtc';
    }
    this.file = target.files[0];

    console.log('this.file', this.file);
  }

  blob: any;
  showData: any = {};
  showtable: boolean = false;

  openConfirmationpopupDialog() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.submitUploadMaterial();
      }
    });
  }

  async submitUploadMaterial() {
    let formData = new FormData();
    console.log('file', this.file);
    console.log('rcVendorName', this.rcvendorName);
    console.log('rateType', this.selectedRateType);
    console.log('rateContractMasterId', this.rateContractMasterId);
    formData.append('materialsLabourData', this.file);
    console.log('formData', formData);
    const targetVendor = this.vendorData.find(
      (data) => data.vendorId === this.rcvendorName
    );

    const submit = await this.rcratesservices.GetUploadMaterialData(
      {
        apiKey: sessionStorage.getItem('api-key'),
        serviceKey: sessionStorage.getItem('service-key'),
        userRole: sessionStorage.getItem('user-role'),
        userName: sessionStorage.getItem('user-name'),
        userCode: sessionStorage.getItem('user-code'),
        rateType: this.selectedRateType,
        vendorId: 0,
        rateContractMasterId: 0,
      },
      formData
    );
    console.log(submit);
    this.showData = submit;
    this.showtable = true;
    // if (submit.messageType == 'SUCCESS') {
    this.snackBar
      .open('Upload SR/RC Rates Save Successfully', 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      })
      .onAction()
      .subscribe(() => {
        this.snackBar.dismiss();
      });
    // }
  }

  getExcelFile() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    return this.http.get(
      `${this.apiUrl}/api/materialsLabourMaster/generateMaterialsLabourMasterDataXLS?userName=${userName}&userCode=${userCode}&userRole=${userRole}&apiKey=${apiKey}&serviceKey=${serviceKey}`,
      { observe: 'response', responseType: 'blob' }
    );
  }

  downloadExcelFile() {
    this.getExcelFile().subscribe((fileData: any) => {
      //  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      const blob: any = new Blob([fileData.body], {
        type: fileData.type,
      });
      let link = document.createElement('a');
      if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Material_Labour_Data.xlsx`);
        document.body.appendChild(link);
        if (typeof cordova !== 'undefined') { MobileUtils.downloadFileOnMobileByNameOnly(link.download, blob); } else { link.click(); }        document.body.removeChild(link);
      }
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
    this.tableData = await this.rcratesservices.getAllDataRcRates(filters);
    console.log('this.tableData ===', this.tableData);

    this.isAPILoaded = true;

    this.DicomData = await this.configurationService.getAllDiscomData(filters);
    console.log('discomdata', this.DicomData);
    this.vendorNameOptions = await this.rcratesservices.getAllContractData(
      filters
    );

    console.log('this.vendorNameOptions ===', this.vendorNameOptions);

    this.vendorData = this.vendorNameOptions.map((data) => ({
      vendorId: data.vendorId,
      vendorOrganizationName: data.vendorOrganizationName,
      rateContractMasterId: data.rateContractMasterId,
      rcCode: data.rcCode,
    }));

    this.vendorNameOptions = this.filterUniqueVendorNames(
      this.vendorNameOptions
    );
    this.selectedRateType =
      this.rateTypeOptions.length > 0 ? this.rateTypeOptions[0] : '';
    this.selectedVendorName =
      this.vendorNameOptions.length > 0
        ? this.vendorNameOptions[0].rcVendorName
        : '';
    this.myGroup = this.formBuilder.group({
      RateType: new FormControl(''),
    });
    this.uniqueMaterialTypes = this.filterUniqueMaterialTypes(this.tableData);
    this.calculateVisibleMaterialCounts();
    this.updateCounts();
  }

  filterUniqueMaterialTypes(tableData: any[]): string[] {
    const uniqueTypes: string[] = [];
    const typeSet = new Set();
    for (const row of tableData) {
      const materialType = row.materialTypeName;
      if (!typeSet.has(materialType)) {
        typeSet.add(materialType);
        uniqueTypes.push(materialType);
      }
    }
    return uniqueTypes;
  }

  getTableDataByMaterialType(materialType: string): any[] {
    return this.tableData.filter(
      (row) => row.materialTypeName === materialType
    );
  }

  onTabSelected(event: any) {
    this.selectedMaterialType = this.uniqueMaterialTypes[event.index];
  }

  filterUniqueVendorNames(vendorOptions: any[]): any[] {
    const uniqueVendors = [];
    const vendorMap = new Map();
    for (const vendor of vendorOptions) {
      const vendorName = vendor.rcVendorName;
      if (!vendorMap.has(vendorName)) {
        vendorMap.set(vendorName, {
          rcVendorName: vendorName,
          vendorId: vendor.vendorId,
          rateContractMasterId: vendor.rateContractMasterId,
        });
      }
    }
    for (const [_, vendor] of vendorMap) {
      console.log(_);
      uniqueVendors.push(vendor);
    }
    return uniqueVendors;
  }

  getVendorDetails(selectedVendorName: string) {
    const selectedVendor = this.vendorNameOptions.find(
      (vendor) => vendor.rcVendorName === selectedVendorName
    );
    if (selectedVendor) {
      return {
        vendorId: selectedVendor.vendorId,
        rateContractMasterId: selectedVendor.rateContractMasterId,
      };
    }
    return { vendorId: null, rateContractMasterId: null };
  }

  onVendorNameSelected(vendorName: string) {
    this.selectedVendorName = vendorName;
  }
  onDiscomSelectChange(event: any) {
    this.selectedDiscomCode = event.target.value;
  }
  async onAddRcRateType() {
    if (!this.selectedRateType || !this.selectedVendorName) {
      alert('Please select Rate Type and Vendor Name.');
      return;
    }
    const selectedRowsWithRate = this.tableData.filter(
      (row) => row.selected && row.rate !== ''
    );

    if (selectedRowsWithRate.length === 0) {
      alert('Please select rows and provide rates before saving.');
      return;
    }
    if (this.selectedRateType === 'RC') {
      const selectedVendor = this.vendorNameOptions.find(
        (vendor) => vendor.rcVendorName === this.selectedVendorName
      );
      if (!selectedVendor) {
        console.log('Selected Vendor not found:', this.selectedVendorName);
        alert('Selected vendor not found.');
        return;
      }

      const { vendorId, rateContractMasterId } = selectedVendor;
      const dataToSave = this.tableData
        .filter((row) => row.selected && row.rate !== '')
        .map((row) => ({
          srMaterialsMasterId: row.srMaterialsMasterId,
          materialTypeMasterId: row.materialTypeMasterId,
          mlType: row.mlType,
          mlCode: row.mlCode,
          mlName: row.mlName,
          mlUnit: row.mlUnit,
          rateType: this.selectedRateType,
          mlRate: row.rate,
          vendorId,
          rateContractMasterId,
        }));

      if (dataToSave.length > 0) {
        this.dataArray.push(...dataToSave);
        this.tableData.forEach((row) => {
          if (row.selected && row.rate !== '') {
            row.rate = '';
          }
        });

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

        this.rcratesservices
          .rcRatesSaveData(filters, this.dataArray)
          .then((response) => {
            console.log('Data Saved Successfully:', response);
            this.snackBar
              .open('Data saved successfully!', 'OK', {
                panelClass: ['snackbar-success'],
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              })
              .onAction()
              .subscribe(() => {
                this.isSnackbarDisplayed = true;
                this.router.navigate(['/configuration/rc-rate-master']);
              });
          })
          .catch((error) => {
            console.error('Error while saving data:', error);
            this.snackBar.open('Error saving data!', 'OK', {
              panelClass: ['snackbar-error'],
              verticalPosition: cordova !== undefined ? 'bottom' : 'top',
            });
          });
      } else {
        alert('Please select the particular rate entered check box.');
      }
    } else if (this.selectedRateType === 'SR') {
      const dataToSave = this.tableData
        .filter((row) => row.selected && row.rate !== '')
        .map((row) => ({
          srMaterialsMasterId: row.srMaterialsMasterId,
          materialTypeMasterId: row.materialTypeMasterId,
          mlType: row.mlType,
          mlCode: row.mlCode,
          mlName: row.mlName,
          mlUnit: row.mlUnit,
          rateType: this.selectedRateType,
          mlRate: row.rate,
          vendorId: null,
          rateContractMasterId: null,
        }));
      this.selectedFields = this.tableData
        .filter((row) => row.selected)
        .map((row) => row.mlName);
      this.tableData.forEach((row) => {
        row.selected = false;
        row.rate = '';
      });
      if (dataToSave.length > 0) {
        this.dataArray.push(...dataToSave);
        this.tableData.forEach((row) => {
          if (row.selected && row.rate !== '') {
            row.rate = '';
          }
        });

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

        this.rcratesservices
          .rcRatesSaveData(filters, this.dataArray)
          .then((response) => {
            console.log('Data Saved Successfully:', response);
            this.snackBar
              .open('Data saved successfully!', 'OK', {
                panelClass: ['snackbar-success'],
                verticalPosition: cordova !== undefined ? 'bottom' : 'top',
              })
              .onAction()
              .subscribe(() => {
                this.isSnackbarDisplayed = true;
                this.router.navigate(['/configuration/rc-rate-master']);
              });
          })
          .catch((error) => {
            console.error('Error while saving data:', error);
            this.snackBar.open('Error saving data!', 'Dismiss', {
              panelClass: ['snackbar-error'],
            });
          });
      } else {
        alert('Please select the particular rate entered check box.');
      }
    }
  }

  selectAllCheckboxByMaterialType(
    checked: boolean,
    materialTypeName: string
  ): void {
    for (const row of this.getTableDataByMaterialType(materialTypeName)) {
      row.selected = checked;
      if (checked) {
        this.onSelectField(row.mlName);
      } else {
        this.onSelectField(row.mlName, true);
      }
    }
    this.calculateVisibleMaterialCounts();
  }

  getTabLabel(materialTypeName: string): string {
    const count = this.visibleMaterialCounts[materialTypeName];
    return `${materialTypeName} (${count})`;
  }

  getTotalCount(materialType: string): number {
    const totalCount = this.tableData.filter(
      (row) => row.materialTypeName === materialType
    ).length;
    return totalCount;
  }

  calculateVisibleMaterialCounts() {
    for (const materialType of this.uniqueMaterialTypes) {
      // const totalCount = this.getTotalCount(materialType);
      const selectedCount = this.tableData.filter(
        (row) => row.materialTypeName === materialType && row.selected
      ).length;
      this.visibleMaterialCounts[materialType] = selectedCount;
    }
  }

  updateCounts() {
    for (const materialType of this.uniqueMaterialTypes) {
      // const totalCount = this.getTotalCount(materialType);
      const selectedCount = this.tableData.filter(
        (row) => row.materialTypeName === materialType && row.selected
      ).length;
      this.visibleMaterialCounts[materialType] = selectedCount;
    }
  }

  hasMissingRates(): boolean {
    return this.selectedFields.some((field) => {
      const selectedRow = this.tableData.find((row) => row.mlName === field);
      return selectedRow && selectedRow.selected && !selectedRow.rate;
    });
  }

  loadRateTypeOptions() {
    if (!this.showRateTypeOptions) {
      this.showRateTypeOptions = true;
      if (this.selectedRateType === 'RC') {
        this.isRcVendorNameDropdownEnabled = true;
      } else {
        this.isRcVendorNameDropdownEnabled = false;
      }
    }
  }

  validateRateInput(event: any) {
    const input = event.target.value;
    const pattern = /^\d+(\.\d{1,2})?$/;
    if (!pattern.test(input)) {
      event.target.value = '';
    }
  }

  updateNoItemsSelected() {
    this.noItemsSelected = this.tableData.every((row) => !row.selected);
  }

  onRateTypeChange() {
    this.showRcVendorNameOptions = this.selectedRateType === 'RC';
    this.isSRSelected = this.selectedRateType === 'SR';
  }

  togglePreviewMode() {
    console.log('Selected Fields:', this.selectedFields);
    this.showMainTable = !this.showMainTable;
    this.showPreviewTable = !this.showPreviewTable;
    if (this.hasMissingRates()) {
      alert(
        'Please enter rates for all selected items before proceeding to preview.'
      );
      return;
    }
    this.canShowPreview = true;
  }

  getSelectedRows() {
    return this.tableData.filter((row) => row.selected && row.rate !== '');
  }

  onSelectField(selectedField: string, deselect?: boolean) {
    const selectedRow = this.tableData.find(
      (row) => row.mlName === selectedField
    );

    if (!selectedRow) {
      return;
    }

    if (this.selectedFields.includes(selectedField) && !deselect) {
      return;
    }

    if (deselect) {
      this.selectedFields = this.selectedFields.filter(
        (field) => field !== selectedField
      );
      this.selectedRowsForPreview = this.selectedRowsForPreview.map(
        (rowGroup) => ({
          materialTypeName: rowGroup.materialTypeName,
          rows: rowGroup.rows.filter((row) => row.mlName !== selectedField),
        })
      );
    } else {
      this.selectedFields.push(selectedField);

      const rowGroup = this.selectedRowsForPreview.find(
        (group) => group.materialTypeName === selectedRow.materialTypeName
      );
      if (!rowGroup) {
        this.selectedRowsForPreview.push({
          materialTypeName: selectedRow.materialTypeName,
          rows: [selectedRow],
        });
      } else {
        rowGroup.rows.push(selectedRow);
      }
    }
    this.updateCounts();
    this.updateNoItemsSelected();
  }

  getSelectedRowsByMaterialTypes(materialTypes: string[]): any[] {
    return this.tableData.filter(
      (row) =>
        materialTypes.includes(row.mlType) && row.selected && row.rate !== ''
    );
  }

  getSelectedRowsByMaterialType(materialType: string) {
    return this.tableData.filter(
      (row) => row.selected && row.mlType === materialType
    );
  }

  trackByMaterialTypeName(index: number, materialTypeName: string) {
    return materialTypeName;
  }

  enableSaveButton() {
    this.isSaveButtonEnabled = true;
  }

  onBackToMain() {
    if (!this.isSnackbarDisplayed) {
      this.togglePreviewMode();
    }
  }

  onNext() {
    if (this.selectedTabIndex < this.uniqueMaterialTypes.length - 1) {
      this.selectedTabIndex++;
    } else {
    }
  }

  showBox() {
    if (
      this.selectedRateType == 'SR' ||
      (this.selectedRateType == 'RC' && this.rcvendorName)
    ) {
      this.isOpen = true;
      this.showBtn = false;
    } else {
      this.snackBar.open('Please select above fields first', 'OK');
    }
  }

  hideBox() {
    this.isOpen = false;
    this.showBtn = true;
  }
}
