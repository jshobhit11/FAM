import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsReturnApprovalFormComponent } from './materials-return-approval-form.component';

describe('MaterialsReturnApprovalFormComponent', () => {
  let component: MaterialsReturnApprovalFormComponent;
  let fixture: ComponentFixture<MaterialsReturnApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsReturnApprovalFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsReturnApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
