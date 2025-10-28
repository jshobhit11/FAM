import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateBudgetReportComponent } from './corporate-budget-report.component';

describe('CorporateBudgetReportComponent', () => {
  let component: CorporateBudgetReportComponent;
  let fixture: ComponentFixture<CorporateBudgetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateBudgetReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateBudgetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
