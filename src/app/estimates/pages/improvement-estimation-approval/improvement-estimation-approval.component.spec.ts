import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementEstimationApprovalComponent } from './improvement-estimation-approval.component';

describe('ImprovementEstimationApprovalComponent', () => {
  let component: ImprovementEstimationApprovalComponent;
  let fixture: ComponentFixture<ImprovementEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImprovementEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
