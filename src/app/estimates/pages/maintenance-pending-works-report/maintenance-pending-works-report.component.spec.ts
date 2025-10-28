import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePendingWorksReportComponent } from './maintenance-pending-works-report.component';

describe('MaintenancePendingWorksReportComponent', () => {
  let component: MaintenancePendingWorksReportComponent;
  let fixture: ComponentFixture<MaintenancePendingWorksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenancePendingWorksReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePendingWorksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
