import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBudgetApprovalComponent } from './config-budget-approval.component';

describe('ConfigBudgetApprovalComponent', () => {
  let component: ConfigBudgetApprovalComponent;
  let fixture: ComponentFixture<ConfigBudgetApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigBudgetApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigBudgetApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
