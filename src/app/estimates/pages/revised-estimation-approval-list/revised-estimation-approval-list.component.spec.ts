import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedEstimationApprovalListComponent } from './revised-estimation-approval-list.component';

describe('RevisedEstimationApprovalListComponent', () => {
  let component: RevisedEstimationApprovalListComponent;
  let fixture: ComponentFixture<RevisedEstimationApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisedEstimationApprovalListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedEstimationApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
