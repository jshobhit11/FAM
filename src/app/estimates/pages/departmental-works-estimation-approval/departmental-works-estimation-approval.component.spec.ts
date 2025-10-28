import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentalWorksEstimationApprovalComponent } from './departmental-works-estimation-approval.component';

describe('DepartmentalWorksEstimationApprovalComponent', () => {
  let component: DepartmentalWorksEstimationApprovalComponent;
  let fixture: ComponentFixture<DepartmentalWorksEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentalWorksEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentalWorksEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
