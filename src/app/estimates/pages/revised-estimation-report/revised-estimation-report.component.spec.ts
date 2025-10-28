import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedEstimationReportComponent } from './revised-estimation-report.component';

describe('RevisedEstimationReportComponent', () => {
  let component: RevisedEstimationReportComponent;
  let fixture: ComponentFixture<RevisedEstimationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisedEstimationReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedEstimationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
