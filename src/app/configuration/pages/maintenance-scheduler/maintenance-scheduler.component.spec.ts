import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceSchedulerComponent } from './maintenance-scheduler.component';

describe('MaintenanceSchedulerComponent', () => {
  let component: MaintenanceSchedulerComponent;
  let fixture: ComponentFixture<MaintenanceSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceSchedulerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
