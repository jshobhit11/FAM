import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmrEstimationApprovalListComponent } from './bmr-estimation-approval-list.component';

describe('BmrEstimationApprovalListComponent', () => {
  let component: BmrEstimationApprovalListComponent;
  let fixture: ComponentFixture<BmrEstimationApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BmrEstimationApprovalListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BmrEstimationApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
