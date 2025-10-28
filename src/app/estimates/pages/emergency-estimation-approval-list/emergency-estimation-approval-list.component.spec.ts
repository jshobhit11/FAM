import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyEstimationApprovalListComponent } from './emergency-estimation-approval-list.component';

describe('EmergencyEstimationApprovalListComponent', () => {
  let component: EmergencyEstimationApprovalListComponent;
  let fixture: ComponentFixture<EmergencyEstimationApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmergencyEstimationApprovalListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyEstimationApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
