import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentalWorksEstimationCreationComponent } from './departmental-works-estimation-creation.component';

describe('DepartmentalWorksEstimationCreationComponent', () => {
  let component: DepartmentalWorksEstimationCreationComponent;
  let fixture: ComponentFixture<DepartmentalWorksEstimationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentalWorksEstimationCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentalWorksEstimationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
