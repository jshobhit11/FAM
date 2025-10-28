import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BMRErrorReportComponent } from './bmr-error-report.component';

describe('BMRErrorReportComponent', () => {
  let component: BMRErrorReportComponent;
  let fixture: ComponentFixture<BMRErrorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BMRErrorReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BMRErrorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
