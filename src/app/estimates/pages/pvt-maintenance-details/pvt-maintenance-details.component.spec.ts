import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvtMaintenanceDetailsComponent } from './pvt-maintenance-details.component';

describe('PvtMaintenanceDetailsComponent', () => {
  let component: PvtMaintenanceDetailsComponent;
  let fixture: ComponentFixture<PvtMaintenanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PvtMaintenanceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PvtMaintenanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
