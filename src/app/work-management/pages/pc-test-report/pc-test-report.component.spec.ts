import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PCTestReportComponent } from './pc-test-report.component';

describe('PCTestReportComponent', () => {
  let component: PCTestReportComponent;
  let fixture: ComponentFixture<PCTestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PCTestReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PCTestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
