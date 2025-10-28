import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementEstimationCreationComponent } from './improvement-estimation-creation.component';

describe('ImprovementEstimationCreationComponent', () => {
  let component: ImprovementEstimationCreationComponent;
  let fixture: ComponentFixture<ImprovementEstimationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImprovementEstimationCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementEstimationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
