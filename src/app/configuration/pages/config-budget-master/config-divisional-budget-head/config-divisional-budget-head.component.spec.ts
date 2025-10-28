import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDivisionalBudgetHeadComponent } from './config-divisional-budget-head.component';

describe('ConfigDivisionalBudgetHeadComponent', () => {
  let component: ConfigDivisionalBudgetHeadComponent;
  let fixture: ComponentFixture<ConfigDivisionalBudgetHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigDivisionalBudgetHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigDivisionalBudgetHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
