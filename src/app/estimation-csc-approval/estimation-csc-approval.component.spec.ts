import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationCscApprovalComponent } from './estimation-csc-approval.component';

describe('EstimationCscApprovalComponent', () => {
  let component: EstimationCscApprovalComponent;
  let fixture: ComponentFixture<EstimationCscApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstimationCscApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationCscApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
