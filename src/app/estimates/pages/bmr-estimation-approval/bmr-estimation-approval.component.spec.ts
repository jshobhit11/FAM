import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmrEstimationApprovalComponent } from './bmr-estimation-approval.component';

describe('BmrEstimationApprovalComponent', () => {
  let component: BmrEstimationApprovalComponent;
  let fixture: ComponentFixture<BmrEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BmrEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BmrEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
