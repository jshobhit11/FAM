import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderTransferApprovalFormComponent } from './sender-transfer-approval-form.component';

describe('SenderTransferApprovalFormComponent', () => {
  let component: SenderTransferApprovalFormComponent;
  let fixture: ComponentFixture<SenderTransferApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenderTransferApprovalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderTransferApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
