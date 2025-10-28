import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBudgetApprovalDetailsComponent } from './config-budget-approval-details.component';

describe('ConfigBudgetApprovalDetailsComponent', () => {
  let component: ConfigBudgetApprovalDetailsComponent;
  let fixture: ComponentFixture<ConfigBudgetApprovalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigBudgetApprovalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigBudgetApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
