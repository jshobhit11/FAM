import { Component, OnInit ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MaterialAcknowledgementReportComponent } from '../material-acknowledgement-report.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-material-acknowledgement-serial-number',
  templateUrl: './material-acknowledgement-serial-number.component.html',
  styleUrls: ['./material-acknowledgement-serial-number.component.scss']
})
export class MaterialAcknowledgementSerialNumberComponent implements OnInit {
  serialControl = new FormControl();
  uploadExcel = new FormControl();
  invoiceData: any;
  serialNoArr: any[] = [];
  addSerialNo: any[] = [];
  filteredSerialNumbers: Observable<string[]>;
  selectedType: 'new' | 'used' = 'new';
  newCurrentQty: any; 
  usedCurrentQty: any;
  workscopeDescCode:any;
  wmWorkorderRegisteredId:any;
  newSerialNumbers: any[] = [];
  usedSerialNumbers: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MaterialAcknowledgementReportComponent>,
    private materialInvoiceService: MaterialInvoiceService,
    private snackbar: MatSnackBar,
  ) {}

  async ngOnInit() {  
    this.newCurrentQty = this.data.issuedNewQty;
    this.usedCurrentQty = this.data.issuedUsedQty;
    this.workscopeDescCode = this.data.workscopeDescCode;
    this.wmWorkorderRegisteredId =this.data.wmWorkorderRegisteredId;
  }
  async updateSerialNumbers(type: 'new' | 'used') {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const installedfilter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      materialMasterId: this.data.materialMasterId,
      wmWorkorderRegisteredId:this.data.wmWorkorderRegisteredId

    };
    const assignedFilter:any ={
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      materialMasterId: this.data.materialMasterId,
      storeMasterId: this.data.storeMasterId,
      wmWorkorderRegisteredId:this.data.wmWorkorderRegisteredId
    }
    if (this.workscopeDescCode=='RG') {
      this.invoiceData = await this.materialInvoiceService.getAssignedMaterialForMaterialAcknowledgement(assignedFilter);
    } else {
      this.invoiceData = await this.materialInvoiceService.getInstalledMaterialForMaterialAcknowledgement(installedfilter);
    }
  
    if (this.invoiceData) {
      this.serialNoArr = this.invoiceData.map((v: any) => v.serialNo);
    }
  
    this.filteredSerialNumbers = this.serialControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSerialNumbers(value)),
    );
  }
  
  
  
  private _filterSerialNumbers(value: string): string[] {
    return this.serialNoArr.filter((no) => no.includes(value));
  }

  async onApply() {
    this.dialogRef.close(this.addSerialNo);
  }

  addSerialNumbers(event: any) {
    const serialNo = event.option.value;
    this.serialControl.setValue(serialNo);
  }

  addSNo() {
    const sno = this.serialControl.value;
   
    const isDuplicate = this.newSerialNumbers.some(item => item.serialNo === sno) ||
                        this.usedSerialNumbers.some(item => item.serialNo === sno);
  
    const currentQty = this.selectedType === 'new' ? this.newCurrentQty : this.usedCurrentQty;
  
    if (isDuplicate) {
  
      const config: MatSnackBarConfig = {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
        duration: 3000, 
      };
      this.snackbar.open('Duplicate serial number. Please choose a different one.', 'Close', config);
    } else if (currentQty > 0 && (this.newSerialNumbers.length + this.usedSerialNumbers.length) >= currentQty) {
 
      const config: MatSnackBarConfig = {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
        duration: 3000, 
      };
      this.snackbar.open(`You can only add up to ${currentQty} serial numbers.`, 'Close', config);
    } else {
      const invoice = this.invoiceData.find((v: any) => v.serialNo);
      const newItem = {
        isSelected: true,
        serialNo: sno,
        materialStatus: invoice.materialStatus,
        materialSerialStockId: invoice.materialSerialStockId,
        storeCode: invoice.storeCode,
        storeOfficeId: this.data.storeOfficeId,
        materialCode: invoice.materialCode,
        materialMasterId: invoice.materialMasterId,
      };
  
      if (this.selectedType === 'new') {
        this.newSerialNumbers.push(newItem);
      } else if (this.selectedType === 'used') {
        this.usedSerialNumbers.push(newItem);
      }
  
      this.addSerialNo.push(newItem);
      this.serialControl.setValue('');
    }
  }
  
  
  
  deleteSerialNo(serialNo: any, index: any) {
   
    if (this.selectedType === 'new') {
      this.newSerialNumbers.splice(index, 1);
    } else if (this.selectedType === 'used') {
      this.usedSerialNumbers.splice(index, 1);
    }
  
    this.addSerialNo.splice(index, 1);
  }
  selectedKey(i: any) {
    if (this.addSerialNo[i].isSelected) {
      this.addSerialNo[i].isSelected = true;
    } else {
      this.addSerialNo[i].isSelected = false;
    }
  }

  public uploadData($event: any) {
    const target = (<DataTransfer>(<unknown>$event.target)) as DataTransfer;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = async (e: any) => {
      const binaryStr = e.target.result as string;
      const workBook = XLSX.read(binaryStr, { type: 'binary' }) as XLSX.WorkBook;
      const workSheetName = workBook.SheetNames[0] as string;
      const workSheet = workBook.Sheets[workSheetName] as XLSX.WorkSheet;
      const data = XLSX.utils.sheet_to_json(workSheet) as Array<any>;
      console.log('Data', data);
      data.forEach((v: any) => {
        this.addSerialNo.push({
          isSelected: true,
          serialNo: v.SERIALNO,
          storeCode: v.STORECODE,
          materialCode: v.MATERIALCODE,
        });
      });
    };
  }
}
