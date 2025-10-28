import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderTransferAprovalComponent } from './sender-transfer-aproval.component';

describe('SenderTransferAprovalComponent', () => {
  let component: SenderTransferAprovalComponent;
  let fixture: ComponentFixture<SenderTransferAprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SenderTransferAprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderTransferAprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
