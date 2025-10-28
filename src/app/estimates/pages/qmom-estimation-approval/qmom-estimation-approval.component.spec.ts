import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QmomEstimationApprovalComponent } from './qmom-estimation-approval.component';

describe('QmomEstimationApprovalComponent', () => {
  let component: QmomEstimationApprovalComponent;
  let fixture: ComponentFixture<QmomEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QmomEstimationApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QmomEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
