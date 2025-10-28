import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreIssueSuspenseReportComponent } from './store-issue-suspense-report.component';

describe('StoreIssueSuspenseReportComponent', () => {
  let component: StoreIssueSuspenseReportComponent;
  let fixture: ComponentFixture<StoreIssueSuspenseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreIssueSuspenseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreIssueSuspenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
