import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementEstimationReportComponent } from './improvement-estimation-report.component';

describe('ImprovementEstimationReportComponent', () => {
  let component: ImprovementEstimationReportComponent;
  let fixture: ComponentFixture<ImprovementEstimationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImprovementEstimationReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementEstimationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
