import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSuspenceMeterReportComponent } from './pending-suspence-meter-report.component';

describe('PendingSuspenceMeterReportComponent', () => {
  let component: PendingSuspenceMeterReportComponent;
  let fixture: ComponentFixture<PendingSuspenceMeterReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingSuspenceMeterReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingSuspenceMeterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
