import { async } from '@angular/core/testing';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MaterialInvoiceService } from 'src/app/services/materialInvoice.service';
import { InvoiceSerialNumbersComponent } from '../../pop-up/invoice-serial-numbers/invoice-serial-numbers.component';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { IndentInvoicePopupComponent } from '../../indent-invoice-popup/indent-invoice-popup.component';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-dispatch-material-invoice-details',
  templateUrl: './dispatch-material-invoice-details.component.html',
  styleUrls: ['./dispatch-material-invoice-details.component.scss'],
})
export class DispatchMaterialInvoiceDetailsComponent implements OnInit {
  data: any = {};
  serialNo: string[] = [];
  wmMaterialsIndentId: string = '';
  driverName: string = '';
  driverPhoneNo: string = '';
  vehicleNo: string = '';
  maxInputLength: number = 17;
  requestBy: string | null;
  fromOffice: string | null;
  submitting: boolean = false;
  validateMaintenanceData:any[]=[];
  validationMessage$ = new BehaviorSubject<string | null>(null);
  wmWorkOrderRegisteredId: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private materialInvoiceService: MaterialInvoiceService,
    private snackbar: MatSnackBar,
    private materialsIntentService:MaterialsIntentService
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
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        wmMaterialsIndentId,
      };
      const invoice =
        await this.materialInvoiceService.getMaterialInvoiceByMaterialIndentId(
          filter
        );
      console.log(
        'invoice.wmMaterialIndentTransLog:',
        invoice.wmMaterialIndentTransLog
      );
      const translog = invoice.wmMaterialIndentTransLog.map((v: any) => {
        return {
          ...v,
          storeQuantity: v.storeQuantity || 0,
          storeUsedQty: v.usedCurrentQty || 0,
          storeBalanceQtyNew: v.newCurrentQty || 0,
          storeBalanceQtyUsed: v.usedCurrentQty || 0,
          estimatedQuantity: v.estimatedQuantity || 0,
          receivedQuantity: v.receivedQuantity || 0,
          matBalancequantity: v.matBalancequantity || 0,
          serialNo: [],
          serials: '',
        };
      });
      console.log('Updated translog:', translog);
      this.data = {
        wmMaterialsIndentDTO: invoice.wmMaterialsIndentDTO,
        wmMaterialIndentTransLog: translog,
      };
      this.wmWorkOrderRegisteredId=this.data.wmMaterialsIndentDTO.wmWorkorderRegisteredId
      if (this.wmWorkOrderRegisteredId) {
      await this.validateRevenueMaintenance(this.wmWorkOrderRegisteredId);
      }
    });
  }
  async validateRevenueMaintenance(wmWorkOrderRegisteredId: string) {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
  
    const filter: any = {
      apiKey,
      serviceKey,
      userRole,
      userName,
      userCode,
      wmWorkOrderRegisteredId,
    };
  
    try {
      const validateMaintenanceData = await this.materialsIntentService.validateQuarter(filter); 
      if (validateMaintenanceData?.messageType == 'FAILURE') {
        this.validationMessage$.next(validateMaintenanceData.messageText);
      } else {
        this.validationMessage$.next(null);
      }
      
    } catch (error) {
      console.error('Error validating revenue maintenance:', error);
    }
  }
  openMaterialSerialNumbersDialog(
    materialMasterId: any,
    storeMasterId: any,
    issuedQuantity: any,
    newCurrentQty: any,
    usedCurrentQty: any,
    i: any
  ) {
    const dialogRef = this.dialog.open(InvoiceSerialNumbersComponent, {
      width: '100%',
      height: '95%',
      data: {
        materialMasterId,
        storeMasterId,
        issuedQuantity,
        newCurrentQty,
        usedCurrentQty,
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
    if (
      this.driverName.trim().length === 0 ||
      this.driverPhoneNo.trim().length === 0 ||
      this.vehicleNo.trim().length === 0
    ) {
      return false;
    }
    // for (const item of this.data.wmMaterialIndentTransLog) {
    //   if (item.isUploadSerialMaterial === '1' && item.serials.trim().length === 0) {
    //     return false;
    //   }
    // }

    return true;
  }
  onConfirmationPopup() {
    const dialogRef = this.dialog.open(IndentInvoicePopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.onSubmit();
      }
    });
  }
  async onSubmit() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
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
          materialSerialStockId: Number(s.materialSerialStockId),
          wmMaterialsIndentId: Number(dto.wmMaterialsIndentId),
          materialsMasterId: Number(dto.materialsMasterId),
          wmMaterialsIndentTransLogId: Number(dto.wmMaterialsIndentTransLogId),
          wmWorkorderRegisteredId: Number(dto.wmWorkorderRegisteredId),
          serialNo: s.serialNo,
          badgeNumber: s.badgeNumber,
          materialStatus: s.materialStatus,
        });
      });
    });

    const submit: any = {
      storeDispatchedInvoiceDTO: {
        wmMaterialsIndentId: Number(
          this.data.wmMaterialsIndentDTO.wmMaterialsIndentId
        ),
        storeMasterId: this.data.wmMaterialsIndentDTO.storeMasterId,
        storeCode: this.data.wmMaterialsIndentDTO.storeCode,
        wmWorkorderRegistrationsId: Number(
          this.data.wmMaterialsIndentDTO.wmWorkorderRegisteredId
        ),
        driverName: this.driverName,
        driverPhoneNo: this.driverPhoneNo,
        vehicleNo: this.vehicleNo,
        typeOfIndent: this.data.wmMaterialsIndentDTO.typeOfIndent,
      },
      wmMaterialsIndentSerializeLogDTO: serials,
    };
    const save = await this.materialInvoiceService.saveDataMaterialsInvoice(
      filter,
      submit
    );
    this.submitting = false;
    if (save.messageType === 'SUCCESS') {
      const snackbarRef: MatSnackBarRef<any> = this.snackbar.open(
        'Saved Material Indent Invoice',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        }
      );
      snackbarRef.afterDismissed().subscribe(() => {
        this.router.navigate([
          `/store-management/Material-indent-invoice-report/${this.wmMaterialsIndentId}`,
        ]);
      });
    } else {
      const snackbarRef: MatSnackBarRef<any> = this.snackbar.open(
        'Failed to save Material Indent Invoice',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          panelClass: 'error-snackbar',
        }
      );
    }
  }
  catch(error) {
    console.error('Error occurred:', error);
    const snackbarRef: MatSnackBarRef<any> = this.snackbar.open(
      'An error occurred while saving Material Indent Invoice',
      'OK',
      {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
        panelClass: 'error-snackbar',
      }
    );
    this.submitting = false;
  }

   // Method to check the quantities before the template renders
   isSerialMaterialAvailable(
    isUploadSerialMaterial: string,
    issuedNewQty: string,
    issuedUsedQty: string
  ): boolean {
    const newQty = Number(issuedNewQty); // Convert string to number
    const usedQty = Number(issuedUsedQty); // Convert string to number
    return isUploadSerialMaterial === '1' && (newQty > 0 || usedQty > 0);
  }
}
