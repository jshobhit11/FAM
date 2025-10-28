import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkImprovementToEstimateComponent } from './work-improvement-to-estimate.component';

describe('WorkImprovementToEstimateComponent', () => {
  let component: WorkImprovementToEstimateComponent;
  let fixture: ComponentFixture<WorkImprovementToEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkImprovementToEstimateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkImprovementToEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
