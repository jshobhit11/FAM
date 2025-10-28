import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceFrequencyComponent } from './maintenance-frequency.component';

describe('MaintenanceFrequencyComponent', () => {
  let component: MaintenanceFrequencyComponent;
  let fixture: ComponentFixture<MaintenanceFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
