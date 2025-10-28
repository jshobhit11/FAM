import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';
import { MaterialAcknowledgementSerialNumberComponent } from '../material-acknowledgement-report/material-acknowledgement-serial-number/material-acknowledgement-serial-number.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuspenseInvoicePopupComponent } from '../../dispatch-material-invoice/suspense-invoice-popup/suspense-invoice-popup.component';
import { AcknowledgementSerialSuspenseComponent } from '../../acknowledgement-serial-suspense/acknowledgement-serial-suspense.component';

@Component({
  selector: 'app-material-suspense-acknowledgement',
  templateUrl: './material-suspense-acknowledgement.component.html',
  styleUrls: ['./material-suspense-acknowledgement.component.scss']
})
export class MaterialSuspenseAcknowledgementComponent implements OnInit {
  data: any = {};
  serialNo: string[] = [];
  wmMaterialsIndentId: string = '';
  wmMaterialIndentTransLog: any[] = [];
  driverName: string = '';
  driverPhoneNo: string = '';
  vehicleNo: string = '';
  maxInputLength: number = 17;
  requestBy: string | null;
  fromOffice: string | null;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private materialInvoiceService: MaterialInvoiceService,
    private snackbar: MatSnackBar
  ) {
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
      const invoice = await this.materialInvoiceService.getMaterialSuspenseByMaterialIndentId(filter);
      this.wmMaterialIndentTransLog = invoice.wmMaterialIndentTransLog.map((v: any) => {
        return { ...v, serialNo: [], serials: '' };
      });

      console.log('API Response:', invoice);

      this.data = {
        wmMaterialsIndentDTO: invoice.wmMaterialsIndentDTO,
        wmMaterialIndentTransLog: this.wmMaterialIndentTransLog,
      }
    });
  }

  enforceIndianVehicleNumberFormat() {
    this.vehicleNo = this.vehicleNo.replace(/[^A-Z0-9\s]/gi, '').toUpperCase().substring(0, this.maxInputLength);
    this.vehicleNo = this.vehicleNo.replace(/^([A-Z]{2})([0-9]{2})([A-Z]{1})([0-9]{4}).*/, '$1 $2 $3 $4');
  }

  formatPhoneNumber(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.driverPhoneNo = inputElement.value.replace(/[^0-9]/g, '');
  }

  onReport() {
    this.router.navigate(['/store-management/Material-indent-invoice-report']);
  }
  calculateStoreUsedBalance(dataItem: any): number {
    const issuedUsedQty = parseFloat(dataItem.issuedUsedQty || 0);
    const receiverUsedCurrentQty = parseFloat(dataItem.receiverUsedCurrentQty || 0);
    
    return issuedUsedQty + receiverUsedCurrentQty;
  }
  calculateStoreBalance(dataItem: any): number {
    const issuedNewQty = parseFloat(dataItem.issuedNewQty || 0);
    const receiverNewCuurentQty = parseFloat(dataItem.receiverNewCuurentQty || 0);
    
    return issuedNewQty +receiverNewCuurentQty;
  }
  openMaterialSerialNumbersDialog(materialMasterId: any, storeMasterId: any, issuedQuantity: any, issuedNewQty: any, issuedUsedQty: any, i: any) {
    const dialogRef = this.dialog.open(AcknowledgementSerialSuspenseComponent, {
      data: {
        materialMasterId,
        storeMasterId,
        issuedQuantity,
        issuedNewQty,
        issuedUsedQty,
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
      }
    });
  }

  convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
  }
  onConfiramationPopup(){
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
    const submitArray: any[] = [];
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
          wmMaterialsIndentTransLogId: Number(dto.wmMaterialsIndentTransLogId),
          wmWorkorderRegisteredId: Number(dto.wmWorkorderRegisteredId),
          serialNo: s.serialNo,
        });
      });
    });
    for (const log of this.data.wmMaterialIndentTransLog) {
      const storeBalanceNewQty = this.calculateStoreBalance(log).toFixed(2);
      const storeBalanceUsedQty = this.calculateStoreUsedBalance(log).toFixed(2);
      const submitItem: any = {
        // storeDispatchedInvoiceDTO: {
          wmMaterialsIndentId: Number(this.data?.wmMaterialsIndentDTO.wmMaterialsIndentId),
          storeMasterId: this.data?.wmMaterialsIndentDTO.receiverStoreId,
          storeCode: this.data?.wmMaterialsIndentDTO.receiverStoreCode,
          storeInventoryId: Number(log.receiverStoreInventoryId),
          materialCode: log.materialCode,
          materialMasterId: Number(log.materialsMasterId),
          transactionQuantity: log.issuedQuantity,
          transactionRate: log.issuedRate,
          transactionAmount: log.issuedAmount,
          officeId: this.data.wmMaterialsIndentDTO.officeId,
          newQty: log.issuedNewQty,
          usedQty: log.issuedUsedQty,
          storeCurrNewQty: log.storeQuantity,
          storeCurrUsedQty: log.storeUsedQty,
          storeBalanceNewQty:log.storeBalanceQuantity,
          storeBalanceUsedQty:log.storeUsedBalanceQty,
          wmMaterialsIndentTransLogId: Number(log.wmMaterialsIndentTransLogId)
        // },
      };
      submitArray.push(submitItem);
    }

    // console.log("material acknowledgement save", submitArray);
    // return;
    const save = await this.materialInvoiceService.saveDataMaterialsAcknowledgement(filter, submitArray);
    if (save.messageType === 'SUCCESS') {
      this.snackbar.open('Saved Material Acknowledgment', 'OK', {
        verticalPosition: "top"
      });
      this.router.navigate([`/store-management/material-ackowledgement`]);
    }
  }
}
