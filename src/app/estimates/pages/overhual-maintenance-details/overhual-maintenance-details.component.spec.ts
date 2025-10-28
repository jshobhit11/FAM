import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverhualMaintenanceDetailsComponent } from './overhual-maintenance-details.component';

describe('OverhualMaintenanceDetailsComponent', () => {
  let component: OverhualMaintenanceDetailsComponent;
  let fixture: ComponentFixture<OverhualMaintenanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverhualMaintenanceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverhualMaintenanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
