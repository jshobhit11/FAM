import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyEstimationReportComponent } from './emergency-estimation-report.component';

describe('EmergencyEstimationReportComponent', () => {
  let component: EmergencyEstimationReportComponent;
  let fixture: ComponentFixture<EmergencyEstimationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmergencyEstimationReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyEstimationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
