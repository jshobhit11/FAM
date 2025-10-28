import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';
import { MaterialAcknowledgementSerialNumberComponent } from './material-acknowledgement-serial-number/material-acknowledgement-serial-number.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcknowReturnComponent } from '../acknow-return/acknow-return.component';

@Component({
  selector: 'app-material-acknowledgement-report',
  templateUrl: './material-acknowledgement-report.component.html',
  styleUrls: ['./material-acknowledgement-report.component.scss']
})
export class MaterialAcknowledgementReportComponent implements OnInit {
  data: any = {};
  serialNo: string[] = [];
  wmMaterialsIndentId: string = '';
  driverName: string = '';
  driverPhoneNo: string ='';
  vehicleNo: string = '';
  maxInputLength: number = 17;
  requestBy: string | null;
  fromOffice: string | null;
  workscopeDescCode: string='';
  constructor(
              public dialog: MatDialog,
              private router:Router, 
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
      const invoice = await this.materialInvoiceService.getMaterialInvoiceByMaterialIndentId(filter);
      const translog = invoice.wmMaterialIndentTransLog.map((v: any) => {
        return { ...v, serialNo: [], serials: '' };
      });
      this.data = {
        wmMaterialsIndentDTO: invoice.wmMaterialsIndentDTO,
        wmMaterialIndentTransLog: translog,
      };
      this.workscopeDescCode=this.data.wmMaterialIndentTransLog[0].workscopeDescCode;
    });
  }
  onReport() {
    this.router.navigate(['/store-management/Material-indent-invoice-report']);
  }

  openMaterialSerialNumbersDialog(
          materialMasterId: any, 
          storeMasterId: any, 
          issuedQuantity: any, 
          issuedNewQty: any,
          workscopeDescCode:any, 
          wmWorkorderRegisteredId:any,
          issuedUsedQty: any, 
          i: any
        ) {
    const dialogRef = this.dialog.open(MaterialAcknowledgementSerialNumberComponent, {
      data: {
        materialMasterId,
        storeMasterId,
        issuedQuantity,
        issuedNewQty, 
        workscopeDescCode,
        wmWorkorderRegisteredId,
        issuedUsedQty,
      },
      width: '100%',
      height:'90%'
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
  isFormValid(): boolean {
    return (
      this.driverName.trim().length > 0 &&
      this.driverPhoneNo.trim().length > 0 &&
      this.vehicleNo.trim().length > 0
    );
  }
  onConfiramationPopupReturn(){
    const dialogRef = this.dialog.open(AcknowReturnComponent);
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
  
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode,workscopeDescCode: this.workscopeDescCode };
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
          materialSerialStockId:Number(s.materialSerialStockId),
          wmMaterialsIndentId: Number(dto.wmMaterialsIndentId),
          materialsMasterId: Number(dto.materialsMasterId),
          wmMaterialsIndentTransLogId: Number(dto.wmMaterialsIndentTransLogId),
          wmWorkorderRegisteredId: Number(dto.wmWorkorderRegisteredId),
          serialNo: s.serialNo,
          materialStatus:s.materialStatus
        });
      });
    });

    const submit: any = {
      storeDispatchedInvoiceDTO: {
        wmMaterialsIndentId: Number(this.data.wmMaterialsIndentDTO.wmMaterialsIndentId),
        storeMasterId: this.data.wmMaterialsIndentDTO.storeMasterId,
        storeCode: this.data.wmMaterialsIndentDTO.storeCode,
        wmWorkorderRegistrationsId: Number(this.data.wmMaterialsIndentDTO.wmWorkorderRegisteredId),
        driverName:this.driverName,
        driverPhoneNo:this.driverPhoneNo,
        vehicleNo:this.vehicleNo,
      },
      wmMaterialsIndentSerializeLogDTO: serials,
    };
    console.log('return serial',submit,filter);
    const save = await this.materialInvoiceService.saveDataMaterialsInvoice(filter, submit);
    if (save.messageType === 'SUCCESS') {
      this.snackbar.open('Saved Material Acknowledment', 'OK',{
        verticalPosition:"top"
      });
      this.router.navigate([`/store-management/Material-return-report/${this.wmMaterialsIndentId}`]);
    }
  }
}