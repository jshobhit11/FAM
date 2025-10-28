import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSerialMaterialReportComponent } from './store-serial-material-report.component';

describe('StoreSerialMaterialReportComponent', () => {
  let component: StoreSerialMaterialReportComponent;
  let fixture: ComponentFixture<StoreSerialMaterialReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSerialMaterialReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSerialMaterialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
