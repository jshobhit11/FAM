import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeterReplacementsEstimationApprovalComponent } from './meter-replacements-estimation-approval.component';

describe('MeterReplacementsEstimationApprovalComponent', () => {
  let component: MeterReplacementsEstimationApprovalComponent;
  let fixture: ComponentFixture<MeterReplacementsEstimationApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeterReplacementsEstimationApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterReplacementsEstimationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
