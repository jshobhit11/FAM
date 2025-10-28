import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialAcknowledgementReportComponent } from './material-acknowledgement-report.component';

describe('MaterialAcknowledgementReportComponent', () => {
  let component: MaterialAcknowledgementReportComponent;
  let fixture: ComponentFixture<MaterialAcknowledgementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialAcknowledgementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAcknowledgementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
