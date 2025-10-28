import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreTransferApprovalFormComponent } from './store-transfer-approval-form.component';

describe('StoreTransferApprovalFormComponent', () => {
  let component: StoreTransferApprovalFormComponent;
  let fixture: ComponentFixture<StoreTransferApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreTransferApprovalFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreTransferApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
