import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAcknowledgementSuspenseReportComponent } from './material-acknowledgement-suspense-report.component';

describe('MaterialAcknowledgementSuspenseReportComponent', () => {
  let component: MaterialAcknowledgementSuspenseReportComponent;
  let fixture: ComponentFixture<MaterialAcknowledgementSuspenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialAcknowledgementSuspenseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAcknowledgementSuspenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
