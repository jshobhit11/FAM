import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';
import { InvoiceSerialNumbersComponent } from '../../../../pop-up/invoice-serial-numbers/invoice-serial-numbers.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuspenseInvoicePopupComponent } from '../../../../suspense-invoice-popup/suspense-invoice-popup.component';
import { InvoiceSuspenseSerialComponent } from 'src/app/store-management/pages/invoice-suspense-serial/invoice-suspense-serial.component';

@Component({
  selector: 'app-invoice-store-suspense-details',
  templateUrl: './invoice-store-suspense-details.component.html',
  styleUrls: ['./invoice-store-suspense-details.component.scss']
})
export class InvoiceStoreSuspenseDetailsComponent implements OnInit {
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
        return { ...v,
          storeQuantity: v.storeQuantity || 0,
          storeUsedQty: v.usedCurrentQty || 0,
          storeBalanceQtyNew: v.newCurrentQty || 0,
          storeBalanceQtyUsed: v.usedCurrentQty || 0,
          estimatedQuantity: v.estimatedQuantity || 0,
          receivedQuantity: v.receivedQuantity || 0,
          matBalancequantity: v.matBalancequantity || 0,
           serialNo: [], 
           serials: '' };
      });
      this.data = {
        wmMaterialsIndentDTO: invoice.wmMaterialsIndentDTO,
        wmMaterialIndentTransLog: translog,
      };
    });
  }


  openMaterialSerialNumbersDialog(
    materialMasterId: any,
    storeMasterId: any,
    issuedQuantity: any,
    newCurrentQty: any,
    usedCurrentQty: any,
    i: any,
    serialData: string
  ) {
    const dialogRef = this.dialog.open(InvoiceSuspenseSerialComponent, {
      width: '100%',
      height: '95%',
      data: {
        materialMasterId,
        storeMasterId,
        issuedQuantity,
        newCurrentQty,
        usedCurrentQty,
        serialData
      },
    });
    dialogRef.afterClosed().subscribe((v) => {
      if (v && v.length) {
        const serial = v.filter((sr: any) => sr.isSelected === true);
        const serialNos = serial.map(
          (srNos: any) => srNos.serialNo
        ) as string[];
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
  onConfirmationPopup(){
    const dialogRef = this.dialog.open(SuspenseInvoicePopupComponent);
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
        materialSerialStockId:v.materialSerialStockId,
        wmMaterialsIndentTransLogId: v.wmMaterialsIndentTransLogId,
        wmWorkorderRegisteredId: v.wmWorkorderRegisteredId,
      });
    });

    serializeLogDTO.forEach((dto: any) => {
      dto.serialNo.forEach((s: any) => {
        serials.push({
          smInventoryUploadMaterialsLogId: Number(s.smInventoryUploadMaterialsLogId),
          materialSerialStockId:Number(s.materialSerialStockId),
          wmMaterialsIndentId: Number(dto.wmMaterialsIndentId),
          materialsMasterId: Number(dto.materialsMasterId),
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
      //  wmWorkorderRegistrationsId: Number(this.data.wmMaterialsIndentDTO.wmWorkorderRegisteredId),
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
      this.router.navigate([`/store-management/Material-suspense-invoice-report/${this.wmMaterialsIndentId}`]);
    }
  }
}
