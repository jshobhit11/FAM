import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRegistrationReportComponent } from './pending-registration-report.component';

describe('PendingRegistrationReportComponent', () => {
  let component: PendingRegistrationReportComponent;
  let fixture: ComponentFixture<PendingRegistrationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingRegistrationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRegistrationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
