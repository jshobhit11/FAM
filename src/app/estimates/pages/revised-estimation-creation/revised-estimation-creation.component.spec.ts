import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedEstimationCreationComponent } from './revised-estimation-creation.component';

describe('RevisedEstimationCreationComponent', () => {
  let component: RevisedEstimationCreationComponent;
  let fixture: ComponentFixture<RevisedEstimationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisedEstimationCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedEstimationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
