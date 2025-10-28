import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairsMaintenanceEstimationCreationComponent } from './repairs-maintenance-estimation-creation.component';

describe('RepairsMaintenanceEstimationCreationComponent', () => {
  let component: RepairsMaintenanceEstimationCreationComponent;
  let fixture: ComponentFixture<RepairsMaintenanceEstimationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepairsMaintenanceEstimationCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairsMaintenanceEstimationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
