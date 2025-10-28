import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverhualMaintenanceListComponent } from './overhual-maintenance-list.component';

describe('OverhualMaintenanceListComponent', () => {
  let component: OverhualMaintenanceListComponent;
  let fixture: ComponentFixture<OverhualMaintenanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverhualMaintenanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverhualMaintenanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
