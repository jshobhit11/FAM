import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { StoreOfficeService } from 'src/app/services/storeOffice.service';
import { SuspensePopupComponent } from '../../suspense-popup/suspense-popup.component';
@Component({
  selector: 'app-store-manager-suspense-details',
  templateUrl: './store-manager-suspense-details.component.html',
  styleUrls: ['./store-manager-suspense-details.component.scss']
})
export class StoreManagerSuspenseDetailsComponent implements OnInit {
  isAllocateButton: boolean = true;
  data: any;
  snackbarIsOpen: boolean = false;
  matIndentTLog: any[] = [];
  storeOfficerApprovedRemarks: string = '';
  constructor(
              private route: ActivatedRoute, 
              private storeOfficeService: StoreOfficeService, 
              private snackbar: MatSnackBar, 
              private router: Router,
              public dialog: MatDialog,
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
      this.data = await this.storeOfficeService.getStoreOfficeApprovalShowSuspenseMaterialIndentdata(filter);
      const wmMatIndentTLog = this.data.wmMaterialIndentTransLog;
      this.matIndentTLog = wmMatIndentTLog.map((v: any) => {
        return {...v, 
          total: 0,
          issuedNewQty: 0, 
          issuedUsedQty: 0,
          storeQuantity: v.newCurrentQty || 0, 
          storeUsedQty: v.usedCurrentQty || 0,
          storeBalanceQtyNew: v.newCurrentQty || 0, 
          storeBalanceQtyUsed: v.usedCurrentQty || 0,
          
        }
      });
      this.storeOfficerApprovedRemarks = this.data.wmMaterialIndent.approveRemarks;
      console.log('storeOfficerApprovedRemarks:', this.storeOfficerApprovedRemarks);
    })
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
  resetItemValues(item: any) {
    item.issuedNewQty = 0;
    item.issuedUsedQty = 0;
    item.total = 0;
    item.storeBalanceQtyNew = item.newCurrentQty;
    item.storeBalanceQtyUsed = item.usedCurrentQty;
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
              
  // changeRemark(remark: any) {
    //   this.data.wmMaterialIndent.approveRemarks = remark;
    //   console.log(this.data.wmMaterialIndent);
    // }
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
  
    
    convertToCode(value: string) {
      const v = value.split('-');
      return v[0];
    }
    openSuspensePoup(){
      const dialogRef = this.dialog.open(SuspensePopupComponent);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.allocate();
        }
      });
    }
  async allocate() {
    const apiKey = sessionStorage.getItem('api-key');
    const serviceKey = sessionStorage.getItem('service-key');
    const userRole = sessionStorage.getItem('user-role');
    const userName = sessionStorage.getItem('user-name');
    const userCode = sessionStorage.getItem('user-code');
    const storeOfficerApprovedRemarks = this.storeOfficerApprovedRemarks;
    const filter: any = { apiKey, serviceKey, userRole, userName, userCode,storeOfficerApprovedRemarks};
    
    const tLog: any[] = [];
    const alternateMaterialsTransLog: any[] = [];
    if (this.matIndentTLog.length === 0) {
      this.snackbar.open(
        'don\'t have any materials to allocate.',
        'OK',
        { verticalPosition: cordova !== undefined ? 'bottom' : 'top', panelClass: ['error-snackbar'] }
      );
      return; 
    }
    this.matIndentTLog.forEach((v: any) => {
      const newQty = parseFloat(v.issuedNewQty) || 0;
      const usedQty = parseFloat(v.issuedUsedQty) || 0;
      const issuedRate = parseFloat(v.materialRate) || 0; 
      
      const issuedAmount = (newQty + usedQty) * issuedRate;
      
      tLog.push({
        storeInventoryId: parseFloat(v.storeInventoryId),
        issuedRate: issuedRate.toFixed(3),
        issuedUsedQty: parseFloat(v.issuedUsedQty).toFixed(3),
        issuedNewQty: parseFloat(v.issuedNewQty).toFixed(3),
        storeUsedQty: parseFloat(v.storeUsedQty).toFixed(3),
        storeBalanceQuantity: parseFloat(v.storeBalanceQtyNew).toFixed(3), 
        storeUsedBalanceQty: parseFloat(v.storeBalanceQtyUsed).toFixed(3),
        issuedQuantity: (newQty + usedQty).toFixed(3),
        storeQuantity: parseFloat(v.storeQuantity).toFixed(3),
        issuedAmount: issuedAmount.toFixed(3),
        wmMaterialsIndentTransLogId: parseFloat(v.wmMaterialsIndentTransLogId),
        // wmMaterialsIndentId: parseFloat(v.wmMaterialsIndentId),
        noStockFlag: 0,
      });
    });
    
    
    const allocate: any = {
      wmMaterialIndent: {
        wmMaterialsIndentId: this.data.wmMaterialIndent.wmMaterialsIndentId,
        typeOfIndent:"SUSPENSE_INDENT",
      },
      wmMaterialIndentTransLog: tLog,
      wmMaterialIndentTransLogForAlternateMaterial: alternateMaterialsTransLog,
    };
    // console.log('sus[pense',allocate);
    // return;
    const save = await this.storeOfficeService.saveStoreOfficeApprovalForIndent(filter, allocate);
    if (save.messageType === 'SUCCESS') {
      this.snackbar.open('Store Manager Successfully Approved Suspense data', 'OK', {
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
  } catch (error) {
    console.error('Error occurred during allocation:', error);
    this.snackbar.open('An error occurred during allocation', 'OK', {
      verticalPosition: cordova !== undefined ? 'bottom' : 'top', 
      panelClass: ['error-snackbar'],
    });
  }
}
