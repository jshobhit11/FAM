import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkComplitionReportComponent } from './work-complition-report.component';

describe('WorkComplitionReportComponent', () => {
  let component: WorkComplitionReportComponent;
  let fixture: ComponentFixture<WorkComplitionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkComplitionReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkComplitionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
