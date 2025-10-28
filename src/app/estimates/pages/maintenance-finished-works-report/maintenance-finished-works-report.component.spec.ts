import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceFinishedWorksReportComponent } from './maintenance-finished-works-report.component';

describe('MaintenanceFinishedWorksReportComponent', () => {
  let component: MaintenanceFinishedWorksReportComponent;
  let fixture: ComponentFixture<MaintenanceFinishedWorksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceFinishedWorksReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceFinishedWorksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
