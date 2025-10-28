import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionalBudgetHeadComponent } from './divisional-budget-head.component';

describe('DivisionalBudgetHeadComponent', () => {
  let component: DivisionalBudgetHeadComponent;
  let fixture: ComponentFixture<DivisionalBudgetHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DivisionalBudgetHeadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionalBudgetHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
