import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAdjustmentReportComponent } from './store-adjustment-report.component';

describe('StoreAdjustmentReportComponent', () => {
  let component: StoreAdjustmentReportComponent;
  let fixture: ComponentFixture<StoreAdjustmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreAdjustmentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAdjustmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
