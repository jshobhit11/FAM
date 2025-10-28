import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { StoreManagementRoutingModule } from './store-management-routing.module';
import { StoreManagementComponent } from './store-management.component';
import { StoreManagerApprovalComponent } from './pages/store-manager-approval/store-manager-approval.component';
import { DispatchMaterialInvoiceComponent } from './pages/dispatch-material-invoice/dispatch-material-invoice.component';
import { DispatchMaterialInvoiceDetailsComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/dispatch-material-invoice-details.component';
import { MaterialSerialNumbersComponent } from './pages/dispatch-material-invoice/pop-up/material-serial-numbers/material-serial-numbers.component';
import { StoreManagerApprovalDetailsComponent } from './pages/store-manager-approval/pages/store-manager-approval-details/store-manager-approval-details.component';
import { UploadInvoiceApprovalDetailsComponent } from './pages/upload-invoice-approval/pages/upload-invoice-approval-details/upload-invoice-approval-details.component';
import { UploadInvoiceApprovalComponent } from './pages/upload-invoice-approval/upload-invoice-approval.component';
import { UploadInvoiceComponent } from './pages/upload-invoice/upload-invoice.component';
import { GatePassComponent } from './pages/gate-pass/gate-pass.component';
import { GatePassDetailsComponent } from './pages/gate-pass/pages/gate-pass-details/gate-pass-details.component';
import { StoreManagementSidenavComponent } from './components/store-management-sidenav/store-management-sidenav.component';
import { MaterialIndentInvoiceReportComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/material-indent-invoice-report.component';
import { DatePipeThirdComponent } from '../commons/date-pipe/date-pipe.component-third';
import { GatePassReportComponent } from './pages/gate-pass/pages/gate-pass-details/gate-pass-report/gate-pass-report.component';
import { InvoiceSerialNumbersComponent } from './pages/dispatch-material-invoice/pop-up/invoice-serial-numbers/invoice-serial-numbers.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ExceptionalReportComponent } from './pages/exceptional-report/exceptional-report.component';
import { StoreTransferRequestComponent } from './pages/store-transfer-request/store-transfer-request.component';
import { StoreTransferApprovalComponent } from './pages/store-transfer-approval/store-transfer-approval.component';
import { StoreTransferApprovalFormComponent } from './pages/store-transfer-approval-form/store-transfer-approval-form.component';
import { StockLogReportComponent } from './pages/stock-log-report/stock-log-report.component';
import { StockInventoryAbstractReportComponent } from './pages/stock-inventory-abstract-report/stock-inventory-abstract-report.component';
import { GatePassAcknowledgementComponent } from './pages/gate-pass-acknowledgement/gate-pass-acknowledgement/gate-pass-acknowledgement.component';
import { GatePassAcknowledgementDetailsComponent } from './pages/gate-pass-acknowledgement/gate-pass-acknowledgement-details/gate-pass-acknowledgement-details.component';
import { MaterialAcknowledmentComponent } from './pages/material-return-process/material-acknowledgement-report/material-acknowledment/material-acknowledment.component';
import { MaterialAcknowledgementReportComponent } from './pages/material-return-process/material-acknowledgement-report/material-acknowledgement-report.component';
import { MaterialAcknowledgementSerialNumberComponent } from './pages/material-return-process/material-acknowledgement-report/material-acknowledgement-serial-number/material-acknowledgement-serial-number.component';
import { MaterialReturnAcknowledgementComponent } from './pages/material-return-process/material-acknowledgement-report/material-return-acknowledgement/material-return-acknowledgement.component';
import { StoreManagerReturnDetailsComponent } from './pages/store-manager-approval/pages/store-manager-return-details/store-manager-return-details.component';
import { StoreManagerSuspenseDetailsComponent } from './pages/store-manager-approval/pages/store-manager-suspense/store-manager-suspense-details/store-manager-suspense-details.component';
import { StoreManagerStoreIndentComponent } from './pages/store-manager-approval/pages/store-manger-store-indent/store-manager-store-indent/store-manager-store-indent.component';
import { InvoiceStoreSuspenseDetailsComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/invoice-store-suspense-details.component';
// import { InvoicStoreSuspenseReportComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/invoic-store-suspense-report/invoic-store-suspense-report.component';
import { StoreIndentDetailsComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/store-indent-details/store-indent-details.component';
//import { StoreIndentInvoiceReportComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/store-indent-invoice-report/store-indent-invoice-report.component';
import { MaterialSuspenseAcknowledgementComponent } from './pages/material-return-process/material-suspense-acknowledgement/material-suspense-acknowledgement.component';
import { MaterialAcknowledgementSuspenseReportComponent } from './pages/material-return-process/material-suspense-acknowledgement/material-acknowledgement-suspense-report/material-acknowledgement-suspense-report.component';
//import { InvoicStoreSuspenseReportComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/invoic-store-suspense-report/invoic-store-suspense-report.component';
import { MaterialPopupComponent } from './pages/material-popup/material-popup.component';
import { SuspensePopupComponent } from './pages/store-manager-approval/pages/suspense-popup/suspense-popup.component';
import { StorePopupComponent } from './pages/store-manager-approval/pages/store-popup/store-popup.component';
import { IndentPopupComponent } from './pages/store-manager-approval/pages/indent-popup/indent-popup.component';
import { ReturnPopupComponent } from './pages/store-manager-approval/pages/return-popup/return-popup.component';
import { IndentInvoicePopupComponent } from './pages/dispatch-material-invoice/indent-invoice-popup/indent-invoice-popup.component';
import { SuspenseInvoicePopupComponent } from './pages/dispatch-material-invoice/suspense-invoice-popup/suspense-invoice-popup.component';
import { StoreInvoicePopupComponent } from './pages/dispatch-material-invoice/store-invoice-popup/store-invoice-popup.component';
import { AcknowReturnComponent } from './pages/material-return-process/acknow-return/acknow-return.component';
import { StoretPopupComponent } from './pages/storet-popup/storet-popup.component';
import { StoreaPopupComponent } from './pages/storea-popup/storea-popup.component';
import { SenderTransferAprovalComponent } from './pages/sender-transfer-aproval/sender-transfer-aproval.component';
import { ReceiverTransferApprovalComponent } from './pages/receiver-transfer-approval/receiver-transfer-approval.component';
import { ReceiverTransferApprovalFormComponent } from './pages/receiver-transfer-approval/receiver-transfer-approval-form/receiver-transfer-approval-form.component';
import { SenderTransferApprovalFormComponent } from './pages/sender-transfer-aproval/sender-transfer-approval-form/sender-transfer-approval-form.component';
import { SenderPopupComponent } from './pages/sender-popup/sender-popup.component';
import { ReceiverPopupComponent } from './pages/receiver-popup/receiver-popup.component';
import { MaterialStoreAcknowledgementComponent } from './pages/material-return-process/material-store-acknowledgement/material-store-acknowledgement/material-store-acknowledgement.component';
import { MaterialStoreAcknwReportComponent } from './pages/material-return-process/material-store-acknowledgement/material-store-acknw-report/material-store-acknw-report.component';
import { StoreiPopupComponent } from './pages/material-return-process/material-store-acknowledgement/storei-popup/storei-popup.component';
import { RejectStockPopupComponent } from './pages/reject-stock-popup/reject-stock-popup.component';
import { StoreManagementDashboardComponent } from './components/store-management-dashboard/store-management-dashboard.component';
import { StoreGenerateComponent } from './pages/store-generate/store-generate.component';
import { StoreInventoryAdjustmentComponent } from './pages/store-inventory-adjustment/StoreInventoryAdjustmentComponent';
import { StoreAdjustmentReportComponent } from './pages/store-adjustment-report/store-adjustment-report.component';
import { StoreInvAdjPopupComponent } from './pages/store-inv-adj-popup/store-inv-adj-popup.component';
import { StoreIssueSuspenseReportComponent } from './pages/store-issue-suspense-report/store-issue-suspense-report.component';
import { InvoiceSuspenseSerialComponent } from './pages/invoice-suspense-serial/invoice-suspense-serial.component';
import { AcknowledgementSerialSuspenseComponent } from './pages/acknowledgement-serial-suspense/acknowledgement-serial-suspense.component';
import { StockSerialNumberComponent } from './pages/stock-serial-number/stock-serial-number.component';
import { StoreSerialMaterialReportComponent } from './pages/store-serial-material-report/store-serial-material-report.component';

@NgModule({
  declarations: [
    StoreManagementComponent,
    StoreManagementDashboardComponent,
    StoreManagerApprovalComponent,
    StoreManagerApprovalDetailsComponent,
    UploadInvoiceComponent,
    UploadInvoiceApprovalComponent,
    UploadInvoiceApprovalDetailsComponent,
    DispatchMaterialInvoiceComponent,
    DispatchMaterialInvoiceDetailsComponent,
    MaterialSerialNumbersComponent,
    InvoiceSerialNumbersComponent,
    GatePassComponent,
    GatePassDetailsComponent,
    StoreManagementSidenavComponent,
    MaterialIndentInvoiceReportComponent,
    DatePipeThirdComponent,
    GatePassReportComponent,
    ExceptionalReportComponent,
    StoreTransferRequestComponent,
    StoreTransferApprovalComponent,
    StoreTransferApprovalFormComponent,
    StockLogReportComponent,
    StockInventoryAbstractReportComponent,
    GatePassAcknowledgementComponent,
    GatePassAcknowledgementDetailsComponent,
    MaterialAcknowledmentComponent,
    MaterialAcknowledgementReportComponent,
    MaterialAcknowledgementSerialNumberComponent,
    MaterialReturnAcknowledgementComponent,
    StoreManagerReturnDetailsComponent,
    StoreManagerSuspenseDetailsComponent,
    StoreManagerStoreIndentComponent,
    InvoiceStoreSuspenseDetailsComponent,
    //InvoicStoreSuspenseReportComponent,
    StoreIndentDetailsComponent,
    //StoreIndentInvoiceReportComponent,
    MaterialSuspenseAcknowledgementComponent,
    MaterialAcknowledgementSuspenseReportComponent,
    MaterialPopupComponent,
    SuspensePopupComponent,
    StorePopupComponent,
    IndentPopupComponent,
    ReturnPopupComponent,
    IndentInvoicePopupComponent,
    SuspenseInvoicePopupComponent,
    StoreInvoicePopupComponent,
    AcknowReturnComponent,
    StoretPopupComponent,
    StoreaPopupComponent,
    SenderTransferAprovalComponent,
    ReceiverTransferApprovalComponent,
    ReceiverTransferApprovalFormComponent,
    SenderTransferApprovalFormComponent,
    SenderPopupComponent,
    ReceiverPopupComponent,
    MaterialStoreAcknowledgementComponent,
    MaterialStoreAcknwReportComponent,
    StoreiPopupComponent,
    RejectStockPopupComponent,
    StoreGenerateComponent,
    StoreInventoryAdjustmentComponent,
    StoreAdjustmentReportComponent,
    StoreInvAdjPopupComponent,
    StoreIssueSuspenseReportComponent,
    InvoiceSuspenseSerialComponent,
    AcknowledgementSerialSuspenseComponent,
    StockSerialNumberComponent,
    StoreSerialMaterialReportComponent,
  ],
  imports: [CommonModule, StoreManagementRoutingModule, SharedModule, MatAutocompleteModule],
})
export class StoreManagementModule { }
