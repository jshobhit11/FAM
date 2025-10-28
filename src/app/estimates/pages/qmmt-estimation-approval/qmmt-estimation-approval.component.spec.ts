import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmmtEstimationApprovalComponent } from './qmmt-estimation-approval.component';

describe('QmmtEstimationApprovalComponent', () => {
  let component: QmmtEstimationApprovalComponent;
  let fixture: ComponentFixture<QmmtEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QmmtEstimationApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QmmtEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
