import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BMRSuccessReportComponent } from './bmr-success-report.component';

describe('BMRSuccessReportComponent', () => {
  let component: BMRSuccessReportComponent;
  let fixture: ComponentFixture<BMRSuccessReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BMRSuccessReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BMRSuccessReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
