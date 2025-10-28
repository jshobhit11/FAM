import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';
import { InvoiceSerialNumbersComponent } from 'src/app/store-management/pages/dispatch-material-invoice/pop-up/invoice-serial-numbers/invoice-serial-numbers.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreInvoicePopupComponent } from 'src/app/store-management/pages/dispatch-material-invoice/store-invoice-popup/store-invoice-popup.component';
import { StockSerialNumberComponent } from 'src/app/store-management/pages/stock-serial-number/stock-serial-number.component';

@Component({
  selector: 'app-store-indent-details',
  templateUrl: './store-indent-details.component.html',
  styleUrls: ['./store-indent-details.component.scss']
})
export class StoreIndentDetailsComponent implements OnInit {
  data: any = {};
  serialNo: string[] = [];
  wmMaterialsIndentId: string = '';
  driverName: string = '';
  driverPhoneNo: string ='';
  vehicleNo: string = '';
  maxInputLength: number = 17;
  requestBy: string | null;
  fromOffice: string | null;
  constructor(public dialog: MatDialog,private router:Router, 
              private route: ActivatedRoute, 
              private materialInvoiceService: MaterialInvoiceService, 
              private snackbar: MatSnackBar
              ){
                this.requestBy = this.route.snapshot.queryParamMap.get('requestBy');
                this.fromOffice = this.route.snapshot.queryParamMap.get('fromOffice');
              }
              
  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const wmMaterialsIndentId = params.get('wmMaterialsIndentId');
      this.wmMaterialsIndentId = wmMaterialsIndentId;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, wmMaterialsIndentId };
      const invoice = await this.materialInvoiceService.getMaterialSuspenseStoreDataById(filter);
      const translog = invoice.wmMaterialIndentTransLog.map((v: any) => {
        return { ...v, serialNo: [], serials: '' };
      });
      this.data = {
        wmMaterialsIndentDTO: invoice.wmMaterialsIndentDTO,
        wmMaterialIndentTransLog: translog,
      };
    });
  }
  onReport() {
    this.router.navigate(['/store-management/Material-indent-invoice-report']);
  }

  openMaterialSerialNumbersDialog(materialMasterId: any, storeMasterId: any, issuedQuantity: any, issuedNewQty: any, issuedUsedQty: any, i: any, serialData: string) {
    const dialogRef = this.dialog.open(StockSerialNumberComponent, {
      data: {
        materialMasterId,
        storeMasterId,
        issuedQuantity,
        issuedNewQty, 
        issuedUsedQty,
        serialData
      },
      width: '100%',
    });
    dialogRef.afterClosed().subscribe((v) => {
      if (v && v.length) {
        const serial = v.filter((sr: any) => sr.isSelected === true);
        const serialNos = serial.map((srNos: any) => srNos.serialNo) as string[];
        const serials = serialNos.join(',');
        this.data.wmMaterialIndentTransLog[i].serials = serials;
        this.data.wmMaterialIndentTransLog[i].serialNo = serial;
        this.data.wmMaterialIndentTransLog[i].badgeNumbers = serial.map(
          (srNos: any) => srNos.badgeNumber
        );
      }
    });
  }

  convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
  }
  isFormValid(): boolean {
    return (
      this.driverName.trim().length > 0 &&
      this.driverPhoneNo.trim().length > 0 &&
      this.vehicleNo.trim().length > 0
    );
  }
  onConfiramationPopup(){
      const dialogRef = this.dialog.open(StoreInvoicePopupComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.onSubmit();
        }
      });
  }
  async onSubmit() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode };
    const serializeLogDTO: any[] = [];
    const serials: any[] = [];
    this.data.wmMaterialIndentTransLog.forEach((v: any) => {
      serializeLogDTO.push({
        wmMaterialsIndentId: v.wmMaterialsIndentId,
        wmWorkorderRegistrationsId: v.wmWorkorderRegistrationsId,
        serialNo: v.serialNo,
        materialsMasterId: v.materialsMasterId,
        wmMaterialsIndentTransLogId: v.wmMaterialsIndentTransLogId,
        wmWorkorderRegisteredId: v.wmWorkorderRegisteredId,
      });
    });

    serializeLogDTO.forEach((dto: any) => {
      dto.serialNo.forEach((s: any) => {
        serials.push({
          smInventoryUploadMaterialsLogId: Number(s.smInventoryUploadMaterialsLogId),
          wmMaterialsIndentId: Number(dto.wmMaterialsIndentId),
          materialsMasterId: Number(dto.materialsMasterId),
          materialSerialStockId:Number(s.materialSerialStockId),
          wmMaterialsIndentTransLogId: Number(dto.wmMaterialsIndentTransLogId),
          wmWorkorderRegisteredId: Number(dto.wmWorkorderRegisteredId),
          serialNo: s.serialNo,
          badgeNumber: s.badgeNumber,
        });
      });
    });

    const submit: any = {
      storeDispatchedInvoiceDTO: {
        wmMaterialsIndentId: Number(this.data.wmMaterialsIndentDTO.wmMaterialsIndentId),
        storeMasterId: this.data.wmMaterialsIndentDTO.storeMasterId,
        storeCode: this.data.wmMaterialsIndentDTO.storeCode,
       // wmWorkorderRegistrationsId: Number(this.data.wmMaterialsIndentDTO.wmWorkorderRegisteredId),
        driverName:this.driverName,
        driverPhoneNo:this.driverPhoneNo,
        vehicleNo:this.vehicleNo,
      },
      wmMaterialsIndentSerializeLogDTO: serials,
    };
    console.log('data', submit);
    const save = await this.materialInvoiceService.saveDataMaterialsInvoice(filter, submit);
    if (save.messageType === 'SUCCESS') {
      this.snackbar.open('Saved Material Invoice', 'OK',{
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
      this.router.navigate([`/store-management/Material-store-invoice-report/${this.wmMaterialsIndentId}`]);
    }
  }
}
