import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyEstimationApprovalComponent } from './emergency-estimation-approval.component';

describe('EmergencyEstimationApprovalComponent', () => {
  let component: EmergencyEstimationApprovalComponent;
  let fixture: ComponentFixture<EmergencyEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmergencyEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
