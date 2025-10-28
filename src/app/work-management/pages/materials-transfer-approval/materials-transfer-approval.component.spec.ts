import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsTransferApprovalComponent } from './materials-transfer-approval.component';

describe('MaterialsTransferApprovalComponent', () => {
  let component: MaterialsTransferApprovalComponent;
  let fixture: ComponentFixture<MaterialsTransferApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsTransferApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsTransferApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
