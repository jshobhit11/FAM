import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyEstimationCreationComponent } from './emergency-estimation-creation.component';

describe('EmergencyEstimationCreationComponent', () => {
  let component: EmergencyEstimationCreationComponent;
  let fixture: ComponentFixture<EmergencyEstimationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmergencyEstimationCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyEstimationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
