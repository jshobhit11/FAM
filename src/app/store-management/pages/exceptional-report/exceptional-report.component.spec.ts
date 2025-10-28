import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionalReportComponent } from './exceptional-report.component';

describe('ExceptionalReportComponent', () => {
  let component: ExceptionalReportComponent;
  let fixture: ComponentFixture<ExceptionalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExceptionalReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
