import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockLogReportComponent } from './stock-log-report.component';

describe('StockLogReportComponent', () => {
  let component: StockLogReportComponent;
  let fixture: ComponentFixture<StockLogReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockLogReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
