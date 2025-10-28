import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DismantlementWorksEstimationCreationComponent } from './dismantlement-works-estimation-creation.component';

describe('DismantlementWorksEstimationCreationComponent', () => {
  let component: DismantlementWorksEstimationCreationComponent;
  let fixture: ComponentFixture<DismantlementWorksEstimationCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DismantlementWorksEstimationCreationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DismantlementWorksEstimationCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
