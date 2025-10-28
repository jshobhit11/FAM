import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairsMaintenanceEstimationApprovalComponent } from './repairs-maintenance-estimation-approval.component';

describe('RepairsMaintenanceEstimationApprovalComponent', () => {
  let component: RepairsMaintenanceEstimationApprovalComponent;
  let fixture: ComponentFixture<RepairsMaintenanceEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepairsMaintenanceEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairsMaintenanceEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
