import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedEstimationApprovalComponent } from './revised-estimation-approval.component';

describe('RevisedEstimationApprovalComponent', () => {
  let component: RevisedEstimationApprovalComponent;
  let fixture: ComponentFixture<RevisedEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisedEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
