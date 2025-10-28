import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreTransferApprovalComponent } from './store-transfer-approval.component';

describe('StoreTransferApprovalComponent', () => {
  let component: StoreTransferApprovalComponent;
  let fixture: ComponentFixture<StoreTransferApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreTransferApprovalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreTransferApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
