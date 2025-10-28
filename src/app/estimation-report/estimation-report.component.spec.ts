import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationReportComponent } from './estimation-report.component';

describe('EstimationReportComponent', () => {
  let component: EstimationReportComponent;
  let fixture: ComponentFixture<EstimationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstimationReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
