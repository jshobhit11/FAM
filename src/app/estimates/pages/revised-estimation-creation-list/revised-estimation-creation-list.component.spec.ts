import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedEstimationCreationListComponent } from './revised-estimation-creation-list.component';

describe('RevisedEstimationCreationListComponent', () => {
  let component: RevisedEstimationCreationListComponent;
  let fixture: ComponentFixture<RevisedEstimationCreationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisedEstimationCreationListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedEstimationCreationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
