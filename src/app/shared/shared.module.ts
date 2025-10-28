import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';

import { MatIconModule } from '@angular/material/icon';
import { MenubarComponent } from './components/menubar/menubar.component';
import { HeaderComponent } from './components/header/header.component';

import { FooterComponent } from './components/footer/footer.component';

import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { OptimizedPopupComponent } from './components/optimized-popup/optimized-popup.component';
import { FilterTableComponent } from '../commons/filter-table/filter-table.component';

import { TreeSelectModule } from 'primeng/treeselect';
import { TreeModule } from 'primeng/tree';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { AlphaNumericDirective } from './alpha-numeric.directive';
import { MobileValidationDirective } from './mobile-validation.directive';
import { ValidationDirective } from './validation.directive';
import { VechileNumberDirective } from './vechile-number.directive';
import { IndianCurrencyDirective } from './indian-currency.directive';
import { DateDirective } from './date.directive';
import { NumbersDirective } from './numbers.directive';
import { DateRangeValidatorDirective } from './date-range-validator.directive';
import { PortingDatesDirective } from './porting-dates.directive';
import { FileSizeDirective } from './file-size.directive';
import { VendorDateRangeValidatorDirective } from './vendor-date-range-validator.directive';
import { WebsiteUrlValidatorDirective } from './website-url-validator.directive';
import { EmailValidatorDirective } from './email-validator.directive';
import { PercentageValidatorDirective } from './percentage-validator.directive';
import { DateToDirective } from './date-to.directive';
import { LineDateDirective } from './line-date.directive';
import { FinancialYearFormatDirective } from './financial-year-format.directive';
import { CountdownTimerComponent } from '../commons/countdown-timer/countdown-timer.component';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { FileSizeValidatorDirective } from './services/file-size-validator.directive';
import { NumberToWordsPipe } from './number-to-words.pipe';
import { ViewDocPopupComponent } from './components/document-upload/view-doc-popup/view-doc-popup.component';


const reUseComponents: any = [MenubarComponent, HeaderComponent, FooterComponent, FilterTableComponent, CountdownTimerComponent];

const reUseModules: any = [
  CommonModule,
  HttpClientModule,
  RouterModule,
  FormsModule,
  MaterialModule,
  ReactiveFormsModule,
  MatIconModule,
  TableModule,
  TreeModule,
  DropdownModule,
  TreeSelectModule,
  ChartModule,
  VirtualScrollerModule
];

@NgModule({
  declarations: [
    ...reUseComponents,
    ConfirmationPopupComponent,
    OptimizedPopupComponent,
    AlphaNumericDirective,
    MobileValidationDirective,
    ValidationDirective,
    VechileNumberDirective,
    IndianCurrencyDirective,
    DateDirective,
    NumbersDirective,
    DateRangeValidatorDirective,
    PortingDatesDirective,
    FileSizeDirective,
    VendorDateRangeValidatorDirective,
    WebsiteUrlValidatorDirective,
    EmailValidatorDirective,
    PercentageValidatorDirective,
    DateToDirective,
    LineDateDirective,
    FinancialYearFormatDirective,
    DocumentUploadComponent,
    FileSizeValidatorDirective,
    NumberToWordsPipe,
    ViewDocPopupComponent,
  ],
  imports: [...reUseModules],
  exports: [
    ...reUseModules,
    ...reUseComponents,
    AlphaNumericDirective,
    MobileValidationDirective,
    ValidationDirective,
    VechileNumberDirective,
    IndianCurrencyDirective,
    DateDirective,
    NumbersDirective,
    DateRangeValidatorDirective,
    PortingDatesDirective,
    FileSizeDirective,
    VendorDateRangeValidatorDirective,
    WebsiteUrlValidatorDirective,
    EmailValidatorDirective,
    PercentageValidatorDirective,
    DateToDirective,
    LineDateDirective,
    FinancialYearFormatDirective,
    VirtualScrollerModule,
    FileSizeValidatorDirective,
    NumberToWordsPipe
  ],
})
export class SharedModule {}
