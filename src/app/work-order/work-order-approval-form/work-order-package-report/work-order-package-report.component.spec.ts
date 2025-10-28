import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderPackageReportComponent } from './work-order-package-report.component';

describe('WorkOrderPackageReportComponent', () => {
  let component: WorkOrderPackageReportComponent;
  let fixture: ComponentFixture<WorkOrderPackageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkOrderPackageReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderPackageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
