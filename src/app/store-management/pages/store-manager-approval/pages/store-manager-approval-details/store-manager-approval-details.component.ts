import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { MaterialPopupComponent } from '../../../material-popup/material-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogConfig } from '@angular/material/dialog';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { IndentPopupComponent } from '../indent-popup/indent-popup.component';
import { BehaviorSubject } from 'rxjs';
import { MaterialsIntentService } from 'src/app/services/materialsIntent.service';
@Component({
  selector: 'app-store-manager-approval-details',
  templateUrl: './store-manager-approval-details.component.html',
  styleUrls: ['./store-manager-approval-details.component.scss'],
})
export class StoreManagerApprovalDetailsComponent implements OnInit {
  isAllocateButton: boolean = true;
  data: any;
  snackbarIsOpen: boolean = false;
  matIndentTLog: any[] = [];
  storeOfficerApprovedRemarks: string = '';
  alternateMaterialsData: any[] = [];
  showAlternateMaterialDetails: boolean = false;
  materialsLabourMasterId: any;
  isAddButtonDisabled: boolean = false;
  alternateMaterialsAdded: { [recordId: string]: boolean } = {};
  validateMaintenanceData:any[]=[];
  validationMessage$ = new BehaviorSubject<string | null>(null);
  wmWorkOrderRegisteredId: any;
  constructor(private route: ActivatedRoute,
              private storeOfficeService: StoreOfficeService,
              private snackbar: MatSnackBar, 
              private router: Router,
              private dataSharingService: DataSharingService,
              public dialog: MatDialog,
              private materialsIntentService:MaterialsIntentService
              ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const wmMaterialsIndentId = params.get('wmMaterialsIndentId');
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = { apiKey, serviceKey, userRole, userName, userCode, wmMaterialsIndentId };
      this.data = await this.storeOfficeService.getStoreOfficeApprovalShowMaterialIndentdata(filter);
      const wmMatIndentTLog = this.data.wmMaterialIndentTransLog;
      
      console.log("this.wmMatIndentTLog====",wmMatIndentTLog);
      this.wmWorkOrderRegisteredId=wmMatIndentTLog[0].wmWorkorderRegisteredId;
      if (this.wmWorkOrderRegisteredId) {
        await this.validateRevenueMaintenance(this.wmWorkOrderRegisteredId);
        }
      this.matIndentTLog = wmMatIndentTLog.map((v: any) => {
        return {...v, 
          total: 0,
          issuedNewQty: 0, 
          issuedUsedQty: 0,
          storeQuantity: Number(v.newCurrentQty)|| 0, 
          storeUsedQty:  Number(v.usedCurrentQty) || 0,
          storeBalanceQtyNew: Number(v.newCurrentQty) || 0, 
          storeBalanceQtyUsed: v.usedCurrentQty || 0,
          stockAvailable: "Yes",
        }
      });
      
      this.storeOfficerApprovedRemarks = this.data.wmMaterialIndent.approveRemarks;
    })
    this.dataSharingService.alternateMaterialsData$.subscribe(async (data) => {
      if (data.length) {
        const index = this.matIndentTLog.findIndex(item => item.wmMaterialsIndentTransLogId === data[0].wmMaterialsIndentTransLogId);
   
        if (index !== -1) {
          this.alternateMaterialsData.push(data[0]);
          this.alternateMaterialsAdded[data[0].wmMaterialsIndentTransLogId] = true;
          this.matIndentTLog[index].alternateMaterialsAdded = true;
        }
      }
      this.showAlternateMaterialDetails = true;
      this.isAddButtonDisabled = !this.isAddButtonEnabled();

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
  isAddButtonEnabled(): boolean {
    const isStoreCurrentQtyZero = this.matIndentTLog.every((item) => {
      return item.newCurrentQty === 0 && item.storeUsedQty === 0;
    });
  
    const isStoreQtyLessThanRequested = this.matIndentTLog.every((item) => {
      return (
        item.newCurrentQty + item.storeUsedQty < item.requestQuantity
      );
    });
  
    return !isStoreCurrentQtyZero && isStoreQtyLessThanRequested;
  }
  
handleQuantityChange(index: number) {
  const newItem = this.matIndentTLog[index];
  const newQty = parseFloat(newItem.issuedNewQty) || 0;
  const usedQty = parseFloat(newItem.issuedUsedQty) || 0;

  newItem.total = newQty + usedQty;

  const initialStoreQty = newItem.newCurrentQty || 0;
  const initialStoreUsedQty = newItem.storeUsedQty || 0;

  const totalIssuedQty = newQty + usedQty;
  if (totalIssuedQty > newItem.requestQuantity) {
    this.isAllocateButton = false;
    this.showNotification('Total Issued Quantity Cannot Exceed Requested Quantity',index);
    return;
  } else if (newQty > initialStoreQty || usedQty > initialStoreUsedQty) {
    this.isAllocateButton = false;
    if (newQty > initialStoreQty) {
      this.showNotification('Issued New Quantity Cannot Exceed Store Quantity',index);
    } else {
      this.showNotification('Issued Used Quantity Cannot Exceed Store Used Quantity',index);
    }
  } else {
    this.isAllocateButton = true;

    newItem.storeBalanceQtyNew = initialStoreQty - newQty;
    newItem.storeBalanceQtyUsed = initialStoreUsedQty - usedQty;
    
  }
}
showNotification(message: string, index: number) {
  this.snackbar.open(message, 'OK', {
    verticalPosition: cordova !== undefined ? 'bottom' : 'top',
  });
  this.snackbarIsOpen = true;
  this.snackbar._openedSnackBarRef?.onAction().subscribe(() => {
    this.snackbarIsOpen = false;
    
    const newItem = this.matIndentTLog[index];

    
    const defaultNewQty = 0;
    const defaultUsedQty = 0;

    newItem.issuedNewQty = defaultNewQty.toString();
    newItem.issuedUsedQty = defaultUsedQty.toString();

    
    newItem.total = defaultNewQty + defaultUsedQty; 
    newItem.amount = newItem.total * newItem.unitPrice;  

   
    newItem.storeBalanceQtyNew = newItem.newCurrentQty - defaultNewQty;
    newItem.storeBalanceQtyUsed = newItem.storeUsedQty - defaultUsedQty;
  });
}

calculateMatBalanceQty(dataItem: any): number {
  const estimatedQty = parseFloat(dataItem.estimatedQuantity) || 0;
  const drawnQty = parseFloat(dataItem.receivedQuantity) || 0;
  const totalIssuedQty = parseFloat(dataItem.issuedNewQty) + parseFloat(dataItem.issuedUsedQty) || 0;
  
  return estimatedQty - (drawnQty+totalIssuedQty);
}

resetInputValues(index: number) {
  const newItem = this.matIndentTLog[index];
  const newQty = parseFloat(newItem.issuedNewQty) || 0;
  const usedQty = parseFloat(newItem.issuedUsedQty) || 0;

  if (newQty === 0 && usedQty === 0) {
    newItem.issuedNewQty = '0';
    newItem.issuedUsedQty = '0';
    this.calculateTotal(index);
  }
}

limitInputToThreeDecimalPlaces(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  let inputValue = inputElement.value;
  const validPattern = /^\d{0,10}(\.\d{0,3})?$/;
  if (!validPattern.test(inputValue)) {
    const match = inputValue.match(/^\d{0,10}(\.\d{0,3})?/);
    inputElement.value = match ? match[0] : '';
  }
}
blockExtraDecimalPlaces(event: KeyboardEvent): void {
  const allowedKeys = [
    'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'
  ];
  
  if (allowedKeys.includes(event.key)) return;

  const inputElement = (event.target as HTMLInputElement).value;
  if (inputElement.includes('.') && inputElement.split('.')[1].length >= 3 && event.key >= '0' && event.key <= '9') {
    event.preventDefault();
  }
}

  calculateTotal(index: number) {
  const newItem = this.matIndentTLog[index];
  const newQty = parseFloat(newItem.issuedNewQty) || 0;
  const usedQty = parseFloat(newItem.issuedUsedQty) || 0;
  
  const total = newQty + usedQty;
  this.matIndentTLog[index].total = total;
}

  
getTotal(index: number, dataItem: any) {
  const newQty = parseFloat(dataItem.issuedNewQty) || 0;
  const usedQty = parseFloat(dataItem.issuedUsedQty) || 0;
  return (newQty + usedQty) || 0;
}

calculateAmount(total: number, rate: number) {
  return total * rate;
}
onStockAvailableChange(dataItem: any) {
  if (dataItem.stockAvailable === 'Yes') {
    dataItem.nostockflag = 0; 
  } else if (dataItem.stockAvailable === 'No') {
    dataItem.nostockflag = 1; 
  }else {
    dataItem.nostockflag = 0; 
  }
}

  
  convertToCode(value: string) {
    const v = value.split('-');
    return v[0];
  }
  dataItem = {
   
    stockAvailable: '', 
    nostockflag: 0, 
  };
  // isStoreQtyZero(item: any): boolean {
  //   return item.storeQuantity === 0 && item.storeUsedQty === 0;
  // }
  // && this.isStoreQtyZero(dataItem)
  openMaterialPopup(dataItem: any, totalIssuedQty: any) {
    if (dataItem.stockAvailable === 'No') {
      if (this.alternateMaterialsAdded[dataItem.wmMaterialsIndentTransLogId]) {
        this.showSnackBar('Alternate materials have already been added for this Material.');
      } else {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.data = { matIndentTLog: dataItem, totalIssuedQty };
        dialogConfig.disableClose = true;
        this.dialog.open(MaterialPopupComponent, dialogConfig);
      }
    } else {
      this.showSnackBar('Please select "No" from the "Stock Available" dropdown to select the Alternate Material.');
    }
  }
  
  showSnackBar(message: string) {
    this.snackbar.open(message, 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top',
    });
  }
  receiveSavedData(savedData: any) {
    console.log('Received saved data in parent component:', savedData);
  }
  onConfiramationPopupOpen(){
    const dialogRef = this.dialog.open(IndentPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.allocate();
      }
    });
  }
  async allocate(){ 
  const apiKey = sessionStorage.getItem('api-key');
  const serviceKey = sessionStorage.getItem('service-key');
  const userRole = sessionStorage.getItem('user-role');
  const userName = sessionStorage.getItem('user-name');
  const userCode = sessionStorage.getItem('user-code');
  const storeOfficerApprovedRemarks = this.storeOfficerApprovedRemarks;
//  const wmMaterialsIndentTransLogId = this.alternateMaterialsData.map(item => item.wmMaterialsIndentTransLogId).join(', ')
//  const alternateMaterialMasterId = this.alternateMaterialsData.map(item => item.materialsLabourMasterId).join(', ');

  const filter: any = { 
    apiKey, 
    serviceKey,
    userRole, 
    userName, 
    userCode,
    storeOfficerApprovedRemarks,
 //   wmMaterialsIndentTransLogId,
 //   alternateMaterialMasterId
  };
  
  const tLog: any[] = [];
  const alternateMaterialsTransLog: any[] = [];
  if (this.matIndentTLog.length === 0) {
    this.snackbar.open(
      'You don\'t have any materials to allocate.',
      'OK',
      { verticalPosition: cordova !== undefined ? 'bottom' : 'top', panelClass: ['error-snackbar'] }
    );
    return; 
  }
const isValidSubmission = this.matIndentTLog.some(item => {
  const totalIssuedQty = parseFloat(item.issuedNewQty) + parseFloat(item.issuedUsedQty);
  return item.requestQuantity > 0 && totalIssuedQty > 0;
});

if (!isValidSubmission) {
  this.snackbar.open(
    'Allocation not allowed: Ensure at least one requested item has an issued quantity.',
    'OK',
    { verticalPosition: cordova !== undefined ? 'bottom' : 'top' }
  );
  return; 
}
const isInvalidAllocation = this.matIndentTLog.some((item: any) => {
  const requestedQty = item.requestQuantity || 0;
  const storeNewQty = item.newCurrentQty || 0;
  const storeUsedQty = item.storeUsedQty || 0;
  const issuedNewQty = parseFloat(item.issuedNewQty) || 0;
  const issuedUsedQty = parseFloat(item.issuedUsedQty) || 0;

  return (
    requestedQty > 0 &&
    storeNewQty === 0 &&
    storeUsedQty === 0 &&
    (issuedNewQty > 0 || issuedUsedQty > 0)
  );
});

if (isInvalidAllocation) {
  this.snackbar.open(
    'Allocation not allowed: Store quantity is insufficient for the requested quantity.',
    'OK',
    { verticalPosition: cordova !== undefined ? 'bottom' : 'top', panelClass: ['error-snackbar'] }
  );
  return;
}

  this.matIndentTLog.forEach((v: any) => {
    if (v.nostockflag === undefined || v.nostockflag === null) {
      v.nostockflag = 0;
    }
    const newQty = parseFloat(v.issuedNewQty) || 0;
    const usedQty = parseFloat(v.issuedUsedQty) || 0;
    const totalIssuedQty = newQty + usedQty;
    const total = newQty + usedQty;
    const issuedAmount = total * parseFloat(v.issuedRate);
    const matBalancequantity = this.calculateMatBalanceQty(v);
    tLog.push({
      storeInventoryId: parseFloat(v.storeInventoryId),
      issuedRate: v.materialRate,
      part: v.part,
      issuedUsedQty: parseFloat(v.issuedUsedQty).toFixed(3),
      issuedNewQty: parseFloat(v.issuedNewQty).toFixed(3),
      storeUsedQty: parseFloat(v.storeUsedQty).toFixed(3),
      storeBalanceQuantity: parseFloat(v.storeBalanceQtyNew).toFixed(3), 
      storeUsedBalanceQty:parseFloat(v.storeBalanceQtyUsed).toFixed(3),
      issuedQuantity: (parseFloat(v.issuedNewQty) + parseFloat(v.issuedUsedQty)).toFixed(3),
      storeQuantity:parseFloat(v.storeQuantity).toFixed(3),
      matBalancequantity: matBalancequantity.toFixed(3),
      issuedAmount: issuedAmount.toFixed(3),
      wmMaterialsIndentTransLogId: parseFloat(v.wmMaterialsIndentTransLogId), 
      wmMaterialsIndentId: parseFloat(v.wmMaterialsIndentId),
   //   alternateMaterialMasterId:parseFloat(alternateMaterialMasterId),
      noStockFlag:v.nostockflag,
    });
  });
  this.alternateMaterialsData.forEach((alternateItem: any) => {
    alternateMaterialsTransLog.push({
      wmMaterialsIndentId:parseFloat(this.data.wmMaterialIndent.wmMaterialsIndentId) ,
      materialsMasterId:parseInt(alternateItem.materialsLabourMasterId),
      requestQuantity: alternateItem.requestedQty,
      issuedQuantity: parseFloat(alternateItem.totalIssuedQty).toFixed(3),
      storeQuantity: alternateItem.storeNewQunatity,
      issuedRate: alternateItem.mlRate,
      issuedAmount:parseFloat(alternateItem.amount).toFixed(3),
      part: alternateItem.part,
      storeInventoryId:parseInt(alternateItem.storeInventoryId),
      storeBalanceQuantity: parseFloat(alternateItem.storeNewBalanceQunatity).toFixed(3),
      issuedNewQty:parseFloat(alternateItem.issuedNewQty).toFixed(3),
      issuedUsedQty: parseFloat(alternateItem.issuedUsedQty).toFixed(3),
      storeUsedQty: alternateItem.storeUsedQunatity,
      storeUsedBalanceQty:parseFloat( alternateItem.storeUsedBalanceQunatity).toFixed(3),
      estimationWorkScopeDataId:parseFloat(this.data.wmMaterialIndentTransLog[0]?.estimationWorkScopeDataId),
      estimationRegisteredId:parseFloat(this.data.wmMaterialIndentTransLog[0]?.estimationRegisteredId),
      wmWorkorderRegisteredId:parseFloat(alternateItem.wmWorkorderRegisteredId),
      alternateMaterialMasterId:parseFloat(alternateItem.materialsMasterId),
    });
  });

  const alternate: any = {
    wmMaterialIndent: {
      wmMaterialsIndentId: this.data.wmMaterialIndent.wmMaterialsIndentId,
      typeOfIndent:"INDENT",
    },
    wmMaterialIndentTransLog: tLog,
    wmMaterialIndentTransLogForAlternateMaterial: alternateMaterialsTransLog, 
  };
  const save = await this.storeOfficeService.saveStoreOfficeApprovalAlternate(filter, alternate);
  if (save.messageType === 'SUCCESS') {
    this.snackbar.open('Store Manager approved sucessfully!', 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
    });

    this.data = {};
    this.matIndentTLog = [];
    this.router.navigate(['/store-management', 'store-manager-approval']);
  } else {
    this.snackbar.open('Allocation Failed', 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
      panelClass: ['error-snackbar'], 
    });
  }
} 
  catch (error) {
    console.error('Error occurred during allocation:', error);
    this.snackbar.open('An error occurred during allocation', 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
      panelClass: ['error-snackbar'],
    });
  }
  isStockAvailable(newQty: number, usedQty: number): boolean {
    console.log("stock data",newQty+"   "+usedQty);
    return newQty > 0 || usedQty > 0;
  }
  
deleteAlternateMaterial(index: number) {
  this.alternateMaterialsData.splice(index, 1);
}

}
