import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetFromsComponent } from './budget-froms.component';

describe('BudgetFromsComponent', () => {
  let component: BudgetFromsComponent;
  let fixture: ComponentFixture<BudgetFromsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetFromsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetFromsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
