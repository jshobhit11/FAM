import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiveMaintenanceListComponent } from './preventive-maintenance-list.component';

describe('PreventiveMaintenanceListComponent', () => {
  let component: PreventiveMaintenanceListComponent;
  let fixture: ComponentFixture<PreventiveMaintenanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreventiveMaintenanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventiveMaintenanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
