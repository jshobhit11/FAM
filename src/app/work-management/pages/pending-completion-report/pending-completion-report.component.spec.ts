import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCompletionReportComponent } from './pending-completion-report.component';

describe('PendingCompletionReportComponent', () => {
  let component: PendingCompletionReportComponent;
  let fixture: ComponentFixture<PendingCompletionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingCompletionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingCompletionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
