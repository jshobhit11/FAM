import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherServiceRequestsEstimationApprovalComponent } from './other-service-requests-estimation-approval.component';

describe('OtherServiceRequestsEstimationApprovalComponent', () => {
  let component: OtherServiceRequestsEstimationApprovalComponent;
  let fixture: ComponentFixture<OtherServiceRequestsEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtherServiceRequestsEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherServiceRequestsEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
