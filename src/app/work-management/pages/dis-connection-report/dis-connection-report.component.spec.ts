import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisConnectionReportComponent } from './dis-connection-report.component';

describe('DisConnectionReportComponent', () => {
  let component: DisConnectionReportComponent;
  let fixture: ComponentFixture<DisConnectionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisConnectionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisConnectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
