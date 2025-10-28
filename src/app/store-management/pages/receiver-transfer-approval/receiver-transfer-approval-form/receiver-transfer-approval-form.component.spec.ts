import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverTransferApprovalFormComponent } from './receiver-transfer-approval-form.component';

describe('ReceiverTransferApprovalFormComponent', () => {
  let component: ReceiverTransferApprovalFormComponent;
  let fixture: ComponentFixture<ReceiverTransferApprovalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiverTransferApprovalFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverTransferApprovalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
