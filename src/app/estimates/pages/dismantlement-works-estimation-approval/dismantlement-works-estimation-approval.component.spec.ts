import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantlementWorksEstimationApprovalComponent } from './dismantlement-works-estimation-approval.component';

describe('DismantlementWorksEstimationApprovalComponent', () => {
  let component: DismantlementWorksEstimationApprovalComponent;
  let fixture: ComponentFixture<DismantlementWorksEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DismantlementWorksEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantlementWorksEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
