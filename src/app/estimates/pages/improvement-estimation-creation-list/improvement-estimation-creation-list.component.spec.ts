import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementEstimationCreationListComponent } from './improvement-estimation-creation-list.component';

describe('ImprovementEstimationCreationListComponent', () => {
  let component: ImprovementEstimationCreationListComponent;
  let fixture: ComponentFixture<ImprovementEstimationCreationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImprovementEstimationCreationListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementEstimationCreationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
