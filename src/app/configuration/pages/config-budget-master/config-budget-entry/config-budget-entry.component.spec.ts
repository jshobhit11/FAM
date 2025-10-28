import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBudgetEntryComponent } from './config-budget-entry.component';

describe('ConfigBudgetEntryComponent', () => {
  let component: ConfigBudgetEntryComponent;
  let fixture: ComponentFixture<ConfigBudgetEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigBudgetEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigBudgetEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
