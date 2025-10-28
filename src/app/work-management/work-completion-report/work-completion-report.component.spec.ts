import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCompletionReportComponent } from './work-completion-report.component';

describe('WorkCompletionReportComponent', () => {
  let component: WorkCompletionReportComponent;
  let fixture: ComponentFixture<WorkCompletionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkCompletionReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCompletionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
