import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMaintenanceFrequencyComponent } from './update-maintenance-frequency.component';

describe('UpdateMaintenanceFrequencyComponent', () => {
  let component: UpdateMaintenanceFrequencyComponent;
  let fixture: ComponentFixture<UpdateMaintenanceFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMaintenanceFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMaintenanceFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
