import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialStoreAcknwReportComponent } from './material-store-acknw-report.component';

describe('MaterialStoreAcknwReportComponent', () => {
  let component: MaterialStoreAcknwReportComponent;
  let fixture: ComponentFixture<MaterialStoreAcknwReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialStoreAcknwReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialStoreAcknwReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
