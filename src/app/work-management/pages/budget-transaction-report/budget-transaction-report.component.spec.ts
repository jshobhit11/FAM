import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTransactionReportComponent } from './budget-transaction-report.component';

describe('BudgetTransactionReportComponent', () => {
  let component: BudgetTransactionReportComponent;
  let fixture: ComponentFixture<BudgetTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetTransactionReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
