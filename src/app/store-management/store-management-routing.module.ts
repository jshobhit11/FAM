import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GatePassComponent } from './pages/gate-pass/gate-pass.component';
import { GatePassDetailsComponent } from './pages/gate-pass/pages/gate-pass-details/gate-pass-details.component';
import { DispatchMaterialInvoiceComponent } from './pages/dispatch-material-invoice/dispatch-material-invoice.component';
import { DispatchMaterialInvoiceDetailsComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/dispatch-material-invoice-details.component';
import { StoreManagerApprovalComponent } from './pages/store-manager-approval/store-manager-approval.component';
import { StoreManagerApprovalDetailsComponent } from './pages/store-manager-approval/pages/store-manager-approval-details/store-manager-approval-details.component';
import { UploadInvoiceComponent } from './pages/upload-invoice/upload-invoice.component';
import { UploadInvoiceApprovalComponent } from './pages/upload-invoice-approval/upload-invoice-approval.component';
import { UploadInvoiceApprovalDetailsComponent } from './pages/upload-invoice-approval/pages/upload-invoice-approval-details/upload-invoice-approval-details.component';
import { MaterialIndentInvoiceReportComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/material-indent-invoice-report.component';
import { GatePassReportComponent } from './pages/gate-pass/pages/gate-pass-details/gate-pass-report/gate-pass-report.component';
import { ExceptionalReportComponent } from './pages/exceptional-report/exceptional-report.component';
import { StoreTransferRequestComponent } from './pages/store-transfer-request/store-transfer-request.component';
import { StoreTransferApprovalComponent } from './pages/store-transfer-approval/store-transfer-approval.component';
import { StoreTransferApprovalFormComponent } from './pages/store-transfer-approval-form/store-transfer-approval-form.component';
import { StockLogReportComponent } from './pages/stock-log-report/stock-log-report.component';
import { GatePassAcknowledgementComponent } from './pages/gate-pass-acknowledgement/gate-pass-acknowledgement/gate-pass-acknowledgement.component';
import { GatePassAcknowledgementDetailsComponent } from './pages/gate-pass-acknowledgement/gate-pass-acknowledgement-details/gate-pass-acknowledgement-details.component';
import { StockInventoryAbstractReportComponent } from './pages/stock-inventory-abstract-report/stock-inventory-abstract-report.component';
import { MaterialAcknowledmentComponent } from './pages/material-return-process/material-acknowledgement-report/material-acknowledment/material-acknowledment.component';
import { MaterialAcknowledgementReportComponent } from './pages/material-return-process/material-acknowledgement-report/material-acknowledgement-report.component';
import { MaterialAcknowledgementSerialNumberComponent } from './pages/material-return-process/material-acknowledgement-report/material-acknowledgement-serial-number/material-acknowledgement-serial-number.component';
import { StoreManagerReturnDetailsComponent } from './pages/store-manager-approval/pages/store-manager-return-details/store-manager-return-details.component';
import { MaterialReturnAcknowledgementComponent } from './pages/material-return-process/material-acknowledgement-report/material-return-acknowledgement/material-return-acknowledgement.component';
import { StoreManagerSuspenseDetailsComponent } from './pages/store-manager-approval/pages/store-manager-suspense/store-manager-suspense-details/store-manager-suspense-details.component';
import { StoreManagerStoreIndentComponent } from './pages/store-manager-approval/pages/store-manger-store-indent/store-manager-store-indent/store-manager-store-indent.component';
// import { InvoiceSerialNumbersComponent } from './pages/dispatch-material-invoice/pop-up/invoice-serial-numbers/invoice-serial-numbers.component';
import { StoreIndentDetailsComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/store-indent-details/store-indent-details.component';
//import { StoreIndentInvoiceReportComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/store-indent-invoice-report/store-indent-invoice-report.component';
import { InvoiceStoreSuspenseDetailsComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/invoice-store-suspense-details.component';
import { MaterialSuspenseAcknowledgementComponent } from './pages/material-return-process/material-suspense-acknowledgement/material-suspense-acknowledgement.component';
//import { InvoicStoreSuspenseReportComponent } from './pages/dispatch-material-invoice/pages/dispatch-material-invoice-details/material-indent-invoice-report/invoice-store-suspense-details/invoic-store-suspense-report/invoic-store-suspense-report.component';
import { MaterialAcknowledgementSuspenseReportComponent } from './pages/material-return-process/material-suspense-acknowledgement/material-acknowledgement-suspense-report/material-acknowledgement-suspense-report.component';
import { MaterialPopupComponent } from './pages/material-popup/material-popup.component';
import { ReceiverTransferApprovalFormComponent } from './pages/receiver-transfer-approval/receiver-transfer-approval-form/receiver-transfer-approval-form.component';
import { SenderTransferApprovalFormComponent } from './pages/sender-transfer-aproval/sender-transfer-approval-form/sender-transfer-approval-form.component';
import { ReceiverTransferApprovalComponent } from './pages/receiver-transfer-approval/receiver-transfer-approval.component';
import { SenderTransferAprovalComponent } from './pages/sender-transfer-aproval/sender-transfer-aproval.component';
import { MaterialStoreAcknwReportComponent } from './pages/material-return-process/material-store-acknowledgement/material-store-acknw-report/material-store-acknw-report.component';
import { MaterialStoreAcknowledgementComponent } from './pages/material-return-process/material-store-acknowledgement/material-store-acknowledgement/material-store-acknowledgement.component';
import { StoreManagementDashboardComponent } from './components/store-management-dashboard/store-management-dashboard.component';
import { StoreGenerateComponent } from './pages/store-generate/store-generate.component';
import { StoreInventoryAdjustmentComponent } from './pages/store-inventory-adjustment/StoreInventoryAdjustmentComponent';
import { StoreAdjustmentReportComponent } from './pages/store-adjustment-report/store-adjustment-report.component';
import { StoreIssueSuspenseReportComponent } from './pages/store-issue-suspense-report/store-issue-suspense-report.component';
import { RoleBasedGuard } from '../guards/role-based.guard';
import { StoreSerialMaterialReportComponent } from './pages/store-serial-material-report/store-serial-material-report.component';

const routes: Routes = [
  ///// Gate Pass routing /////
  { path: 'dashboard', component: StoreManagementDashboardComponent },

  { path: 'gate-pass', component: GatePassComponent },
  {
    path: 'gate-pass-details/:wmMaterialsIndentId',
    component: GatePassDetailsComponent,
  },
  {
    path: 'gate-pass-acknowledgement',
    component: GatePassAcknowledgementComponent,
    canActivate: [RoleBasedGuard]
  },
  {
    path: 'gate-pass-ackowledgement-details/:wmMaterialsIndentId',
    component: GatePassAcknowledgementDetailsComponent,
  },
  //Store transfer request
  { path: 'store-transfer-request', component: StoreTransferRequestComponent, canActivate: [RoleBasedGuard] },
  { path: 'store-inventory-adjustment', component: StoreInventoryAdjustmentComponent, canActivate: [RoleBasedGuard] },
  //Store transfer approval
  {
    path: 'store-transfer-approval',
    component: StoreTransferApprovalComponent,
    canActivate: [RoleBasedGuard]
  },
  {
    path: 'receiver-transfer-approval',
    component: ReceiverTransferApprovalComponent,
  },
  {
    path: 'sender-transfer-approval',
    component: SenderTransferAprovalComponent,
  },
  //Store transfer approval form
  {
    path: 'store-transfer-approval-form/:wmMaterialsIndentId',
    component: StoreTransferApprovalFormComponent,
  },
  {
    path: 'Receiver-transfer-approval-form/:wmMaterialsIndentId',
    component: ReceiverTransferApprovalFormComponent,
  },
  {
    path: 'Sender-transfer-approval-form/:wmMaterialsIndentId',
    component: SenderTransferApprovalFormComponent,
  },
  ///// Upload Invoice routing /////
  { path: 'upload-invoice', component: UploadInvoiceComponent, canActivate: [RoleBasedGuard] },

  ///// Upload Invoice Approval routing /////
  {
    path: 'upload-invoice-approval',
    component: UploadInvoiceApprovalComponent,
  },
  {
    path: 'upload-invoice-approval-details',
    component: UploadInvoiceApprovalDetailsComponent,
  },

  ///// Store Manager Approval routing /////
  { path: 'store-manager-approval', component: StoreManagerApprovalComponent, canActivate: [RoleBasedGuard] },
  {
    path: 'store-manager-approval-details/:wmMaterialsIndentId',
    component: StoreManagerApprovalDetailsComponent,
  },

  ///// Dispatch Material Invoice routing /////
  {
    path: 'dispatch-material-invoice',
    component: DispatchMaterialInvoiceComponent,
    canActivate: [RoleBasedGuard]
  },
  {
    path: 'dispatch-material-invoice-details/:wmMaterialsIndentId',
    component: DispatchMaterialInvoiceDetailsComponent,
  },
  {
    path: 'Material-indent-invoice-report/:wmMaterialsIndentId',
    component: MaterialIndentInvoiceReportComponent,
  },
  {
    path: 'gate-pass-report',
    component: GatePassReportComponent,
  },
  {
    path: 'Exceptional-report',
    component: ExceptionalReportComponent,
  },
  {
    path: 'stock-log-report',
    component: StockLogReportComponent,
  },
  {
    path: 'stock-inventory-abstract-report',
    component: StockInventoryAbstractReportComponent,
  },
  {
    path: 'store-adjustment-report',
    component: StoreAdjustmentReportComponent,
  },
  {
    path: 'store-issue-suspense-report',
    component: StoreIssueSuspenseReportComponent,
  },
  {
    path: 'store-serial-material-report',
    component: StoreSerialMaterialReportComponent,
  },

  // material acknowledgement
  {
    path: 'material-ackowledgement',
    component: MaterialAcknowledmentComponent,
    canActivate: [RoleBasedGuard]
  },
  {
    path: 'material-acknowledgement-details/:wmMaterialsIndentId',
    component: MaterialAcknowledgementReportComponent,
  },
  {
    path: 'material-ackowledgement-serial-number',
    component: MaterialAcknowledgementSerialNumberComponent,
  },
  {
    path: 'Material-return-report/:wmMaterialsIndentId',
    component: MaterialReturnAcknowledgementComponent,
  },

  ///// Store Manager return Approval routing /////
  {
    path: 'store-manager-return-approval-details/:wmMaterialsIndentId',
    component: StoreManagerReturnDetailsComponent,
  },

  // Gate pass acknowledgement //
  {
    path: 'gate-pass-acknowledgement',
    component: GatePassAcknowledgementComponent,
    canActivate: [RoleBasedGuard]
  },
  // Suspense Indent //
  {
    path: 'store-manager-suspense-approval-details/:wmMaterialsIndentId',
    component: StoreManagerSuspenseDetailsComponent,
  },
  {
    path: 'material-suspense-invoice-details/:wmMaterialsIndentId',
    component: InvoiceStoreSuspenseDetailsComponent,
  },
  // {
  //   path: 'Material-suspense-invoice-report/:wmMaterialsIndentId',
  //   component: InvoicStoreSuspenseReportComponent,
  // },
  {
    path: 'Material-suspense-acknowledgement-report/:wmMaterialsIndentId',
    component: MaterialAcknowledgementSuspenseReportComponent,
  },
  {
    path: 'material-suspense-ackonowledgement-details/:wmMaterialsIndentId',
    component: MaterialSuspenseAcknowledgementComponent,
  },
  // stock indent
  {
    path: 'store-manager-store-indent-approval-details/:wmMaterialsIndentId',
    component: StoreManagerStoreIndentComponent,
  },
  {
    path: 'material-store-invoice-details/:wmMaterialsIndentId',
    component: StoreIndentDetailsComponent,
  },
  // {
  //   path: 'Material-store-invoice-report/:wmMaterialsIndentId',
  //   component: StoreIndentInvoiceReportComponent,
  // },
  {
    path: 'material-popup',
    component: MaterialPopupComponent,
  },
  {
    path: 'material-store-acknowledgement-report',
    component: MaterialStoreAcknwReportComponent,
  },
  {
    path: 'material-store-ackonowledgement-details/:wmMaterialsIndentId',
    component: MaterialStoreAcknowledgementComponent,
  },
  {
    path: 'material-store-indent-generated',
    component: StoreGenerateComponent,
  },
  {
    path: 'store-adjustment-report',
    component: StoreAdjustmentReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreManagementRoutingModule { }
