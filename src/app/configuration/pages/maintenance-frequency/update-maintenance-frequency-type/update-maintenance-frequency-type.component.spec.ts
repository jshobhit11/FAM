import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMaintenanceFrequencyTypeComponent } from './update-maintenance-frequency-type.component';

describe('UpdateMaintenanceFrequencyTypeComponent', () => {
  let component: UpdateMaintenanceFrequencyTypeComponent;
  let fixture: ComponentFixture<UpdateMaintenanceFrequencyTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMaintenanceFrequencyTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMaintenanceFrequencyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
