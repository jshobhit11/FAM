import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementEstimationApprovalListComponent } from './improvement-estimation-approval-list.component';

describe('ImprovementEstimationApprovalListComponent', () => {
  let component: ImprovementEstimationApprovalListComponent;
  let fixture: ComponentFixture<ImprovementEstimationApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImprovementEstimationApprovalListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementEstimationApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
