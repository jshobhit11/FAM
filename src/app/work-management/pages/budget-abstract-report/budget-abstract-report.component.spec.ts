import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetAbstractReportComponent } from './budget-abstract-report.component';

describe('BudgetAbstractReportComponent', () => {
  let component: BudgetAbstractReportComponent;
  let fixture: ComponentFixture<BudgetAbstractReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetAbstractReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetAbstractReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
