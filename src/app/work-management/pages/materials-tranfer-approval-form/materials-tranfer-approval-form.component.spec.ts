import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsTranferApprovalFormComponent } from './materials-tranfer-approval-form.component';

describe('MaterialsTranferApprovalFormComponent', () => {
  let component: MaterialsTranferApprovalFormComponent;
  let fixture: ComponentFixture<MaterialsTranferApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsTranferApprovalFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsTranferApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
