import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintenanceFrequencyComponent } from './add-maintenance-frequency.component';

describe('AddMaintenanceFrequencyComponent', () => {
  let component: AddMaintenanceFrequencyComponent;
  let fixture: ComponentFixture<AddMaintenanceFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaintenanceFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaintenanceFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
