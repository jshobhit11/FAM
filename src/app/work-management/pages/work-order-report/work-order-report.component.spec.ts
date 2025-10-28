import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderReportComponent } from './work-order-report.component';

describe('WorkOrderReportComponent', () => {
  let component: WorkOrderReportComponent;
  let fixture: ComponentFixture<WorkOrderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
