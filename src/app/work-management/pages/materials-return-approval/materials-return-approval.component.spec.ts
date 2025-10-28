import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsReturnApprovalComponent } from './materials-return-approval.component';

describe('MaterialsReturnApprovalComponent', () => {
  let component: MaterialsReturnApprovalComponent;
  let fixture: ComponentFixture<MaterialsReturnApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsReturnApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsReturnApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
