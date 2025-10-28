import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintenanceFrequencyTypeComponent } from './add-maintenance-frequency-type.component';

describe('AddMaintenanceFrequencyTypeComponent', () => {
  let component: AddMaintenanceFrequencyTypeComponent;
  let fixture: ComponentFixture<AddMaintenanceFrequencyTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaintenanceFrequencyTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaintenanceFrequencyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
