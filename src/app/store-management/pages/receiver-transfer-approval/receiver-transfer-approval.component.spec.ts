import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverTransferApprovalComponent } from './receiver-transfer-approval.component';

describe('ReceiverTransferApprovalComponent', () => {
  let component: ReceiverTransferApprovalComponent;
  let fixture: ComponentFixture<ReceiverTransferApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiverTransferApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverTransferApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
