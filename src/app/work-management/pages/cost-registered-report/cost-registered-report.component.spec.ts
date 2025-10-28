import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostRegisteredReportComponent } from './cost-registered-report.component';

describe('CostRegisteredReportComponent', () => {
  let component: CostRegisteredReportComponent;
  let fixture: ComponentFixture<CostRegisteredReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostRegisteredReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostRegisteredReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
