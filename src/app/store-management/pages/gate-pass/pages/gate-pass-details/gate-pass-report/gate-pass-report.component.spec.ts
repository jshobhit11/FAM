import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatePassReportComponent } from './gate-pass-report.component';

describe('GatePassReportComponent', () => {
  let component: GatePassReportComponent;
  let fixture: ComponentFixture<GatePassReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatePassReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatePassReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
