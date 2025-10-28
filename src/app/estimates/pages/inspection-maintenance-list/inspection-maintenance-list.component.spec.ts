import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionMaintenanceListComponent } from './inspection-maintenance-list.component';

describe('InspectionMaintenanceListComponent', () => {
  let component: InspectionMaintenanceListComponent;
  let fixture: ComponentFixture<InspectionMaintenanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectionMaintenanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionMaintenanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
